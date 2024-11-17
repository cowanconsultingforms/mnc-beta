import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, query, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useParams, useNavigate } from 'react-router-dom';

const PaymentHistory = () => {
  const [paymentHistory, setPaymentHistory] = useState([]);
  const { uid: routeUserId } = useParams();
  const [userId, setUserId] = useState(null);
  const [role, setRole] = useState('');
  const [userName, setUserName] = useState(''); // Store the selected user's name
  const auth = getAuth();
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userRef = doc(db, 'users', user.uid);
          const userSnapshot = await getDoc(userRef);
          const userData = userSnapshot.data();

          setRole(userData?.role);

          const userIdToFetch = routeUserId && routeUserId !== ':uid' ? routeUserId : user.uid;
          setUserId(userIdToFetch);

          // Fetch the name of the selected user if admin is viewing
          if (routeUserId && routeUserId !== ':uid' && userData?.role === 'admin') {
            const selectedUserRef = doc(db, 'users', routeUserId);
            const selectedUserSnapshot = await getDoc(selectedUserRef);
            const selectedUserData = selectedUserSnapshot.data();
            setUserName(selectedUserData?.name);
          }

          const q = query(collection(db, `payments/${userIdToFetch}/transactions`));
          const querySnapshot = await getDocs(q);

          const history = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              ...data,
              timestamp: data.timestamp?.toDate().toLocaleString(),
            };
          });
          setPaymentHistory(history);
        } catch (error) {
          console.error('Error fetching payment history:', error);
        }
      }
    });
  }, [auth, routeUserId]);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>
        {role === 'admin' && routeUserId ? `Payment History for ${userName || 'Admin'}` : 'Your Payment History'}
      </h2>
      {paymentHistory.length > 0 ? (
        paymentHistory.map((payment, index) => (
          <div key={index} style={styles.historyItem}>
            <div style={styles.paymentDetails}>
              <div>
                <strong>{payment.description}</strong>
                <p style={styles.date}>Date: {payment.timestamp}</p>
              </div>
              <div>
                <span style={styles.amount}>${payment.amount}</span>
              </div>
            </div>
            <p style={styles.paymentType}>Payment Type: {payment.paymentType}</p>
          </div>
        ))
      ) : (
        <p style={styles.noDataText}>No payment history found.</p>
      )}

      <button style={styles.backButton} onClick={() => navigate(-1)}>
        {role === 'admin' ? 'Back to Previous Page' : 'Back to Payments'}
      </button>
    </div>
  );
};

export default PaymentHistory;

const styles = {
  container: {
    padding: '40px 20px',
    maxWidth: '900px',
    margin: '0 auto',
    background: 'linear-gradient(135deg, #f3f4f6, #ffffff)',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    borderRadius: '15px',
    marginTop: '50px',
  },
  title: {
    fontSize: '2.5rem',
    color: '#1a202c',
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: '30px',
    textTransform: 'uppercase',
    letterSpacing: '2px',
  },
  historyItem: {
    backgroundColor: '#f9fafb',
    padding: '20px',
    marginBottom: '20px',
    borderRadius: '12px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)',
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  },
  paymentDetails: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  date: {
    fontSize: '0.9rem',
    color: '#718096',
    marginTop: '5px',
  },
  amount: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'right',
  },
  paymentType: {
    fontSize: '1rem',
    color: '#4a5568',
    marginTop: '10px',
    fontStyle: 'italic',
  },
  noDataText: {
    textAlign: 'center',
    color: '#a0aec0',
    fontSize: '1.2rem',
    marginTop: '30px',
  },
  backButton: {
    display: 'block',
    width: '100%',
    padding: '12px 0',
    backgroundColor: 'grey',
    color: '#fff',
    textAlign: 'center',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    marginTop: '30px',
    transition: 'background-color 0.3s ease',
  },
  backButtonHover: {
    backgroundColor: '#2c5282',
  },
};
