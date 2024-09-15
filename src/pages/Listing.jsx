import {
  GoogleMap,
  InfoWindowF,
  MarkerF,
  useLoadScript,
} from "@react-google-maps/api";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState, Link } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
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
  const [listingData, setListingData] = useState('');
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

  if (!listing || !isLoaded || loading) {
    return <Spinner />;
  }

  const handleDirection = (lat, lang)=>{
    const directionsLink = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lang}`;

    window.open(directionsLink, '_blank');
  }
  return (
    <main className="relative">
      {/* Back button */}
      <div className="absolute top-4 left-4 md:top-6 md:left-6 z-20">
        <button
          className="bg-white cursor-pointer border-2 border-gray-400 rounded-full w-10 h-10 md:w-12 md:h-12 flex justify-center items-center shadow-md"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft className="text-gray-600 text-sm md:text-lg" />
        </button>
      </div>
  
      {/* Copy link button */}
      <div className="absolute top-4 right-4 md:top-6 md:right-6 z-10">
        <div
          className="bg-white cursor-pointer border-2 border-gray-400 rounded-full w-10 h-10 md:w-12 md:h-12 flex justify-center items-center"
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            toast.success("Link copied!");
          }}
        >
          <FaShare className="text-lg text-gray-600" />
        </div>
      </div>
  
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
        {listing.imgs.map(({ path }, index) => (
          <SwiperSlide key={path}>
            <div
              className="grayscale relative w-full overflow-hidden h-[300px] md:h-[400px]"
              style={{
                background: `url(${listing.imgs[index].url}) center no-repeat`,
                backgroundSize: "cover",
              }}
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>
  
      {/* Information section */}
      <div className="lg:m-4 flex flex-col md:flex-row max-w-6xl lg:mx-auto p-4 rounded-lg shadow-lg bg-white lg:space-x-5 relative z-10 mt-6">
        <div className="w-full flex flex-col">
          <p className="text-2xl font-bold mb-3 text-gray-800">
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
  
          <p className="flex items-center mt-6 mb-3 font-semibold">
            <FaMapMarkerAlt className="text-gray-600 mr-1" />
            {listing.address}
          </p>
  
          <div className="flex justify-start items-center space-x-4 w-full md:w-[75%]">
            <p className="bg-gray-800 w-full max-w-[200px] rounded-md p-1 text-white text-center font-semibold shadow-md">
              {listing.type === "rent" ? "Rent" : listing.type === "buy" ? "Buy" : "Sold"}
            </p>
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
  
          <p className="mt-3 mb-3">
            <span className="font-semibold">Description - </span>
            {listing.description}
          </p>
  
          <ul className="items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 lg:space-x-10 text-sm font-semibold mb-6">
            <li className="flex items-center">
              <FaBed className="text-lg mr-1" />
              {+listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : `${listing.bedrooms} Bed`}
            </li>
            <li className="flex items-center whitespace-nowrap">
              <FaBath className="text-lg mr-1" />
              {+listing.bathrooms > 1 ? `${listing.bathrooms} Baths` : `${listing.bathrooms} Bath`}
            </li>
            <li className="flex items-center whitespace-nowrap">
              <FaParking className="text-lg mr-1" />
              {listing.parking ? "Parking spot" : "No parking"}
            </li>
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
              {+listing.stories > 1 ? `${listing.stories} Stories` : `${listing.stories} Story`}
            </li>
            <li className="flex items-center whitespace-nowrap">
              <FaTree className="text-lg mr-1" />
              {listing.privateOutdoorSpace ? "Outdoor space" : "No outdoor space"}
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
              {listing.airConditioning ? "Air conditioning" : "No air conditioning"}
            </li>
          </ul>
  
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
            <MarkerF
              key={1}
              position={{
                lat: listing.geolocation.lat,
                lng: listing.geolocation.lng,
              }}
              onClick={() => setSelectedMarker(1)}
            >
              {selectedMarker && (
                <InfoWindowF
                  onCloseClick={() => setSelectedMarker(null)}
                  position={{
                    lat: listing.geolocation.lat,
                    lng: listing.geolocation.lng,
                  }}
                >
                  <div>
                    <button className="bg-gray-600 p-1 font-semibold text-white" onClick={()=>{handleDirection(listing.geolocation.lat, listing.geolocation.lng)}}>Directions</button>
                    <p className="text-gray-800 text-sm font-medium mb-1">
                      {listing.name}
                    </p>
                    <p className="text-gray-800 font-normal">
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

export default Listing;
