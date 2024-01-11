import { useState } from "react";

const PropertyButton = (props) => {
  const [showPropertyButton, setShowPropertyButton] = useState(true);

  return (
    <div>
        <div style={{display: "flex"}}>
        <button
        style={{
            fontSize: "12px",
            backgroundColor: "#4a5568",
            width: "auto",
            height: "auto",
            padding: "7px",
            marginRight: "5px",
            color: "white"
          }}
          onClick={() => {
            props.actions.searchHouses();
          }}
        >
          Search For Housing
        </button>
        <button
        style={{
            fontSize: "12px",
            backgroundColor: "#4a5568",
            width: "auto",
            height: "auto",
            padding: "7px",
            marginRight: "5px",
            color: "white"
          }}
          onClick={() => {
            props.actions.signIn();
          }}
        >
          Sign In
        </button>
        
       
        </div>
        <div style={{display: "flex", marginTop: "4px"}}>
        <button
        style={{
            fontSize: "12px",
            backgroundColor: "#4a5568",
            width: "auto",
            height: "auto",
            padding: "7px",
            color: "white",
            marginRight: "6px"
          }}
          onClick={() => {
            props.actions.signUp();
          }}
        >
          Sign Up
        </button>
        <button
        style={{
            fontSize: "12px",
            backgroundColor: "#4a5568",
            width: "auto",
            height: "auto",
            padding: "7px",
            color: "white"
          }}
          onClick={() => {
            props.actions.agents();
          }}
        >
          Agents
        </button>
        <div style={{marginLeft: "5px"}} >
        <button 
        style={{
            fontSize: "12px",
            backgroundColor: "#4a5568",
            width: "auto",
            height: "auto",
            padding: "7px",
            color: "white"
          }}
          onClick={() => {
            props.actions.contact();
          }}
        >
          Contact
        </button></div>
        </div>
        <div>
        <button 
        style={{
            fontSize: "12px",
            backgroundColor: "#4a5568",
            width: "auto",
            height: "auto",
            padding: "7px",
            color: "white",
            marginTop: "5px"
          }}
          onClick={() => {
            props.actions.vipSubscription();
          }}
        >
          VIP Subscriptions
        </button>
        </div>
    </div>
  );
};

export default PropertyButton;
