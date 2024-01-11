import { collection, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import "../css/Home1.css";
import ListingItem from "../components/ListingItem";
import { db } from "../firebase";
import "../css/PopUp.css";
import { onAuthStateChanged } from "firebase/auth";
import { doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { deleteDoc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { deleteObject, getStorage, ref } from "firebase/storage";

const SavedSearches = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState(null);
  const [buttonClicked, setButtonClicked] = useState(false);

  useEffect(() => {
    const saved = async () => {
      const auth = getAuth();

      // Listen for changes in the user's authentication state
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const uid = user.uid;
          const userDocRef = doc(db, "users", uid);

          try {
            const docSnapshot = await getDoc(userDocRef);

            if (docSnapshot.exists()) {
              const userData = docSnapshot.data();
              const userlistings = userData.savedProperties || [];
              const idArray = userlistings.map((listing) => listing.id);
              const listingRef = collection(db, "propertyListings");

              const promises = idArray.map(async (id) => {
                const docRef = doc(listingRef, id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                  return {
                    id: docSnap.id,
                    data: docSnap.data(),
                  };
                } else {
                  return null;
                }
              });

              const results = await Promise.all(promises);
              const listings = results.filter((result) => result !== null);

              setSuggestions(listings);
              if (buttonClicked) {
                window.location.reload(); // This reloads the page
              }
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
          } finally {
            setLoading(false); // Mark loading as complete
          }
        } else {
          // Handle the case when the user is not authenticated
        }
      });
    };

    saved(); // Call the function within the useEffect

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buttonClicked]);

  const onDelete = async (listingID) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        // Handle the case where the user is not authenticated.
        return;
      }

      const userDocRef = doc(db, "users", user.uid);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        const savedProperties = userData.savedProperties || [];

        const indexToDelete = savedProperties.findIndex(
          (property) => property.id === listingID
        );

        if (indexToDelete !== -1) {
          savedProperties.splice(indexToDelete, 1);

          await updateDoc(userDocRef, {
            savedProperties: savedProperties,
          });
          setButtonClicked("true");
          toast.success("The listing was deleted from saved properties!");
        } else {
          toast.error("Listing not found in saved properties.");
        }
      } else {
        toast.error("User document does not exist.");
      }
    }
  };

  return (
    <>
      <div className="px-4 py-2 font-medium uppercase shadow-md rounded ring-1 hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full">
        <h1>Saved Searches</h1>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="w-full max-w-6xl mx-auto flex items-center justify-center">
          <ul className="w-full sm:grid sm:grid-cols-2 lg:grid-cols-3 mb-6">
            {suggestions.map((listing) => (
              <ListingItem
                key={listing.id}
                id={listing.id}
                listing={listing.data}
                onDelete={() => onDelete(listing.id)}
              />
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default SavedSearches;
