import React, { useState, Fragment } from "react";
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { Link } from "react-router-dom";
import "../css/faq.css";
import { Dialog, Transition } from "@headlessui/react";
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';


function FAQPage() {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [openDialog, setOpenDialog] = useState(null);
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser ? auth.currentUser.uid : null;
  const [showModal, setShowModal] = useState(false);

  const handleStripeLinkClick = (e) => {
    if (!user) {
      e.preventDefault(); // Prevent navigation
      setShowModal(true); // Show the popup
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const faqData = [
    {
      question: "How to sign in?",
      answer: "To sign in, click on this link: ",
      link: "/sign-in",
      linkText: "Sign In",
    },
    {
      question: "How to register?",
      answer: "To register, click on this link: ",
      link: "/sign-up",
      linkText: "Register",
    },
    {
      question: "How to search for housing?",
      answer: "To search for houses, click on this link: ",
      link: "/",
      linkText: "Houses",
    },
    {
      question: "How to search for agents?",
      answer: "To search for agents, click on this link: ",
      link: "/agents",
      linkText: "Search Agents",
    },
    {
      question: "What are VIP listings?",
      answer: "A VIP listing is an off-market listing that can be shared by an agent directly with their colleagues and their buyers to help VIP clients SELL privately. Property details aren't disseminated widely and won't appear on public home search websites. Or, VIP users have exclusive access to these listings to BUY or RENT.",
    },
    {
      question: "Why should I pay for a 'VIP' subscription?",
      answer: "As a paid VIP subscriber:\n\n1) Be the first to browse exclusive listings to RENT or BUY before they hit the market.\n2) SELL your home while maintaining your privacy. Listing your home as a private exclusive allows you to control what information is shared about you and your home while still getting exposure to top agents at MNC Development. A private exclusive listing is an off-market home that can be shared by an agent directly with their colleagues and their buyers. Property details aren't disseminated widely and won't appear on public home search websites.\n\nDiscretion: Privacy is the ultimate commodity and the decision to sell your home is a personal one.\nFlexibility: Decide when to share details about your home, including price, more broadly on your own timing.\nQuality: Retain exposure to Compass agents, including premium placement on our agent facing platform.\nValue: Get the best offer by testing the market privately to gather key insights without your listing getting stale.\n\nReasons why you might choose to sell your home as a private exclusive:\nNew job or relocation\nFamily changes like marriage or divorce\nEvolving financial circumstances\nHealth issues\nValuable belongings like art or furniture\nOpposition to holding open houses.\n\nContact us now for pricing.",
    },
    {
      question: "What's the step-by-step procedure to obtain the VIP membership?",
      answer: (
        <>
          <p className="mb-4 text-lg text-gray-700">
            If interested in a VIP subscription, register for a normal user account, if you have not done so already 
            (<a 
              href="/sign-up" 
              target="_blank" 
              className="text-blue-600 hover:underline"
            >
              sign up
            </a>). Then email us for a VIP subscription quote
            (<a 
              href="mailto:team@mncdevelopment.com" 
              className="text-blue-600 hover:underline"
            >
              team@mncdevelopment.com
            </a>). 
            Then you must pay the requisite fee via Zelle or Stripe:
          </p>
          <ol className="list-decimal ml-6 mb-4 text-gray-700">
            <li className="mb-4">
              Pay the agreed yearly VIP membership fee via Zelle at 
              <span className="font-semibold text-gray-900"> mncdevelopmentapartments@gmail.com</span>. 
              In the memo of the Zelle transfer, type: 
              <span className="font-medium italic"> VIP yearly membership fee</span>. 
              Within 48 hours of receipt of the Zelle payment, an admin will change your regular user account to 
              <span className="font-semibold"> 'VIP'</span>.
            </li>
            <li>
              Pay the agreed yearly VIP membership fee via {' '}
              <a 
                href="/payments/:uid"
                onClick={handleStripeLinkClick} // Check authentication on click
                className="text-blue-600 hover:underline"
              >
                Stripe
              </a>.
              In the memo section of the Stripe transfer, type: 
              <span className="font-medium italic"> VIP yearly membership fee</span>. 
              Within 48 hours of receipt of the Stripe payment, an admin will change your regular user account to 
              <span className="font-semibold"> 'VIP'</span>.
            </li>
          </ol>

          {/* Popup Given If User Not Logged In and Attempts to Access Stripe Payment Page */}
          {showModal && (
            <div
              className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
              role="dialog"
              aria-live="polite"
            >
              <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
                <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center justify-center">
                  <span className="mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v6m0 0a2 2 0 01-2-2v-4m4 0v4a2 2 0 01-2 2zm-8-6V7a4 4 0 018-0v2a4 4 0 01-8 0z" />
                    </svg>
                  </span>
                  Access Restricted
                </h2>
                <p className="text-gray-600 mb-6">
                  You must be logged in to access the Stripe payment page. Please log in and try again.
                </p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => window.location.href = '/login'} // Redirect to login page
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Log In
                  </button>
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      ),
    },
  ];

  const handleClick = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };
  
  const openPolicyDialog = (policy) => {
    setOpenDialog(policy);
  };

  const closePolicyDialog = () => {
    setOpenDialog(null);
  };

  return (
    <div className="relative font-semibold text-gray-900">
      {/* Video Background */}
      <div className="fixed top-0 left-0 w-full h-full z-0 overflow-hidden">
        <iframe
          className="absolute top-0 left-0 w-full h-full"
          src="https://www.youtube.com/embed/YWGfcrqXo50?si=8khE0ad0Tpc1Uzaw&autoplay=1&mute=1&controls=0&loop=1&playlist=YWGfcrqXo50&modestbranding=1&vq=hd2160&iv_load_policy=3&showinfo=0&rel=0"
          title="YouTube video player"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{
            width: '100vw',
            height: '100vh',
            position: 'absolute',
            top: '0',
            left: '0',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* FAQ Content */}
      <div className="relative z-10 flex flex-col items-center justify-center p-4 min-h-screen">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-[10px_10px_30px_rgba(0,0,0,0.2)] overflow-auto">
          {faqData.map((item, index) => (
            <div key={index} className="py-2">
              <button
                onClick={() => handleClick(index)}  
                className="flex w-full items-center justify-between p-4 text-lg font-medium text-gray-800 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none"
              >
                <span>{item.question}</span>
                <ChevronDownIcon
                  className={`w-5 h-5 text-gray-500 transition-transform duration-300 
                    ${expandedIndex === index ? "transform rotate-180" : ""}
                  `}
                />
              </button>
              {expandedIndex === index && (
                <div className="p-4 text-gray-600">
                  {item.answer}
                  {item.link && (
                    <Link
                      to={item.link}
                      className="text-blue-500 underline ml-1"
                    >
                      {item.linkText}
                    </Link>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Legal Buttons */}
          <div className="mt-6 flex justify-around">
            <button
              onClick={() => openPolicyDialog('privacy')}
              className="px-4 py-2 text-gray-800 font-medium bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => openPolicyDialog('terms')}
              className="px-4 py-2 text-gray-800 font-medium bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Terms of Service
            </button>
            <button
              onClick={() => openPolicyDialog('copyright')}
              className="px-4 py-2 text-gray-800 font-medium bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Copyright
            </button>
          </div>
        </div>
      </div>

      {/* Policy Dialog */}
      <Transition appear show={openDialog !== null} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closePolicyDialog}>
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
                <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all mt-12">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    {openDialog === 'privacy' && 'Privacy Policy'}
                    {openDialog === 'terms' && 'Terms of Service'}
                    {openDialog === 'copyright' && 'Copyright'}
                  </Dialog.Title>
                  <div className="mt-2 space-y-4 text-xs text-gray-500">
                    {/* Privacy Policy Content */}
                    {openDialog === 'privacy' && (
                      <><p><strong>Who we are</strong><br />
                        Suggested text: Our website address is: <a href="https://www.mncdevelopment.com" className="underline text-gray-600">https://www.mncdevelopment.com</a>.
                      </p><p><strong>Comments</strong><br />
                          When visitors leave comments on the site we may collect the data shown in the comments form, and also the visitor’s IP address and browser user agent string to help spam detection.
                        </p><p>An anonymized string created from your email address (also called a hash) may be provided to the Gravatar service to see if you are using it. The Gravatar service privacy policy is available here: <a href="https://automattic.com/privacy/" className="underline text-gray-600">https://automattic.com/privacy/</a>. After approval of your comment, your profile picture may be visible to the public in the context of your comment.
                        </p><p><strong>Media</strong><br />
                          If you upload images to the website, you should avoid uploading images with embedded location data (EXIF GPS) included. Visitors to the website can download and extract any location data from images on the website.
                        </p><p><strong>Cookies</strong><br />
                          If you leave a comment on our site you may opt-in to saving your name, email address, and website in cookies. These are for your convenience so that you do not have to fill in your details again when you leave another comment. These cookies may last for one year.
                        </p><p>If you visit our login page, we may set a temporary cookie to determine if your browser accepts cookies. This cookie contains no personal data and is discarded when you close your browser.
                        </p><p>When you log in, we may also set up several cookies to save your login information and your screen display choices. Login cookies may last for two days, and screen options cookies may last for a year. If you select “Remember Me”, your login may persist for two weeks. If you log out of your account, the login cookies may be removed.
                        </p><p>If you edit or publish an article, an additional cookie may be saved in your browser. This cookie includes no personal data and simply indicates the post ID of the article you just edited. It may expire after 1 day.
                        </p><p><strong>Embedded content from other websites</strong><br />
                          Articles on this site may include embedded content (e.g., videos, images, articles, etc.). Embedded content from other websites behaves in the exact same way as if the visitor has visited the other website.
                        </p><p>These websites may collect data about you, use cookies, embed additional third-party tracking, and monitor your interaction with that embedded content, including tracking your interaction with the embedded content if you have an account and are logged in to that website.
                        </p><p><strong>Who we share your data with</strong><br />
                          If you request a password reset, your IP address may be included in the reset email.
                        </p><p><strong>How long we retain your data</strong><br />
                          If you leave a comment, the comment and its metadata may be retained indefinitely. This is so we can recognize and approve any follow-up comments automatically instead of holding them in a moderation queue.
                        </p><p>For users that register on our website (if any), we also store the personal information they provide in their user profile. Some users may see, edit, or delete their personal information at any time (except they cannot change their username). Website administrators can also see and edit that information.
                        </p><p><strong>What rights you have over your data</strong><br />
                          If you have an account on this site, or have left comments, you can request to receive an exported file of the personal data we hold about you, including any data you have provided to us. You can also request that we erase any personal data we hold about you. This does not include any data we are obliged to keep for administrative, legal, or security purposes.
                        </p><p><strong>Where your data is sent</strong><br />
                          Visitor comments may be checked through an automated spam detection service.
                        </p></>
                    )}
                    {/* Terms of Service Content */}
                    {openDialog === 'terms' && (
                      <><p>Last updated: December 15, 2023</p><h4 className="font-semibold">What’s in these terms?</h4><p>
                        This index is designed to help you understand some of the key updates we’ve made to our Terms of Service (Terms). We hope this serves as a useful guide, but please ensure you read the Terms in full.
                      </p><h4 className="font-semibold">Welcome to MNC DEVELOPMENT and MNC DEVELOPMENT-VIP!</h4><p>
                          This section outlines our relationship with you. It includes a description of the Service, defines our Agreement, and names your service provider.
                        </p><h4 className="font-semibold">Who May Use the Service?</h4><p>
                          This section sets out certain requirements for use of the Service, and defines categories of users.
                        </p><h4 className="font-semibold">Your Use of the Service</h4><p>
                          This section explains your rights to use the Service, and the conditions that apply to your use of the Service. It also explains how we may make changes to the Service.
                        </p><h4 className="font-semibold">Your Content and Conduct</h4><p>
                          This section applies to users who provide Content to the Service. It defines the scope of the permissions that you grant by uploading your Content, and includes your agreement not to upload anything that infringes on anyone else’s rights.
                        </p><h4 className="font-semibold">Account Suspension and Termination</h4><p>
                          This section explains how you, MNC DEVELOPMENT and MNC DEVELOPMENT-VIP may terminate this relationship.
                        </p><h4 className="font-semibold">About Software in the Service</h4><p>
                          This section includes details about software on the Service.
                        </p><h4 className="font-semibold">Other Legal Terms</h4><p>
                          This section includes our service commitment to you. It also explains that there are some things we will not be responsible for.
                        </p><h4 className="font-semibold">About this Agreement</h4><p>
                          This section includes some further important details about our contract, including what to expect if we need to make changes to these Terms; or which law applies to them.
                        </p><h4 className="font-semibold">TERMS OF SERVICE</h4><p>
                          Welcome to MNC DEVELOPMENT and MNC DEVELOPMENT-VIP!
                        </p><h4 className="font-semibold">Introduction</h4><p>
                          Thank you for using the MNC DEVELOPMENT and MNC DEVELOPMENT-VIP platform and the products, services, and features we make available to you as part of the platform (collectively, the “Service”).
                        </p><h4 className="font-semibold">Our Service</h4><p>
                          The Service allows you to discover, watch and share videos and other content, provides a forum for people to connect, inform, and inspire others across the globe, and acts as a distribution platform for original content creators and advertisers large and small. We provide lots of information about our products and how to use them in our FAQ section. Among other things, you can find out about MNC DEVELOPMENT and MNC DEVELOPMENT-VIP paid memberships and purchases (where available) and more. You can also read all about enjoying content on other devices like your television, your games console, etc.
                        </p><h4 className="font-semibold">Your Service Provider</h4><p>
                          The entity providing the Service is MNC DEVELOPMENT, LLC, a company operating under the laws of New York, located at 31 Buffalo Avenue, Brooklyn, NY 11233 (referred to as “MNC DEVELOPMENT, MNC DEVELOPMENT-VIP and/or Assigns”, “we”, “us”, or “our”). References to MNC DEVELOPMENT, MNC DEVELOPMENT-VIP and/or Assigns’s “Affiliates” in these terms means the other companies within our affiliate corporate group (now or in the future).
                        </p><h4 className="font-semibold">Applicable Terms</h4><p>
                          Your use of the Service is subject to these terms, and any other rules promulgated by this firm which may be updated from time to time (together, this “Agreement”). Your Agreement with us will also include any Advertising on MNC DEVELOPMENT, MNC DEVELOPMENT-VIP and/or Assigns additional agreement we may share if you provide advertising or sponsorships to the Service or incorporate paid promotions in your content. Any agreement outside of this for advertisement may take precedence over this agreement at MNC DEVELOPMENT and/or MNC DEVELOPMENT’s sole discretion. Any other links or references provided in the terms herein are for informational use only and are not part of the Agreement.
                        </p><p>
                          Please read this Agreement carefully and make sure you understand it. If you do not understand the Agreement, or do not accept any part of it, then you may not use the Service.
                        </p><h4 className="font-semibold">Who may use the Service?</h4><h5 className="font-semibold">Age Requirements</h5><p>
                          You must be at least 13 years old to use the Service; however, children of all ages may use the Service and MNC DEVELOPMENT, MNC DEVELOPMENT-VIP and/or Assigns Kids (where available) if enabled by a parent or legal guardian.
                        </p><h5 className="font-semibold">Permission by Parent or Guardian</h5><p>
                          If you are under 18, you represent that you have your parent or guardian’s permission to use the Service. Please have them read this Agreement with you.
                        </p><p>
                          If you are a parent or legal guardian of a user under the age of 18, by allowing your child to use the Service, you are subject to the terms of this Agreement and responsible for your child’s activity on the Service. You can find tools and resources to help you manage your family’s experience on MNC DEVELOPMENT, MNC DEVELOPMENT-VIP and/or Assigns (including how to enable a child under the age of 13 to use the Service and MNC DEVELOPMENT, MNC DEVELOPMENT-VIP and/or Assigns Kids) in our FAQ section.
                        </p><h5 className="font-semibold">Businesses </h5><p>
                          If you are using the Service on behalf of a company or organization, you represent that you have authority to act on behalf of that entity, and that such entity accepts this Agreement.
                        </p><h4 className="font-semibold">Your Use of the Service</h4><h5 className="font-semibold">Content on the Service</h5><p>
                          The content on the Service includes videos, audio (for example, music and other sounds), graphics, photos, text (such as comments and scripts), branding (including trade names, trademarks, service marks, or logos), interactive features, software, metrics, and other materials whether provided by you, MNC DEVELOPMENT, MNC DEVELOPMENT-VIP and/or Assigns or a third-party (collectively, “Content”).
                        </p><p>
                          Content is the responsibility of the person or entity that provides it to the Service. MNC DEVELOPMENT, MNC DEVELOPMENT-VIP and/or Assigns is under no obligation to host or serve Content. If you see any Content you believe does not comply with this Agreement, including by violating the below community guidelines or the law, you can report it to us:
                        </p><ul className="list-disc pl-8">
                          <li>Spam & deceptive practices</li>
                          <li>Fake engagement</li>
                          <li>Impersonation</li>
                          <li>External links</li>
                          <li>Spam, deceptive practices & scams</li>
                          <li>Playlists</li>
                          <li>Sensitive content</li>
                          <li>Child safety</li>
                          <li>Thumbnails</li>
                          <li>Nudity and sexual content</li>
                          <li>Suicide and self-harm</li>
                          <li>Vulgar language</li>
                          <li>Violent or dangerous content</li>
                          <li>Harassment and cyberbullying</li>
                          <li>Harmful or dangerous content</li>
                          <li>Hate speech</li>
                          <li>Violent criminal organizations</li>
                          <li>Violent or graphic content</li>
                          </ul>

                        <p>MNC DEVELOPMENT and MNC DEVELOPMENT-VIP in their sole discretion will determine if a user has violated our community guidelines and take appropriate action where necessary.Accounts and MNC DEVELOPMENT, MNC DEVELOPMENT-VIP and/or Assigns Channels
                          You can use parts of the MNC DEVELOPMENT Service, such as browsing and searching for Content, without having a VIP account.
                          However, you do need a VIP account to use some features. With a VIP account, you may be able to like videos, subscribe to channels, create your own  MNC DEVELOPMENT-VIP channel, and more.
                          Creating a MNC DEVELOPMENT, MNC DEVELOPMENT-VIP and/or Assigns channel may give you access to additional features and functions, such as uploading videos, making comments or creating playlists (where available).
                          To protect your account, keep your password confidential. You should not reuse your  account password on third-party applications.
                        </p>

                        <h5 className="font-semibold">Your Information</h5>
                        <p>
                          We take steps to ensure that your information is treated securely and in accordance with this Privacy Notice. Unfortunately, no system is 100% secure, and we cannot ensure or warrant the security of any information you provide to us. The files and records containing your personal information will be kept in our offices and/or on our servers or those of our service providers, and only those employees that require it for the purposes of their duties will have access to this file. 
                          To the fullest extent permitted by applicable law, we do not accept liability for unauthorized disclosure. By using our Services or providing personal information to us, you agree that we may communicate with you electronically regarding security, privacy, and administrative issues relating to your use of our Services.
                          If we learn of a breach of security that impacts your personal information, we may attempt to notify you electronically by posting a notice on our Services, by mail, or by sending an email to you. 
                          Also, we store personal information we collect as described in this Privacy Notice for as long as you use our Services, or as necessary to fulfill the purpose(s) for which it was collected, provide our Services, resolve disputes, establish legal defenses, conduct audits, pursue legitimate business purposes, enforce our agreements, and comply with applicable laws.
                        </p>
                        <h5 className="font-semibold">Permissions and Restrictions</h5>
                        <p>
                          You may access and use the Service as made available to you, as long as you comply with this Agreement and applicable law. You may view or listen to Content for your personal, non-commercial use. The following restrictions apply to your use of the Service. You are not allowed to:
                        </p>
                        <ul className="list-disc pl-8">
                          <li>
                            Access, reproduce, download, distribute, transmit, broadcast, display, sell, license, alter, modify or otherwise use any part of the Service or any Content except: (a) as expressly authorized by the Service; or (b) with prior written permission from MNC DEVELOPMENT, MNC DEVELOPMENT-VIP, and/or assigns, and, if applicable, the respective rights holders.
                          </li>
                          <li>
                            Circumvent, disable, fraudulently engage with, or otherwise interfere with any part of the Service (or attempt to do any of these things), including security-related features or features that (a) prevent or restrict the copying or other use of Content or (b) limit the use of the Service or Content.
                          </li>
                          <li>
                            Access the Service using any automated means (such as robots, botnets, or scrapers) except (a) in the case of public search engines, in accordance with MNC DEVELOPMENT, MNC DEVELOPMENT-VIP, and/or assigns’ robots.txt file; or (b) with MNC DEVELOPMENT, MNC DEVELOPMENT-VIP, and/or assigns’ prior written permission.
                          </li>
                          <li>
                            Collect or harvest any information that might identify a person (for example, usernames or faces), unless permitted by that person or allowed under section (3) above.
                          </li>
                          <li>
                            Use the Service to distribute unsolicited promotional or commercial content or other unwanted or mass solicitations.
                          </li>
                          <li>
                            Cause or encourage any inaccurate measurements of genuine user engagement with the Service, including by paying people or providing them with incentives to increase a video’s views, likes, or dislikes, or to increase a channel’s subscribers, or otherwise manipulate metrics in any manner.
                          </li>
                          <li>
                            Misuse any reporting, flagging, complaint, dispute, or appeals process, including by making groundless, vexatious, or frivolous submissions.
                          </li>
                          <li>
                            Run contests on or through the Service that do not comply with MNC DEVELOPMENT, MNC DEVELOPMENT-VIP, and/or assigns’ contest policies and guidelines.
                          </li>
                          <li>
                            Use the Service to view or listen to Content other than for personal, non-commercial use (for example, you may not publicly screen videos or stream music from the Service); or use the Service to (a) sell any advertising, sponsorships, or promotions placed on, around, or within the Service or Content, other than those allowed in the Advertising on MNC DEVELOPMENT, MNC DEVELOPMENT-VIP, and/or assigns policies (such as compliant product placements); or (b) sell advertising, sponsorships, or promotions on any page of any website or application that only contains Content from the Service or where Content from the Service is the primary basis for such sales (for example, selling ads on a webpage where MNC DEVELOPMENT, MNC DEVELOPMENT-VIP, and/or assigns videos are the main draw for users visiting the webpage).
                          </li>
                        </ul>
                        <h5 className="font-semibold">Reservation</h5>
                        <p>Using the Service does not give you ownership of or rights to any aspect of the Service, including user names or any other Content posted by others or MNC DEVELOPMENT, MNC DEVELOPMENT-VIP and/or Assigns .</p>
                        <h5 className="font-semibold">Develop, Improve and Update the Service</h5>
                        <p>MNC DEVELOPMENT, MNC DEVELOPMENT-VIP and/or Assigns  is constantly changing and improving the Service. As part of this continual evolution, we may make modifications or changes (to all or part of the Service) such as adding or removing features and functionalities, offering new digital content or services or discontinuing old ones. We may also need to alter or discontinue the Service, or any part of it, in order to make performance or security improvements, make changes to comply with law, or prevent illegal activities on or abuse of our systems.
                          These changes may affect all users, some users or even an individual user. When the Service requires or includes downloadable software, that software may update automatically on your device once a new version or feature is available, subject to your device settings.
                          If we make material changes that negatively impact your use of the Service, we’ll provide you with reasonable advance notice, except in urgent situations such as preventing abuse, responding to legal requirements, or addressing security and operability issues.
                          We’ll also provide you with an opportunity to export your content from your account, subject to applicable law and policies.
                        </p>
                        <h5 className="font-semibold">Your Content and Conduct</h5>
                        <h4 className="font-semibold">Uploading Content</h4>
                        <p>If you have a MNC DEVELOPMENT, MNC DEVELOPMENT-VIP and/or Assigns  channel, you may be able to upload Content to the Service. You may use your Content to promote your business or artistic enterprise. 
                          If you choose to upload Content, you must not submit to the Service any Content that does not comply with this Agreement or the law. For example, the Content you submit must not include third-party intellectual property (such as copyrighted material) unless you have permission from that party or are otherwise legally entitled to do so.
                          You are legally responsible for the Content you submit to the Service. We may use automated systems that analyze your Content to help detect infringement and abuse, such as spam, malware, and illegal content.
                        </p>
                        <h4 className="font-semibold">Rights you Grant</h4>
                        <p>You retain ownership rights in your Content. However, we do require you to grant certain rights to MNC DEVELOPMENT, MNC DEVELOPMENT-VIP and/or Assigns  and other users of the Service, as described below.</p>
                        <h4 className="font-semibold">License to MNC DEVELOPMENT, MNC DEVELOPMENT-VIP and/or Assigns</h4>
                        <p>By providing Content to the Service, you grant to MNC DEVELOPMENT, MNC DEVELOPMENT-VIP and/or Assigns  a worldwide, non-exclusive, royalty-free, sublicensable and transferable license to use that Content (including to reproduce, distribute, prepare derivative works, display and perform it) in connection with the Service and MNC DEVELOPMENT, MNC DEVELOPMENT-VIP and/or Assigns ’s (and its successors’ and Affiliates’) business, including for the purpose of promoting and redistributing part or all of the Service.
                        </p>
                        <h4 className="font-semibold">License to Other Users</h4>
                        <p>You also grant each other user of the Service a worldwide, non-exclusive, royalty-free license to access your Content through the Service, and to use that Content, including to reproduce, distribute, prepare derivative works, display, and perform it, only as enabled by a feature of the Service (such as video playback or embeds). For clarity, this license does not grant any rights or permissions for a user to make use of your Content independent of the Service.
                        </p>
                        <h4 className="font-semibold">Duration of License</h4>
                        <p>The licenses granted by you continue for a commercially reasonable period of time after you remove or delete your Content from the Service. You understand and agree, however, that MNC DEVELOPMENT, MNC DEVELOPMENT-VIP and/or Assigns  may retain, but not display, distribute, or perform, server copies of your videos that have been removed or deleted.</p>
                        <h4 className="font-semibold">Right to Monetize</h4>
                        <p>You grant to MNC DEVELOPMENT, MNC DEVELOPMENT-VIP and/or Assigns the right to monetize your Content on the Service (and such monetization may include displaying ads on or within Content or charging users a fee for access). This Agreement does not entitle you to any payments. Starting March 18, 2024, any payments you may be entitled to receive from MNC DEVELOPMENT, MNC DEVELOPMENT-VIP and/or Assigns  under any other agreement between you and MNC DEVELOPMENT, MNC DEVELOPMENT-VIP and/or Assigns  (including for example payments under the MNC DEVELOPMENT, MNC DEVELOPMENT-VIP and/or Assigns  Partner Program, Channel memberships or Super Chat) will be treated as royalties.  If required by law, Google will withhold taxes from such payments.</p>
                        <h4 className="font-semibold">Removing Your Content</h4>
                        <p>You may remove your Content from the Service at any time. You also have the option to make a copy of your Content before removing it. You must remove your Content if you no longer have the rights required by these terms.</p>
                        <h4 className="font-semibold">Removal of Content By MNC DEVELOPMENT, MNC DEVELOPMENT-VIP and/or Assigns</h4>
                        <p>If any of your Content (1) is in breach of this Agreement or (2) may cause harm to MNC DEVELOPMENT, MNC DEVELOPMENT-VIP and/or Assigns , our users, or third parties, we reserve the right to remove or take down some or all of such Content in our discretion. We will notify you with the reason for our action unless we reasonably believe that to do so: (a) would breach the law or the direction of a legal enforcement authority or would otherwise risk legal liability for MNC DEVELOPMENT, MNC DEVELOPMENT-VIP and/or Assigns  or our Affiliates; (b) would compromise an investigation or the integrity or operation of the Service; or (c) would cause harm to any user, other third party, MNC DEVELOPMENT, MNC DEVELOPMENT-VIP and/or Assigns  or our Affiliates. You can learn more about reporting and enforcement, including how to appeal on the Troubleshooting page of our Help Center.</p>
                        <h4 className="font-semibold">Community Guidelines Strikes</h4>
                        <p>MNC DEVELOPMENT, MNC DEVELOPMENT-VIP and/or Assigns  operates a system of “strikes” in respect of Content that violates the MNC DEVELOPMENT, MNC DEVELOPMENT-VIP and/or Assigns Community Guidelines. Each strike comes with varying restrictions and may result in the permanent removal of your channel from MNC DEVELOPMENT, MNC DEVELOPMENT-VIP and/or Assigns .   All strikes are at the sole discretion of MNC DEVELOPMENT and MNC DEVELOPMENT-VIP. If you believe that a strike has been issued in error, you may appeal.
                          If your channel has been restricted due to a strike, you must not use another means to circumvent these restrictions. Violation of this prohibition is a material breach of this Agreement. MNC DEVELOPMENT and MNC DEVELOPMENT-VIP reserves the right to terminate your account or your access to all or part of the Service.
                        </p>
                        <h4 className="font-semibold">Copyright Protection</h4>
                        <p>We provide information to help copyright holders manage their intellectual property online in our MNC DEVELOPMENT, MNC DEVELOPMENT-VIP and/or Assigns FAQ section or upon request. If you believe your copyright has been infringed on the Service, please send us a notice.
                          We respond to notices of alleged copyright infringement according to the process in our MNC DEVELOPMENT, MNC DEVELOPMENT-VIP and/or Assigns  FAQ section, where you can also find information about how to resolve a copyright strike. MNC DEVELOPMENT, MNC DEVELOPMENT-VIP and/or Assigns ‘s policies provide for the termination, in appropriate circumstances, of repeat infringers’ access to the Service.
                        </p>
                        <h5 className="font-semibold">Account Suspension & Termination</h5>
                        <h4 className="font-semibold">Terminations by You</h4>
                        <p>You may stop using the Service at any time.</p>
                        <h4 className="font-semibold">Terminations and Suspensions by MNC DEVELOPMENT, MNC DEVELOPMENT-VIP and/or Assigns</h4>
                        <p>MNC DEVELOPMENT, MNC DEVELOPMENT-VIP and/or Assigns reserve the right to suspend or terminate your account or your access to all or part of the Service if (a) you materially or repeatedly breach this Agreement; (b) we are required to do so to comply with a legal requirement or a court order; or (c) we reasonably believe that there has been conduct that creates (or could create) liability or harm to any user, other third party, MNC DEVELOPMENT, MNC DEVELOPMENT-VIP, our Assigns or our Affiliates.</p>
                        <h4 className="font-semibold">Notice for Termination or Suspension</h4>
                        <p>We will notify you with the reason for termination or suspension by MNC DEVELOPMENT, MNC DEVELOPMENT-VIP and/or Assigns  unless we reasonably believe that to do so: (a) would violate the law or the direction of a legal enforcement authority; (b) would compromise an investigation; (c) would compromise the integrity, operation or security of the Service; or (d) would cause harm to any user, other third party, MNC DEVELOPMENT, MNC DEVELOPMENT-VIP and/or Assigns  or our Affiliates.</p>
                        <h4 className="font-semibold">Effect of Account Suspension or Termination</h4>
                        <p>If your Google account is terminated or your access to the Service is restricted, you may continue using certain aspects of the Service (such as viewing only) without an account, and this Agreement will continue to apply to such use. If you believe that the termination or suspension has been made in error, you can appeal by contacting us.</p>
                        <h4 className="font-semibold">About Software in the Service</h4>
                        <h4 className="font-semibold">Downloadable Software</h4>
                        <p>When the Service requires or includes downloadable software, unless that software is governed by additional terms which provide a license, MNC DEVELOPMENT, MNC DEVELOPMENT-VIP and/or Assigns gives you a personal, worldwide, royalty-free, non-assignable and non-exclusive license to use the software provided to you by MNC DEVELOPMENT, MNC DEVELOPMENT-VIP and/or Assigns  as part of the Service. This license is for the sole purpose of enabling you to use and enjoy the benefit of the Service as provided by MNC DEVELOPMENT, MNC DEVELOPMENT-VIP and/or Assigns , in the manner permitted by this Agreement. You are not allowed to copy, modify, distribute, sell, or lease any part of the software, or to reverse-engineer or attempt to extract the source code of that software, unless laws prohibit these restrictions or you have MNC DEVELOPMENT, MNC DEVELOPMENT-VIP and/or Assigns ’s written permission.</p>
                        <h4 className="font-semibold">Open Source</h4><p>Some software used in our Service may be offered under an open source license that we make available to you. There may be provisions in an open source license that expressly override some of these terms, so please be sure to read those licenses. </p>
                        <h4 className="font-semibold">Other Legal Terms</h4><h4 className="font-semibold">Warranty Disclaimer</h4><p>OTHER THAN AS EXPRESSLY STATED IN THIS AGREEMENT OR AS REQUIRED BY LAW, THE SERVICE IS PROVIDED “AS IS” AND MNC DEVELOPMENT, MNC DEVELOPMENT-VIP AND/OR ASSIGNS DOES NOT MAKE ANY SPECIFIC COMMITMENTS OR WARRANTIES ABOUT THE SERVICE. FOR EXAMPLE, WE DON’T MAKE ANY WARRANTIES ABOUT: (A) THE CONTENT PROVIDED THROUGH THE SERVICE; (B) THE SPECIFIC FEATURES OF THE SERVICE, OR ITS ACCURACY, RELIABILITY, AVAILABILITY, OR ABILITY TO MEET YOUR NEEDS; OR (C) THAT ANY CONTENT YOU SUBMIT WILL BE ACCESSIBLE ON THE SERVICE. </p>
                        <h4 className="font-semibold">Limitation of Liability</h4><p>EXCEPT AS REQUIRED BY APPLICABLE LAW, MNC DEVELOPMENT, MNC DEVELOPMENT-VIP AND/OR ASSIGNS , ITS AFFILIATES, OFFICERS, DIRECTORS, EMPLOYEES AND AGENTS WILL NOT BE RESPONSIBLE FOR ANY LOSS OF PROFITS, REVENUES, BUSINESS OPPORTUNITIES, GOODWILL, OR ANTICIPATED SAVINGS; LOSS OR CORRUPTION OF DATA; INDIRECT OR CONSEQUENTIAL LOSS; PUNITIVE DAMAGES CAUSED BY:</p>
                        <ul className="list-disc pl-8">
                          <li>ERRORS, MISTAKES, OR INACCURACIES ON THE SERVICE;</li>
                          <li>PERSONAL INJURY OR PROPERTY DAMAGE RESULTING FROM YOUR USE OF THE SERVICE;</li>
                          <li>ANY UNAUTHORIZED ACCESS TO OR USE OF THE SERVICE;</li>
                          <li>ANY INTERRUPTION OR CESSATION OF THE SERVICE;</li>
                          <li>ANY VIRUSES OR MALICIOUS CODE TRANSMITTED TO OR THROUGH THE SERVICE BY ANY THIRD PARTY;</li>
                          <li>ANY CONTENT WHETHER SUBMITTED BY A USER OR MNC DEVELOPMENT, MNC DEVELOPMENT-VIP AND/OR ASSIGNS , INCLUDING YOUR USE OF CONTENT; AND/OR</li>
                          <li>THE REMOVAL OR UNAVAILABILITY OF ANY CONTENT.</li>
                          <li>THIS PROVISION APPLIES TO ANY CLAIM, REGARDLESS OF WHETHER THE CLAIM ASSERTED IS BASED ON WARRANTY, CONTRACT, TORT, OR ANY OTHER LEGAL THEORY.</li>
                          <li>MNC DEVELOPMENT, MNC DEVELOPMENT-VIP, OUR ASSIGNS AND ITS AFFILIATES’ TOTAL LIABILITY FOR ANY CLAIMS ARISING FROM OR RELATING TO THE SERVICE IS LIMITED TO THE GREATER OF: (A) THE AMOUNT OF REVENUE THAT MNC DEVELOPMENT, MNC DEVELOPMENT-VIP AND/OR ASSIGNS  HAS PAID TO YOU FROM YOUR USE OF THE SERVICE IN THE 12 MONTHS BEFORE THE DATE OF YOUR NOTICE, IN WRITING TO MNC DEVELOPMENT, MNC DEVELOPMENT-VIP AND/OR ASSIGNS , OF THE CLAIM; AND (B) USD $500.</li>
                        </ul>

                        <h4 className="font-semibold">Indemnity</h4><p>To the extent permitted by applicable law, you agree to defend, indemnify and hold harmless MNC DEVELOPMENT, MNC DEVELOPMENT-VIP and/or Assigns , its Affiliates, officers, directors, employees and agents, from and against any and all claims, damages, obligations, losses, liabilities, costs or debt, and expenses (including but not limited to attorney’s fees) arising from: (i) your use of and access to the Service; (ii) your violation of any term of this Agreement; (iii) your violation of any third party right, including without limitation any copyright, property, or privacy right; or (iv) any claim that your Content caused damage to a third party. This defense and indemnification obligation will survive this Agreement and your use of the Service.</p>
                        <h4 className="font-semibold">Third-Party Links</h4><p>The Service may contain links to third-party websites and online services that are not owned or controlled by MNC DEVELOPMENT, MNC DEVELOPMENT-VIP and/or Assigns . MNC DEVELOPMENT, MNC DEVELOPMENT-VIP and/or Assigns  has no control over, and assumes no responsibility for, such websites and online services. Be aware when you leave the Service; we suggest you read the terms and privacy policy of each third-party website and online service that you visit.</p>
                        <h5 className="font-semibold">About this Agreement</h5>
                        <h4 className="font-semibold">Changing this Agreement</h4><p>We may change this Agreement, for example, (1) to reflect changes to our Service or how we do business – for example, when we add new products or features or remove old ones, (2) for legal, regulatory, or security reasons, or (3) to prevent abuse or harm.
                          If we materially change this Agreement, we’ll provide you with reasonable advance notice and the opportunity to review the changes, except (1) when we launch a new product or feature, or (2) in urgent situations, such as preventing ongoing abuse or responding to legal requirements. If you don’t agree to the new terms, you should remove any Content you uploaded and stop using the Service.
                        </p>
                        <h4 className="font-semibold">Continuation of this Agreement</h4><p>If your use of the Service ends, the following terms of this Agreement will continue to apply to you: “Other Legal Terms”, “About This Agreement”, and the licenses granted by you will continue as described under “Duration of License”.</p>
                        <h4 className="font-semibold">Severance</h4><p>If it turns out that a particular term of this Agreement is not enforceable for any reason, this will not affect any other terms.</p>
                        <h4 className="font-semibold">No Waiver</h4><p>If you fail to comply with this Agreement and we do not take immediate action, this does not mean that we are giving up any rights that we may have (such as the right to take action in the future).</p>
                        <h4 className="font-semibold">Interpretation</h4><p>In these terms, “include” or “including” means “including but not limited to,” and any examples we give are for illustrative purposes.</p>
                        <h4 className="font-semibold">Governing Law</h4><p>All claims arising out of or relating to these terms or the Service will be governed by New York, except New York’s conflict of laws rules(if any), and will be litigated exclusively in the federal or state courts of Brooklyn, New York, USA. You and MNC DEVELOPMENT, MNC DEVELOPMENT-VIP and/or Assigns  consent to personal jurisdiction in those courts.</p>
                        <h4 className="font-semibold">Limitation on Legal Action</h4><p>YOU AND MNC DEVELOPMENT, MNC DEVELOPMENT-VIP AND/OR ASSIGNS  AGREE THAT ANY CAUSE OF ACTION ARISING OUT OF OR RELATED TO THE SERVICES MUST COMMENCE WITHIN ONE (1) YEAR AFTER THE CAUSE OF ACTION ACCRUES. OTHERWISE, SUCH CAUSE OF ACTION IS PERMANENTLY BARRED.</p>
                    </>



                    )}
                    {/* Copyright Content */}
                    {openDialog === 'copyright' && (
                      <><p><strong>Submit a copyright removal request</strong><br />
                        If your copyright-protected work was posted on MNC DEVELOPMENT or MNC DEVELOPMENT-VIP without your authorization, you can submit a copyright removal request to request that the content be removed. Submitting a copyright removal request is a legal process.
                      </p><p><strong>Prepare a copyright removal request</strong><br />
                          Before you submit a copyright removal request, consider the following:
                        </p><ul className="list-disc list-inside text-gray-500">
                          <li><strong>Copyright exceptions:</strong> Consider whether fair use, fair dealing, or a similar copyright exception applies.</li>
                          <li><strong>Personal info:</strong> Understand how your contact information is used once you submit a copyright removal request.</li>
                          <li><strong>Removal schedule:</strong> You can schedule the request to take effect in 7 days, allowing the uploader time to delete the content.</li>
                        </ul><p><strong>Submit a copyright removal request</strong><br />
                          The fastest way is to contact us via email at <a href="mailto:copyright@mncdevelopment.com" className="underline text-gray-600">copyright@mncdevelopment.com</a>, by fax at 1-877-732-3492, or by mail at 31 Buffalo Avenue, Brooklyn, New York 11233.
                        </p><p><strong>Important:</strong> Do not make false claims. Misuse of the removal request system may result in suspension or other legal consequences.
                        </p></>
                    )}
                  </div>
                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
                      onClick={closePolicyDialog}
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
        <p className="text-center text-white text-center" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)' }}>
          MNC Development and the MNC Development logos are trademarks of MNC Development, Inc. MNC Development, Inc. as a NYS licensed Real Estate Broker fully supports the principles of the Fair Housing Act and the Equal Opportunity Act. Listing information is deemed reliable, but is not guaranteed.
        </p>
      </div>
    </div>
  );
}

export default FAQPage;