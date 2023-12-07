import {
  doc,
  serverTimestamp,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  collection,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState, useRef } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css";
import React from "react";
import imagee from "../assets/img/Progress8.jpg";

const TrackDealsProgress = () => {
  const [allCustomers, setAllCustomers] = useState([]);
  const [allDeals, setAllDeals] = useState([]);
  const navigate = useNavigate();
 

 
  const handleSelect2 = async (index) => {
    navigate(`/trackIndividualDealsProgress/${allCustomers[index].id}`);
  };

  useEffect(() => {
    const extractedDeals = allCustomers.map((customer) => {
      const customerDeals = customer.deal || [];
      const customerDealData = customerDeals.map((deal) => ({
        prospecting: deal.prospecting || [],
        qualification: deal.qualification || [],
        quotation: deal.quotation || [],
        negotiation: deal.negotiation || [],
        contractSent: deal.contractSent || [],
        closing: deal.closing || [],
        postClosureFollowup: deal.postClosureFollowup || [],
      }));

      return customerDealData;
    });

    if (JSON.stringify(extractedDeals) !== JSON.stringify(allDeals)) {
      setAllDeals(extractedDeals);
    }
  }, [allCustomers, allDeals]);

  useEffect(() => {
    const fetchUser = async () => {
      const q = query(
        collection(db, "users"),
        where("dealStatus", "==", "notCompleted")
      );
      const querySnapshot = await getDocs(q);
      const usersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAllCustomers(usersData);
    };
    fetchUser();
  }, [allCustomers]);

  return (
    <div style={{alignItems: "center"}}>
      <div
        className="absolute inset-0 bg-white backdrop-filter backdrop-blur-md"
        style={{
          position: "absolute",
          backgroundImage: `url(${imagee})`,
          width: "100%",
          height: "100vh", 
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          filter: "grayscale(100%) ",
          opacity: 0.6,
        }}
      ></div>

      <div className="pt-20" style={{ display: "flex", justifyContent: "center", alignItems: "center"}}>
        <div
          className="relative bg-gray-100 rounded px-6 py-6 mx-20"
          style={{width: "50%"  }}
        >
          <h1 className="text-3xl text-center py-4 font-bold underline mb-5">
            Deal Tracker
          </h1>

          <div className="">
            {allDeals.map((customerDealData, index) => (
              <div key={`customer-${index}`}>
                <h3
                  className="bg-gray-500 mb-5 bg-gray-700 cursor-pointer text-white pl-2"
                  onClick={() => handleSelect2(index)}
                >
                  #{index + 1} {allCustomers[index].name}
                </h3>
              </div>
            ))}
          </div>
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default TrackDealsProgress;
