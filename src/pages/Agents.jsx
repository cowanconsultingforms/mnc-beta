import {
  collection,
  documentId,
  getDocs,
  getDoc,
  orderBy,
  query,
  where,
  doc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import Moment from "react-moment";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AiOutlineSearch } from "react-icons/ai";
import Spinner from "../components/Spinner";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import back from "../assets/img/backImage.png";

const UserGrid = ({ users, handleUpdate }) => {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 sm:grid-cols-3 sm:grid-cols-4 gap-5">
        {users.map((user, index) => (
          <div
            key={index}
            className={`bg-white ml-5 rounded shadow-lg flex flex-col h-70 w-60 justify-between  ${
              index % 2 === 0 ? "bg-gray-200" : "bg-white"
            }`}
          >
            {" "}
            <Link className="contents" to={`/viewProfile/${user.id}`}>
              {/* User picture */}
              <div className="text-center">
                <img
                  src={user.data.imageUrl || "default-image-url"}
                  alt={`${user.data.name}'s Picture`}
                  className="w-[100%] h-40"
                  style={{ filter: "grayscale(100%)" }}
                />
              </div>
              {/* User data */}
              <div className="">
                <p className="text-left ml-5 font-light font-bold text-2xl font-serif">
                  {user.data.name}
                </p>
                <p className="mt-2 ml-5 text-left text-sm font-serif">
                  Email: {user.data.email}
                </p>
                <p className="mt-2 ml-5 text-left text-gray-500 text-sm color-grey font-serif">
                  Phone: {user.data.phone}
                </p>

                {(user.data.role === "admin" ||
                  user.data.role === "superAdmin") && (
                  <div>
                    <p className="text-left text-sm">
                      Creation Date:{" "}
                      <Moment local>{user.data.timestamp?.toDate()}</Moment>
                    </p>

                    {user.data.dob && (
                      <p className="mt-2 text-left text-sm">
                        Dob:{" "}
                        {new Date(
                          user.data.dob.seconds * 1000
                        ).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                )}
              </div>{" "}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

const ManageUsersProfile = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState("");
  const navigate = useNavigate();

  const [zipcode, setZip] = useState(false);
  const [city, setCity] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState("");
  const [results, setResults] = useState(false);
  const [search, setSearch] = useState(true);
  const [agents, setAgents] = useState([]);
  const [select, setSelect] = useState(false);

  const handleSearch = (e) => {
    setSearchTerm(e);
    setSelect(true);
    setResults(true);
    setSearch(false);
    const agents2 = Array.isArray(suggestions)
      ? users.filter((user) => {
          if (user.data.role === "agent" && user.data.address) {
            const address = user.data.address || {};
            // agent.data.address?.street?.toLowerCase() || ''
            const streetHasE =
              address &&
              address?.street?.toLowerCase().includes(e.toLowerCase());
            const cityHasE =
              address && address?.city?.toLowerCase().includes(e.toLowerCase());
            const stateHasE =
              address &&
              address?.state?.toLowerCase().includes(e.toLowerCase());
            const zipcodeHasE =
              address &&
              address?.zipCode?.toLowerCase().includes(e.toLowerCase());
            const nameHasE = user.data.name.toLowerCase() === e.toLowerCase();

            if (searchTerm.includes(",")) {
              const searchTermsArray = searchTerm.split(",");

              agents.filter((agent) => {
                if (agent.data.address) {
                  const address = agent.data.address;
                  for (const field in address) {
                    if (
                      searchTermsArray.some((term) =>
                        address[field].includes(term)
                      )
                    ) {
                      return searchTermsArray;
                    }
                  }
                }
              });
            }
            return (
              streetHasE || cityHasE || stateHasE || zipcodeHasE || nameHasE
            );
          }
          return false;
        })
      : [];
    setAgents(agents2);
  };

  const onChange = async (e) => {
    setSearchTerm(e.target.value);
    setSearch(true);
    await fetchProperties(searchTerm);
  };

  const fetchProperties = async (searchTerm) => {
    if (searchTerm !== "") {
      const listingRef = collection(db, "users");

      let q = query(listingRef, where("role", "==", "agent"));
      const querySnap = await getDocs(q);
      let agents = [];
      querySnap.forEach((doc) => {
        return agents.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      const filteredSuggestions = agents.filter((agent) => {
        if (agent.data.address) {
          const st = agent.data.address?.street?.toLowerCase() || "";
          const city = agent.data.address?.city?.toLowerCase() || "";
          const state = agent.data.address?.state?.toLowerCase() || "";
          const zipCode = agent.data.address?.zipCode || "";

          if (st.includes(searchTerm.toLowerCase())) {
            return st.includes(searchTerm.toLowerCase());
          }
          if (city.includes(searchTerm.toLowerCase())) {
            return city.includes(searchTerm.toLowerCase());
          }
          if (state.includes(searchTerm.toLowerCase())) {
            return state.includes(searchTerm.toLowerCase());
          }
          if (zipCode.includes(searchTerm)) {
            return zipCode.includes(searchTerm);
          }
        }
        if (agent.data.name.toLowerCase().includes(searchTerm.toLowerCase())) {
          return agent.data.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        }
      });

      if (searchTerm == "") {
        setSuggestions([]);
      } else {
        setSuggestions(filteredSuggestions);
      }
    }
  };

  useEffect(() => {
    setLoading(true);
    const fetchUser = async () => {
      try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, orderBy("timestamp", "desc"));
        const querySnap = await getDocs(q);
        let users = [];
        querySnap.forEach((doc) => {
          return users.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setUsers(users);

        setLoading(false);
      } catch (error) {
        toast.error("Insufficient permissions.");
        navigate("/");
      }
    };

    fetchUser();
  }, [navigate]);

  if (loading) {
    return <Spinner />;
  }

  const handleUpdate = (data) => {
    navigate(`/tenant/${data.id}`);
  };

  return (
    <div>
      <div
        style={{
          position: "absolute",
          zIndex: -1,
          top: 45,
          width: "100%",
          opacity: 1,
        }}
      >
        <div
          style={{
            backgroundImage: `url(${back})`,
            width: "100%",
            backgroundSize: "cover",
            opacity: 0.75,
            backgroundRepeat: "no-repeat",
            display: "flex", // Use flexbox
            flexDirection: "column", // Stack items vertically
            justifyContent: "center", // Center vertically
            alignItems: "center",
            height: select ? "400px" : "100vh",
          }}
        >
          <div className="flex flex-col items-center justify-center text-center">
            <div style={{ maxWidth: "100%" }}>
              <form
                className=" mt-6 mb-15 flex items-center "
                style={{
                  maxWidth: "90%",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
                onSubmit={onchange}
              >
                {/* Search bar */}
                <div
                  className="px-3 relative"
                  style={{ width: "456px", margin: "auto" }}
                >
                  <input
                    type="search"
                    placeholder="Search agents by address or name"
                    value={searchTerm}
                    onChange={onChange}
                    style={{
                      width: "100%",
                      border: "",
                      boxShadow:
                        "10px 10px 10px 0px rgba(1, 1, 0, 0), -10px -10px 10px 0px rgba(0, 0, 0, 0), 0px 10px 10px 0px rgba(0, 0, 0, 0), 0px -10px 10px 0px rgba(0, 0, 0, 0.6)",
                    }}
                    className=" text-lg text-gray-700 bg-white border border-white hover:ring-1 transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-gray-300"
                  ></input>
                </div>
              </form>
              {search && searchTerm && suggestions.length > 0 && (
                <>
                <div
                  style={{
                    marginLeft: "35px",
                  }}
                  className="bg-red"
                >
                  <ul
                    className="suggestions-list bg-white font-semibold"
                    style={{
                      textAlign: "left",
                      paddingLeft: "15px",
                      width: "91.8%",
                    }}
                  >
                    {Array.from(
                      new Set(
                        suggestions.map((suggestion) => {
                          const { address } = suggestion.data;
                          const filteredInfo = [];

                          if (
                            address && address.street &&
                            address.street
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase())
                          ) {
                            filteredInfo.push(address.street);
                          }
                          if (
                            address && address.city &&
                            address.city
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase())
                          ) {
                            filteredInfo.push(address.city);
                          }
                          if (
                            address && address.state &&
                            address.state 
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase())
                          ) {
                            filteredInfo.push(address.state);
                          }
                          if (address && address.zipCode && address.zipCode.includes(searchTerm)) {
                            filteredInfo.push(address.zipCode);
                          }
                          if (
                            suggestion.data.name &&
                            suggestion.data.name.toLowerCase().includes(
                              searchTerm.toLowerCase())
                          ) {
                            filteredInfo.push(
                              suggestion.data.name.toLowerCase()
                            );
                          }
                          return filteredInfo.join(", "); // Join non-empty parts with a comma
                        })
                      )
                    ).map((cityStatePair, index) => (
                      <li key={index} style={{}}>
                        <button
                          onClick={() => handleSearch(cityStatePair)}
                          style={{ width: "100%", textAlign: "left" }}
                        >
                          {cityStatePair}
                        </button>
                      </li>
                    ))}
                    
                  </ul>
                </div>
                
                </>
              )}
              {search && searchTerm && suggestions.length == 0 && (
                  <>
                  <ul className="text-black bg-white " style={{marginLeft: "34px", width: "388px", maxWidth: "100%"}}>
                    <li>No listings available with "{searchTerm}"</li>
                  </ul>
                  </>
                )}
            </div>
          </div>
        </div>
        {select && (
          <h2 className="bg-gray-600 text-white cursor-pointer font-semibold text-md text-center">
            Agents
          </h2>
        )}
        {results && (
          <div style={{ marginTop: "20px" }}>
            <UserGrid users={agents} handleUpdate={searchTerm} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsersProfile;
