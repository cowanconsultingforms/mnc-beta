import React, { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import nyc from '../assets/nyc.mp4'; // Import the video file


const Payments = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState(localStorage.getItem('userEmail') || '');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentType, setPaymentType] = useState(''); // Start with an empty state
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [userId, setUserId] = useState(null);
  const stripe = useStripe();
  const elements = useElements();
  const auth = getAuth();
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        setEmail(user.email);
        localStorage.setItem('userEmail', user.email);
      } else {
        setUserId(null);
      }
    });
  }, [auth]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    if (!stripe || !elements) {
      setErrorMessage('Stripe has not loaded.');
      setLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement || paymentType === '') {
      setErrorMessage('Please select a valid payment type and enter card information.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_API}/createPaymentIntent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount * 100,
          currency: 'usd',
        }),
      });

      const { clientSecret } = await response.json();

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name,
            email,
            phone: phoneNumber,
          },
        },
      });

      if (error) {
        setErrorMessage(error.message);
      } else {
        setSuccessMessage('Payment successful!');

        if (userId) {
          await addDoc(collection(db, `payments/${userId}/transactions`), {
            name,
            email,
            phoneNumber,
            paymentType,
            amount,
            description,
            paymentIntentId: paymentIntent.id,
            timestamp: new Date(),
          });
        }
      }
    } catch (error) {
      setErrorMessage('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewPaymentHistory = () => {
    navigate('/payment-history/:uid');
  };

  return (
    <div style={styles.container}>
      <video src={nyc} autoPlay loop muted style={styles.video} />
      <div style={styles.overlay}></div>
      <div style={styles.formContainer}>
        <form onSubmit={handleSubmit} style={styles.checkoutForm}>
          <h2 style={styles.formTitle}>Make a Payment</h2>
          <label htmlFor="name" style={styles.label}>First and Last Name:</label>
          <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" required style={styles.input} />
          <label htmlFor="email" style={styles.label}>Email:</label>
          <input type="email" id="email" value={email} onChange={(e) => { setEmail(e.target.value); localStorage.setItem('userEmail', e.target.value); }} placeholder="Enter your email" required style={styles.input} />
          <label htmlFor="phone" style={styles.label}>Phone Number:</label>
          <input type="text" id="phone" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="Enter your phone number" required style={styles.input} />
          <label htmlFor="paymentType" style={styles.label}>Payment Type:</label>
          <select id="paymentType" value={paymentType} onChange={(e) => setPaymentType(e.target.value)} style={styles.dropdown}>
            <option value="">--- Select Payment Type ---</option> {/* Default option */}
            <option value="VIP fee">VIP fee</option>
            <option value="Tenant fee">Tenant fee</option>
            <option value="Partner fee">Partner fee</option>
            <option value="Vendor fee">Vendor fee</option>
            <option value="Other">Other</option>
          </select>
          <label htmlFor="amount" style={styles.label}>Amount:</label>
          <input type="number" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter amount" required style={styles.input} />
          <label htmlFor="description" style={styles.label}>Description:</label>
          <input type="text" id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Payment description" required style={styles.input} />
          <CardElement className="card-element" />
          <button type="submit" style={paymentType === '' ? styles.disabledButton : styles.submitButton} disabled={loading || !stripe || !elements || paymentType === ''}>
            {loading ? 'Processing...' : `Pay $${amount}`}
          </button>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          {successMessage && <div className="success-message">{successMessage}</div>}
        </form>
        <button onClick={handleViewPaymentHistory} style={styles.historyButton}>View Payment History</button>
      </div>
    </div>
  );
};

export default Payments;


const styles = {
    container: {
      position: 'relative',
      height: '100vh',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    video: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transform: 'translate(-50%, -50%)',
      zIndex: '-2', // Make sure video stays behind everything else
    },
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'linear-gradient(to bottom right, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.1))',
      zIndex: '-1', // Ensure the overlay is above the video but below the form
    },
    formContainer: {
      background: '#ffffff',
      borderRadius: '12px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
      padding: '40px',
      maxWidth: '500px',
      width: '90%',
      textAlign: 'center',
      zIndex: '1', // Ensure the form is above all other elements
    },
    formTitle: {
      fontSize: '2rem',
      fontWeight: '600',
      color: '#2d3748',
      marginBottom: '1.5rem',
      borderBottom: '2px solid #e2e8f0',
      paddingBottom: '10px',
    },
    label: {
      fontSize: '1rem',
      color: '#4a5568',
      textAlign: 'left',
      marginBottom: '8px',
      display: 'block',
    },
    input: {
      width: '100%',
      padding: '12px',
      margin: '10px 0 15px',
      border: '1px solid #cbd5e0',
      borderRadius: '8px',
      fontSize: '1rem',
    },
    dropdown: {
      width: '100%',
      padding: '12px',
      margin: '10px 0 15px',
      border: '1px solid #cbd5e0',
      borderRadius: '8px',
      fontSize: '1rem',
      background: '#ffffff',
    },
    submitButton: {
      backgroundColor: '#3182ce',
      color: '#fff',
      padding: '12px',
      borderRadius: '8px',
      cursor: 'pointer',
      width: '100%',
      fontSize: '1rem',
      fontWeight: '600',
      border: 'none',
      marginTop: '20px',
      transition: 'background-color 0.3s ease',
    },
    disabledButton: {
      backgroundColor: '#cbd5e0', // Gray out button to indicate it's disabled
      color: '#fff',
      padding: '12px',
      borderRadius: '8px',
      cursor: 'not-allowed',
      width: '100%',
      fontSize: '1rem',
      fontWeight: '600',
      border: 'none',
      marginTop: '20px',
      transition: 'background-color 0.3s ease',
    },
    historyButton: {
      backgroundColor: '#718096',
      color: '#fff',
      padding: '12px',
      borderRadius: '8px',
      cursor: 'pointer',
      width: '100%',
      fontSize: '1rem',
      border: 'none',
      marginTop: '15px',
      transition: 'background-color 0.3s ease',
    },
  };