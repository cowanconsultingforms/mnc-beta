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
import { db } from "../firebase";
import { differenceInDays, addYears } from "date-fns";

const MyProfile = () => {
  const [uid, setUid] = useState("");
  const navigate = useNavigate();
  const [currentUser, seteCurrentUser] = "";
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
  const auth = getAuth();
  const [role, setRole] = useState("");
  const [remainingDays, setRemainingDays] = useState(0);

  const handleFacebookLogin = () => {
    window.location.href = user.facebookLink;
  };
  const handleInstagramLogin = () => {
    window.location.href = user.instagramLink;
  };

  useEffect(() => {
    const fetchUser = async () => {
      getUserRole();
    };

    fetchUser();
  }, [uid, role]);

  const getUserRole = async () => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user2) => {
      if (user2) {
        const userRef = doc(db, "users", user2.uid);
        setUid(user2.uid);
        try {
          const userDoc = await getDoc(userRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser(userDoc.data());
            setRole(userData.role);
            if (userData.subscription) {
              const subscriptionData = userData.subscription;
              const startDate = subscriptionData.toDate();
              const endDate = addYears(startDate, 1);
              const daysLeft = calculateRemainingDays(endDate);
              setRemainingDays(daysLeft);
              
            }
          } else {
            console.log("User document not found.");
          }
        } catch (error) {
          console.error("Error getting user document:", error);
        }
      }
    });
  };

  const calculateRemainingDays = (endDate) => {
    const currentDate = new Date();
    const daysLeft = differenceInDays(endDate, currentDate);
    return Math.max(0, daysLeft);
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
            <div
              onClick={() => {
                navigate(`/tenant/${uid}`);
              }}
              className="text-center 2-auto text-white mb-5 font-semibold text-xl bg-gray-600"
            >
              <button>Update your profile</button>
            </div>
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
            <div>
              <div className="text-left font-serif  mt-12 text-4xl">
                {user.name}
              </div>
              <div className="text-left sans-serif text-lg text-gray-500 mb-4">
                {user.role}
              </div>
              <div className="text-left mb-4 mt-6">
                <p className="pb-3">
                  <span className="font-semibold pb-5">Subscription: </span>
                  {remainingDays} days left
                </p>
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
                      <p className="pb-3">
                        <span className="font-semibold">Agent: </span>
                        {user.agent}
                      </p>
                      <p className="pb-3">
                        <span className="font-semibold">Agent Email: </span>
                        {user.agentEmail}
                      </p>
                    </>
                  )}
                </>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mx-10 mb-20">
          <div className="col-span-1 "></div>
          <div className="col-span-1 ">
            <h1 className="text-3xl">About</h1>
            <p className="text-base leading-6 font-normal">{user.about}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mx-10 mb-20 justify-center ">
        <div className="col-span-1"></div>
        <div className="col-span-1">
          <h1 className="text-3xl">Testimonial</h1>
          <p className="text-base leading-6 font-normal">{user.testimonial}</p>
        </div>
        </div>
      </section>
    </div>
  );
};

export default MyProfile;
