import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';


const PaymentHistory = () => {
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [userId, setUserId] = useState(null);
  const auth = getAuth();
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        const q = query(collection(db, `payments/${user.uid}/transactions`));
        const querySnapshot = await getDocs(q);
        const history = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            ...data,
            timestamp: data.timestamp?.toDate().toLocaleString(), // Format timestamp for display
          };
        });
        setPaymentHistory(history);
      }
    });
  }, [auth]);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Payment History</h2>
      {paymentHistory.map((payment, index) => (
        <div key={index} style={styles.historyItem}>
          <strong>{payment.description}</strong><br />
          Amount: ${payment.amount}<br />
          Date: {payment.timestamp}<br />
          Payment Type: {payment.paymentType}
        </div>
      ))}
      <button style={styles.backButton} onClick={() => navigate('/payments/:uid')}>Back to Payments</button>
    </div>
  );
};

export default PaymentHistory;


const styles = {
    container: {
      padding: '20px',
      maxWidth: '900px',
      margin: '0 auto',
      background: '#ffffff',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
      borderRadius: '12px',
      marginTop: '40px',
    },
    title: {
      fontSize: '2rem',
      color: '#2d3748',
      textAlign: 'center',
      marginBottom: '20px',
    },
    historyItem: {
      backgroundColor: '#f7fafc',
      padding: '15px',
      marginBottom: '10px',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    },
    backButton: {
      backgroundColor: '#3182ce',
      color: '#fff',
      padding: '10px 20px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '1rem',
      border: 'none',
      marginTop: '15px',
    },
  };