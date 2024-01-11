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
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import arrow from "../assets/img/arrow.png";
import { toast } from "react-toastify";
import "react-datepicker/dist/react-datepicker.css";
import SignInBackgroundImage from "../assets/img/sign-in-background.jpg";
import { db } from "../firebase";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  updateProfile,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import fetch from "node-fetch";
import emailjs from "@emailjs/browser";

const ManageRequests = () => {
  const { uid } = useParams();
  const auth = getAuth();
  const [allCustomers, setAllCustomers] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [user, setUser] = useState("");
  const [customer, setCustomer] = useState("");

  const handleDeleteRequest = async (customer, index) => {
    try {
      const userDocRef = doc(db, "users", customer.id);
      await updateDoc(userDocRef, {
        requestStatus: "completed",
        dealStatus: "completed",
        interested: "",
        dealTimeline: "",
        maxBudget: "",
        houseldIncome: "",
        lenderInfo: "",
        preApprovalAmount: "",
        hasPreApprovalLetter: false,
        preApprovalExpiration: "",
        agent: "",
        agentEmail: "",
        agentRequested: "",
        agentEmailRequested: "",
        role: customer.role === "client" ? "user" : customer.role,
      });
      toast.success("You have successfully closed the request!");
    } catch (error) {
      console.error("Error deleting request:", error);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const q = query(
        collection(db, "users"),
        where("requestStatus", "==", "notCompleted")
      );
      const querySnapshot = await getDocs(q);
      const usersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAllCustomers(usersData);
      const userDocRef = doc(db, "users", uid);
      const userDocSnapshot = await getDoc(userDocRef);
      setUser(userDocSnapshot.data());
    };

    fetchUser();
  }, [uid, allCustomers]);

  const handleToggle = async (customer, index) => {
    setExpandedIndex((prevIndex) => (prevIndex === index ? null : index));

    const userDocRef = doc(db, "users", customer.id);
    try {
      const docSnapshot = await getDoc(userDocRef);
      if (docSnapshot.exists()) {
        setCustomer(docSnapshot.data());
      } else {
        console.log("Document does not exist");
      }
    } catch (error) {
      console.error("Error fetching document:", error.message);
    }
  };

  const sendEmail = async (name, email, password) => {
    const subject = "New Application";
    const to = email;
    const message = `Hi ${name}, I am your agent ${user.name}. I just want to let you know that I have initiated a deal for you.\n\nThank You\nTeam MNC Development`;

    try {
      const response = await fetch(
        "https://us-central1-mnc-development.cloudfunctions.net/contactUs",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ to, message, subject }),
        }
      );

      if (response.ok) {
        console.log("Email sent successfully");
      } else {
        console.error("Failed to send email", response);
      }
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  const handleCreateDeal = async (customer, index) => {
    const userDocRef = doc(db, "users", customer.id);
    const role2 = customer.role;
    let updatedRole;
    if (["admin", "superadmin", "agent", "vendor", "partner", "vip", "tenant"].includes(role2)) {
      updatedRole = role2;
    } else {
      updatedRole = "client";
    }
    try {
      await updateDoc(userDocRef, {
        deal: [
          {
            prospecting: [
              {
                status: "",
                dueDate: "",
                Notes: "",
                timeLiine: "",
                lastUpdated: "",
              },
            ],
          },
          {
            qualification: [
              {
                status: "",
                dueDate: "",
                Notes: "",
                timeLiine: "",
                lastUpdated: "",
              },
            ],
          },
          {
            quotation: [
              {
                status: "",
                dueDate: "",
                Notes: "",
                timeLiine: "",
                lastUpdated: "",
              },
            ],
          },
          {
            negotiation: [
              {
                status: "",
                dueDate: "",
                Notes: "",
                timeLiine: "",
                lastUpdated: "",
              },
            ],
          },
          {
            contractSent: [
              {
                status: "",
                dueDate: "",
                Notes: "",
                timeLiine: "",
                lastUpdated: "",
              },
            ],
          },
          {
            closing: [
              {
                status: "",
                dueDate: "",
                Notes: "",
                timeLiine: "",
                lastUpdated: "",
              },
            ],
          },
          {
            postClosureFollowup: [
              {
                status: "",
                dueDate: "",
                Notes: "",
                timeLiine: "",
                lastUpdated: "",
              },
            ],
          },
        ],
        agent: customer.agentRequested,
        agentEmail: customer.agentEmailRequested,
        dealStatus: "notCompleted",
        role: updatedRole,
      });
      await sendEmail(customer.name, customer.email);
      toast.success("Deal is created successfully!");

      const userDocRef2 = doc(db, "users", customer.id);
      try {
        const docSnapshot = await getDoc(userDocRef2);
        if (docSnapshot.exists()) {
          setCustomer(docSnapshot.data());
        } else {
          console.log("Document does not exist");
        }
      } catch (error) {
        console.error("Error fetching document:", error.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong with the registration.");
    }
  };

  return (
    <div
      className="object-cover h-auto"
      style={{
        backgroundImage: `url(${SignInBackgroundImage})`,
        backgroundSize: "cover",
        position: "relative",
        height: "calc(100vh - 10px)",
      }}
    >
      <div
        className="absolute inset-0 bg-white backdrop-filter backdrop-blur-md"
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          backgroundColor: "gray",
          opacity: 0.5,
        }}
      ></div>
      <div className="pt-20 ">
        <div
          className=" relative  bg-gray-100 rounded px-6 py-6 mx-auto"
          style={{ width: "550px" }}
        >
          <h1 className=" text-3xl text-center py-4 font-semibold underline mb-5">
            Request Tracker
          </h1>
          <div className="">
            <ul>
              {/* {console.log("fff", allCustomers)} */}
              {allCustomers.map((customer, index) => (
                <li key={index} className="mb-5">
                  <div className="flex flex-row justify-between">
                    <span
                      style={{ cursor: "pointer", textDecoration: "underline" }}
                      onClick={() => handleToggle(customer, index)}
                      className="hover:ring-2 bg-gray-600 text-white mb-4 pl-2 pr-1"
                    >
                      <div className="flex flex-row">
                        Request {index + 1}{" "}
                        <img
                          src={arrow}
                          alt="arrow"
                          className=" w-5 h-5  ml-1"
                          style={{ marginTop: "2px" }}
                        />
                      </div>{" "}
                    </span>

                    <button
                      onClick={() => handleCreateDeal(customer, index)}
                      className="bg-gray-600 text-white pr-2 pl-2 mb-4 hover:ring-2 "
                      disabled={
                        customer && customer.dealStatus === "notCompleted"
                      }
                      style={{
                        opacity:
                          customer && customer.dealStatus === "notCompleted"
                            ? 0.5
                            : 1,
                      }}
                    >
                      {customer && customer.dealStatus === "notCompleted" ? (
                        <>Deal In Progress</>
                      ) : (
                        <>Create Deal</>
                      )}
                    </button>

                    <button
                      onClick={() => handleDeleteRequest(customer, index)}
                      className="bg-gray-600 text-white pr-2 pl-2 mb-4 hover:ring-2"
                    >
                      Close Request
                    </button>
                  </div>
                  {expandedIndex === index && (
                    <div>
                      <p>Name: {customer.name}</p>
                      <p>Email: {customer.email}</p>
                      <p>Phone: {customer.phone}</p>
                      <p>Interested: {customer.interested}</p>
                      <p>Deal Timeline: {customer.dealTimeline}</p>
                      <p>Max Budget: {customer.maxBudget}</p>
                      <p>Household Income: {customer.houseldIncome}</p>
                      <p>Lender Information: {customer.lenderInfo}</p>
                      <p>Preapproval Amount: {customer.preApprovalAmount}</p>
                      <p>
                        Preapproval Expiration: {customer.preApprovalExpiration}
                      </p>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default ManageRequests;
