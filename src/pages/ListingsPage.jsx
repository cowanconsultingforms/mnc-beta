import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase"; // Adjust import if necessary
import ListingItem from "../components/ListingItem"; // Assuming this component displays a listing
import { toast } from "react-toastify";
import "../css/listingPage.css";

const ListingsPage = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        // Get regular listings from Firestore
        const listingRef = collection(db, "propertyListings");
        const q = query(listingRef, orderBy("timestamp", "desc"));
        const querySnap = await getDocs(q);

        let listings = [];
        querySnap.forEach((doc) => {
          listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });

        setListings(listings);
      } catch (error) {
        toast.error("Failed to load listings.");
        console.error("Error fetching listings: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  // Delete listing function
  const onDelete = async (listingID) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      const docRef = doc(db, "propertyListings", listingID);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const deletedListing = docSnap.data();
        await deleteDoc(docRef); // Remove from Firestore

        // Update the state to reflect the deleted listing
        const updatedListings = listings.filter(
          (listing) => listing.id !== listingID
        );
        setListings(updatedListings);

        toast.success("Listing deleted successfully.");
      }
    }
  };

  // Edit listing function
  const onEdit = (listingID) => {
    navigate(`/edit-listing/${listingID}`);
  };

  return (
    <div className="relative font-semibold text-gray-900">
      {/* Video Background */}
      <div className="fixed top-0 left-0 w-full h-full z-0 overflow-hidden">
        <iframe
          className="absolute top-0 left-0 w-full h-full"
          src="https://www.youtube.com/embed/8BBE1Ui8yo4?si=5BNr_sLaivrlXusM&controls=0&autoplay=1&mute=1&loop=1&playlist=8BBE1Ui8yo4&modestbranding=1&vq=hd2160&iv_load_policy=3&showinfo=0&rel=0"
          title="YouTube video player"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{
            width: '100vw',
            height: '100vh',
            position: 'absolute',
            top: '0',
            left: '0',
            objectFit: 'cover', // Ensures the video covers the entire area
            pointerEvents: 'none'
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl px-3 mt-6 mx-auto">
        {!loading && listings.length > 0 && (
          <>
            <h2 className="text-2xl text-center font-semibold mb-6 text-white">
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
        {!loading && listings.length === 0 && (
          <p className="text-center">No listings available.</p>
        )}
      </div>
    </div>
  );
};

export default ListingsPage;
