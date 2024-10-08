import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import { db } from "../firebase";
import { Link } from "react-router-dom";

const ManageUsersProfile = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [topAgents, setTopAgents] = useState([]); // State for top agents
  const [currentSlide, setCurrentSlide] = useState(0); // Track current slide
  const navigate = useNavigate();

  const handleSearch = (searchInput) => {
    setSearchTerm(searchInput);
    const filteredAgents = users.filter((user) => {
      const { address } = user.data;
      const searchValue = searchInput.toLowerCase();
      return (
        user.data.name.toLowerCase().includes(searchValue) ||
        (address?.street && address.street.toLowerCase().includes(searchValue)) ||
        (address?.city && address.city.toLowerCase().includes(searchValue)) ||
        (address?.state && address.state.toLowerCase().includes(searchValue)) ||
        (address?.zipCode && address.zipCode.includes(searchValue))
      );
    });
    setSuggestions(filteredAgents);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (suggestions.length > 0) {
      const firstSuggestion = suggestions[0];
      navigate(`/viewProfile/${firstSuggestion.id}`);
    }
  };

  const onChange = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value !== "") {
      const listingRef = collection(db, "users");
      const q = query(listingRef, where("role", "==", "agent"));
      const querySnap = await getDocs(q);
      let agents = [];
      querySnap.forEach((doc) => {
        return agents.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      const filteredSuggestions = agents.filter((agent) => {
        const { address } = agent.data;
        const lowerSearchTerm = value.toLowerCase();
        return (
          agent.data.name.toLowerCase().includes(lowerSearchTerm) ||
          (address?.street && address.street.toLowerCase().includes(lowerSearchTerm)) ||
          (address?.city && address.city.toLowerCase().includes(lowerSearchTerm)) ||
          (address?.state && address.state.toLowerCase().includes(lowerSearchTerm)) ||
          (address?.zipCode && address.zipCode.includes(lowerSearchTerm))
        );
      });
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  useEffect(() => {
    setLoading(true);
    const fetchUsers = async () => {
      try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, orderBy("timestamp", "desc"));
        const querySnap = await getDocs(q);
        let users = [];
        querySnap.forEach((doc) => {
          users.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setUsers(users);

        // Filter top agents (customizable criteria)
        const topAgents = users.filter(user => user.data.role === 'agent').slice(0, 5);
        setTopAgents(topAgents);

        setLoading(false);
      } catch (error) {
        toast.error("Insufficient permissions.");
        navigate("/");
      }
    };

    fetchUsers();
  }, [navigate]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % topAgents.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + topAgents.length) % topAgents.length);
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      {/* Background video */}
      <iframe
        className="absolute top-0 left-0 w-full h-full"
        src="https://www.youtube.com/embed/37ZwT0H67R8?autoplay=1&mute=1&controls=0&loop=1&playlist=37ZwT0H67R8&modestbranding=1&vq=hd2160&iv_load_policy=3&showinfo=0&rel=0"
        title="YouTube video player"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{
          width: "100vw",
          height: "100vh",
          position: "absolute",
          top: "0",
          left: "0",
          pointerEvents: "none",
        }}
      ></iframe>

      {/* Foreground content */}
      <div className="flex flex-col items-center justify-center text-center" style={{ position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: "100%" }}>
          {/* Search bar */}
          <form
            className="mt-6 mb-15 flex items-center"
            style={{
              maxWidth: "90%",
              marginLeft: "auto",
              marginRight: "auto",
              marginTop: "150px",
            }}
            onSubmit={handleSubmit}
          >
            <div className="px-3 relative" style={{ width: "456px", margin: "auto" }}>
              <input
                type="search"
                placeholder="Search agents by address or name"
                value={searchTerm}
                onChange={onChange}
                style={{
                  width: "100%",
                  boxShadow: "10px 10px 10px 0px rgba(1, 1, 0, 0), -10px -10px 10px 0px rgba(0, 0, 0, 0), 0px 10px 10px 0px rgba(0, 0, 0, 0), 0px -10px 10px 0px rgba(0, 0, 0, 0.6)",
                }}
                className="rounded-lg text-lg text-gray-700 bg-white border border-white hover:ring-1 transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-gray-300"
              />
            </div>
          </form>

          {/* Top Agents Carousel */}
          <div className="relative w-full mt-6">
            {/* Carousel wrapper */}
            <div className="relative h-56 overflow-hidden rounded-lg md:h-96">
              {topAgents.length > 0 ? (
                topAgents.map((agent, index) => (
                  <div
                    key={agent.id}
                    className={`absolute top-0 left-0 w-full h-full transition-transform duration-700 ease-in-out ${
                      index === currentSlide ? "translate-x-0" : "translate-x-full"
                    }`}
                  >
                    <Link to={`/viewProfile/${agent.id}`} className="block w-full h-full">
                      <img
                        src={agent.data.imageUrl || "default-image-url"}
                        className="absolute block w-full h-full object-cover"
                        alt={`${agent.data.name}'s profile`}
                      />
                      <div className="absolute bottom-0 left-0 w-full bg-gray-800 bg-opacity-50 text-white text-center py-2">
                        <h3 className="text-lg font-bold">{agent.data.name}</h3>
                      </div>
                    </Link>
                  </div>
                ))
              ) : (
                <p className="text-center text-white">No agents available</p>
              )}
            </div>

            {/* Slider controls */}
            <button
              type="button"
              className="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group"
              onClick={prevSlide}
            >
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50">
                <svg
                  className="w-4 h-4 text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 1L1 5l4 4"
                  />
                </svg>
                <span className="sr-only">Previous</span>
              </span>
            </button>
            <button
              type="button"
              className="absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group"
              onClick={nextSlide}
            >
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50">
                <svg
                  className="w-4 h-4 text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 9 4-4-4-4"
                  />
                </svg>
                <span className="sr-only">Next</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageUsersProfile;
