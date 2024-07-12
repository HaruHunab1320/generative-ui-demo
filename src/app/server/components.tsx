"use client";
import React from "react";

export const GreetingLoadingComponent: React.FC = () => (
  <div className="flex items-center justify-center p-4 text-blue-500">
    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v8H4z"
      ></path>
    </svg>
    Generating greeting...
  </div>
);

export const GreetingComponent: React.FC<{ name: string }> = ({ name }) => (
  <div className="p-4 border border-gray-300 rounded-lg shadow-lg bg-white">
    <h2 className="text-2xl font-bold text-gray-800">Hello, {name}!</h2>
    <p className="text-gray-600">Welcome to our AI-powered greeting app.</p>
  </div>
);

export const WeatherLoadingComponent = () => (
  <div className="animate-pulse p-4">getting weather...</div>
);

export const getWeather = async (location: string) => {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return "82°F️ ☀️";
};
