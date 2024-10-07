import React, { useState, useEffect } from 'react';
import { storage, db, auth } from '../firebase'; // Ensure Firebase setup
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';

// Custom styles for the background image
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

// Document management component
const UserDocuments = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedDocs, setUploadedDocs] = useState([]);
  const [comments, setComments] = useState({});
  const [userRole, setUserRole] = useState('user'); // Adjust user role accordingly

  useEffect(() => {
    // Fetch the documents from Firebase on component mount
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    const querySnapshot = await getDocs(collection(db, 'documents'));
    const documents = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setUploadedDocs(documents);
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    const fileName = `${uuidv4()}-${selectedFile.name}`;
    const storageRef = ref(storage, `documents/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, selectedFile);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Progress monitoring can be added here
      },
      (error) => {
        console.error('File upload failed', error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        const docRef = await addDoc(collection(db, 'documents'), {
          name: fileName,
          url: downloadURL,
          comments: ''
        });
        setUploadedDocs((prev) => [...prev, { id: docRef.id, name: fileName, url: downloadURL, comments: '' }]);
        setSelectedFile(null);
      }
    );
  };

  const handleFileDelete = async (docId, fileName) => {
    const storageRef = ref(storage, `documents/${fileName}`);
    await deleteObject(storageRef);
    await deleteDoc(doc(db, 'documents', docId));
    setUploadedDocs(uploadedDocs.filter(doc => doc.id !== docId));
  };

  const handleCommentChange = (docId, comment) => {
    setComments((prev) => ({ ...prev, [docId]: comment }));
  };

  const handleAddComment = async (docId) => {
    const updatedComments = comments[docId];
    const docRef = doc(db, 'documents', docId);
    await updateDoc(docRef, { comments: updatedComments });
    setUploadedDocs(uploadedDocs.map(doc => doc.id === docId ? { ...doc, comments: updatedComments } : doc));
  };

  return (
    <div style={backgroundStyle}>
      <div style={overlayStyle}>
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-white mb-6 text-center">Manage Your Documents</h2>
          
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
        </div>
      </div>
    </div>
  );
};

export default UserDocuments;
