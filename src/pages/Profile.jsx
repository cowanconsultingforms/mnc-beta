import {
  collection,
  deleteDoc,
  doc,
  documentId,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState, useRef } from "react";
import { AiFillHome } from "react-icons/ai";
import { FaClipboardList } from "react-icons/fa";
import { VscSymbolProperty } from "react-icons/vsc";
import { Link, useNavigate } from "react-router-dom";

import { deleteObject, getStorage, ref } from "firebase/storage";
import ListingItem from "../components/ListingItem";
import VipListingItem from "../components/VipListingItem";
import { db } from "../firebase";
// import { getFirebaseToken, onForegroundMessage } from "../firebase";
import { ToastContainer, toast } from "react-toastify";
import { getMessaging, onMessage } from "firebase/messaging";
import { getAuth, onAuthStateChanged } from "firebase/auth";
// import { createNotification } from "../firebase";
import { addNotificationToCollection } from "../components/Notification";

const Profile = () => {
  const [listings, setListings] = useState(null);
  const [vipListings, setVipListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateListing, setShowCreateListing] = useState(false);
  const [showVIPCreateListing, setShowVIPCreateListing] = useState(false); // VIP

  const [signed, setSigned] = useState("false");
  // const [notificationMessage, setNotificationMessage] = useState('');
  // const [notificationSent, setNotificationSent] = useState(false);
  // const [initialized, setInitialized] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [added, setAdded] = useState(false);
  const [userId, setUserId] = useState("");
  const messaging = getMessaging();

  const auth = getAuth();
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });
  const navigate = useNavigate();
  const { name, email } = formData;

  // Allows user to sign out from logged in account
  const onLogout = () => {
    auth.signOut();
    window.location.assign("/");
  };

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        getUserRole(user.uid);

        setSigned("true");
        // handleGetFirebaseToken();
        setAdded(true);
      }
    });
  }, []);

  // Example of calling the function when a button is clicked
  const handleAddNotificationClick = (notification) => {
    return async () => {
      addNotificationToCollection(notification);
      const usersCollectionRef = collection(db, "users");
      try {
        const querySnapshot = await getDocs(usersCollectionRef);
        querySnapshot.forEach(async (userDoc) => {
          const userData = userDoc.data();
          if (userData.clear !== undefined) {
            const userRef = doc(db, "users", userDoc.id);
            await updateDoc(userRef, { clear: false });
          } else {
            const userRef = doc(db, "users", userDoc.id);
            await updateDoc(userRef, { clear: false });
          }
        });
      } catch (error) {
        console.error("Error updating clear field:", error);
      }
    };
  };
  // // Function to retrieve user role from Firebase Firestore
  const getUserRole = async (uid) => {
    const userRef = doc(db, "users", uid);

    try {
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserRole(userData.role);
      } else {
        console.log("User document not found.");
      }
    } catch (error) {
      console.error("Error getting user document:", error);
    }
  };

  // Get user account role
  useEffect(() => {
    const fetchListings = async () => {
      // Get user info from firestore database
      const userRef = collection(db, "users");
      const userQuery = query(
        userRef,
        where(documentId(), "==", auth.currentUser.uid)
      );
      const user = [];
      const userSnap = await getDocs(userQuery);
      userSnap.forEach((doc) => {
        return user.push(doc.data());
      });

      // Gives user access to listings if they have the correct role
      if (["agent", "admin", "superadmin"].includes(user[0]?.role)) {
        setShowCreateListing(true);
        setShowVIPCreateListing(true); // VIP
        const listingRef = collection(db, "propertyListings");
        const vipListingRef = collection(db, "vipPropertyListings");

        // Queries all listings
        const q = query(listingRef, orderBy("timestamp", "desc"));
        const querySnap = await getDocs(q);

        // Queries all vip listings
        const vipQ = query(vipListingRef, orderBy("timestamp", "desc"));
        const vipQuerySnap = await getDocs(vipQ);

        // Adds all listings from query to 'listings' variable
        let listings = [];
        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setListings(listings);

        // Adds all vip listings from query to 'vipListings' variable
        let vipListings = [];
        vipQuerySnap.forEach((doc) => {
          return vipListings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setVipListings(vipListings);
      }
      setLoading(false);
    };

    fetchListings();
  }, [auth.currentUser.uid]);

  // Allows users to delete their own entries
  const onDelete = async (listingID) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      const storage = getStorage();

      const docRef = doc(db, "propertyListings", listingID);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const deletedListing = docSnap.data();
        deletedListing.imgs.forEach((img) => {
          deleteObject(ref(storage, img.path));
        });
      }

      await deleteDoc(doc(db, "propertyListings", listingID));
      const updatedListings = listings.filter(
        (listing) => listing.id !== listingID
      );
      setListings(updatedListings);
      // handleAddNotificationClick(`A listing is removed!`);
      // sendNotification("Listing deleted");
      // sendNotification();
      toast.success("The listing was deleted!");
    }
  };

  const vipOnDelete = async (viplistingID) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      const storage = getStorage();

      const docRef = doc(db, "vipPropertyListings", viplistingID);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const vipDeletedListing = docSnap.data();
        vipDeletedListing.imgs.forEach((img) => {
          deleteObject(ref(storage, img.path));
        });
      }
      // handleAddNotificationClick(`${listingName} is removed!`);
      await deleteDoc(doc(db, "vipPropertyListings", viplistingID));
      const vipUpdatedListings = vipListings.filter(
        (vipListing) => vipListing.id !== viplistingID
      );
      setVipListings(vipUpdatedListings);
      toast.success("The listing was deleted!");
    }
  };

  const vipOnEdit = (vipListingID) => {
    navigate(`/edit-vip-listing/${vipListingID}`);
  };

  // Redirects users to /edit-listing page
  const onEdit = (listingID) => {
    navigate(`/edit-listing/${listingID}`);
  };

  const manageClients = () => {
    navigate(`/manageRequests/${userId}`);
  };

  return (
    <>
      <section className="max-w-6xl mx-auto flex justify-center items-center flex-col">
        <button
          onClick={() => {
            navigate("/myProfile");
          }}
          className="shadow border p-1 hover:ring-2 text-xl text-center mt-6 font-bold"
        >
          View Your Profile
        </button>
        <div className="w-full max-w-md mt-6 px-3">
          {/* {signed === "true" && userRole === "admin" && (
            <div>
              <button onClick={handleAddNotificationClick(`removed!`)}>
                Send Notification
              </button>
            </div>
          )} */}
          <form>
            {/* Name input */}
            <input
              type="text"
              id="name"
              value={name}
              disabled
              className="mb-6 w-full px-4 py-2 text-lg text-gray-700 border shadow-md rounded transition ease-in-out focus:shadow-lg focus:text-gray-700 bg-white focus:bg-white border-white focus:border-white"
            />

            {/* Email input */}
            <input
              type="email"
              id="email"
              value={email}
              disabled
              className="mb-6 w-full px-4 py-2 text-lg text-gray-700 border shadow-md rounded transition ease-in-out focus:shadow-lg focus:text-gray-700 bg-white focus:bg-white border-white focus:border-white"
            />

            {/* Sign out button */}

            <button
              type="button"
              onClick={onLogout}
              className="flex justify-center items-center mb-9 w-full bg-gray-600 text-white uppercase px-7 py-3 text-sm font-medium rounded shadow-md hover:bg-gray-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-gray-800"
            >
              Sign out
            </button>
          </form>

          {/* Create listing button, navigates to /create-listing page */}
          {showCreateListing && (
            <button
              type="submit"
              className="w-full mb-3 bg-gray-600 text-white uppercase px-7 py-3 text-sm font-medium rounded shadow-md hover:bg-gray-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-gray-800"
            >
              <Link
                to="/create-listing"
                className="flex justify-center items-center"
              >
                <AiFillHome className="mr-2 text-2xl p-1 border-2 rounded-full" />
                Create a Listing
              </Link>
            </button>
          )}

          {showVIPCreateListing && (
            <button
              type="submit"
              className="mt-6 mb-8 w-full bg-gray-600 text-white uppercase px-7 py-3 text-sm font-medium rounded shadow-md hover:bg-gray-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-gray-800"
            >
              <Link
                to="/vip-create-listing"
                className="flex justify-center items-center"
              >
                <AiFillHome className="mr-2 text-2xl p-1 border-2 rounded-full" />
                Create a VIP Listing
              </Link>
            </button>
          )}

          {/* {userRole === "agent" ||
          userRole === "admin" ||
          userRole === "superadmin" ? (
            <button
              type="button"
              onClick={manageClients}
              className="flex justify-center items-center mb-9 w-full bg-gray-600 text-white uppercase px-7 py-3 text-sm font-medium rounded shadow-md hover:bg-gray-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-gray-800"
            >
              <AiFillHome className="mr-2 text-2xl p-1 border-2 rounded-full" />
              Request Tracker
            </button>
          ) : null} */}
          {showCreateListing && (
            <button
              type="submit"
              className=" w-full bg-gray-600 text-white uppercase px-7 py-3 text-sm font-medium rounded shadow-md hover:bg-gray-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-gray-800 mb-6"
            >
              <Link
                to="/manageUsersProfile"
                className="flex justify-center items-center"
              >
                <AiFillHome className="mr-2 text-2xl p-1 border-2 rounded-full" />
                Relationship Management
              </Link>
            </button>
          )}

          {showCreateListing && (
            <button
              type="submit"
              className="w-full bg-gray-600 text-white uppercase px-7 py-3 text-sm font-medium rounded shadow-md hover:bg-gray-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-gray-800 mb-6 "
            >
              <Link
                to="/property-Management"
                className="flex justify-center items-center"
              >
                <VscSymbolProperty className="mr-2 text-2xl p-1 border-2 rounded-full" />
                Property Management
              </Link>
            </button>
          )}

          {showCreateListing && (
            <button
              type="button"
              className="w-full bg-blue-500 text-white uppercase px-7 py-3 text-sm font-medium rounded shadow-md hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-800 "
              onClick={() =>
                window.open(
                  "https://docs.google.com/forms/d/e/1FAIpQLSeJEKEmhkNChaStTLliCwconvj07lyfvKA-fQuIpLqQguApMw/viewform?pli=1%22;send_form%26pli%3D1%22%3B&gs_lcrp=EgZjaHJvbWUyBggAEEUYOdIBBzc3OGowajeoAgCwAgA&sourceid=chrome&ie=UTF-8",
                  "_blank"
                )
              }
            >
              <div className="flex items-center justify-center">
                <FaClipboardList className="mr-2 text-2xl p-1 border-2 rounded-full" />
                Repair Request Form
              </div>
            </button>
          )}
          
        </div>
      </section>

      {/* Display created listings on profile for agents, admins, superadmins */}
      <div className="max-w-6xl px-3 mt-6 mx-auto">
        {!loading && listings?.length > 0 && (
          <>
            <h2 className="text-2xl text-center font-semibold mb-6">
              Listings
            </h2>
            <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 mt-6 mb-6">
              {listings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  id={listing.id}
                  listing={listing.data}
                  onDelete={() => onDelete(listing.id)}
                  onEdit={() => onEdit(listing.id)}
                  // onClick ={() => handleAddNotificationClick(`${listingName} is removed!`)}
                />
              ))}
            </ul>
          </>
        )}
        {!loading && vipListings?.length > 0 && (
          <>
            <h2 className="text-2xl text-center font-semibold mb-6">
              VIP Listings
            </h2>
            <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 mt-6 mb-6">
              {vipListings.map((vipListing) => (
                <VipListingItem
                  key={vipListing.id}
                  id={vipListing.id}
                  vipListing={vipListing.data}
                  onDelete={() => vipOnDelete(vipListing.id)}
                  onEdit={() => vipOnEdit(vipListing.id)}
                />
              ))}
            </ul>
          </>
        )}
      </div>
    </>
  );
};

export default Profile;
