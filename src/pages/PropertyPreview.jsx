import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import Spinner from "../components/Spinner";
import { GoogleMap, MarkerF, useLoadScript } from "@react-google-maps/api";

const PropertyPreview = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [source, setSource] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: `${import.meta.env.VITE_API_KEY}`,
    libraries: ["marker"],
  });

  useEffect(() => {
    const fetchProperty = async () => {
      let docRef = doc(db, "propertyListings", id);
      let docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        docRef = doc(db, "properties", id);
        docSnap = await getDoc(docRef);
        setSource("properties");
      } else {
        setSource("propertyListings");
      }

      if (docSnap.exists()) {
        const data = docSnap.data();
        setProperty({
          ...data,
          name: data.name || data.propertyName || "",
          address: data.address || data.location || "",
          dateOfPurchase: data.dateOfPurchase?.seconds
            ? new Date(data.dateOfPurchase.seconds * 1000)
                .toISOString()
                .split("T")[0]
            : "",
          imageUrl: data.imageUrl || data.imgs?.[0]?.url || "",
        });
      } else {
        navigate("/property-management");
      }

      setLoading(false);
    };

    fetchProperty();
  }, [id, navigate]);

  if (loading || !isLoaded) return <Spinner />;
  if (!property) return <p className="text-center">Property not found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow-md">
      {/* Header */}
      <h2 className="text-2xl font-bold mb-6 text-center">Property Preview</h2>

      {/* Image */}
      {property.imageUrl && (
        <div className="w-full mb-6">
          <img
            src={property.imageUrl}
            alt="Property"
            className="w-full h-64 object-cover rounded grayscale"
          />
        </div>
      )}

      {/* Grid Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-800">
        <Info label="Property Name" value={property.name} />
        <Info label="Location" value={property.address} />
        <Info label="Total Floors" value={property.totalFloors} />
        <Info label="Total Units" value={property.totalUnits} />
        <Info label="Total SqFt" value={property.totalSqFt} />
        <Info label="Date of Purchase" value={property.dateOfPurchase} />
        <Info label="Property Type" value={property.propertyType} />
        <div className="sm:col-span-2">
          <p className="font-semibold mb-1">Internal Notes:</p>
          <div className="bg-gray-100 p-3 rounded min-h-[80px]">
            {property.internalNotes || "—"}
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="w-full h-64 my-8">
        <GoogleMap
          zoom={14}
          center={{
            lat: property.geolocation?.lat || 0,
            lng: property.geolocation?.lng || 0,
          }}
          mapContainerClassName="w-full h-full rounded grayscale"
        >
          <MarkerF
            position={{
              lat: property.geolocation?.lat || 0,
              lng: property.geolocation?.lng || 0,
            }}
          />
        </GoogleMap>
      </div>

      {/* Edit Button */}
      <div className="text-center mt-6 flex justify-center gap-4">
        <Link
          to={source === "properties" ? `/edit-property/${id}` : `/edit-listing/${id}`}
        >
          <button className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700">
            Edit Property
          </button>
        </Link>
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

const Info = ({ label, value }) => (
  <div>
    <p className="font-semibold">{label}:</p>
    <p className="bg-gray-100 p-3 rounded">{value || "—"}</p>
  </div>
);

export default PropertyPreview;
