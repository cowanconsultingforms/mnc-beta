import React, {lazy, Suspense} from "react";
import { Route, Routes } from 'react-router-dom';
import './App.css';
import { useEffect, useState } from 'react';
import { preloadUser, useFirestore, useUser } from 'reactfire';
import NavBar from './components/Misc/NavBar';
import { getDoc } from 'firebase/firestore';
import ResetPasswordPage from './pages/ResetPassword';
import { collection, query, where } from 'firebase/firestore';
import { errorPrefix } from '@firebase/util';
import { getIdTokenResult } from 'firebase/auth';
import { List } from '@mui/material';

const AuthPage = lazy(()=> import("./pages/Authentication"));
const ListingPage = lazy(()=> import("./pages/Listings/index"));
const AccountPage = lazy(()=> import("./pages/Account/index"));
const Contact  = lazy(()=> import("./pages/Contact/index"));
const HomePage = lazy(()=> import("./pages/Home/index"));
const AdminDashboard = lazy(()=> import( "./pages/Admin"));
const AuditLog = lazy(()=> import("./pages/Admin/AuditLog"));
const SearchPage  = lazy(()=> import("./pages/Search"));


export const App = ({ children }) => {
  const { status, data: user } = useUser();
  const firestore = useFirestore();
  const fsCollection = collection(firestore, 'users');
  const [userData, setUserData] = useState([]);
  const [admin, setAdmin] = useState(userData);
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
        const formData = new FormData(uid, email, verified, displayName);
        const q = query(
          collection(firestore, 'users'),
          where('email', '==', formData.get('email')),
        );
        const role = getDoc(q).then((snapshot) => {
          if (snapshot.get('Admin') === true) setUserData(...snapshot.data());
          console.log(userData);
        });
      }
    }, console.log(errorPrefix));
  };
  const browseUsers = () => {
    if (userData.length !== 0) {
      userData.forEach((val, idx) => {
        const users = [
          <List dense id={idx}>
            {val}
          </List>,
        ];
      });
    }
  };
  useEffect(() => {
    roleCheck();
  });

  return (
    <div className="App">
      <NavBar />
      <Suspense fallback={<h1>loading....</h1>}>
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route exact path="/contact" element={<Contact />} />
        <Route exact path="/account" element={<AccountPage />} />
        <Route exact path="/account:uid" element={<AccountPage />} />

        <Route exact path="/admin" element={<AdminDashboard />} />

        <Route exact path="/reset-password" element={<ResetPasswordPage />} />

        <Route exact path="/login" element={<AuthPage title={'Login'} />} />
        <Route
          exact
          path="/register"
          element={<AuthPage title={'register'} />}
        />

        <Route exact path="/admin/auditlog" element={<AuditLog />} />
        <Route path="/listings/" element={<ListingPage />} />
        <Route path="/listings/:listing_ID" element={<ListingPage />} />
        <Route path="/listings/:state" element={<ListingPage />} />
        <Route path="/search/:city" element={<SearchPage />} />
        <Route path="/listings/:address" element={<ListingPage />} />
        <Route path="/listings/:zip" element={<ListingPage />} />
      </Routes>
      </Suspense>
    </div>
  );
};
//  <Route path="/editListing/:id" element={<EditDocs database={database}/>} />
export default App;
