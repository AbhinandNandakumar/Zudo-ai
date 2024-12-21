import React, { useEffect, useRef, useState } from "react";
import "./ChatWindow.css";

const ChatWindow = ({ messages }) => {
  const chatContainerRef = useRef(null);

  const processMessage = (text) => {
    let responseArray = text.split("**");
    let newResponse = "";

    for (let i = 0; i < responseArray.length; i++) {
      if (i === 0 || i % 2 !== 1) {
        newResponse += responseArray[i];
      } else {
        newResponse += `<b>${responseArray[i]}</b>`;
      }
    }

    let formattedResponse = newResponse.split('\n').join("</br>");
    return formattedResponse;
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      ref={chatContainerRef}
      className="h-64 overflow-y-auto mb-4 border p-3 rounded"
      style={{
        scrollbarWidth: "none", 
        msOverflowStyle: "none", 
      }}
    >
      {/* Check if the messages array is empty */}
      {messages.length === 0 ? (
        <div className=" p-2 bg-transparent rounded text-red-300 h-full w-full flex justify-between items-start pt-8">
          <div className=" w-1/4 m-3">
          <span className="font-bold">AI-Powered Captioning:</span><br/>Generate engaging captions automatically.
          </div>
          <div className="w-1/4 m-3">
          <span className="font-bold">Hashtag Recommendations:</span><br/> Automatically suggests relevant hashtags.
          </div>
          <div className=" w-1/4 m-3">
          <span className="font-bold">User-Friendly Interface:</span><br/> Simple and intuitive design for easy use.
          </div>
          <div className="w-1/4 m-3">
          <span className="font-bold">Personalization:</span><br/> Tailor captions to your brand or style using realtime conversation
          </div>
          
          </div> // Display when no messages are available
      ) : (
        messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 ${
              msg.sender === "user" ? "text-right text-blue-400" : "text-left text-green-400"
            }`}
          >
            {/* Render the processed message */}
            <span
              className="inline-block p-2 bg-transparent rounded"
              dangerouslySetInnerHTML={{ __html: processMessage(msg.text) }}
            />
          </div>
        ))
      )}
    </div>
  );
};

export default ChatWindow;
