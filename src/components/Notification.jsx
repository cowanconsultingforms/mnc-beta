import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Import your Firestore instance

// Function to add a notification to the "notifications" collection
export const addNotificationToCollection = async (text) => {
  const notificationsRef = collection(db, 'notifications');
  const notificationData = {
    text,
    timestamp: new Date(),
  };

  try {
    await addDoc(notificationsRef, notificationData);
    // console.log('Notification added to the "notifications" collection.');
  } catch (error) {
    console.error('Error adding notification:', error);
  }
};