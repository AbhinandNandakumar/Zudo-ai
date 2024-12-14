import React, { useState, useEffect } from "react";
import ChatWindow from "./components/ChatWindow";
import MessageInput from "./components/MessageInput";

const App = () => {
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    // Generate a unique session ID when the app loads
    const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    setSessionId(newSessionId);
  }, []);

  const handleSendMessage = async (userMessage) => {
    const newMessage = { sender: "user", text: userMessage };
    setMessages((prev) => [...prev, newMessage]);

    try {
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: userMessage,
          sessionId, // Include session ID with each request
        }),
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
      <h1 className="text-3xl font-bold mb-6">Zudo AI</h1>
      <h1 className="text-xl text-gray-500 mb-6">Your Caption Assistant</h1>
      <div className="bg-slate-300 shadow-lg rounded-lg p-6 w-3/4 max-w-3xl">
        <ChatWindow messages={messages} />
        <MessageInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default App;
