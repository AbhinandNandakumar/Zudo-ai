import React, { useEffect, useRef } from "react";

const ChatWindow = ({ messages }) => {
  const chatContainerRef = useRef(null);

  const processMessage = (text) => {
    const cleanedText = text.replace(/\*"?|"?\*/g, "");
    const sentences = cleanedText
      .split(/(?<=[.!?])(?!\d)/)
      .map((sentence) => sentence.trim())
      .filter(Boolean);
    return sentences.map((sentence, index) => (
      <div key={index}>
        {sentence}
      </div>
    ));
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      ref={chatContainerRef}
      className="h-64 overflow-y-auto mb-4 border p-3 rounded bg-gray-50"
    >
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`mb-2 ${
            msg.sender === "user" ? "text-right text-blue-500" : "text-left text-gray-700"
          }`}
        >
          <span className="inline-block p-2 bg-gray-200 rounded">
            {processMessage(msg.text)}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ChatWindow;
