import { useState } from "react";

const Contact = ({ listing }) => {
  const [message, setMessage] = useState("");

  // Updates contact form when user types
  const onChange = (e) => {
    setMessage(e.target.value);
  };

  return (
    <div className="flex flex-col w-full">
      <p>Contact us for inquiries about this listing!</p>
      <div className="mt-3 mb-6">
        {/* Message input */}
        <textarea
          name="message"
          id="message"
          rows="2"
          value={message}
          onChange={onChange}
          placeholder={"Enter message"}
          className="w-full px-4 py-2 text-lg text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-gray-700"
        ></textarea>
      </div>

      {/* Submit message button */}
      <a
        href={`mailto:info@mncdevelopment.com?Subject=${listing.name}&body=${message}`}
      >
        <button
          type="button"
          className="px-7 py-3 bg-gray-600 text-white rounded font-medium text-sm uppercase shadow-md hover:bg-gray-700 hover:shadow-lg focus:bg-gray-700 focus:shadow-lg active:bg-gray-800 active:shadow-lg transition duration-150 ease-in-out w-full text-center mb-6"
        >
          Send Message
        </button>
      </a>
    </div>
  );
};

export default Contact;
