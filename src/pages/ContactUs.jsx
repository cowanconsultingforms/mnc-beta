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
      className="object-cover h-[calc(100vh-48px)]"
      style={{
        backgroundImage: `url(${ContactImage})`,
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
    </main>
  );
};

export default ContactUs;
