import React from "react";
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import ListingItem from "../components/ListingItem";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const PropertyManagement = () => {
  const [propertyListings, setPropertyListings] = useState([]);

  const fetchPropertyListings = async () => {
    try {
      const listingRef = collection(db, "propertyListings");
      const snapshot = await getDocs(listingRef);
      const listings = snapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data(),
      }));

      setPropertyListings(listings);
    } catch (error) {
      console.log("there was an error", error);
    }
  };

  useEffect(() => {
    fetchPropertyListings();
  }, []);

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
      slidesToSlide: 3, // optional, default to 1.
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
      slidesToSlide: 2, // optional, default to 1.
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1, // optional, default to 1.
    },
  };

  return (
    <div>
      {/* {!propertyListings.length ? (
        <p>No properties available</p>
      ) : (
        <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 mt-6 mb-6">
          {propertyListings.map((listing) => (
            <ListingItem
              key={listing.id}
              id={listing.id}
              listing={listing.data}
              onDelete={() => onDelete(listing.id)}
              onEdit={() => onEdit(listing.id)}
              // onClick ={() => handleAddNotificationClick(`${listingName} is removed!`)}
            />
          ))}
        </ul>
      )} */}
      <Carousel
        swipeable={false}
        draggable={false}
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
        {propertyListings.map((listing) => (
          <ListingItem
            key={listing.id}
            id={listing.id}
            listing={listing.data}
            onDelete={() => onDelete(listing.id)}
            onEdit={() => onEdit(listing.id)}
            isPropertyManagement={true}
          />
        ))}
      </Carousel>
      ;
    </div>
  );
};

export default PropertyManagement;
