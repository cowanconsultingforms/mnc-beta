import emailjs from "@emailjs/browser";
import React, { useRef, useState, Fragment } from "react";
import ContactImage from "../assets/img/contact.jpeg";
import fetch from 'node-fetch';
import { Field, Label, Switch, Transition, Dialog } from '@headlessui/react';

const ContactUs = () => {
  const [agreed, setAgreed] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message2, setMessage] = useState("");
  const [sent, setSent] = useState("Send Message");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const form = useRef();
  const textareaRef = useRef();

  const contactUs = async (e) => {
    e.preventDefault();
    if (!agreed) {
      alert("You must agree to the privacy policy to proceed.");
      return;
    }

    setSent("Sent!");
    const subject = "Contact request";
    const to = "team@mncdevelopment.com";
    const message = `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\nMessage: ${message2}`;

    try {
      const response = await fetch('https://us-central1-mnc-development.cloudfunctions.net/contactUs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
    textareaRef.current.style.height = 'auto';
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
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
        Contact Us
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
                  ref={textareaRef}
                  id="message"
                  name="message"
                  rows={3}
                  value={message2}
                  onChange={handleMessageChange}
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6 resize-none"
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
                <button type="button" className="font-semibold text-gray-600 underline" onClick={() => setIsDialogOpen(true)}>
                  privacy&nbsp;policy
                </button>.
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

      {/* Privacy Policy Dialog */}
      <Transition appear show={isDialogOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsDialogOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all mt-12">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    Privacy Policy
                  </Dialog.Title>
                  <div className="mt-2 space-y-4 text-xs text-gray-500">
                  <p><strong>Who we are</strong><br />
                    Suggested text: Our website address is: <a href="https://www.mncdevelopment.com" className="underline text-gray-600">https://www.mncdevelopment.com</a>.
                  </p>

                  <p><strong>Comments</strong><br />
                    When visitors leave comments on the site we may collect the data shown in the comments form, and also the visitor’s IP address and browser user agent string to help spam detection.
                  </p>

                  <p>An anonymized string created from your email address (also called a hash) may be provided to the Gravatar service to see if you are using it. The Gravatar service privacy policy is available here: <a href="https://automattic.com/privacy/" className="underline text-gray-600">https://automattic.com/privacy/</a>. After approval of your comment, your profile picture may be visible to the public in the context of your comment.
                  </p>

                  <p><strong>Media</strong><br />
                    If you upload images to the website, you should avoid uploading images with embedded location data (EXIF GPS) included. Visitors to the website can download and extract any location data from images on the website.
                  </p>

                  <p><strong>Cookies</strong><br />
                    If you leave a comment on our site you may opt-in to saving your name, email address, and website in cookies. These are for your convenience so that you do not have to fill in your details again when you leave another comment. These cookies may last for one year.
                  </p>

                  <p>If you visit our login page, we may set a temporary cookie to determine if your browser accepts cookies. This cookie contains no personal data and is discarded when you close your browser.
                  </p>

                  <p>When you log in, we may also set up several cookies to save your login information and your screen display choices. Login cookies may last for two days, and screen options cookies may last for a year. If you select “Remember Me”, your login may persist for two weeks. If you log out of your account, the login cookies may be removed.
                  </p>

                  <p>If you edit or publish an article, an additional cookie may be saved in your browser. This cookie includes no personal data and simply indicates the post ID of the article you just edited. It may expire after 1 day.
                  </p>

                  <p><strong>Embedded content from other websites</strong><br />
                    Articles on this site may include embedded content (e.g., videos, images, articles, etc.). Embedded content from other websites behaves in the exact same way as if the visitor has visited the other website.
                  </p>

                  <p>These websites may collect data about you, use cookies, embed additional third-party tracking, and monitor your interaction with that embedded content, including tracking your interaction with the embedded content if you have an account and are logged in to that website.
                  </p>

                  <p><strong>Who we share your data with</strong><br />
                    If you request a password reset, your IP address may be included in the reset email.
                  </p>

                  <p><strong>How long we retain your data</strong><br />
                    If you leave a comment, the comment and its metadata may be retained indefinitely. This is so we can recognize and approve any follow-up comments automatically instead of holding them in a moderation queue.
                  </p>

                  <p>For users that register on our website (if any), we also store the personal information they provide in their user profile. Some users may see, edit, or delete their personal information at any time (except they cannot change their username). Website administrators can also see and edit that information.
                  </p>

                  <p><strong>What rights you have over your data</strong><br />
                    If you have an account on this site, or have left comments, you can request to receive an exported file of the personal data we hold about you, including any data you have provided to us. You can also request that we erase any personal data we hold about you. This does not include any data we are obliged to keep for administrative, legal, or security purposes.
                  </p>

                  <p><strong>Where your data is sent</strong><br />
                    Visitor comments may be checked through an automated spam detection service.
                  </p>
                </div>
                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-600 focus-visible:ring-offset-2"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Close
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

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
