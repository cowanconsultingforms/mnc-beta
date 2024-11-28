import React, { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import nyc from '../assets/nyc.mp4';

const Payments = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState(localStorage.getItem('userEmail') || '');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentType, setPaymentType] = useState('');
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

          // Send email notification upon successful payment
          await sendEmailNotification(userId, name);
        }
      }
    } catch (error) {
      setErrorMessage('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Function to send email notification
  const sendEmailNotification = async (userId, userName) => {
    try {
      await fetch(`${import.meta.env.VITE_BACKEND_API}/sendEmail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipients: ['team@mncdevelopment.com'],
          subject: `New Payment Submitted By User '${userName}'`,
          text: 'A payment has successfully been completed. Navigate to https://mnc-development.web.app/admin to view more information.',
        }),
      });
      console.log('Email notification sent successfully.');
    } catch (error) {
      console.error('Failed to send email notification:', error);
    }
  };

  const handleViewPaymentHistory = () => {
    navigate('/payment-history/:uid');
  };

  return (
    <div style={styles.container}>
      <div style={styles.background}>
    <video src={nyc} autoPlay loop muted playsInline style={styles.video}></video>
    <div style={styles.overlay}></div>
  </div>
      <div style={styles.formContainer}>
        <form onSubmit={handleSubmit} style={styles.checkoutForm}>
          <h2 style={styles.formTitle}>Make a Payment</h2>
          <label htmlFor="name" style={styles.label}>Full Name:</label>
          <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" required style={styles.input} />
          <label htmlFor="email" style={styles.label}>Email:</label>
          <input type="email" id="email" value={email} onChange={(e) => { setEmail(e.target.value); localStorage.setItem('userEmail', e.target.value); }} placeholder="Enter your email" required style={styles.input} />
          <label htmlFor="phone" style={styles.label}>Phone Number:</label>
          <input type="text" id="phone" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="Enter your phone number" required style={styles.input} />
          <label htmlFor="paymentType" style={styles.label}>Payment Type:</label>
          <select id="paymentType" value={paymentType} onChange={(e) => setPaymentType(e.target.value)} style={styles.dropdown}>
            <option value="">--- Select Payment Type ---</option>
            <option value="VIP fee">VIP fee</option>
            <option value="Tenant fee">Tenant fee</option>
            <option value="Partner fee">Partner fee</option>
            <option value="Vendor fee">Vendor fee</option>
            <option value="Other">Other</option>
          </select>
          <label htmlFor="description" style={styles.label}>Description:</label>
          <input type="text" id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Payment description" required style={styles.input} />
          <label htmlFor="amount" style={styles.label}>Amount:</label>
          <input type="number" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter amount" required style={styles.input} />
          <label style={styles.label}>Card Details:</label>
          <div style={styles.cardElement}>
            <CardElement />
          </div>
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
    width: '100%',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: -2,
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    zIndex: -2,
    filter: 'brightness(0.85)', // Slightly dimmed for readability
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.2)', // Light overlay for better visibility
    zIndex: -1,
  },
  formContainer: {
    position: 'relative',
    zIndex: 1,
    width: '100%',
    maxWidth: '800px', // Balanced width for readability
    backgroundColor: '#ffffff', // Clean, professional white background
    borderRadius: '12px',
    boxShadow: '0 6px 15px rgba(0, 0, 0, 0.1)', // Light shadow for subtle depth
    padding: '50px',
    textAlign: 'center',
    zoom: 0.65,
  },
  checkoutForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    alignItems: 'center',
  },
  formTitle: {
    fontSize: '2.3rem', // Slightly larger for prominence
    fontWeight: '600', // Balanced boldness
    color: '#1a202c', // Neutral, professional dark color
    textAlign: 'center', // Centered for better visual balance
    marginBottom: '10px', // Space below the title
    paddingBottom: '5px', // Padding for a clean underline effect
    borderBottom: '2px solid #007bff', // Subtle blue underline for distinction
    letterSpacing: '1px', // Slightly spaced letters for elegance
    fontFamily: '"Poppins", sans-serif', // Modern, professional font
  },
  
  label: {
    fontSize: '1rem',
    color: '#343a40', // Muted dark gray
    marginBottom: '5px',
    alignSelf: 'flex-start',
    fontWeight: '500',
  },
  input: {
    width: '100%',
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid #ced4da', // Light border
    fontSize: '1rem',
    boxSizing: 'border-box',
    outline: 'none',
    backgroundColor: '#fdfdfd',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.05)', // Subtle shadow for realism
  },
  inputFocus: {
    borderColor: '#007bff', // Professional blue focus color
    boxShadow: '0 0 5px rgba(0, 123, 255, 0.3)', // Subtle glow for focus
  },
  dropdown: {
    width: '100%',
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid #ced4da',
    fontSize: '1rem',
    backgroundColor: '#ffffff',
    outline: 'none',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  },
  submitButton: {
    backgroundColor: '#007bff',
    color: '#ffffff',
    padding: '14px',
    borderRadius: '8px',
    cursor: 'pointer',
    width: '100%',
    fontSize: '1rem',
    fontWeight: '600',
    border: 'none',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Professional shadow
    transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
  },
  submitButtonHover: {
    backgroundColor: '#0056b3', // Darker blue for hover
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
  },
  disabledButton: {
    backgroundColor: '#ced4da',
    color: '#6c757d',
    padding: '14px',
    borderRadius: '8px',
    cursor: 'not-allowed',
    width: '100%',
    fontSize: '1rem',
    fontWeight: '600',
    border: 'none',
  },
  historyButton: {
    backgroundColor: '#6c757d',
    color: '#ffffff',
    padding: '12px',
    borderRadius: '6px',
    cursor: 'pointer',
    width: '100%',
    fontSize: '1rem',
    border: 'none',
    marginTop: '10px',
    transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
  },
  cardElement: {
    border: '1px solid #cbd5e0',
    borderRadius: '8px',
    padding: '12px',
    minHeight: '100%',
    width: '800px',
    boxSizing: 'border-box',
    marginBottom: '8px',
    fontSize: '1rem',
    backgroundColor: '#fdfdfd',
  },
};
