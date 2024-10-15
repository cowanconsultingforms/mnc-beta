import { GoogleMap, MarkerF, useLoadScript } from "@react-google-maps/api";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Spinner from "../components/Spinner";
import { db } from "../firebase";

const Map = () => {
  const [properties, setProperties] = useState([]);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: `${import.meta.env.VITE_API_KEY}`,
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
    navigate(`/category/${property.data.type}/${property.id}`);
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
    <div className="w-full h-screen z-10 flex flex-col overflow-hidden">
  {/* Map Section */}
  <div className="flex-grow">
    <GoogleMap
      zoom={11}
      center={{ lat: 40.78, lng: -73.97 }}
      mapContainerClassName="w-full h-full grayscale"
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
</div>
  );
};

export default Map;
