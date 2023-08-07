import { GoogleMap, useLoadScript, MarkerF } from "@react-google-maps/api";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";

const Map = () => {
  const [properties, setProperties] = useState([]);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: `${import.meta.env.VITE_DEV_KEY}`,
  });
  const navigate = useNavigate();

  useEffect(() => {
    getProperties();
  }, []);

  if (!isLoaded) {
    return <Spinner />;
  }

  // Use the 'property' data or id to navigate to the desired page
  const handleClick = (property) => {
    navigate(`/category/${property.type}/${property.id}`);
  };

  async function getProperties() {
    const listingRef = collection(db, "propertyListings");
    const snapshot = await getDocs(listingRef);
    let listings = [];

    snapshot.forEach((doc) => {
      listings.push({
        id: doc.id,
        data: doc.data(),
      });
    });

    setProperties(listings);
  }

  // return <Map properties={properties} navigate={navigate} />;
  return (
    <div className="w-full h-full z-10 overflow-x-hidden grayscale">
      <GoogleMap
        zoom={11}
        center={{ lat: 40.78, lng: -73.97 }}
        mapContainerClassName="map-container"
        clickableIcons={false}
        options={{
          disableDefaultUI: true,
          gestureHandling: "greedy",
          keyboardShortcuts: true,
        }}
      >
        {/* Render Markers using properties */}
        {properties.map((property) => (
          <MarkerF
            onClick={() => handleClick(property)}
            key={property.id}
            position={{
              lat: property.data.geolocation.lat,
              lng: property.data.geolocation.lng,
            }}
          />
        ))}
      </GoogleMap>
    </div>
  );
};

export default Map;
