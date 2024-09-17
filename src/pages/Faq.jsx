import React, { useState } from "react";
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { Link } from "react-router-dom";

function FAQPage() {
  const [expandedIndex, setExpandedIndex] = useState(null);

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
      question: "What's the step by step procedure to obtain the VIP membership?",
      answer: "If interested in a VIP subscription, register for a normal user account. Then contact us for a VIP subscription quote. Pay the agreed yearly VIP membership fee via Zelle @ mncdevelopmentapartments@gmail.com. In the memo of the Zelle transfer, type: VIP yearly membership fee. Within 48 hours of receipt of the Zelle payment, an admin will change your regular user account to 'VIP'.",
    },
  ];

  const handleClick = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };
  return (
    <div className="relative font-semibold text-gray-900">
      {/* Video Background */}
      <div className="fixed top-0 left-0 w-full h-full z-0">
        <iframe
          src="https://drive.google.com/file/d/1lf2Dpw7-eC3Ia7X6Bc8kPE6CoQmaOx_-/preview"
          width="100%"
          height="100%"
          frameBorder="0"
          allow="autoplay; fullscreen"
          className="w-full h-full object-cover"
          title="Background Video"
        ></iframe>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center p-4 min-h-screen">
        <div className="w-full max-w-lg divide-y divide-gray-200 rounded-xl bg-white p-6 shadow-[10px_10px_30px_rgba(0,0,0,0.2)] overflow-auto">
          {faqData.map((item, index) => (
            <div key={index} className="py-2">
              <button
                onClick={() => handleClick(index)}  
                className="flex w-full items-center justify-between p-4 text-lg font-medium text-gray-800 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none"
              >
                <span>{item.question}</span>
                <ChevronDownIcon
                  className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
                    expandedIndex === index ? "transform rotate-180" : ""
                  }`}
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
        </div>
      </div>
    </div>
  );
}

export default FAQPage;