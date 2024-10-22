import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import { db } from "../firebase";

const ManageUsersProfile = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [topAgents, setTopAgents] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);
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
        agents.push({
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

        // Filter top agents
        const topAgents = users.filter(user => user.data.isTopAgent === true);
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
          position: "fixed",
          top: "0",
          left: "0",
          zIndex: "-1",
          pointerEvents: "none",
        }}
      ></iframe>

      {/* Foreground content */}
      <div className="flex flex-col items-center justify-start text-center" style={{ position: "relative", zIndex: 1, paddingTop: "100px" }}>
        <div style={{ maxWidth: "100%" }}>
          {/* Search bar */}
          <form
            className="mt-6 mb-15 flex items-center"
            style={{
              maxWidth: "456px", // Set the same width as the carousel
              marginLeft: "auto",
              marginRight: "auto",
            }}
            onSubmit={handleSubmit}
          >
            <div className="px-3 relative" style={{ width: "100%", margin: "auto" }}>
              <input
                type="search"
                placeholder="Search agents by address or name"
                value={searchTerm}
                onChange={onChange}
                style={{
                  width: "100%",  // Takes up the full width of the form
                  maxWidth: "456px", // Matches the carousel's width
                  boxShadow: "10px 10px 10px 0px rgba(1, 1, 0, 0), -10px -10px 10px 0px rgba(0, 0, 0, 0), 0px 10px 10px 0px rgba(0, 0, 0, 0), 0px -10px 10px 0px rgba(0, 0, 0, 0.6)"
                }}
                className="rounded-lg text-lg text-gray-700 bg-white border border-white hover:ring-1 transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-gray-300"
              />

              {/* Suggestions */}
              {suggestions.length > 0 && (
                <div
                  className="absolute bg-white shadow-lg z-10 w-full mt-1 rounded-lg"
                  style={{ width: "456px" }} // Consistent width with search input
                >
                  {suggestions.map((suggestion) => (
                    <Link
                      key={suggestion.id}
                      to={`/viewProfile/${suggestion.id}`}
                      onClick={() => setSearchTerm(suggestion.data.name)}
                    >
                      <div className="py-2 px-4 hover:bg-gray-200 cursor-pointer">
                      {suggestion.data.name} {suggestion.data.address?.city && `- ${suggestion.data.address.city}`} 
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </form>

          {/* Top Agents Carousel */}
          <div className="relative w-full mt-20 flex justify-center">
            <div className="relative h-56 overflow-hidden rounded-lg md:h-96" style={{ width: "456px" }}>
              {topAgents.length > 0 ? (
                topAgents.map((agent, index) => (
                  <div
                    key={agent.id}
                    className={`absolute top-0 left-0 w-full h-full transition-transform duration-700 ease-in-out ${
                      index === currentSlide ? "translate-x-0" : "translate-x-full"
                    }`}
                    onMouseEnter={() => setHoveredIndex(index)} // Set hovered index
                    onMouseLeave={() => setHoveredIndex(null)} // Clear hovered index
                  >
                    <Link to={`/viewProfile/${agent.id}`} className="block w-full h-full">
                      <img
                        src={agent.data.imageUrl || "default-image-url"}
                        className="absolute block w-full h-full object-cover filter grayscale"
                        alt={`${agent.data.name}'s profile`}
                        style={{
                          transform: hoveredIndex === index ? "scale(1.05)" : "scale(1)", // Scale up on hover
                          transition: "transform 0.3s",
                        }}
                      />
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                        <h3 className="text-xl font-bold">{agent.data.name}</h3>
                        <p className="text-lg">{agent.data.title}</p>
                      </div>
                    </Link>
                  </div>
                ))
              ) : (
                <div className="text-white">No top agents available.</div>
              )}
            </div>
            <button onClick={prevSlide} className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full">
              &lt;
            </button>
            <button onClick={nextSlide} className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full">
              &gt;
            </button>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-white">Testimonials</h2>
          {/* Add testimonial content here */}
        </div>

        {/* Legal Information Section */}
        <div className="mt-5">
          <p className="text-white">Legal information content goes here.</p>
        </div>
      </div>
    </div>
  );
};

export default ManageUsersProfile;
