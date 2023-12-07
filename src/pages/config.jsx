import { createChatBotMessage } from "react-chatbot-kit";
import PropertyButton from "./PropertyButton";
const config = {
  botName: "MNC Chat Bot",
  initialMessages: [
    createChatBotMessage(
      "Hello! Welcome to MNC Chat Bot. Please choose from the following options:",
      {
        widget: "mainMenu", // Display initial menu options
      }
    ),
  ],
  customStyles: {
    botMessageBox: {
      backgroundColor: "#4a5568",
    },
    chatButton: {
      backgroundColor: "#4a5568",
    },
  },
  state: {
    checker: "mainMenu",
  },
  widgets: [
    {
      widgetName: "mainMenu",
      widgetFunc: (props) => (
        <PropertyButton actions={props.actions} />
      ),
    },
  ],
};

export default config;
