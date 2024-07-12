"use client";

import React, { useState } from "react";
import { useActions, useUIState, useAIState } from "ai/rsc";
import { ClientMessage, ServerMessage, streamComponent } from "./actions";

interface WeatherProps {
  location: string;
  weather: string;
}

export default function Page() {
  const [component, setComponent] = useState<React.ReactNode>();
  const { sendMessage, getWeather } = useActions();
  const [aiMessages, setAIMessages] = useAIState();
  const [uiMessages, setUIMessages] = useUIState();
  const [inputValue, setInputValue] = useState("");

  const Button: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <button type="submit" className="p-2 bg-blue-500 text-white rounded">
      {children}
    </button>
  );

  const handleSendMessage = async (event: React.FormEvent) => {
    event.preventDefault();
    const message = inputValue;

    // Update UI state with user message
    setUIMessages((prevMessages: ClientMessage[]) => [
      ...prevMessages,
      {
        id: Date.now().toString(),
        role: "user",
        display: <div className="text-black">{message}</div>,
      },
    ]);

    // Update AI state with user message
    setAIMessages((prevMessages: ServerMessage[]) => [
      ...prevMessages,
      { role: "user", content: message },
    ]);

    // Call the server action
    const response = await sendMessage(message);

    // Update UI state with assistant message
    setUIMessages((prevMessages: ClientMessage[]) => [
      ...prevMessages,
      response,
    ]);

    // Update AI state with assistant message
    setAIMessages((prevMessages: ServerMessage[]) => [
      ...prevMessages,
      { role: "assistant", content: response.display.props.children },
    ]);

    setInputValue(""); // Clear the input field after sending
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-2">
        Message History State Management
      </h2>
      <ul className="mb-4 bg-gray-50 p-4 rounded shadow-md">
        {uiMessages.map((message: ClientMessage) => (
          <li
            key={message.id}
            className={`mb-2 p-2 rounded ${
              message.role === "user"
                ? "bg-blue-100 text-black"
                : "bg-gray-200 text-black"
            }`}
          >
            {message.display}
          </li>
        ))}
      </ul>
      <form
        onSubmit={handleSendMessage}
        className="flex items-center space-x-2 mb-4"
      >
        <input
          type="text"
          name="message"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-black"
          placeholder="Type your message..."
        />
        <button
          type="submit"
          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Send
        </button>
      </form>

      <h2 className="text-xl font-bold mb-2 mt-8">Streaming UI Components</h2>
      <div className="bg-gray-50 p-4 rounded shadow-md">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setComponent(await streamComponent());
          }}
          className="flex items-center space-x-2 mb-4"
        >
          <Button>Stream Component</Button>
        </form>
        <div className="p-2 border border-gray-300 rounded bg-white text-black">
          {component}
        </div>
      </div>
    </div>
  );
}
