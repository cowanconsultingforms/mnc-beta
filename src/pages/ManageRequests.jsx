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
      await updateDoc(userDocRef, { requestStatus: "completed", dealStatus: "completed"});
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
    emailjs
      .send(
        "service_untmu1h",
        "template_t618r9h",
        {
          to_email: [email],
          subject: "New Application",
          message: `Hi ${name}, I am your agent ${user.name}. I just want to let you know that I have initiated a deal for you.`,
        },
        import.meta.env.VITE_APP_EMAILJS_API_KEY
      )
      .then((response) => {
        console.log("Email sent:", response);
      })
      .catch((error) => {
        console.error("Error sending email:", error);
      });
  };

  const handleCreateDeal = async (customer, index) => {
    const userDocRef = doc(db, "users", customer.id);
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
        dealStatus: "notCompleted",
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

  // const getUserRole = async (uid) => {
  //   const userRef = doc(db, "users", uid);
  //   try {
  //     const userDoc = await getDoc(userRef);
  //     if (userDoc.exists()) {
  //       const userData = userDoc.data();
  //       setRole(userData.role);
  //     } else {
  //       setRole(null); // Handle the case when the user document doesn't exist
  //     }
  //   } catch (error) {
  //     console.error("Error getting user document:", error);
  //     setRole(null); // Handle errors by setting userRole to a fallback value
  //   }
  // };

  //   e.preventDefault();

  //   try {
  //     const userDocRef = doc(db, "users", uid);
  //     const userDocSnapshot = await getDoc(userDocRef);

  //     const existingUserData = userDocSnapshot.exists()
  //       ? userDocSnapshot.data()
  //       : {};
  //     const nonEmptySpecialties = formData.specialities.filter(
  //       (value) => value.trim() !== ""
  //     );
  //     const nonEmptyEducations = formData.educations.filter(
  //       (value) => value.trim() !== ""
  //     );
  //     const updatedUserData = { ...existingUserData };

  //     for (const key in formData) {
  //       if (formData[key] !== "") {
  //         if (key === "address") {
  //           if (!updatedUserData.address) {
  //             updatedUserData.address = {};
  //           }
  //           for (const addressKey in formData[key]) {
  //             if (formData[key][addressKey] !== "") {
  //               updatedUserData.address[addressKey] = formData[key][addressKey];
  //             }
  //           }
  //         } else {
  //           updatedUserData[key] = formData[key];
  //         }
  //       }
  //     }
  //     updatedUserData.specialities = [
  //       ...existingUserData.specialities,
  //       ...nonEmptySpecialties,
  //     ];
  //     updatedUserData.educations = [
  //       ...existingUserData.educations,
  //       ...nonEmptyEducations,
  //     ];

  //     updatedUserData.timestamp = serverTimestamp();
  //     await setDoc(userDocRef, updatedUserData);

  //     toast.success("Updated successfully!");
  //     navigate("/manageUsersProfile");
  //   } catch (error) {
  //     toast.error("Something went wrong with the update.");
  //   }
  // };

  // const handleImageUpload = async (e) => {
  //   const file = e.target.files[0]; // Get the selected file
  //   const storage = getStorage();
  //   const uniqueFileName = `${file.name}-${uuidv4()}`;
  //   const storageRef = ref(storage, `images/${uniqueFileName}`);

  //   try {
  //     const snapshot = await uploadBytes(storageRef, file); // Upload the file to Firebase Storage

  //     // Get the download URL of the uploaded image
  //     const downloadURL = await getDownloadURL(snapshot.ref);

  //     // Update your formData with the download URL
  //     setFormData({ ...formData, imageUrl: downloadURL });
  //     setImage(URL.createObjectURL(file));
  //   } catch (error) {
  //     console.error("Error uploading image:", error);
  //   }
  // };

  // const handleAddNewEducationInput = () => {
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     educations: [...prevData.educations, ""],
  //   }));
  // };

  // const handleAddNewSpecialtyInput = () => {
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     specialities: [...prevData.specialities, ""],
  //   }));
  // };

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
          <h1 className=" text-3xl text-center py-4 font-bold underline mb-5">
            Requests
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
