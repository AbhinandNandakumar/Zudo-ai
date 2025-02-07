import React, { useState, useEffect } from "react";
import ChatWindow from "./components/ChatWindow";
import MessageInput from "./components/MessageInput";
import "./App.css"

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
      const response = await fetch("https://zudo-ai.onrender.com/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: userMessage,
          sessionId, 
        }),
      });

      const data = await response.json();
      const botMessage = { sender: "bot", text: data.message };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Sorry, some problem occurred. Feel free to retry 😊" },
      ]);
    }
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <h1 className="text-5xl font-bold mb-6 zudo">Zudo AI</h1>
      <h1 className="text-xl text-gray-400 mb-6">Your Caption Assistant</h1>
      <div className=" shadow-lg rounded-lg p-6 w-3/4 max-w-3xl">
        <ChatWindow messages={messages} />
        <MessageInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default App;
