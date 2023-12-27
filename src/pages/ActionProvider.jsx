import React from "react";// Import the widget

const ActionProvider = ({ createChatBotMessage, setState, children }) => {
  
  
    const initialAction = () => {
    const message = createChatBotMessage("Please choose from the following options:");
    updateState(message, "mainMenu");
  };

  const handleSearchForProperties = () => {
    const message = createChatBotMessage("Great choice! What type of property are you looking for?",  {
          widgetName: "property",
        //   widgetFunc: (props) => <Property {...props} />,
        });
    updateState(message, "property");
  };

  const searchHouses = () => {
    const message = createChatBotMessage(
      <p>
        Please use the following link for housing:{" "}
        <a href="https://mnc-development.web.app/" target="_blank" rel="noopener noreferrer">
          <span className="font-bold underline">Housing</span>
        </a>
      </p>
    );
    updateState(message, "zipCodeInput");
  }

  const signIn = () => {
    const message = createChatBotMessage(
      <p>
        Please use the link to sign in:{" "}
        <a href="https://mnc-development.web.app/sign-in" target="_blank" rel="noopener noreferrer">
          <span className="font-bold underline">Sign In</span>
        </a>
      </p>
    );
    updateState(message, "scheduleViewing");
  };

  const signUp = () => {
    const message = createChatBotMessage(
      <p>
        Please use the following link to sign up:{" "}
        <a href="https://mnc-development.web.app/sign-up" target="_blank" rel="noopener noreferrer">
          <span className="font-bold underline">Sign Up</span>
        </a>
      </p>
    );
    updateState(message, "askQuestion");
  };
  
  const agents = () => {
    const message = createChatBotMessage(
      <p>
        Please use the following link to find agents:{" "}
        <a href="https://mnc-development.web.app/agents" target="_blank" rel="noopener noreferrer">
          <span className="font-bold underline">Find Agents</span>
        </a>
      </p>
    );
    updateState(message, "requestContactInfo");
  };
  
  const contact = () => {
    const message = createChatBotMessage(
      <p>
        Please use the following link to contact us:{" "}
        <a href="https://mnc-development.web.app/contact-us" target="_blank" rel="noopener noreferrer">
          <span className="font-bold underline">Contact Us</span>
        </a>
      </p>
    );
    updateState(message, "confirmation");
  };
  
  const vip = () => {
    const message = createChatBotMessage(
      <p>
        Please use the following link to find the answer:{" "}
        <a href="https://mnc-development.web.app/faqPage" target="_blank" rel="noopener noreferrer">
          <span className="font-bold underline">FAQs</span>
        </a>
      </p>
    );
    updateState(message, "hello");
  };

const vipSubscription = ()=>{
  const message = createChatBotMessage(
    <p>
      Please use the following link to learn about VIP Subscriptions:{" "}
      <a href="https://mnc-development.web.app/faqPage" target="_blank" rel="noopener noreferrer">
        <span className="font-bold underline">VIP Subscriptions</span>
      </a>
    </p>
  );
  updateState(message, "agew");
}

  const updateState = (message, checker) => {
    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, message],
      checker,
    }));
  };

  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          actions: {
            initialAction,
            handleSearchForProperties,
            signIn,
            signUp,
            agents,
            contact,
            searchHouses,
            vip,
            vipSubscription,
          },
        });
      })}
    </div>
  );
};

export default ActionProvider;
