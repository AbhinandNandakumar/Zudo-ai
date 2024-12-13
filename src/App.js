import React, { useState } from "react";
import ChatWindow from "./components/ChatWindow";
import MessageInput from "./components/MessageInput";

const App = () => {
  const [messages, setMessages] = useState([]);

  const handleSendMessage = async (userMessage) => {
    const newMessage = { sender: "user", text: userMessage };
    setMessages((prev) => [...prev, newMessage]);
    // console.log(JSON.stringify({ prompt: userMessage }))

    try {
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: userMessage }),
      });

      const data = await response.json();
      const botMessage = { sender: "bot", text: data.message };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error: Unable to fetch response." },
      ]);
    }
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold mb-6">Zudo ai</h1>
      <h1 className="text-xl text-gray-500 mb-6">your caption assistant</h1>
      <div className="bg-slate-300 shadow-lg rounded-lg p-6 w-3/4 max-w-3xl">
        <ChatWindow messages={messages} />
        <MessageInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default App;
