// Import react components
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Import firebase components
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination, EffectFade } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

// Import created components
import Spinner from "../components/Spinner";

const Slider = () => {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch 5 most recent listings
  useEffect(() => {
    const fetchPropertyListings = async () => {
      const propertyListingsRef = collection(db, "propertyListings");
      const q = query(
        propertyListingsRef,
        orderBy("timestamp", "desc"),
        limit(5)
      );
      const querySnap = await getDocs(q);
      let listings = [];
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings(listings);
      setLoading(false);
    };

    fetchPropertyListings();
  }, []);

  // Shows loading screen when fetching data
  if (loading) {
    return <Spinner />;
  }

  // Does not display homepage when there are no listings
  if (listings.length === 0) {
    return <></>;
  }

  return (
    listings && (
      <>
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
          {listings.map(({ data, id }) => (
            <SwiperSlide
              key={id}
              onClick={() => navigate(`/category/${data.type}/${id}`)}
            >
              <div
                className="grayscale relative w-full overflow-hidden h-[300px]"
                style={{
                  background: `url(${data.imgUrls[0]}) center no-repeat`,
                  backgroundSize: "cover",
                }}
              ></div>
              <p className="text-white absolute left-1 top-3 font-medium max-w-[90%] bg-gray-500 shadow-lg opacity-90 p-2 rounded rounded-br-xl">
                {data.name}
              </p>
              <p className="text-white absolute left-1 bottom-1 font-medium max-w-[90%] bg-gray-500 shadow-lg opacity-90 p-2 rounded rounded-tr-xl">
                $
                {data.offer
                  ? data.discountedPrice
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  : data.regularPrice
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                {data.type === "rent" && " / Month"}
              </p>
            </SwiperSlide>
          ))}
        </Swiper>
      </>
    )
  );
};

export default Slider;
