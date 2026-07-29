import React, { useRef } from "react";

function ChatForm({ chatHistory, setChatHistory, generateBotResponse }) {
  const inputRef = useRef();

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const userMessage = inputRef.current.value.trim();
    if (!userMessage) return;
    inputRef.current.value = "";

    const nextHistory = [...chatHistory, { role: "user", text: userMessage }];
    setChatHistory([...nextHistory, { role: "model", text: "Thinking..." }]);
    generateBotResponse(nextHistory);
  };

  return (
    <form action="#" className="chat-form" onSubmit={handleFormSubmit}>
      <input
        ref={inputRef}
        type="text"
        placeholder="Message..."
        className="message-input"
        required
        autoComplete="off"
      />
      <button type="submit" className="z-99" aria-label="Send">
        <span className="material-symbols-rounded" style={{ fontSize: 18, lineHeight: 1 }}>
          arrow_upward
        </span>
      </button>
    </form>
  );
}

export default ChatForm;
