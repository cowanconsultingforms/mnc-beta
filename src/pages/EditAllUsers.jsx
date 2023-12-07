import {
  doc,
  serverTimestamp,
  setDoc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { useEffect, useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SignInBackgroundImage from "../assets/img/sign-in-background.jpg";
import OAuth from "../components/OAuth";
import { db } from "../firebase";
import emailjs from "@emailjs/browser";
import { useParams } from "react-router-dom";

const EditUser = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [errorMessage2, setErrorMessage2] = useState("");

  const [formData, setFormData] = useState({
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
    },
    spouseName: "",
    numberOfKids: "",
    facebookLink: "",
    instagramLink: "",
    dob: new Date(),
    about: "",
    educations: [],
    specialities: [],
  });

  const {
    phone,
    address,
    spouseName,
    numberOfKids,
    facebookLink,
    instagramLink,
    dob,
    about,
    educations,
    specialities,
  } = formData;
  const navigate = useNavigate();
  const [isTenant, setIsTenant] = useState(false);
  const [sent, setSent] = useState(false);
  const [specialtyInput, setSpecialtyInput] = useState("");
  const [image, setImage] = useState(null);
  const handleCheckboxChange = (e) => {
    setIsTenant(e.target.checked);
  };
  const { uid } = useParams();
  const [user, setUser] = useState({
    name: "",
    email: "",
    role: "",
  });

  const handleSent = () => {
    setSent(!sent);
  };
  const sendEmail = async () => {
    console.log("1");
    if (isTenant) {
      emailjs
        .send(
          "service_untmu1h",
          "template_t618r9h",
          {
            to_email: ["Rinkusarkar353@gmail.com"], // Email address of the recipient
            subject: "New Tenant Application",
            message: `User with email ${email} wants to become a tenant.`,
          },
          import.meta.env.VITE_APP_EMAILJS_API_KEY
        )
        .then((response) => {
          console.log("Email sent:", response);
        })
        .catch((error) => {
          console.error("Error sending email:", error);
        });
      console.log("sent");
    } else {
      console.log("User is not authenticated.");
    }
  };

  // Update text when typing in form data
  const onChange = (e) => {
    const { id, value } = e.target;

    if (id === "facebookLink") {
      if (!value.startsWith("https://")) {
        setErrorMessage(
          'Please enter a valid link starting with "https://".'
        );
      } else {
        setErrorMessage("");
      }
    }
    if (id === "instagramLink") {
      if (!value.startsWith("https://")) {
        setErrorMessage2(
          'Please enter a valid link starting with "https://".'
        );
      } else {
        setErrorMessage2("");
      }
    }

    if (id === "specialtyInput") {
      setSpecialtyInput(value);
    } else if (id.startsWith("address.")) {
      // It's an address field, update the address object
      const addressField = id.substring(8); // Remove "address." prefix from the id
      setFormData((prevData) => ({
        ...prevData,
        address: {
          ...prevData.address,
          [addressField]: value,
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [id]: value,
      }));
    }
  };
  useEffect(() => {
    const fetchUser = async () => {
      const userDocRef = doc(db, "users", uid);
      const userDocSnapshot = await getDoc(userDocRef);
      setUser(userDocSnapshot.data());
    };
    fetchUser();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const userDocRef = doc(db, "users", uid);
      const userDocSnapshot = await getDoc(userDocRef);

      const existingUserData = userDocSnapshot.exists()
        ? userDocSnapshot.data()
        : {};
      const nonEmptySpecialties = formData.specialities.filter(
        (value) => value.trim() !== ""
      );
      const nonEmptyEducations = formData.educations.filter(
        (value) => value.trim() !== ""
      );
      const updatedUserData = { ...existingUserData };

      for (const key in formData) {
        if (formData[key] !== "") {
          if (key === "address") {
            if (!updatedUserData.address) {
              updatedUserData.address = {};
            }
            for (const addressKey in formData[key]) {
              if (formData[key][addressKey] !== "") {
                updatedUserData.address[addressKey] = formData[key][addressKey];
              }
            }
          } else {
            updatedUserData[key] = formData[key];
          }
        }
      }
      if (existingUserData.specialities) {
        updatedUserData.specialities = [
          ...existingUserData.specialities,
          ...nonEmptySpecialties,
        ];
      }
      if (existingUserData.educations) {
        updatedUserData.educations = [
          ...existingUserData.educations,
          ...nonEmptyEducations,
        ];
      }

      updatedUserData.timestamp = serverTimestamp();
      await setDoc(userDocRef, updatedUserData);

      toast.success("Updated successfully!");
      navigate("/manageUsersProfile");
    } catch (error) {
      console.error("Error updating user data:", error);
      toast.error("Something went wrong with the update.");
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]; // Get the selected file
    const storage = getStorage();
    const uniqueFileName = `${file.name}-${uuidv4()}`;
    const storageRef = ref(storage, `images/${uniqueFileName}`);

    try {
      const snapshot = await uploadBytes(storageRef, file); // Upload the file to Firebase Storage

      // Get the download URL of the uploaded image
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Update your formData with the download URL
      setFormData({ ...formData, imageUrl: downloadURL });
      setImage(URL.createObjectURL(file));
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleAddNewEducationInput = () => {
    setFormData((prevData) => ({
      ...prevData,
      educations: [...prevData.educations, ""],
    }));
  };

  const handleAddNewSpecialtyInput = () => {
    setFormData((prevData) => ({
      ...prevData,
      specialities: [...prevData.specialities, ""],
    }));
  };

  return (
    <div
      className="object-cover h-auto"
      style={{
        backgroundImage: `url(${SignInBackgroundImage})`,
        backgroundSize: "cover",
        position: "relative",
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
      <div className="relative max-w-md w-full mx-auto bg-gray-100 rounded px-6 py-6">
        <h1 className="text-3xl text-center py-4 font-bold">
          Update information
        </h1>
        <form onSubmit={onSubmit}>
          <input
            className="w-full px-4 py-2 text-lg text-gray-700 bg-white border border-white shadow-md rounded transition duration-150 ease-in-out focus:shadow-lg focus:text-gray-700 focus:bg-white focus:border-gray-300 mb-6"
            value={user.name}
            readOnly
          />
          <input
            className="w-full px-4 py-2 text-lg text-gray-700 bg-white border border-white shadow-md rounded transition duration-150 ease-in-out focus:shadow-lg focus:text-gray-700 focus:bg-white focus:border-gray-300 mb-6"
            value={user.email}
            readOnly
          />
          <input
            className="w-full px-4 py-2 text-lg text-gray-700 bg-white border border-white shadow-md rounded transition duration-150 ease-in-out focus:shadow-lg focus:text-gray-700 focus:bg-white focus:border-gray-300 mb-6"
            value={user.role}
            readOnly
          />
          {/* Name form box */}
          <input
            className="w-full px-4 py-2 text-lg text-gray-700 bg-white border border-white shadow-md rounded transition duration-150 ease-in-out focus:shadow-lg focus:text-gray-700 focus:bg-white focus:border-gray-300 mb-6"
            type="tel"
            id="phone"
            value={phone}
            onChange={onChange}
            placeholder="Phone number"
          />
          {/* Email form box */}
          <input
            className="w-full px-4 py-2 text-lg text-gray-700 bg-white border border-white shadow-md rounded transition duration-150 ease-in-out focus:shadow-lg focus:text-gray-700 focus:bg-white focus:border-gray-300 mb-6"
            type="text"
            id="address.street"
            value={formData.address.street}
            onChange={onChange}
            placeholder="Street"
          />

          <input
            className="w-full px-4 py-2 text-lg text-gray-700 bg-white border border-white shadow-md rounded transition duration-150 ease-in-out focus:shadow-lg focus:text-gray-700 focus:bg-white focus:border-gray-300 mb-6"
            type="text"
            id="address.city"
            value={formData.address.city}
            onChange={onChange}
            placeholder="City"
          />
          <div className="flex">
            <select
              className="w-60 px-4 py-2 text-lg text-gray-700 bg-white border border-white shadow-md rounded transition duration-150 ease-in-out focus:shadow-lg focus:text-gray-700 focus:bg-white focus:border-gray-300 mb-6"
              id="address.state"
              value={formData.address.state}
              onChange={onChange}
            >
              <option value="">Select State</option>
              <option value="AL">Alabama</option>
              <option value="AK">Alaska</option>
              <option value="AZ">Arizona</option>
              <option value="AR">Arkansas</option>
              <option value="CA">California</option>
              <option value="CO">Colorado</option>
              <option value="CT">Connecticut</option>
              <option value="DE">Delaware</option>
              <option value="FL">Florida</option>
              <option value="GA">Georgia</option>
              <option value="HI">Hawaii</option>
              <option value="ID">Idaho</option>
              <option value="IL">Illinois</option>
              <option value="IN">Indiana</option>
              <option value="IA">Iowa</option>
              <option value="KS">Kansas</option>
              <option value="KY">Kentucky</option>
              <option value="LA">Louisiana</option>
              <option value="ME">Maine</option>
              <option value="MD">Maryland</option>
              <option value="MA">Massachusetts</option>
              <option value="MI">Michigan</option>
              <option value="MN">Minnesota</option>
              <option value="MS">Mississippi</option>
              <option value="MO">Missouri</option>
              <option value="MT">Montana</option>
              <option value="NE">Nebraska</option>
              <option value="NV">Nevada</option>
              <option value="NH">New Hampshire</option>
              <option value="NJ">New Jersey</option>
              <option value="NM">New Mexico</option>
              <option value="NY">New York</option>
              <option value="NC">North Carolina</option>
              <option value="ND">North Dakota</option>
              <option value="OH">Ohio</option>
              <option value="OK">Oklahoma</option>
              <option value="OR">Oregon</option>
              <option value="PA">Pennsylvania</option>
              <option value="RI">Rhode Island</option>
              <option value="SC">South Carolina</option>
              <option value="SD">South Dakota</option>
              <option value="TN">Tennessee</option>
              <option value="TX">Texas</option>
              <option value="UT">Utah</option>
              <option value="VT">Vermont</option>
              <option value="VA">Virginia</option>
              <option value="WA">Washington</option>
              <option value="WV">West Virginia</option>
              <option value="WI">Wisconsin</option>
              <option value="WY">Wyoming</option>
            </select>
            <input
              className=" ml-4 px-4 py-2 text-lg text-gray-700 bg-white border border-white shadow-md rounded transition duration-150 ease-in-out focus:shadow-lg focus:text-gray-700 focus:bg-white focus:border-gray-300 mb-6"
              style={{ width: "145px" }}
              type="text"
              id="address.zipCode"
              value={formData.address.zipCode}
              onChange={onChange}
              placeholder="ZIP Code"
            />
          </div>
          {/* Password form box */}
          <input
            className="w-full px-4 py-2 text-lg text-gray-700 bg-white border border-white shadow-md rounded transition duration-150 ease-in-out focus:shadow-lg focus:text-gray-700 focus:bg-white focus:border-gray-300 mb-6"
            type="text"
            id="spouseName"
            value={spouseName}
            onChange={onChange}
            placeholder="Spouse name"
          />
          <input
            className="w-full px-4 py-2 text-lg  text-gray-700 bg-white border border-white shadow-md rounded transition duration-150 ease-in-out focus:shadow-lg focus:text-gray-700 focus:bg-white focus:border-gray-300 mb-6"
            type="number"
            id="numberOfKids"
            value={numberOfKids}
            onChange={onChange}
            placeholder="Number Of Kids"
          />
          
          <input
            className="w-full px-4 py-2 text-lg  text-gray-700 bg-white border border-white shadow-md rounded transition duration-150 ease-in-out focus:shadow-lg focus:text-gray-700 focus:bg-white focus:border-gray-300 mb-6"
            type="text"
            id="facebookLink"
            value={facebookLink}
            onChange={onChange}
            placeholder="Facebook Link"
          />
          {facebookLink && errorMessage && <p className="text-red-500">{errorMessage}</p>}
          <input
            className="w-full px-4 py-2 text-lg  text-gray-700 bg-white border border-white shadow-md rounded transition duration-150 ease-in-out focus:shadow-lg focus:text-gray-700 focus:bg-white focus:border-gray-300 mb-6"
            type="text"
            id="instagramLink"
            value={instagramLink}
            onChange={onChange}
            placeholder="Instagram Link"
          />
          {instagramLink && errorMessage2 && <div className="text-red-500">{errorMessage2}</div>}

          <div style={{}}>
            <p>
              <button
                className="bg-gray-600 text-white w-7 mb-3"
                type="button"
                onClick={handleAddNewEducationInput}
              >
                +
              </button>{" "}
              Add Education{" "}
            </p>

            {educations.map((education, index) => (
              <div key={index}>
                <input
                  type="text"
                  value={education}
                  placeholder="Add Education"
                  className="mb-6"
                  onChange={(e) => {
                    const updatedEducations = [...educations];
                    updatedEducations[index] = e.target.value;
                    setFormData((prevData) => ({
                      ...prevData,
                      educations: updatedEducations,
                    }));
                  }}
                />
              </div>
            ))}
          </div>
          {/* specialties */}
          <div style={{}}>
            <p>
              <button
                className="bg-gray-600 text-white w-7 mb-3"
                type="button"
                onClick={handleAddNewSpecialtyInput}
              >
                +
              </button>{" "}
              Add Specialties{" "}
            </p>

            {specialities.map((speciality, index) => (
              <div key={index}>
                <input
                  type="text"
                  value={speciality}
                  placeholder="Add a Specialty"
                  className="mb-6"
                  onChange={(e) => {
                    const updatedSpecialities = [...specialities];
                    updatedSpecialities[index] = e.target.value;
                    setFormData((prevData) => ({
                      ...prevData,
                      specialities: updatedSpecialities,
                    }));
                  }}
                />
              </div>
            ))}
          </div>
          <textarea
            className="w-full h-40 text-lg text-gray-700 bg-white border border-white shadow-md rounded transition duration-150 ease-in-out focus:shadow-lg focus:text-gray-700 focus:bg-white focus:border-gray-300 mb-6"
            type="text"
            id="about"
            value={about}
            onChange={onChange}
            placeholder="about"
          />
          <p>Date of Birth</p>
          <DatePicker
            selected={formData.dob}
            onChange={(date) => {
              // Set the time to midnight (00:00:00) and update the formData
              date.setHours(0, 0, 0, 0);
              setFormData({ ...formData, dob: date });
            }}
            placeholderText="Date of birth"
            dateFormat="MM/dd/yyyy"
            showTimeSelect={false}
          />
          <input
            style={{ marginBottom: "15px", marginTop: "15px" }}
            type="file"
            accept=".jpg,.png,.jpeg"
            onChange={handleImageUpload}
            className="w-full px-3 py-1.5 text-gray-700 bg-white border border-white shadow-md rounded transition duration-150 ease-in-out focus:shadow-lg focus:text-gray-700 focus:bg-white focus:border-gray-300"
          />
          {image && (
            <img
              src={image}
              alt="Uploaded Image"
              style={{
                filter: "grayscale(100%)",
                marginBottom: "20px",
              }}
            />
          )}
          {/* Sign up button */}
          <button
            onClick={handleSent}
            className="w-full bg-gray-600 text-white px-7 py-3 text-sm font-medium uppercase rounded shadow-md hover:bg-gray-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-gray-800"
            type="submit"
          >
            Update
          </button>
          <div className="flex items-center my-4 before:border-t before:flex-1 before:border-gray-300 after:border-t after:flex-1 after:border-gray-300"></div>
        </form>
      </div>
    </div>
  );
};

export default EditUser;
