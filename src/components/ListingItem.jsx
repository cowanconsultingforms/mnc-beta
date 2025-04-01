import { useState } from "react";
import { FaMapMarkerAlt, FaTrash } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import Moment from "react-moment";
import { Link, useNavigate } from "react-router-dom";
import { getStorage, ref, deleteObject } from "firebase/storage";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { toast } from "react-hot-toast"; // Use react-hot-toast for notifications
import { db } from "../firebase"; // Import db if not imported

const ListingItem = ({
  listing,
  id,
  onDelete,
  isPropertyManagement,
  showActions, // Add the showActions prop here
  videoRef,
  isVip = false,
}) => {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = () => {
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    setShowConfirm(false);
    try {
      const storage = getStorage();
      const docRef = doc(db, "propertyListings", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const deletedListing = docSnap.data();
        const deletePromises = deletedListing.imgs.map((img) =>
          deleteObject(ref(storage, img.path))
        );

        await Promise.all(deletePromises); // Wait for all delete promises to resolve
        await deleteDoc(docRef); // Delete the listing from Firestore

        if (onDelete) {
          onDelete(); // Update parent state
        }

        toast.success("The listing was deleted!"); // Notify the user
      } else {
        toast.error("Listing not found."); // Notify if the listing does not exist
      }
    } catch (error) {
      console.error("Error deleting listing:", error);
      toast.error("Failed to delete the listing.");
    }
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    if (videoRef?.current && videoRef.current.paused) {
      videoRef.current.play().catch((err) => {
        console.warn("Failed to resume video:", err);
      });
    }
  };

  const handleEdit = (event) => {
    event.stopPropagation(); // Prevents triggering the Link's onClick
    navigate(`/edit-listing/${id}`);
  };

  return (
    <>
      <li className="relative bg-white flex flex-col justify-between items-center shadow-md hover:shadow-xl rounded-md overflow-hidden transition-shadow duration-150 m-2">
        <Link
          className="contents"
          to={
            isPropertyManagement
              ? `/property-management/${id}/tenants`
              : `${isVip ? "/vip" : ""}/category/${listing.type}/${id}`
          }
        >
          <div className="relative w-full h-60 mb-2">
            <img
              className="grayscale h-full w-full object-cover hover:scale-105 transition-transform duration-200 ease-in"
              loading="lazy"
              src={listing.imgs[0].url}
              alt=""
            />
            <Moment
              className="absolute top-2 left-2 bg-gray-500 text-white uppercase text-xs font-semibold rounded-md px-2 py-1 shadow-lg"
              fromNow
            >
              {listing.timestamp?.toDate()}
            </Moment>
          </div>

          <div className="w-full p-2">
            <div className="flex items-center space-x-1 mb-1">
              <FaMapMarkerAlt className="h-4 w-4 text-gray-600" />
              <p className="font-semibold text-sm text-gray-600 truncate">
                {listing.address}
              </p>
            </div>

            <p className="font-semibold text-xl truncate">{listing.name}</p>

            <p className="text-gray-500 mt-1 font-semibold">
              $
              {listing.offer
                ? listing.discountedPrice
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                : listing.regularPrice
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              {listing.type === "rent" && " / Month"}
            </p>
          </div>

          <div className="flex items-center mt-1 space-x-3 px-2">
            <p className="font-bold text-xs">
              {listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : "1 Bed"}
            </p>
            <p className="font-bold text-xs">
              {listing.bathrooms > 1 ? `${listing.bathrooms} Baths` : "1 Bath"}
            </p>
            <p className="font-bold text-xs">{`${listing.landSize} Sq Ft`}</p>
            <p className="font-bold text-xs">{`Year Built: ${listing.yearBuilt}`}</p>
          </div>
        </Link>

        
        {/* Conditionally render the Edit and Delete buttons based on showActions */}
        {!showActions && <div className="mb-4"></div>}
        {showActions && (
          <div className="flex justify-between w-full p-2 mt-2">
            <button
              type="button"
              onClick={handleEdit}
              className="text-sm flex items-center justify-center space-x-1 cursor-pointer font-medium text-gray-500 hover:text-gray-800 active:text-black transition duration-150 ease-in-out"
            >
              <MdEdit className="text-lg" />
              <span>Edit</span>
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="text-sm flex items-center justify-center space-x-1 cursor-pointer font-medium text-gray-500 hover:text-gray-800 active:text-black transition duration-150 ease-in-out"
            >
              <FaTrash className="text-lg" />
              <span>Delete</span>
            </button>
          </div>
        )}
      </li>

        {showConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white text-black rounded-2xl p-5 w-full max-w-sm text-center">
                <p className="text-sm mb-6">
                  Are you sure you want to delete this listing?
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={cancelDelete}
                    className="px-5 py-2  border-gray-300 rounded-full text-gray-700 transition-colors text-sm text-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="px-5 py-2  border-gray-300 rounded-full text-gray-700 transition-colors text-sm text-blue-500"
                  >
                    Ok
                  </button>
                </div>
              </div>
            </div>
          )}




    </>
  );
};

export default ListingItem;
