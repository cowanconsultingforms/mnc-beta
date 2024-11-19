import { useParams } from "react-router-dom";
import {
  getDoc,
  doc,
  setDoc,
  updateDoc,
  getDocs,
  query,
  collection,
  where,
  serverTimestamp,
} from "firebase/firestore";
import facebook from "../assets/img/fb.jpg";
import instagram from "../assets/img/insta.jpg";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  updateProfile,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { db } from "../firebase";
import emailjs from "@emailjs/browser";
import { differenceInDays, addYears } from "date-fns";
import fetch from "node-fetch";

const ViewProfile = () => {
  const { uid } = useParams();
  const [user, setUser] = useState({
    name: "",
    email: "",
    role: "",
    address: "",
    imageUrl: "",
  });
  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    interested: "",
    dealTimeline: "",
    maxBudget: "",
    houseldIncome: "",
    lenderInfo: "",
    preApprovalAmount: "",
    hasPreApprovalLetter: false,
    preApprovalExpiration: "",
  });
  const [id, setId] = useState("");
  const auth = getAuth();
  const [role, setRole] = useState("");
  const [showWorkWithAgent, setShowWorkWithAgent] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [remainingDays, setRemainingDays] = useState(0);

  const handleFacebookLogin = () => {
    window.location.href = user.facebookLink;
  };
  const handleInstagramLogin = () => {
    window.location.href = user.instagramLink;
  };

  useEffect(() => {
    const fetchUser = async () => {
      const userDocRef = doc(db, "users", uid);
      const userDocSnapshot = await getDoc(userDocRef);
      setUser(userDocSnapshot.data());
      getUserRole();

      // if (userDocSnapshot.exists()) {
      //   const userData = userDocSnapshot.data();
      //   if (userData.subscription) {
      //     const subscriptionData = userData.subscription;
      //     const startDate = subscriptionData.toDate();
      //     const endDate = addYears(startDate, 1);
      //     const daysLeft = calculateRemainingDays(endDate);
      //     setRemainingDays(daysLeft);
      //   } else {
      //     console.log("User document not found.");
      //   }
      // }
    };

    fetchUser();
  }, [uid, role]);

  // const calculateRemainingDays = (endDate) => {
  //   const currentDate = new Date();
  //   const daysLeft = differenceInDays(endDate, currentDate);
  //   return Math.max(0, daysLeft);
  // };

  const getUserRole = async () => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user2) => {
      if (user2) {
        const userRef = doc(db, "users", user2.uid);
        try {
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setRole(userData.role);
          } else {
            console.log("User document not found.");
          }
        } catch (error) {
          console.error("Error getting user document:", error);
        }
      }
    });
  };

  const handlePopUp = () => {
    setShowWorkWithAgent(!showWorkWithAgent);
  };

  const handleClose = () => {
    setShowWorkWithAgent(!showWorkWithAgent);
    customer.hasPreApprovalLetter = false;
    customer.interested = "";
  };

  const onChange = (e) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setCustomer({
        ...customer,
        [name]: !customer[name],
      });
    } else {
      setCustomer({
        ...customer,
        [name]: value,
      });
    }
  };

  const handleAgent = () => {
    handlePopUp();
    setIsClicked(true);

    setTimeout(() => {
      setIsClicked(false);
    }, 200);
  };

  const sendEmail = async (email, message) => {
    const subject = "New Request";
    const to = email;

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

  function generateRandomPassword() {
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+";
    const length = 12;
    let password = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }

    return password;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const existingMethods = await fetchSignInMethodsForEmail(
        auth,
        customer.email
      );
      if (existingMethods.length === 0) {
        const auth = getAuth();
        const password = generateRandomPassword();
        const userCredentials = await createUserWithEmailAndPassword(
          auth,
          customer.email,
          password
        );
        const user2 = userCredentials.user;
        const userDocRef = doc(db, "users", user2.uid);

        await updateProfile(user2, {
          displayName: customer.name,
        });

        const updatedData = {
          ...customer,
          role: "user",
          agentRequested: user.name,
          agentEmailRequested: user.email,
          requestStatus: "notCompleted",
          timestamp: serverTimestamp(),
        };

        await setDoc(userDocRef, updatedData);
        sendEmail(
          user.email,
          `${customer.name} wants to work with you in ${customer.interested}ing. \nHere's some information customer provided: \nEmail:${customer.email}, \nPhone: ${customer.phone},\nDeal Timeline: ${customer.dealTimeline}, \nMax Budget: ${customer.maxBudget}, \nhousehold Income: ${customer.houseldIncome}, \nLender Info: ${customer.lenderInfo}, \npreApproval amount: ${customer.preApprovalAmount}\n\nThank You\nTeam MNC Development`
        );
        sendEmail(
          customer.email,
          `Hello ${customer.name}, your account is created with MNC Development with email: ${customer.email} and a temporary password: ${password}\n\nThank You\nTeam MNC Development.`
        );
        toast.success("Deal is created successfully!");
        handlePopUp();
      } else {
        const auth = getAuth();
        onAuthStateChanged(auth, async (user2) => {
          if (user2) {
            setId(user2.uid);
            const q = query(
              collection(db, "users"),
              where("email", "==", customer.email)
            );
            const querySnapshot = await getDocs(q);

            if (id && id.length > 1) {
              if (querySnapshot.docs.length > 0) {
                const userDoc = querySnapshot.docs[0];
                const userUid = userDoc.id;
                const updatedData = {
                  ...userDoc.data(),
                  ...customer,
                  agentRequested: user.name,
                  agentEmailRequested: user.email,
                  requestStatus: "notCompleted",
                  timestamp: serverTimestamp(),
                };

                await updateDoc(doc(db, "users", userUid), updatedData);
              }
              sendEmail(
                user.email,
                `${customer.name} wants to work with you in ${customer.interested}ing. \nHere's some information customer provided: \nEmail:${customer.email}, \nPhone: ${customer.phone},\nDeal Timeline: ${customer.dealTimeline}, \nMax Budget: ${customer.maxBudget}, \nhousehold Income: ${customer.houseldIncome}, \nLender Info: ${customer.lenderInfo}, \npreApproval amount: ${customer.preApprovalAmount}\n\nThank You\nTeam MNC Development`
              );
              toast.success(
                "Thank you for your time. The agent will contact you soon."
              );
            } else {
              // console.error("Not logged in")
            }
            handlePopUp();
          } else {
            toast.error(
              "This email is already in use! Please log in to work with agent."
            );
          }
        });
      }
    } catch (error) {
      toast.error("Something went wrong with the registration.");
    }
  };
  const style = {
    "@media (max-width: 900px)": {
      marginLeft: "30px",
    },
  };
  return (
    <div>
      <section
        style={{
          height: "100%",
          margin: 0,
          padding: 0,
          // opacity: showWorkWithAgent ? 0.6 : 1,
          // backgroundColor: showWorkWithAgent ? "gray" : "white",
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mx-20">
          <div className="responsive-box mx-auto py-8 mt-6">
            {/* Column 1: User Image */}
            <div className="my-30 grid-area-image ">
              <img
                src={user.imageUrl}
                alt={user.name}
                className=" h-60 border-full"
                style={{ filter: "grayscale(100%)", width: "280px" }}
              />
            </div>
            <div className="mt-10">
              <h1 className=" font-semibold" style={{ fontSize: "22px" }}>
                Social Media
              </h1>
              <div className=" flex items-center ">
                <img
                  src={facebook}
                  alt="facebook"
                  className="mt-5 hover:ring-1"
                />
                <button
                  onClick={handleFacebookLogin}
                  className="hover:ring-1 mt-5 ml-5 text-xl font-bold"
                >
                  Facebook
                </button>
              </div>
              <div className="flex items-center">
                <img
                  src={instagram}
                  alt="instagram"
                  className="mt-5 hover:ring-1"
                />
                <button
                  onClick={handleInstagramLogin}
                  className="mt-5 ml-5 text-xl font-bold hover:ring-1"
                >
                  Instagram
                </button>
              </div>
              <div className="items-center">
                <p className="mt-10 font-semibold" style={{ fontSize: "22px" }}>
                  Specialties
                </p>
                {user.specialities && (
                  <>
                    {user.specialities.map((specialty, index) => (
                      <p className="font-serif" key={index}>
                        {specialty}
                      </p>
                    ))}
                  </>
                )}
              </div>
              <div className="items-center">
                <p className="mt-10 font-semibold" style={{ fontSize: "22px" }}>
                  Education
                </p>
                {user.educations && (
                  <>
                    {user.educations.map((education, index) => (
                      <p className="font-serif" key={index}>
                        {education}
                      </p>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Column 2: User Details */}
          <div className="col-span-1 md:col-span-1">
            {" "}
            {/* Adjust width as needed */}
            {/* <div> */}
            <div className="text-left font-serif  mt-12 text-4xl">
              {user.name}
            </div>
            <div className="text-left sans-serif text-lg text-gray-500 mb-4">
              {user.role}
            </div>
            <div className="text-left mb-4 mt-6">
              {/* <p className="pb-3">
                <span className="font-semibold pb-5">Subscription: </span>
                {remainingDays} days left
              </p> */}
              {/* vip */}
              {user.role === "vip" && (
                <>
                  {user.numberOfDaysLeft && (
                    <p>
                      <span className="font-semibold">Subscription:</span>{" "}
                      {user.numberOfDaysLeft} days left
                    </p>
                  )}
                </>
              )}
              <p className="pb-3">
                <span className="font-semibold pb-5">Email: </span>
                {user.email}
              </p>
              {user.address && user.address.street && (
                <p className="pb-3">
                  <span className="font-semibold">Address: </span>
                  {user.address.street}
                  <span>
                    , {user.address.city}, {user.address.state}{" "}
                    {user.address.zipCode}
                  </span>
                </p>
              )}

              <p className="pb-3">
                <span className="font-semibold">Phone: </span>
                {user.phone}
              </p>
              {(role === "admin" ||
                role === "superAdmin" ||
                role === "agent") && (
                <>
                  <p className="pb-3">
                    <span className="font-semibold">Number of children: </span>
                    {user.numberOfKids}
                  </p>
                  <p className="pb-3">
                    <span className="font-semibold">Spouse name: </span>
                    {user.spouseName}
                  </p>
                  {user.dob && (
                    <p className="pb-3">
                      <span className="font-semibold">DOB: </span>
                      {user.dob && user.dob.seconds
                        ? new Date(user.dob.seconds * 1000).toLocaleDateString()
                        : "Not available"}
                    </p>
                  )}
                  {user.requestStatus === "notCompleted" && (
                    <>
                      <p className="pb-3">
                        <span className="font-semibold">Interested In: </span>
                        {user.interested}
                      </p>
                      <p className="pb-3">
                        <span className="font-semibold">Deal Timeline: </span>
                        {user.dealTimeline}
                      </p>
                      <p className="pb-3">
                        <span className="font-semibold">Max Budget: </span>
                        {user.maxBudget}
                      </p>

                      <p className="pb-3">
                        <span className="font-semibold">
                          Household Income:{" "}
                        </span>
                        {user.houseldIncome}
                      </p>
                      <p className="pb-3">
                        <span className="font-semibold">
                          Lender Information:{" "}
                        </span>
                        {user.lenderInfo}
                      </p>
                      <p className="pb-3">
                        <span className="font-semibold">
                          Preapproval Amount:{" "}
                        </span>
                        {user.preApprovalAmount}
                      </p>
                      <p className="pb-3">
                        <span className="font-semibold">
                          Preapproval Expiration:{" "}
                        </span>
                        {user.preApprovalExpiration}
                      </p>
                      <p className="pb-3">
                        <span className="font-semibold">Request Status: </span>
                        {user.requestStatus}
                      </p>
                    </>
                  )}
                  {user.agent && (
                    <>
                      <p className="pb-3">
                        <span className="font-semibold">Agent: </span>
                        {user.agent}
                      </p>
                    </>
                  )}

                  {user.agentEmail && (
                    <>
                      <p className="pb-3">
                        <span className="font-semibold">Agent Email: </span>
                        {user.agentEmail}
                      </p>
                    </>
                  )}
                </>
              )}

              {user.role === "agent" && (
                <>
                  <div>
                    <button
                      style={{
                        width: "auto",
                        height: "auto",
                        transform: isClicked ? "scale(0.95)" : "scale(1)",
                        transition: "transform 0.2s",
                      }}
                      className="p-2 hover:ring-1 focus:shadow-lg active:ring-1 bg-gray-600 text-white  font-semibold "
                      onClick={handleAgent}
                    >
                      Work with {user.name}
                    </button>
                  </div>
                </>
              )}
              {showWorkWithAgent && (
                <>
                  <div
                    className=" mr-10 bg-white pl-1 pr-1 rounded-md"
                    style={{
                      maxWidth: "300px",
                      minWidth: "200px",
                      boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
                      position: "absolute",
                      // top: "40%",
                      left: "50%",
                      transform: "translate(-50%)",
                    }}
                  >
                    <div>
                      <button
                        onClick={handleClose}
                        className=" mb-1 font-bold text-xl "
                      >
                        X
                      </button>
                    </div>

                    <div style={{}} className=" flex flex-col items-center">
                      <form
                        onSubmit={handleSubmit}
                        className=" p-4 flex flex-col items-center"
                      >
                        <input
                          type="text"
                          name="name"
                          value={customer.name}
                          onChange={onChange}
                          className=" px-4 py-2 text-sm text-gray-700 bg-white border border-white shadow-md rounded transition duration-150 focus:shadow-lg focus:text-gray-700 focus:bg-white hover:ring-1 focus:shadow-lg active:ring-1 focus:border-gray-300 mb-3"
                          placeholder="Name"
                          required
                        />

                        <input
                          type="text"
                          name="email"
                          value={customer.email}
                          onChange={onChange}
                          className=" px-4 py-2 text-sm text-gray-700 bg-white border border-white shadow-md rounded transition duration-150 focus:shadow-lg focus:text-gray-700 focus:bg-white hover:ring-1 focus:shadow-lg active:ring-1 focus:border-gray-300 mb-3"
                          placeholder="Email"
                          required
                        />

                        <input
                          type="text"
                          name="phone"
                          value={customer.phone}
                          onChange={onChange}
                          className=" px-4 py-2 text-sm text-gray-700 bg-white border border-white shadow-md rounded transition duration-150 focus:shadow-lg focus:text-gray-700 focus:bg-white hover:ring-1 focus:shadow-lg active:ring-1 focus:border-gray-300 mb-3"
                          placeholder="Phone"
                          required
                        />

                        <div className=" mb-2">
                          <label>Interested in:</label>
                          <div className="flex flex-row justify-between">
                            <div>
                              <input
                                type="radio"
                                name="interested"
                                value="Buy"
                                checked={customer.interested === "Buy"}
                                onChange={onChange}
                                required
                              />
                              <label className="ml-2">Buy</label>
                            </div>
                            <div>
                              <input
                                type="radio"
                                name="interested"
                                value="Sell"
                                checked={customer.interested === "Sell"}
                                onChange={onChange}
                                className="ml-2"
                                required
                              />
                              <label className="ml-2">Sell</label>
                            </div>
                            <div>
                              <input
                                type="radio"
                                name="interested"
                                value="Rent"
                                checked={customer.interested === "Rent"}
                                onChange={onChange}
                                className="ml-2"
                                required
                              />
                              <label className="ml-2">Rent</label>
                            </div>
                          </div>
                        </div>

                        {customer.interested === "Buy" && (
                          <>
                            <input
                              type="text"
                              name="dealTimeline"
                              value={customer.dealTimeline}
                              onChange={onChange}
                              className=" px-4 h-8 py-2 text-sm text-gray-700 bg-white border border-white shadow-md rounded transition duration-150 focus:shadow-lg focus:text-gray-700 focus:bg-white hover:ring-1 focus:shadow-lg active:ring-1 focus:border-gray-300 mb-3"
                              placeholder="Deal Timeline"
                              required
                            />
                            <input
                              type="number"
                              name="maxBudget"
                              value={customer.maxBudget}
                              onChange={onChange}
                              className=" px-4 h-8 py-2 text-sm text-gray-700 bg-white border border-white shadow-md rounded transition duration-150 focus:shadow-lg focus:text-gray-700 focus:bg-white hover:ring-1 focus:shadow-lg active:ring-1 focus:border-gray-300 mb-3"
                              placeholder="Max Budget"
                              required
                            />
                            <input
                              type="number"
                              name="houseldIncome"
                              value={customer.houseldIncome}
                              onChange={onChange}
                              className=" px-4 h-8 py-2 text-sm text-gray-700 bg-white border border-white shadow-md rounded transition duration-150 focus:shadow-lg focus:text-gray-700 focus:bg-white hover:ring-1 focus:shadow-lg active:ring-1 focus:border-gray-300 mb-3"
                              placeholder="Houseld Amount"
                              required
                            />
                            <input
                              type="text"
                              name="lenderInfo"
                              className=" px-4 h-8 py-2 text-sm text-gray-700 bg-white border border-white shadow-md rounded transition duration-150 focus:shadow-lg focus:text-gray-700 focus:bg-white hover:ring-1 focus:shadow-lg active:ring-1 focus:border-gray-300 mb-3"
                              value={customer.lenderInfo}
                              onChange={onChange}
                              placeholder="Lender Information"
                              required
                            />
                            <input
                              type="number"
                              name="preApprovalAmount"
                              className=" px-4 h-8 py-2 text-sm text-gray-700 bg-white border border-white shadow-md rounded transition duration-150 focus:shadow-lg focus:text-gray-700 focus:bg-white hover:ring-1 focus:shadow-lg active:ring-1 focus:border-gray-300 mb-3"
                              value={customer.preApprovalAmount}
                              onChange={onChange}
                              placeholder="Pre-Approval Amount"
                              required
                            />
                            <div className="flex">
                              <label className="text-sm ml-4 ">
                                Pre-Approval Letter:
                              </label>
                              <input
                                type="checkbox"
                                name="hasPreApprovalLetter"
                                className=" px-3 h-6 text-sm text-gray-700 bg-white border border-white shadow-md rounded transition duration-150 focus:shadow-lg focus:text-gray-700 focus:bg-white hover:ring-1 focus:shadow-lg active:ring-1 focus:border-gray-300 mb-3"
                                checked={customer.hasPreApprovalLetter}
                                onChange={onChange}
                                required
                              />
                            </div>
                            <div>
                              {customer.hasPreApprovalLetter && (
                                <>
                                  <p className=" text-sm text-semibold">
                                    Pre-Approval Expiration Date:
                                  </p>
                                  <input
                                    type="date"
                                    name="preApprovalExpiration"
                                    className=" px-4 h-8 py-2 text-sm text-gray-700 bg-white border border-white shadow-md rounded transition duration-150 focus:shadow-lg focus:text-gray-700 focus:bg-white hover:ring-1 focus:shadow-lg active:ring-1 focus:border-gray-300 mb-6"
                                    value={customer.preApprovalExpiration}
                                    onChange={onChange}
                                    style={{
                                      maxWidth: "238px",
                                      height: "30PX",
                                    }}
                                    required
                                  />
                                </>
                              )}
                            </div>
                          </>
                        )}

                        <button
                          className=" pl-1 pr-1 h-8 w-40 hover:ring-2 focus:shadow-lg active:ring-2 bg-gray-600 text-white  font-semibold "
                          type="submit"
                        >
                          Submit
                        </button>
                        <div>
                          <p className="mb-9 text-sm mt-2">
                            If you have not created an account yet, your account
                            will be created by submitting this form. Thereafter,
                            a temporary password will be sent to the registered
                            email.
                          </p>
                        </div>
                      </form>
                    </div>
                  </div>
                </>
              )}
            </div>
            {/* </div> */}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mx-10 mb-20">
          <div className="col-span-1 "></div>
          <div className="col-span-1 ">
            <h1 className="text-3xl">About</h1>
            <p className="text-base leading-6 font-normal">{user.about}</p>
            <div className="col-span-1">
          <h1 className="text-3xl">Testimonial</h1>
          <p className="text-base leading-6 font-normal">{user.testimonial}</p>
        </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ViewProfile;
