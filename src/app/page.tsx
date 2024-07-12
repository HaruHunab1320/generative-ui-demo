// app/page.tsx

"use client";

import { useState } from "react";
import { streamComponent } from "./actions";

export default function Page() {
  const [component, setComponent] = useState<React.ReactNode>();

  // components/ui/button.tsx

  const Button: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <button type="submit" className="p-2 bg-blue-500 text-white rounded">
      {children}
    </button>
  );

  return (
    <div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setComponent(await streamComponent());
        }}
      >
        <Button>Stream Component</Button>
      </form>
      <div>{component}</div>
    </div>
  );
}
