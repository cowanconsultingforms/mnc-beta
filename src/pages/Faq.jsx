import React, { useState } from "react";
import faqImage from "../assets/img/faqq3.jpg"; // Import your image
import { Link } from "react-router-dom";

function FAQPage() {
  const [ans, setAns] = useState("");
  const faqData = [
    {
      question: "How to sign in?",
      answer: "To sign in, click on this link: ",
    },
    {
      question: "How to register?",
      answer: "To register, click on this link: ",
    },
    {
      question: "How to search for housing?",
      answer: "To search for houses, click on this link: ",
    },
    {
      question: "How to search for agents?",
      answer: "To search for agents, click on this link: ",
    },
    {
      question: "What are VIP listings?",
      answer: "A VIP listing is an off-market listing ",
    },
    {
      question: "Why should I pay for a 'VIP' subscription?",
      answer: "As a paid VIP subscriber: ",
    },
    {
      question:
        "What's the step by step procedure to obtain the VIP membership?",
      answer: "If interested in a VIP ",
    },
  ];

  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const handleQuestionClick = (item, index) => {
    setSelectedQuestion(selectedQuestion === index ? null : index);
    setAns(item.question);
  };

  return (
    <div className="relative font-semibold text-gray-900">
      <div
        className=""
        style={{
          height: "100%",
          opacity: 0.8,
          backgroundImage: `url(${faqImage})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          width: "100%",
          zIndex: -80,
          position: "fixed",
        }}
      ></div>

      <div className=" p-5 w-400">
        <h1 className="text-2xl font-semibold mb-5 ">
          Frequently Asked Questions
        </h1>
        <ul
          style={{ maxWidth: "750px" }}
          className=" faq-list text-lg   bg-opacity-60"
        >
          {faqData.map((item, index) => (
            <li key={index} className=" faq-item">
              <button
                className={`text-left faq-question ${
                  selectedQuestion === index ? "active" : ""
                }`}
                onClick={() => handleQuestionClick(item, index)}
              >
                {item.question}
              </button>
              {selectedQuestion === index && (
                <div className="">
                  <div className="faq-answer  inline p">
                    {item.answer.includes("register") && (
                      <span>
                        {item.answer}
                        <Link
                          className="cursor-pointer p-2 font-semibold underline"
                          to="/sign-up"
                        >
                          Register
                        </Link>
                      </span>
                    )}
                    {item.answer.includes("sign in") && (
                      <span>
                        {item.answer}
                        <Link
                          className="cursor-pointer p-2 font-semibold underline"
                          to="/sign-up"
                        >
                          Sign In
                        </Link>
                      </span>
                    )}
                    {item.answer.includes("house") && (
                      <span>
                        {item.answer}
                        <Link
                          className="cursor-pointer p-2 font-semibold underline"
                          to="/"
                        >
                          Houses
                        </Link>
                      </span>
                    )}
                    {item.answer.includes("agent") && (
                      <span>
                        {item.answer}
                        <Link
                          className="cursor-pointer p-2 font-semibold underline"
                          to="/agents"
                        >
                          Agents
                        </Link>
                      </span>
                    )}
                    {item.answer.includes("vip") && (
                      <span>
                        {item.answer}
                        <Link
                          className="cursor-pointer p-2 font-semibold underline"
                          to="/agents"
                        >
                          VIP listings
                        </Link>
                      </span>
                    )}
                    {item.answer.includes("VIP subscriber") && (
                      <>
                        {item.answer}
                        <div className="cursor-pointer p-2 ">
                          <ul>
                            <li>
                              1) Be the first to browse exclusive listings to
                              RENT or BUY before they hit the market.
                            </li>
                            {/* Add more list items if needed */}
                            <li>
                              2) SELL your home while maintaining your privacy.
                              Listing your home as a private exclusive allows
                              you to control what information is shared about
                              you and your home while still getting exposure to
                              top agents at MNC Development. A private exclusive
                              listing is an off-market home that can be shared
                              by an agent directly with their colleagues and
                              their buyers. Property details aren't disseminated
                              widely and won't appear on public home search
                              websites.<br></br>
                              <br></br> Discretion:<br></br> Privacy is the
                              ultimate commodity and the decision to sell your
                              home is a personal one. <br></br> <br></br>{" "}
                              Flexibility:<br></br> Decide when to share details
                              about your home, including price, more broadly on
                              your own timing. <br></br> <br></br> Quality:
                              <br></br> Retain exposure to Compass agents,
                              including premium placement on our agent facing
                              platform.<br></br> <br></br> Value:<br></br> Get
                              the best offer by testing the market privately to
                              gather key insights without your listing getting
                              stale. <br></br>
                              <br></br> Reasons why you might choose to sell
                              your home as a private exclusive:<br></br> New job
                              or relocation<br></br>
                              Family changes like marriage or divorce<br></br>{" "}
                              Evolving financial circumstances <br></br> Health
                              issues<br></br> Valuable belongings like art or
                              furniture<br></br> Opposition to holding open
                              houses<br></br> <br></br> Contact us now for
                              pricing.
                            </li>
                          </ul>{" "}
                        </div>
                      </>
                    )}
                    {item.answer.includes("interested in a VIP") && (
                      <>
                        <br></br>
                        <ul>
                          <li>
                            {" "}
                            <span>{item.answer}</span>
                            subscription
                            <Link
                              className="cursor-pointer p-2 font-semibold underline"
                              to="/sign-up"
                            >
                              register
                            </Link>
                            for a normal user account. Then
                            <Link
                              className="cursor-pointer p-2 font-semibold underline"
                              to="/contact-us"
                            >
                              contact us
                            </Link>
                            for a VIP subscription quote. Then pay us the agreed
                            yearly VIP membership fee via Zelle @
                            mncdevelopmentapartments@gmail.com. In the memo of
                            the Zelle transfer make sure to type: VIP yearly
                            membership fee. Within 48 hours of receipt of the
                            Zelle payment an admin will change your regular user
                            account to 'VIP'.
                          </li>
                        </ul>
                      </>
                    )}
                    {item.answer.includes("off-market listing") && (
                      <>
                        <ul>
                          <li>
                            {" "}
                            <span>{item.answer}</span>
                            that can be shared by an agent directly with their
                            colleagues and their buyers to help VIP clients SELL
                            privately. Property details aren't disseminated
                            widely and won't appear on public home search
                            websites. Or, VIP users have exclusive access to
                            these listings to BUY or RENT.
                          </li>
                        </ul>
                      </>
                    )}
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default FAQPage;
