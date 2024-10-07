import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import nyc from '../assets/nyc.mp4';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const Payments = () => {
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

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

    if (amount <= 0) {
      setErrorMessage('Amount must be greater than zero.');
      setLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_API}/createPaymentIntent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount * 100,
          currency: 'usd',
          description,
        }),
      });

      const { clientSecret } = await response.json();

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: 'Customer Name',
          },
        },
      });

      if (error) {
        setErrorMessage(error.message);
      } else {
        setSuccessMessage('Payment successful!');
      }
    } catch (error) {
      setErrorMessage('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewPaymentHistory = () => {
    const mockPaymentHistory = [
      { id: 1, date: '2024-10-07', amount: 50, status: 'Completed', description: 'Subscription Fee' },
      { id: 2, date: '2024-10-05', amount: 75, status: 'Completed', description: 'Consulting Fee' },
      { id: 3, date: '2024-10-03', amount: 100, status: 'Pending', description: 'Service Payment' },
    ];
    setPaymentHistory(mockPaymentHistory);
    setShowHistory(!showHistory);
  };

  return (
    <div style={styles.container}>
      <video src={nyc} autoPlay loop muted style={styles.video} />
      <div style={styles.overlay}></div>

      <Elements stripe={stripePromise}>
        <div className="payment-form-container" style={styles.formContainer}>
          <div className="checkout-form" style={styles.checkoutForm}>
            <h2 style={styles.formTitle}>Make A Payment</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
              <label style={styles.label}>
                Amount
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  style={styles.input}
                />
              </label>

              <label style={styles.label}>
                Description
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Reason for payment"
                  style={styles.textarea}
                />
              </label>

              <label style={styles.label}>
                Card Information
                <CardElement style={styles.cardElement} />
              </label>

              {errorMessage && <div style={styles.errorMessage}>{errorMessage}</div>}
              {successMessage && <div style={styles.successMessage}>{successMessage}</div>}

              <button type="submit" style={styles.submitButton} disabled={loading || !stripe}>
                {loading ? 'Processing...' : `Pay $${amount}`}
              </button>

              <button type="button" style={styles.historyButton} onClick={handleViewPaymentHistory}>
                {showHistory ? 'Hide Payment History' : 'View Payment History'}
              </button>
            </form>

            {showHistory && (
              <div style={styles.historyContainer}>
                <h3 style={styles.historyTitle}>Payment History</h3>
                <ul style={styles.historyList}>
                  {paymentHistory.map((payment) => (
                    <li key={payment.id} style={styles.historyItem}>
                      <strong>Date:</strong> {payment.date} | <strong>Amount:</strong> ${payment.amount} | <strong>Status:</strong> {payment.status} | <strong>Description:</strong> {payment.description}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </Elements>
    </div>
  );
};

export default Payments;

const styles = {
  container: {
    position: 'relative',
    height: '100vh',
    overflow: 'hidden',
  },
  video: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transform: 'translate(-50%, -50%)',
    zIndex: '-2', // Changed to ensure video stays behind everything
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(to bottom right, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.1))',
    zIndex: '-1', // Overlay should stay above the video but below the content
  },
  formContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    zIndex: '1',
  },
  checkoutForm: {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '15px',
    padding: '40px',
    maxWidth: '700px', // Increased the maxWidth for a larger form
    width: '80%', // Ensuring it takes up more space on the page
    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.3)',
    textAlign: 'center',
    zIndex: '2', // Ensures the form is above all other elements
  },
  formTitle: {
    fontSize: '2.5rem',
    fontWeight: '600',
    marginBottom: '20px',
    color: '#333',
  },
  label: {
    fontSize: '1.1rem',
    color: '#555',
    textAlign: 'left',
    width: '100%',
    marginBottom: '10px',
  },
  input: {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    width: '100%',
    marginBottom: '15px',
    fontSize: '1rem',
  },
  textarea: {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    width: '100%',
    marginBottom: '15px',
    fontSize: '1rem',
    minHeight: '100px',
  },
  submitButton: {
    backgroundColor: '#007BFF',
    color: '#fff',
    padding: '14px 35px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    marginTop: '20px',
    transition: 'background-color 0.3s ease',
    width: '100%',
  },
  historyButton: {
    backgroundColor: '#6c757d',
    color: '#fff',
    padding: '12px 30px',
    borderRadius: '8px',
    cursor: 'pointer',
    marginTop: '15px',
    width: '100%',
  },
  historyContainer: {
    background: '#f8f9fa',
    padding: '20px',
    borderRadius: '10px',
    marginTop: '25px',
  },
  historyTitle: {
    fontSize: '1.8rem',
    color: '#333',
    marginBottom: '10px',
  },
  historyItem: {
    fontSize: '1.1rem',
    margin: '8px 0',
  },
};
