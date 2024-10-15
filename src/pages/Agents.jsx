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
                        {suggestion.data.name} - {suggestion.data.address?.city}
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
                  >
                    <Link to={`/viewProfile/${agent.id}`} className="block w-full h-full">
                      <img
                        src={agent.data.imageUrl || "default-image-url"}
                        className="absolute block w-full h-full object-cover filter grayscale"
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
                  style={{
                    filter: "drop-shadow(0 1px 3px rgba(0, 0, 0, 0.6))"
                  }}
                >
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 1 1 5l4 4" />
                </svg>
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
                  style={{
                    filter: "drop-shadow(0 1px 3px rgba(0, 0, 0, 0.6))"
                  }}
                >
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M1 1l4 4-4 4" />
                </svg>
              </span>
            </button>
          </div>
        </div>
        {/* Testimonials Section */}
<section className="bg-gradient-to-b from-white to-gray-200 dark:from-gray-800 dark:to-gray-900 mt-8 rounded-lg mb-5">
  <div className="max-w-screen-xl px-4 py-4 mx-auto text-center lg:py-6 lg:px-6">
    <figure className="max-w-screen-md mx-auto">
      <svg
        className="h-4 mx-auto mb-2 text-gray-400 dark:text-gray-600"
        viewBox="0 0 24 27"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M14.017 18L14.017 10.609C14.017 4.905 17.748 1.039 23 0L23.995 2.151C21.563 3.068 20 5.789 20 8H24V18H14.017ZM0 18V10.609C0 4.905 3.748 1.038 9 0L9.996 2.151C7.563 3.068 6 5.789 6 8H9.983L9.983 18L0 18Z"
          fill="currentColor"
        />
      </svg>
      <blockquote>
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          "Working with MNC Development has been a game changer for me. Their platform is not only efficient but also incredibly easy to use, allowing me to connect with clients faster than ever. The support from the team is top-notch, and they truly care about helping agents succeed. Since joining, I’ve closed more deals in the past six months than I did all of last year!"
        </p>
      </blockquote>
      <figcaption className="flex items-center justify-center mt-4 space-x-2">
        <img
          className="w-5 h-5 rounded-full"
          src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/michael-gouch.png"
          alt="profile picture"
        />
        <div className="flex items-center divide-x-2 divide-gray-500 dark:divide-gray-700">
          <div className="pr-2 text-xs font-medium text-gray-900 dark:text-white">
            Tareeka Kelly
          </div>
          <div className="pl-2 text-xs font-light text-gray-500 dark:text-gray-400">
            MNC Development Agent
          </div>
        </div>
      </figcaption>
    </figure>
  </div>
</section>

      
      </div>
      {/* Legal Section */}
<div className="relative z-20 justify-center items-center text-center mb-6 mx-3 flex flex-col max-w-6xl lg:mx-auto p-3 rounded shadow-lg bg-transparent text-white mt-10">
  <p className="text-white" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)' }}>info@mncdevelopment.com</p> {/* Apply text shadow here */}
  <div className="lg:flex lg:flex-row lg:justify-center lg:items-center lg:space-x-2">
    <div className="md:flex md:flex-row md:justify-center md:items-center md:space-x-2">
      <p className="text-white" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)' }}>All rights reserved.</p> {/* Apply text shadow here */}
      <span className="hidden md:block">|</span>
      <p className="text-white" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)' }}>© MNC Development, Inc. 2008-present.</p> {/* Apply text shadow here */}
    </div>
    <span className="hidden lg:block">|</span>
    <p className="text-white" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)' }}>31 Buffalo Avenue, Brooklyn, New York 11233</p> {/* Apply text shadow here */}
  </div>
  <div className="md:flex md:flex-row md:justify-center md:items-center md:space-x-2">
    <p className="text-white" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)' }}>Phone: 1-718-771-5811 or 1-877-732-3492</p> {/* Apply text shadow here */}
    <span className="hidden md:block">|</span>
    <p className="text-white" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)' }}>Fax: 1-877-760-2763 or 1-718-771-5900</p> {/* Apply text shadow here */}
  </div>
  <p className="text-justify text-white text-center" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)' }}>
    MNC Development and the MNC Development logos are trademarks of MNC Development, Inc. MNC Development, Inc. as a NYS licensed Real Estate Broker fully supports the principles of the Fair Housing Act and the Equal Opportunity Act. Listing information is deemed reliable, but is not guaranteed.
  </p>
</div>
    </div>
  );
};

export default ManageUsersProfile;
