import React, { useState, useEffect } from 'react';
import { storage, db, auth } from '../firebase';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAuth } from 'firebase/auth';

const backgroundStyle = {
  backgroundImage: 'url("https://c8.alamy.com/comp/2M6021K/document-management-data-system-business-technology-concept-dms-on-virtual-screen-2M6021K.jpg")',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  minHeight: '100vh',
};

const overlayStyle = {
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  minHeight: '100vh',
  padding: '50px 20px',
};

const UserDocuments = () => {
  const { uid: routeUserId } = useParams();
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedDocs, setUploadedDocs] = useState([]);
  const [comments, setComments] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentUserRole, setCurrentUserRole] = useState(null);
  const [userName, setUserName] = useState('');
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchUserRole = async () => {
      if (currentUser) {
        const userDocRef = doc(db, `users/${currentUser.uid}`);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setCurrentUserRole(userData.role);
        } else {
          console.error("User role not found in Firestore.");
        }
      }
    };

    fetchUserRole();
  }, [currentUser]);

  useEffect(() => {
    if (currentUserRole) {
      if (currentUserRole === 'admin' || currentUserRole === 'superadmin') {
        if (routeUserId) {
          fetchUserName(routeUserId);
          fetchDocuments(routeUserId);
        } else {
          console.error("No routeUserId available for admin.");
        }
      } else {
        fetchDocuments(currentUser?.uid);
      }
    }
  }, [routeUserId, currentUserRole]);

  const fetchUserName = async (userId) => {
    try {
      const userDocRef = doc(db, `users/${userId}`);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserName(userData.name);
      } else {
        console.error("User name not found in Firestore.");
      }
    } catch (error) {
      console.error("Error fetching user name:", error);
    }
  };

  const fetchDocuments = async (userId) => {
    setLoading(true);
    try {
      if (!userId) {
        console.error('No userId provided for document fetching.');
        return;
      }

      const docsRef = collection(db, `documents/${userId}/files`);
      const querySnapshot = await getDocs(docsRef);

      if (querySnapshot.empty) {
        console.log(`No documents found for userId: ${userId}`);
        setUploadedDocs([]);
      } else {
        const documents = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUploadedDocs(documents);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast.error('Error fetching documents');
    }
    setLoading(false);
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
  if (!selectedFile) return;

  const userId = routeUserId && (currentUserRole === 'admin' || currentUserRole === 'superadmin') ? routeUserId : currentUser?.uid;
  const fileName = selectedFile.name;  // Use the original file name without UUID
  const storageRef = ref(storage, `documents/${userId}/${fileName}`);

  const uploadTask = uploadBytesResumable(storageRef, selectedFile);

  uploadTask.on(
    'state_changed',
    (snapshot) => {
      // Handle upload progress
    },
    (error) => {
      console.error('File upload failed', error);
      toast.error('File upload failed');
    },
    async () => {
      const fileRef = uploadTask.snapshot.ref;
      const downloadURL = await getDownloadURL(fileRef);

      const docRef = await addDoc(collection(db, `documents/${userId}/files`), {
        name: fileName,
        url: downloadURL,
        comments: '',
        uid: userId,
      });

      setUploadedDocs((prev) => [...prev, { id: docRef.id, name: fileName, url: downloadURL, comments: '' }]);
      setSelectedFile(null);
      toast.success('Document uploaded successfully');
      await sendEmailNotification();
    }
  );
};


  // Function to send email notification
  const sendEmailNotification = async () => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    const userName = currentUser?.displayName || "User";
  
    try {
      await fetch(`${import.meta.env.VITE_BACKEND_API}/sendEmail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipients: ['team@mncdevelopment.com'],
          subject: `New Document Uploaded By User '${userName}'`,
          text: 'A document has successfully been uploaded. Navigate to https://mnc-development.web.app/admin to view more information.',
        }),
      });
      console.log('Email notification sent successfully.');
    } catch (error) {
      console.error('Failed to send email notification:', error);
    }
  };

  const handleFileDelete = async (docId, fileName) => {
    // Identify the appropriate userId based on role and routeUserId
    const userId = (currentUserRole === 'admin' || currentUserRole === 'superadmin') && routeUserId 
      ? routeUserId 
      : currentUser?.uid;
  
    const storageRef = ref(storage, `documents/${userId}/${fileName}`);
  
    try {
      // Delete the file from Firebase Storage
      await deleteObject(storageRef);
      
      // Delete the document reference from Firestore
      await deleteDoc(doc(db, `documents/${userId}/files`, docId));
      
      // Update the state to remove the deleted document from the UI
      setUploadedDocs((prev) => prev.filter((doc) => doc.id !== docId));
      toast.success('Document deleted successfully');
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Error deleting document');
    }
  };
  

  const handleCommentChange = (docId, comment) => {
    setComments((prev) => ({ ...prev, [docId]: comment }));
  };

  const handleAddComment = async (docId) => {
    const updatedComments = comments[docId];
    const userId = routeUserId && (currentUserRole === 'admin' || currentUserRole === 'superadmin') ? routeUserId : currentUser?.uid;
    const docRef = doc(db, `documents/${userId}/files`, docId);
    await updateDoc(docRef, { comments: updatedComments });
    setUploadedDocs(uploadedDocs.map(doc => doc.id === docId ? { ...doc, comments: updatedComments } : doc));
    toast.success('Comment updated successfully');
  };

  return (
    <div style={backgroundStyle}>
      <div style={overlayStyle}>
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-white mb-6 text-center">
            {currentUserRole === 'admin' || currentUserRole === 'superadmin' 
              ? `Manage Documents for ${userName || 'the selected user'}`
              : 'Manage Your Documents'}
          </h2>

          <div className="bg-white p-8 rounded-lg shadow-lg max-w-xl mx-auto mb-10">
            <h3 className="text-2xl font-semibold mb-4 text-gray-900">Upload Document</h3>
            <input type="file" onChange={handleFileChange} className="w-full mb-4" />
            <button
              onClick={handleUpload}
              className="py-2 px-4 w-full bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
            >
              Upload Document
            </button>
          </div>

          {loading ? (
            <p>Loading documents...</p>
          ) : (
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
              <h3 className="text-2xl font-semibold mb-6 text-gray-900">Uploaded Documents</h3>
              <ul className="space-y-6">
                {uploadedDocs.length > 0 ? (
                  uploadedDocs.map((doc) => (
                    <li key={doc.id} className="p-4 bg-gray-100 border border-gray-300 rounded-xl shadow-lg flex justify-between items-center">
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:underline text-lg font-medium truncate"
                      >
                        {doc.name}
                      </a>
                      <div className="ml-4 flex flex-col w-64">
                        <textarea
                          value={comments[doc.id] || doc.comments || ""}
                          onChange={(e) => handleCommentChange(doc.id, e.target.value)}
                          placeholder="Add or edit comment"
                          className="w-full h-20 p-3 border border-gray-300 rounded-lg bg-gray-50 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                        />
                        <button
                          onClick={() => handleAddComment(doc.id)}
                          className="mt-2 py-2 px-4 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition duration-300"
                        >
                          Save Comment
                        </button>
                      </div>
                      <button
                        onClick={() => handleFileDelete(doc.id, doc.name)}
                        className="ml-4 py-2 px-4 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition duration-300"
                      >
                        Delete
                      </button>
                    </li>
                  ))
                ) : (
                  <p className="text-gray-600 text-center">No documents found.</p>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDocuments;
