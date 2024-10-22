import emailjs from "@emailjs/browser";
import React, { useRef, useState } from "react";
import ContactImage from "../assets/img/contact.jpeg";
import fetch from 'node-fetch';
import { Field, Label, Switch } from '@headlessui/react';

const ContactUs = () => {
  const [agreed, setAgreed] = useState(false);
  const [name, setName] = useState(""); // Updated to a single name state
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message2, setMessage] = useState("");
  const [sent, setSent] = useState("Send Message");
  const form = useRef();
  const textareaRef = useRef(); // Reference for the textarea

  const contactUs = async (e) => {
    e.preventDefault();
    if (!agreed) {
      alert("You must agree to the privacy policy to proceed.");
      return;
    }

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

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
    adjustTextareaHeight();
  };

  const adjustTextareaHeight = () => {
    textareaRef.current.style.height = 'auto'; // Reset height to auto to shrink
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set height based on scroll height
  };

  return (
    <main
      className="flex flex-col min-h-screen relative"
      style={{
        backgroundImage: `url(${ContactImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <h1 className="text-3xl text-center pt-12 font-bold text-white" style={{ textShadow: "2px 2px 8px rgba(0, 0, 0, 0.6)" }}>
        Contact MNC Development
      </h1>
      <h2 className="text-2xl text-center pb-12 font-semibold text-white" style={{ textShadow: "2px 2px 8px rgba(0, 0, 0, 0.6)" }}>
        We value your feedback!
      </h2>

      {/* Contact form */}
      <div className="max-w-md mx-auto bg-gray-100 rounded-lg px-5 py-5 mb-6">
        <form ref={form} onSubmit={contactUs}>
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-1">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold leading-6 text-gray-900">Name</label>
              <div className="mt-2.5">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold leading-6 text-gray-900">Email</label>
              <div className="mt-2.5">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="phone-number" className="block text-sm font-semibold leading-6 text-gray-900">Phone number</label>
              <div className="relative mt-2.5">
                <input
                  id="phone-number"
                  name="phone-number"
                  type="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                  required
                />
              </div>
            </div>
            <div className="sm:col-span-1">
              <label htmlFor="message" className="block text-sm font-semibold leading-6 text-gray-900">Message</label>
              <div className="mt-2.5">
                <textarea
                  ref={textareaRef} // Attach ref to the textarea
                  id="message"
                  name="message"
                  rows={3} // Start with 1 row
                  value={message2}
                  onChange={handleMessageChange} // Update this to handle message change
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6 resize-none" // Prevent manual resizing
                  required
                />
              </div>
            </div>
            <Field className="flex gap-x-4 sm:col-span-1">
              <div className="flex h-6 items-center">
                <Switch
                  checked={agreed}
                  onChange={setAgreed}
                  className="group flex w-8 flex-none cursor-pointer rounded-full bg-gray-200 p-px ring-1 ring-inset ring-gray-900/5 transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600 data-[checked]:bg-gray-600"
                >
                  <span className="sr-only">Agree to policies</span>
                  <span
                    aria-hidden="true"
                    className="h-4 w-4 transform rounded-full bg-white shadow-sm ring-1 ring-gray-900/5 transition duration-200 ease-in-out group-data-[checked]:translate-x-3.5"
                  />
                </Switch>
              </div>
              <Label className="text-sm leading-6 text-gray-600">
                By selecting this, you agree to our{' '}
                <a href="#" className="font-semibold text-gray-600">
                  privacy&nbsp;policy
                </a>.
              </Label>
            </Field>
          </div>
          <div className="mt-10">
            <button
              type="submit"
              className="block w-full rounded-md bg-gray-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
            >
              {sent}
            </button>
          </div>
        </form>
      </div>

      {/* Legal Section as Footer */}
      <footer className="mt-auto justify-center items-center text-center mx-3 flex flex-col max-w-6xl lg:mx-auto p-3 rounded shadow-lg bg-transparent text-white">
        <p className="text-white" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)' }}>info@mncdevelopment.com</p>
        <div className="lg:flex lg:flex-row lg:justify-center lg:items-center lg:space-x-2">
          <div className="md:flex md:flex-row md:justify-center md:items-center md:space-x-2">
            <p className="text-white" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)' }}>All rights reserved.</p>
            <span className="hidden md:block">|</span>
            <p className="text-white" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)' }}>© MNC Development, Inc. 2008-present.</p>
          </div>
          <span className="hidden lg:block">|</span>
          <p className="text-white" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)' }}>31 Buffalo Avenue, Brooklyn, New York 11233</p>
        </div>
        <div className="md:flex md:flex-row md:justify-center md:items-center md:space-x-2">
          <p className="text-white" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)' }}>Phone: 1-718-771-5811 or 1-877-732-3492</p>
          <span className="hidden md:block">|</span>
          <p className="text-white" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)' }}>Fax: 1-877-760-2763 or 1-718-771-5900</p>
        </div>
        <p className="text-center text-white" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)' }}>
          MNC Development and the MNC Development logos are trademarks of MNC Development, Inc. MNC Development, Inc. as a NYS licensed Real Estate Broker fully supports the principles of the Fair Housing Act and the Equal Opportunity Act. Listing information is deemed reliable, but is not guaranteed.
        </p>
      </footer>
    </main>
  );
};

export default ContactUs;
