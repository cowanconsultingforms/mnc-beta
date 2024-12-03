import {
  GoogleMap,
  InfoWindowF,
  MarkerF,
  useLoadScript,
} from "@react-google-maps/api";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
  FaLeaf,
  FaMobileAlt,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import Contact from "../components/Contact";
import Spinner from "../components/Spinner";
import { db } from "../firebase";

const VipListing = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [contactCreator, setContactCreator] = useState(false);

  // Loads google maps api script
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: `${import.meta.env.VITE_API_KEY}`,
  });

  const [selectedMarker, setSelectedMarker] = useState(null);

  // Gets data from ListingItem that user clicked on
  useEffect(() => {
    const fetchListing = async () => {
      try {
        const docRef = doc(db, "vipPropertyListings", params.listingId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setListing(docSnap.data());
          setLoading(false);
        }
      } catch (error) {
        toast.error("Insufficient permissions");
        navigate("/");
      }
    };
    fetchListing();
  }, [params.listingId]);

  if (!isLoaded || loading) {
    return <Spinner />;
  }

  return (
    <main>
      {/* Image carousel using Swiper component */}
      <Swiper
        slidesPerView={1}
        style={{
          "--swiper-navigation-color": "rgb(243 244 246)",
          "--swiper-pagination-color": "rgb(243 244 246)",
        }}
        loop={true}
        navigation={true}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        effect={"fade"}
        pagination={{ type: "progressbar" }}
        modules={[Navigation, EffectFade, Autoplay, Pagination]}
      >
        {/* Maps each image url from listing object to each slide in the image carousel */}
        {listing.imgs.map(({ path }, index) => (
          <SwiperSlide key={path}>
            <div
              className="grayscale relative w-full overflow-hidden h-[300px]"
              style={{
                background: `url(${listing.imgs[index].url}) center no-repeat`,
                backgroundSize: "cover",
              }}
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Share/copy link button */}
      <div
        className="fixed top-[13%] right-[3%] z-10 bg-white cursor-pointer border-2 border-gray-400 rounded-full w-12 h-12 flex justify-center items-center"
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          toast.success("Link copied!");
        }}
      >
        <FaShare className="text-lg text-gray-600" />
      </div>

      {/* Information section */}
      <div className="lg:m-4 flex flex-col md:flex-row max-w-6xl lg:mx-auto p-4 rounded-lg shadow-lg bg-white lg:space-x-5">
        <div className="w-full">
          <p className="text-2xl font-bold mb-3 text-gray-800">
            {/* Name and price */}
            {listing.name} - $
            {listing.offer
              ? listing.discountedPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : listing.regularPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            {listing.type === "rent" ? " / Month" : ""}
          </p>

          {/* Address */}
          <p className="flex items-center mt-6 mb-3 font-semibold">
            <FaMapMarkerAlt className="text-gray-600 mr-1" />
            {listing.address}
          </p>

          {/* Buy/rent */}
          <div className="flex justify-start items-center space-x-4 w-[75%]">
            <p className="bg-gray-800 w-full max-w-[200px] rounded-md p-1 text-white text-center font-semibold shadow-md">
              {listing.type === "rent"
                ? "Rent"
                : listing.type === "buy"
                ? "Buy"
                : "Sold"}
            </p>

            {/* Shows amount saved if discount is available */}
            {listing.offer && (
              <p className="w-full max-w-[200px] rounded-md bg-gray-600 p-1 text-white text-center font-semibold shadow-md">
                $
                {(+listing.regularPrice - +listing.discountedPrice)
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                discount
              </p>
            )}
          </div>

          {/* Description */}
          <p className="mt-3 mb-3 ">
            <span className="font-semibold">Description - </span>
            {listing.description}
          </p>

          {/* Beds, baths, parking, and furnished */}
          <ul className="flex flex-wrap items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 lg:space-x-10 text-sm font-semibold mb-4">
            {/* Bedrooms */}
            <li className="flex items-center whitespace-nowrap">
              <FaBed className="text-lg mr-1" />
              {+listing.bedrooms > 1
                ? `${listing.bedrooms} Beds`
                : `${listing.bedrooms} Bed`}
            </li>

            {/* Bathrooms */}
            <li className="flex items-center whitespace-nowrap">
              <FaBath className="text-lg mr-1" />
              {+listing.bedrooms > 1
                ? `${listing.bathrooms} Baths`
                : `${listing.bathrooms} Bath`}
            </li>

            {/* Parking */}
            <li className="flex items-center whitespace-nowrap">
              <FaParking className="text-lg mr-1" />
              {listing.parking ? "Parking spot" : "No parking"}
            </li>

            {/* Furnished */}
            <li className="flex items-center whitespace-nowrap">
              <FaChair className="text-lg mr-1" />
              {listing.furnished ? "Furnished" : "Not furnished"}
            </li>
          </ul>

          {/* Smart Technology and Eco-Friendly */}
          <ul className="flex flex-wrap items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 lg:space-x-10 text-sm font-semibold mb-6">
            {/* Smart Technology */}
            <li className="flex items-center whitespace-nowrap">
              <FaMobileAlt className="text-lg mr-1" />
              {listing.smartHome ? "Smart Technology" : "No Smart Technology"}
            </li>

            {/* Eco-Friendly/Green Technology */}
            <li className="flex items-center whitespace-nowrap">
              <FaLeaf className="text-lg mr-1" />
              {listing.ecoFriendly
                ? "Eco-Friendly/Green Technology"
                : "No Eco-Friendly/Green Technology"}
            </li>
          </ul>

          {/* Contact button */}
          {!contactCreator && (
            <div className="mt-6">
              <button
                onClick={() => setContactCreator(true)}
                className="px-7 py-3 bg-gray-600 text-white font-medium text-sm uppercase rounded shadow-md hover:bg-gray-700 hover:shadow-lg focus:bg-gray-700 focus:shadow-lg w-full text-center transition duration-150 ease-in-out"
              >
                Contact
              </button>
            </div>
          )}
          {contactCreator && <Contact listing={listing} />}
        </div>

        {/* Map section */}
        <div className="w-full h-[200px] md:h-[400px] z-10 overflow-x-hidden mt-6 md:mt-0 md:ml-2">
          {/* Displays map centered at geolocation of listing */}
          <GoogleMap
            clickableIcons={false}
            options={{
              disableDefaultUI: true,
              gestureHandling: "greedy",
              keyboardShortcuts: true,
            }}
            mapContainerClassName="w-full h-full rounded grayscale"
            zoom={14}
            center={{
              lat: listing.geolocation.lat,
              lng: listing.geolocation.lng,
            }}
            onClick={() => setSelectedMarker(null)}
          >
            {/* Places a marker at geolocation of listing */}
            <MarkerF
              key={1}
              position={{
                lat: listing.geolocation.lat,
                lng: listing.geolocation.lng,
              }}
              onClick={() => setSelectedMarker(1)}
            >
              {/* Displays listing name and address on top of marker when marker is clicked */}
              {selectedMarker && (
                <InfoWindowF
                  onCloseClick={() => setSelectedMarker(null)}
                  position={{
                    lat: listing.geolocation.lat,
                    lng: listing.geolocation.lng,
                  }}
                >
                  <div>
                    <p className=" text-gray-800 text-sm font-medium mb-1">
                      {listing.name}
                    </p>
                    <p className=" text-gray-800 font-normal">
                      {listing.address}
                    </p>
                  </div>
                </InfoWindowF>
              )}
            </MarkerF>
          </GoogleMap>
        </div>
      </div>
    </main>
  );
};

export default VipListing;
