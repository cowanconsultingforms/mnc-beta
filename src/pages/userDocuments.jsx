import React, { useState, useEffect } from 'react';
import { storage, db, auth } from '../firebase'; // Ensure Firebase setup
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { useParams } from 'react-router-dom'; // For accessing the route parameter (userId)
import { toast } from 'react-toastify';

const backgroundStyle = {
  backgroundImage: 'url("https://c8.alamy.com/comp/2M6021K/document-management-data-system-business-technology-concept-dms-on-virtual-screen-2M6021K.jpg")', // Use a suitable image URL
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  minHeight: '100vh',
};

const overlayStyle = {
  backgroundColor: 'rgba(0, 0, 0, 0.6)', // Add a dark overlay for better readability
  minHeight: '100vh',
  padding: '50px 20px',
};

const UserDocuments = () => {
  const { uid: routeUserId } = useParams(); // Get the selected userId from the route parameters
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedDocs, setUploadedDocs] = useState([]);
  const [comments, setComments] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentUserRole, setCurrentUserRole] = useState(null); // To store current user's role
  const [userName, setUserName] = useState(''); // To store the user's name
  const currentUser = auth.currentUser; // Get the currently logged-in user

  useEffect(() => {
    const fetchUserRole = async () => {
      if (currentUser) {
        const userDocRef = doc(db, `users/${currentUser.uid}`);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setCurrentUserRole(userData.role); // Set the current user's role (admin, user, etc.)
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
          fetchUserName(routeUserId); // Fetch the selected user's name
          fetchDocuments(routeUserId); // Fetch documents for the selected user
        } else {
          console.error("No routeUserId available for admin.");
        }
      } else {
        fetchDocuments(currentUser?.uid); // Fetch documents for the current user
      }
    }
  }, [routeUserId, currentUserRole]);

  const fetchUserName = async (userId) => {
    try {
      const userDocRef = doc(db, `users/${userId}`);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserName(userData.name); // Fetch the user's name from Firestore
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

      const docsRef = collection(db, `documents/${userId}/files`); // Fetch documents from the subcollection for the selected user
      const querySnapshot = await getDocs(docsRef);

      if (querySnapshot.empty) {
        console.log(`No documents found for userId: ${userId}`);
        setUploadedDocs([]); // If no documents are found
      } else {
        const documents = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUploadedDocs(documents); // Set state with fetched documents
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

  const handleUpload = () => {
    if (!selectedFile) return;

    const userId = routeUserId && (currentUserRole === 'admin' || currentUserRole === 'superadmin') ? routeUserId : currentUser?.uid;
    const fileName = `${uuidv4()}-${selectedFile.name}`;
    const storageRef = ref(storage, `documents/${userId}/${fileName}`); // Store under the user's folder in Firebase Storage

    const uploadTask = uploadBytesResumable(storageRef, selectedFile);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Handle upload progress
      },
      (error) => {
        console.error('File upload failed', error);  // Handle error
        toast.error('File upload failed');
      },
      async () => {
        const fileRef = uploadTask.snapshot.ref;
        const downloadURL = await getDownloadURL(fileRef);

        // Add the document details to Firestore under the user's files subcollection
        const docRef = await addDoc(collection(db, `documents/${userId}/files`), {
          name: fileName,
          url: downloadURL,
          comments: '',
          uid: userId,
        });

        setUploadedDocs((prev) => [...prev, { id: docRef.id, name: fileName, url: downloadURL, comments: '' }]);
        setSelectedFile(null);  // Clear selected file
        toast.success('Document uploaded successfully');
      }
    );
  };

  const handleFileDelete = async (docId, fileName) => {
    const userId = routeUserId && (currentUserRole === 'admin' || currentUserRole === 'superadmin') ? routeUserId : currentUser?.uid;
    const storageRef = ref(storage, `documents/${userId}/${fileName}`);  // Path for storage deletion

    try {
      // Delete the file from Firebase Storage
      await deleteObject(storageRef);

      // Delete the document reference from Firestore (user's files subcollection)
      await deleteDoc(doc(db, `documents/${userId}/files`, docId));

      // Update state to reflect the deleted document
      setUploadedDocs(uploadedDocs.filter(doc => doc.id !== docId));
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
          {/* Conditionally render the title based on user role */}
          <h2 className="text-4xl font-bold text-white mb-6 text-center">
            {currentUserRole === 'admin' || currentUserRole === 'superadmin' 
              ? `Manage Documents for ${userName || 'the selected user'}` // Fallback if name is undefined
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
