"use server";

import { getMutableAIState, createAI, streamUI } from "ai/rsc";
import OpenAI from "openai";
import { z } from "zod";
import { ReactNode } from "react";
import { openai as openaiModel } from "@ai-sdk/openai";

// Define the AI state and UI state types
export type ServerMessage = {
  role: "user" | "assistant";
  content: string;
};

export type ClientMessage = {
  id: string;
  role: "user" | "assistant";
  display: ReactNode;
};

export type AIState = ServerMessage[];
export type UIState = ClientMessage[];

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function sendMessage(message: string): Promise<ClientMessage> {
  "use server";

  const history = getMutableAIState();

  // Update the AI state with the new user message.
  history.update((state: AIState) => [
    ...state,
    { role: "user", content: message },
  ]);

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: history.get(),
  });

  // Update the AI state again with the response from the model.
  const assistantMessage = response.choices[0].message.content;
  history.done([
    ...history.get(),
    { role: "assistant", content: assistantMessage },
  ]);

  return {
    id: Date.now().toString(),
    role: "assistant",
    display: <div>{assistantMessage}</div>,
  };
}

const LoadingComponent = () => (
  <div className="animate-pulse p-4">Getting weather...</div>
);

const getWeather = async (location: string) => {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return "82°F️ ☀️";
};

interface WeatherProps {
  location: string;
  weather: string;
}

const WeatherComponent = (props: WeatherProps) => (
  <div className="border border-neutral-200 p-4 rounded-lg max-w-fit">
    The weather in {props.location} is {props.weather}
  </div>
);

export async function streamComponent() {
  const result = await streamUI({
    model: openaiModel("gpt-4o"),
    prompt: "Get the weather for San Francisco",
    text: ({ content }) => <div>{content}</div>,
    tools: {
      getWeather: {
        description: "Get the weather for a location",
        parameters: z.object({
          location: z.string(),
        }),
        generate: async function* ({ location }) {
          yield <LoadingComponent />;
          const weather = await getWeather(location);
          return <WeatherComponent weather={weather} location={location} />;
        },
      },
    },
  });

  return result.value;
}

// Create the AI provider with the initial states and allowed actions
export const AI = createAI<AIState, UIState>({
  initialAIState: [],
  initialUIState: [],
  actions: {
    sendMessage,
    streamComponent,
  },
});
