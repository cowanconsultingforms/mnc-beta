import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import { db } from "../firebase";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import agent from "../css/agent.css";


const Agents = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [topAgents, setTopAgents] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [slideDirection, setSlideDirection] = useState(null);
  const navigate = useNavigate();
  const carouselRef = useRef(null);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);
  

  const checkNumber = (number) => {
    if (number > topAgents.length - 1) return 0;
    if (number < 0) return topAgents.length - 1;
    return number;
  };

  const handleTouchStart = (e) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStartX - touchEndX > 50) {
      nextSlide();
    }

    if (touchStartX - touchEndX < -50) {
      prevSlide();
    }
  };

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
    setSlideDirection('next');
    setCurrentSlide((prev) => (prev + 1) % topAgents.length);
  };

  const prevSlide = () => {
    setSlideDirection('prev');
    setCurrentSlide((prev) => (prev - 1 + topAgents.length) % topAgents.length);
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      {/* Background video */}
      <iframe
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
              maxWidth: "456px",
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
                  width: "100%",
                  maxWidth: "456px",
                  boxShadow: "10px 10px 10px 0px rgba(1, 1, 0, 0), -10px -10px 10px 0px rgba(0, 0, 0, 0), 0px 10px 10px 0px rgba(0, 0, 0, 0), 0px -10px 10px 0px rgba(0, 0, 0, 0.6)",
                }}
                className="rounded-md text-lg text-gray-700 bg-white border border-white hover:ring-1 transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-gray-300"
              />
              {/* Suggestions */}
              {suggestions.length > 0 && (
                <div
                  className="absolute bg-white shadow-lg z-10 w-full mt-1 rounded-md"
                  style={{ width: "100%", maxWidth: "456px" }}
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
          {/* Agent Carousel */}
          <h1 className="mt-20 text-4xl font-bold text-white mb-6" style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.6)" }}>
            MNC Agents
          </h1>
          <div className="mb-20 relative w-full flex justify-center">
            <div
              className="relative h-80 overflow-hidden md:h-96 flex items-center w-full max-w-3xl"
              ref={carouselRef}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div
                className="flex transition-transform duration-700 ease-in-out w-full"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {topAgents.length > 0 ? (
                  topAgents.map((agent, index) => (
                    <div
                      key={agent.id}
                      className="w-full flex-shrink-0"
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    >
                      <Link to={`/viewProfile/${agent.id}`} className="block w-full h-full">
                        <div className="flex h-full transition-transform duration-300 items-center p-4 bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl shadow-2xl">
                          {/* Agent Picture */}
                          <div className="w-2/5 flex justify-center items-center">
                            <img
                              src={agent.data.imageUrl || "default-image-url"}
                              className="rounded-full w-32 h-32 md:w-40 md:h-40 object-cover filter grayscale"
                              alt={`${agent.data.name}'s profile`}
                            />
                          </div>
                          {/* Testimonial Section */}
                          <div className="w-3/5 flex flex-col justify-center items-center text-white text-center mr-10">
                            {agent.data.testimonial && (
                              <blockquote className="font-semibold italic text-sm md:text-lg flex justify-center items-center h-full">
                                “{agent.data.testimonial}”
                              </blockquote>
                            )}
                            <div className="w-full flex flex-col items-end justify-end mt-5">
                              <p className="text-sm font-semibold md:text-md mr-7"> {agent.data.name}</p>
                              <p className="text-xs font-semibold md:text-md mr-10">MNC Agent</p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))
                ) : (
                  <p className="text-white">No top agents available at the moment.</p>
                )}
              </div>

          {/* Navigation arrows */}
          <div className="hidden md:flex absolute top-1/2 left-0 transform -translate-y-1/2 p-2 cursor-pointer z-10" onClick={prevSlide}>
            <FaChevronLeft className="text-white text-4xl" />
          </div>
          <div className="hidden md:flex absolute top-1/2 right-0 transform -translate-y-1/2 p-2 cursor-pointer z-10" onClick={nextSlide}>
            <FaChevronRight className="text-white text-4xl" />
          </div>
        </div>
      </div>

          {/* Footer */}
          <footer
            className="fixed bottom-0 left-0 right-0 mt-auto justify-center items-center text-center mx-3 flex flex-col max-w-6xl lg:mx-auto p-3 rounded shadow-lg bg-transparent text-white"
            style={{ marginTop: "20px", maxHeight: "150px", overflowY: "auto" }}
          >
            <p className="text-white" style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.6)", fontSize: "0.9rem" }}>info@mncdevelopment.com</p>
            <div className="lg:flex lg:flex-row lg:justify-center lg:items-center lg:space-x-2">
              <div className="md:flex md:flex-row md:justify-center md:items-center md:space-x-2">
                <p className="text-white" style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.6)", fontSize: "0.9rem" }}>All rights reserved.</p>
                <span className="hidden md:block">|</span>
                <p className="text-white" style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.6)", fontSize: "0.9rem" }}>© MNC Development, Inc. 2008-present.</p>
              </div>
              <span className="hidden lg:block">|</span>
              <p className="text-white" style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.6)", fontSize: "0.9rem" }}>31 Buffalo Avenue, Brooklyn, New York 11233</p>
            </div>
            <div className="md:flex md:flex-row md:justify-center md:items-center md:space-x-2">
              <p className="text-white" style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.6)", fontSize: "0.9rem" }}>Phone: 1-718-771-5811 or 1-877-732-3492</p>
              <span className="hidden md:block">|</span>
              <p className="text-white" style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.6)", fontSize: "0.9rem" }}>Fax: 1-877-760-2763 or 1-718-771-5900</p>
            </div>
            <p className="text-center text-white" style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.6)", fontSize: "0.8rem" }}>
              MNC Development and the MNC Development logos are trademarks of MNC Development, Inc. MNC Development, Inc. as a NYS licensed Real Estate Broker fully supports the principles of the Fair Housing Act and the Equal Opportunity Act. Listing information is deemed reliable, but is not guaranteed.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Agents;