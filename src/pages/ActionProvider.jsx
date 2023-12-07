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
    const message = createChatBotMessage(`Please use the following link to find housing:" https://mnc-development.web.app/ "`);
    updateState(message, "zipCpdeInput");
  };

  const signIn = () => {
    const message = createChatBotMessage(`Please use the link to log in:" https://mnc-development.web.app/sign-in "`);
    updateState(message, "scheduleViewing");
  };

  const signUp = () => {
    const message = createChatBotMessage(`Please use the following link to sign up: " https://mnc-development.web.app/sign-up "`);
    updateState(message, "askQuestion");
  };

  const agents = () => {
    const message = createChatBotMessage(`Please use the following link to find agents: " https://mnc-development.web.app/agents "`);
    updateState(message, "requestContactInfo");
  };

  const contact = () => {
    const message = createChatBotMessage(`Please use the following link to contact us: " https://mnc-development.web.app/contact-us "`);
    updateState(message, "confirmation");
  };

  const vip = () => {
    const message = createChatBotMessage(`Please use the following link to find the answer: "https://mnc-development.web.app/faqPage"`);
    updateState(message, "hello");
  };

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
          },
        });
      })}
    </div>
  );
};

export default ActionProvider;
