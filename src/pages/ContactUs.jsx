import emailjs from "@emailjs/browser";
import React, { useRef, useState } from "react";
import ContactImage from "../assets/img/contact.jpeg";
import fetch from 'node-fetch';
// import { sendEmail } from "../../functions/server";

const ContactUs = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message2, setMessage] = useState("");
  const [sent, setSent] = useState("Send Message");
  const form = useRef();


  const contactUs = async(e) => {
    e.preventDefault();
    setSent("Sent!");

    // Send the form data to the server
    const subject = "Contact request";
    const to = "team@mncdevelopment.com";
    const phone2 = phone;
    const message = `Name: ${name}\nPhone: ${phone2}\nEmail: ${email}\nMessage: ${message2}`;

    try {
      const response = await fetch('https://us-central1-mnc-development.cloudfunctions.net/contactUs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ to, message, subject }),
      });
  
      if (response.ok) {
        console.log('Email sent successfully');
      } else {
        console.error('Failed to send email', response);
      }
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  return (
    <main
    className="h-[calc(100vh-48px)]"
    style={{
      backgroundImage: `url(${ContactImage})`,
      backgroundSize: "cover", // Ensures the image covers the entire background
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    }}
    >
      <h1 className="text-3xl text-center py-12 font-bold">Contact Us</h1>

      {/* Contact form */}
      <div className="max-w-md mx-auto bg-gray-100 rounded px-6 py-6">
        <form
          ref={form}
          onSubmit={contactUs}
        >
          <input
            placeholder="Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="text-lg w-full px-4 py-2 text-gray-700 bg-white border border-white shadow-md rounded transition duration-150 ease-in-out focus:shadow-lg focus:text-gray-700 focus:bg-white focus:border-gray-300 mb-6"
            required
          />

          <input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="text-lg w-full px-4 py-2 text-gray-700 bg-white border border-white shadow-md rounded transition duration-150 ease-in-out focus:shadow-lg focus:text-gray-700 focus:bg-white focus:border-gray-300 mb-6"
            required
          />

          <input
            placeholder="Phone Number"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="text-lg w-full px-4 py-2 text-gray-700 bg-white border border-white shadow-md rounded transition duration-150 ease-in-out focus:shadow-lg focus:text-gray-700 focus:bg-white focus:border-gray-300 mb-6"
            required
          />

          <textarea
            placeholder="Message"
            type="text"
            value={message2}
            onChange={(e) => setMessage(e.target.value)}
            className="text-lg w-full px-4 py-2 text-gray-700 bg-white border border-white shadow-md rounded transition duration-150 ease-in-out focus:shadow-lg focus:text-gray-700 focus:bg-white focus:border-gray-300 mb-6"
            required
          />

          <button
            type="submit"
            className="w-full px-7 py-3 bg-gray-600 text-white font-medium text-sm uppercase rounded shadow-md hover:bg-gray-700 hover:shadow-lg focus:bg-gray-600 focus:shadow-lg active:bg-gray-800 active:shadow-lg transition duration-150 ease-in-out"
          >
            {sent}
          </button>
        </form>
      </div>
      {/* Legal Section */}
<div className="relative z-20 justify-center items-center text-center mb-6 mx-3 flex flex-col max-w-6xl lg:mx-auto p-3 rounded shadow-lg bg-transparent text-white">
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
    </main>
  );
};

export default ContactUs;
