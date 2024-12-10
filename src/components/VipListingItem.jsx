import { FaMapMarkerAlt, FaTrash } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import Moment from "react-moment";
import { Link } from "react-router-dom";

// Listing Item component for VIP listings
const VipListingItem = ({ vipListing, id, onEdit, onDelete, showActions }) => {
  return (
    <li className="relative bg-white flex flex-col justify-between items-center shadow-md hover:shadow-xl rounded-md overflow-hidden transition-shadow duration-150 m-2">
      {/* Clicking on listing component redirects user to full listing page */}
      <Link className="contents" to={`/vip/category/${vipListing.type}/${id}`}>
        {/* Displays first selected image when listing was created */}
        <div className="relative w-full h-60 mb-2">
          <img
            className="grayscale h-full w-full object-cover hover:scale-105 transition-transform duration-200 ease-in"
            loading="lazy"
            src={vipListing.imgs[0].url}
            alt=""
          />
          <Moment
            className="absolute top-2 left-2 bg-gray-500 text-white uppercase text-xs font-semibold rounded-md px-2 py-1 shadow-lg"
            fromNow
          >
            {vipListing.timestamp?.toDate()}
          </Moment>
        </div>

        <div className="w-full p-2">
          <div className="flex items-center space-x-1 mb-1">
            <FaMapMarkerAlt className="h-4 w-4 text-gray-600" />
            <p className="font-semibold text-sm text-gray-600 truncate">
              {vipListing.address}
            </p>
          </div>

          <p className="font-semibold text-xl truncate">{vipListing.name}</p>

          <p className="text-gray-500 mt-1 font-semibold">
            $
            {vipListing.offer
              ? vipListing.discountedPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : vipListing.regularPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            {vipListing.type === "rent" && " / Month"}
          </p>
        </div>

        <div className="flex items-center mt-1 space-x-3 px-2">
          <p className="font-bold text-xs">
            {vipListing.bedrooms > 1 ? `${vipListing.bedrooms} Beds` : "1 Bed"}
          </p>
          <p className="font-bold text-xs">
            {vipListing.bathrooms > 1 ? `${vipListing.bathrooms} Baths` : "1 Bath"}
          </p>
          <p className="font-bold text-xs">{`${vipListing.landSize} Sq Ft`}</p>
          <p className="font-bold text-xs">{`Year Built: ${vipListing.yearBuilt}`}</p>
        </div>
      </Link>

      {/* Conditionally render the Edit and Delete buttons based on showActions */}
      {showActions && (
        <div className="flex justify-between w-full p-2 mt-2">
          <button
            type="button"
            onClick={() => onEdit(vipListing.id)}
            className="text-sm flex items-center justify-center space-x-1 cursor-pointer font-medium text-gray-500 hover:text-gray-800 active:text-black transition duration-150 ease-in-out"
          >
            <MdEdit className="text-lg" />
            <span>Edit</span>
          </button>
          <button
            type="button"
            onClick={() => onDelete(vipListing.id)}
            className="text-sm flex items-center justify-center space-x-1 cursor-pointer font-medium text-gray-500 hover:text-gray-800 active:text-black transition duration-150 ease-in-out"
          >
            <FaTrash className="text-lg" />
            <span>Delete</span>
          </button>
        </div>
      )}
    </li>
  );
};

export default VipListingItem;
