import React, { useState } from "react";
import "./ChatWindow.css"

const MessageInput = ({ onSendMessage }) => {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input.trim());
      setInput("");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      document.getElementById("Send").click();
    }
  };


  return (
    <div className="flex items-center border-t pt-3" onKeyDown={handleKeyDown}>
      <input
        type="text"
        className="flex-grow border p-2 rounded mr-2  placeholder-gray-500 text-gray-300 inp"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
      />
      <button id="Send"
        className="bg-red-300 text-blue-800 font-semibold px-4 py-2 rounded shadow-2xl" 
        onClick={handleSend}
      >
        Send
      </button>
    </div>
  );
};

export default MessageInput;
