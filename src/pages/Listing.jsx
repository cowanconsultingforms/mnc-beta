import {
  GoogleMap,
  InfoWindowF,
  MarkerF,
  useLoadScript,
} from "@react-google-maps/api";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState, Link } from "react";
import { useNavigate } from "react-router-dom";
import { BrowserRouter as Router } from "react-router-dom";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
  FaTree,
  FaRuler,
  FaCalendar,
  FaGraduationCap,
  FaBook,
  FaHome,
  FaBuilding,
  FaSwimmingPool,
  FaElevator,
  FaCar,
  FaSnowflake,
  FaMobileAlt,
  FaLeaf,
  FaArrowLeft,
} from "react-icons/fa";
import { useParams } from "react-router-dom";
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

const Listing = () => {
  let lat1 = "";
  let lang1 = "";
  const params = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [contactCreator, setContactCreator] = useState(false);
  const [listingData, setListingData] = useState("");
  const navigate = useNavigate();
  // Loads google maps api script
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: `${import.meta.env.VITE_API_KEY}`,
  });

  const [selectedMarker, setSelectedMarker] = useState(null);

  // Gets data from ListingItem that user clicked on
  useEffect(() => {
    const fetchListing = async () => {
      const docRef = doc(db, "propertyListings", params.listingId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setListing(docSnap.data());
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  if (!isLoaded || loading) {
    return <Spinner />;
  }

  const handleDirection = (lat, lang) => {
    const directionsLink = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lang}`;

    window.open(directionsLink, "_blank");
  };
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

      {/* Back button */}
      <div
        className="fixed top-[13%] left-[3%] z-10 bg-white cursor-pointer border-2 border-gray-400 rounded-full w-12 h-12 flex justify-center items-center transform scaleY-[-1]"
        onClick={() => {
          navigate(-1); // Navigate to the previous page
        }}
      >
        <FaArrowLeft className="text-lg text-gray-600" />
      </div>

      {/* Information section */}
      <div className="lg:m-4 flex flex-col md:flex-row max-w-6xl lg:mx-auto p-4 rounded-lg shadow-lg bg-white lg:space-x-5">
        <div className="w-full flex-container">
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
          <div className="flex flex-wrap">
            {/* Beds, baths, parking, furnished */}
            <ul className="items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 lg:space-x-10 text-sm font-semibold mb-6">
              {/* Bedrooms */}
              <div></div>
              <li className="flex items-center ">
                <FaBed className="text-lg mr-1 " />
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
              <li className="flex items-center whitespace-nowrap">
                <FaRuler className="text-lg mr-1" />
                {`${listing.landSize} Square Ft`}
              </li>
              <li className="flex items-center whitespace-nowrap">
                <FaCalendar className="text-lg mr-1" />
                {`Year Built: ${listing.yearBuilt}`}
              </li>
              <li className="flex items-center whitespace-nowrap">
                <FaGraduationCap className="text-lg mr-1" />
                {`${listing.schoolRating} School Rating`}
              </li>
              <li className="flex items-center whitespace-nowrap">
                <FaBath className="text-lg mr-1" />
                {+listing.stories > 1
                  ? `${listing.bathrooms} Stories`
                  : `${listing.bathrooms} Story`}
              </li>
              <li className="flex items-center whitespace-nowrap">
                <FaTree className="text-lg mr-1" />
                {listing.privateOutdoorSpace
                  ? "Outdoor space"
                  : "No outdoor space"}
              </li>
              <li className="flex items-center whitespace-nowrap">
                <FaHome className="text-lg mr-1" />
                {listing.basement ? "Basement" : "No basement"}
              </li>
              <li className="flex items-center whitespace-nowrap">
                <FaBuilding className="text-lg mr-1" />
                {listing.doorMan ? "Doorman" : "No doorman"}
              </li>
              <li className="flex items-center whitespace-nowrap">
                <FaSwimmingPool className="text-lg mr-1" />
                {listing.pool ? "Pool" : "No pool"}
              </li>

              <li className="flex items-center whitespace-nowrap">
                <FaCar className="text-lg mr-1" />
                {listing.garage ? "Garage" : "No garage"}
              </li>
              <li className="flex items-center whitespace-nowrap">
                <FaSnowflake className="text-lg mr-1" />
                {listing.airConditioning
                  ? "Air conditioning"
                  : "No air conditioning"}
              </li>
              <li className="flex items-center whitespace-nowrap">
                <FaMobileAlt className="text-lg mr-1" />
                {listing.smartHome
                  ? "Smart Technology"
                  : "No Smart Technology"}
              </li>
              <li className="flex items-center whitespace-nowrap">
                <FaLeaf className="text-lg mr-1" />
                {listing.ecoFriendly
                  ? "Eco-Friendly/Green Technology"
                  : "No Eco-Friendly/Green Technology"}
              </li>
            </ul>
          </div>
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
                <>
                  <InfoWindowF
                    onCloseClick={() => setSelectedMarker(null)}
                    position={{
                      lat: listing.geolocation.lat,
                      lng: listing.geolocation.lng,
                    }}
                  >
                    <div>
                      <button
                        className="bg-gray-600 p-1 font-semibold text-white"
                        onClick={() => {
                          handleDirection(
                            listing.geolocation.lat,
                            listing.geolocation.lng
                          );
                        }}
                      >
                        Directions
                      </button>
                      <p className=" text-gray-800 text-sm font-medium mb-1">
                        {listing.name}
                      </p>
                      <p className=" text-gray-800 font-normal">
                        {listing.address}
                      </p>
                    </div>
                  </InfoWindowF>
                </>
              )}
            </MarkerF>
          </GoogleMap>
        </div>
        
      </div>
      {/* Footer Information */}
      <div className="justify-center items-center text-center mb-6 mx-3 flex flex-col max-w-6xl lg:mx-auto p-3 rounded shadow-lg bg-white">
        <p>info@mncdevelopment.com</p>
        <div className="lg:flex lg:flex-row lg:justify-center lg:items-center lg:space-x-2">
          <div className="md:flex md:flex-row md:justify-center md:items-center md:space-x-2">
            <p>All rights reserved.</p>
            <span className="hidden md:block">|</span>
            <p>© MNC Development, Inc. 2008-present.</p>
          </div>
          <span className="hidden lg:block">|</span>
          <p>31 Buffalo Avenue, Brooklyn, New York 11233</p>
        </div>
        <div className="md:flex md:flex-row md:justify-center md:items-center md:space-x-2">
          <p>Phone: 1-718-771-5811 or 1-877-732-3492</p>
          <span className="hidden md:block">|</span>
          <p>Fax: 1-877-760-2763 or 1-718-771-5900</p>
        </div>
        <p className=" text-justify [text-align-last:center] ">
          MNC Development and the MNC Development logos are trademarks of MNC
          Development, Inc. MNC Development, Inc. as a NYS licensed Real Estate
          Broker fully supports the principles of the Fair Housing Act and the
          Equal Opportunity Act. Listing information is deemed reliable, but is
          not guaranteed.
        </p>
      </div>
    </main>
  );
};

export default Listing;
