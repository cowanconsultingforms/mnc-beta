import { getAuth, updateProfile } from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
  documentId,
} from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AiFillHome } from "react-icons/ai";
import { Link } from "react-router-dom";
import ListingItem from "../components/ListingItem";

const Profile = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [changeDetail, setChangeDetail] = useState(false);
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });

  const { name, email } = formData;

  // Allows user to sign out from logged in account
  const onLogout = () => {
    auth.signOut();
    navigate("/");
  };

  // Changes name form data as user types
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  // Updates changed name data to firebase
  const onSubmit = async () => {
    try {
      if (auth.currentUser.displayName !== name) {
        // Update display name in firebase auth
        await updateProfile(auth.currentUser, {
          displayName: name,
        });

        // Update name in firestore database
        const docRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(docRef, { name });
      }
      toast.success("Profile details updated!");
    } catch (error) {
      toast.error("Could not apply changes.");
    }
  };

  // Display user created listing on profile page
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
      if (
        user[0]?.role === "agent" ||
        user[0]?.role === "admin" ||
        user[0]?.role === "superadmin"
      ) {
        const listingRef = collection(db, "propertyListings");

        // Queries all listings that match user id
        const q = query(listingRef, orderBy("timestamp", "desc"));
        const querySnap = await getDocs(q);

        // Adds all listings from query to 'listings' variable
        let listings = [];
        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setListings(listings);
      }
      setLoading(false);
    };

    fetchListings();
  }, [auth.currentUser.uid]);

  // Allows users to delete their own entries
  const onDelete = async (listingID) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      await deleteDoc(doc(db, "propertyListings", listingID));
      const updatedListings = listings.filter(
        (listing) => listing.id !== listingID
      );
      setListings(updatedListings);
      toast.success("The listing was deleted!");
    }
  };

  // Redirects users to /edit-listing page
  const onEdit = (listingID) => {
    navigate(`/edit-listing/${listingID}`);
  };

  return (
    <>
      <section className="max-w-6xl mx-auto flex justify-center items-center flex-col">
        <h1 className="text-3xl text-center mt-6 font-bold">My Profile</h1>
        <div className="w-full max-w-md mt-6 px-3">
          <form>
            {/* Name input */}
            <input
              type="text"
              id="name"
              value={name}
              disabled={!changeDetail}
              onChange={onChange}
              className={`mb-6 w-full px-4 py-2 text-lg text-gray-700 border shadow-md rounded transition ease-in-out focus:shadow-lg focus:text-gray-700
              ${
                !changeDetail &&
                "bg-white focus:bg-white border-white focus:border-white"
              }
              ${
                changeDetail &&
                "bg-red-200 focus:bg-red-200 border-red-200 focus:border-red-200"
              }`}
            />

            {/* Email input */}
            <input
              type="email"
              id="email"
              value={email}
              disabled
              className="mb-6 w-full px-4 py-2 text-lg text-gray-700 border shadow-md rounded transition ease-in-out focus:shadow-lg focus:text-gray-700 bg-white focus:bg-white border-white focus:border-white"
            />

            <div className="flex justify-between whitespace-nowrap text-sm mb-6">
              {/* Edit profile name button */}
              <p className="flex items-center">
                Do you want to change your name?
                <span
                  onClick={() => {
                    changeDetail && onSubmit();
                    setChangeDetail((prevState) => !prevState);
                  }}
                  className="text-gray-500 hover:text-gray-700 transition ease-in-out duration-200 ml-1 cursor-pointer"
                >
                  {/* Dynamically switches text depending on changeDetail value */}
                  {changeDetail ? "Apply Changes" : "Edit"}
                </span>
              </p>

              {/* Sign out button */}
              <p
                onClick={onLogout}
                className="text-gray-500 hover:text-gray-700 transition ease-in-out duration-200 cursor-pointer"
              >
                Sign out
              </p>
            </div>
          </form>

          {/* Create listing button, navigates to /create-listing page */}
          <button
            type="submit"
            className="w-full bg-gray-600 text-white uppercase px-7 py-3 text-sm font-medium rounded shadow-md hover:bg-gray-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-gray-800"
          >
            <Link
              to="/create-listing"
              className="flex justify-center items-center"
            >
              <AiFillHome className="mr-2 text-2xl p-1 border-2 rounded-full" />
              Create a Listing
            </Link>
          </button>
        </div>
      </section>

      {/* Display user created listings on profile */}
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
