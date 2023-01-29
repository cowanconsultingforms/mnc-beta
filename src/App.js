import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import ListingPage from './pages/Listings/index';
import { useEffect, useState } from 'react';
import AccountPage from './pages/Account/index';
import Contact from './pages/Contact/index';
import HomePage from './pages/Home/index';
import AdminDashboard from './pages/Admin';
import AuditLog from './pages/Admin/AuditLog';
import { preloadUser, useFirestore, useUser } from 'reactfire';
import NavBar from './components/Misc/NavBar';
import SearchPage from './pages/Search';
import {  getDoc } from 'firebase/firestore';
import ResetPasswordPage from './pages/ResetPassword';
import AuthPage from './pages/Authentication';
import {
  collection,
  query,
  where,
} from 'firebase/firestore';
import { errorPrefix } from '@firebase/util';
import { getIdTokenResult } from 'firebase/auth';


export const App = ({ children }) => {
  const { status, data: user } = useUser();
  const firestore = useFirestore();
  const fsCollection = collection(firestore, 'users');
  const [userData, setUserData] = useState([]);
  const [admin, setAdmin] = userData.role;
  const getUser = async () => {
    if (status === 'loading') {
      preloadUser()
        .toJSON()
        .then(setUserData(...user));
    }
  };
  const roleCheck = async (e) => {
    e.preventDefault();
    
    await getUser().then((res) => {
      if (res) {
        const uid = res.uid;
        const email = res.email;
        const verified = res.emailVerified;
        const displayName = res.displayName;
        const formData = new FormData(uid,email,verified,displayName)
        const q = query(
          collection(firestore, 'users'),
          where('email', '==', formData.get('email'))
        );
        const role = getDoc(q).then((snapshot) => {
          if (snapshot.get('Admin') === true) setUserData(...snapshot.data());
          console.log(userData);
        });
      }
    }, console.log(errorPrefix));
  };
  useEffect(() => {
    roleCheck().then(getIdTokenResult);
  });

  return (
    <div className="App">
      <NavBar />

      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route exact path="/contact" element={<Contact />} />
        <Route exact path="/account" element={<AccountPage />} />
        <Route exact path="/account:uid" element={<AccountPage />} />

        <Route exact path="/admin" element={<AdminDashboard />} />

        <Route exact path="/reset-password" element={<ResetPasswordPage />} />

        <Route exact path="/login" element={<AuthPage title={'Login'} />} />
        <Route exact path="/register" element={<AuthPage title={'register'} />} />

        <Route exact path="/admin/auditlog" element={<AuditLog />} />
        <Route path="/listings/" element={<ListingPage />} />
        <Route path="/listings/:listing_ID" element={<ListingPage />} />
        <Route path="/search/:city" element={<SearchPage />} />
      </Routes>
    </div>
  );
};
//  <Route path="/editListing/:id" element={<EditDocs database={database}/>} />
export default App;
