import React from "react";

export const LoadingComponent: React.FC = () => (
  <div>Generating greeting...</div>
);

export const GreetingComponent: React.FC<{ name: string }> = ({ name }) => (
  <div>
    <h2>Hello, {name}!</h2>
    <p>Welcome to our AI-powered greeting app.</p>
  </div>
);
