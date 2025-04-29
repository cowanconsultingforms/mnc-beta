import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import ListingItem from "../components/ListingItem";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Link } from "react-router-dom";

const PropertyManagement = () => {
  const [propertyListings, setPropertyListings] = useState([]);

  const handleDelete = (id) => {
    setPropertyListings((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  const fetchPropertyListings = async () => {
    try {
      const [listingsSnap, propertiesSnap] = await Promise.all([
        getDocs(collection(db, "propertyListings")),
        getDocs(collection(db, "properties")),
      ]);
  
      const listings = listingsSnap.docs.map((doc) => ({
        id: doc.id,
        data: { ...doc.data(), source: "propertyListings" },
      }));
      
  
      const properties = propertiesSnap.docs.map((doc) => {
        const data = doc.data();
      
        return {
          id: doc.id,
          data: {
            ...data,
            source: "properties",
            imgs: Array.isArray(data.imgs)
              ? data.imgs
              : [
                  {
                    url: data.imageUrl || "",
                    path:
                      data.imageUrl?.split("?alt")[0].split("/o/")[1] || "",
                  },
                ],
          },
        };
      });
      
  
      const combined = [...listings, ...properties];
      setPropertyListings(combined);
    } catch (error) {
      console.log("There was an error fetching property listings:", error);
    }
  };

  useEffect(() => {
    fetchPropertyListings();
  }, []);

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
      slidesToSlide: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
      slidesToSlide: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1,
    },
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Property Management</h1>
      <Carousel
        swipeable={true}
        draggable={true}
        showDots={true}
        responsive={responsive}
        ssr={true}
        infinite={true}
        autoPlay={false}
        autoPlaySpeed={1000}
        keyBoardControl={true}
        customTransition="all .5"
        transitionDuration={500}
        containerClass="carousel-container"
        removeArrowOnDeviceType={["tablet", "mobile"]}
        dotListClass="custom-dot-list-style"
        itemClass="carousel-item-padding-40-px"
      >
{propertyListings
  .filter((listing) => listing.data.source === "properties")
  .map((listing) => (
    <ListingItem
      key={listing.id}
      id={listing.id}
      listing={listing.data}
      source={listing.data.source}
      isPropertyManagement={true}
      onDelete={() => handleDelete(listing.id)}
    />
))}
      </Carousel>

      {/* Single Add Tenant Button - Positioned Below Carousel */}
      {propertyListings.length > 0 && (
        <div className="flex flex-col items-center mt-6 space-y-4">
          <Link
            to={`/add-tenant/${propertyListings[0].id}`} // Link to AddTenant with the first property's ID
            className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-grey-700"
          >
            Add Tenant
          </Link>

          <Link
            to={`/add-property`} 
            className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-grey-700"
          >
            Add Property
          </Link>

        </div>
      )}
    </div>
  );
};

export default PropertyManagement;
