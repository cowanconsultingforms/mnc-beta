import React from 'react';

const MessageParser = ({ children, actions }) => {
  const { checker } = children.props.state;
  const parse = (message) => {
   if(message.includes("sign up for vip")){
    actions.vip();
   }
   if(message.includes("vip")){
    actions.vip();
   }
}

  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          parse: parse,
          actions,
        });
      })};
    </div>
  );
};

export default MessageParser;
