"use client";

import { useState } from "react";
import MediSearchInterface from "./components/MediSearchInterface";
import DeploymentLinks from "./components/DeploymentLinks";
import Footer from "./components/Footer";

export default function Home() {
  const [response, setResponse] = useState("");

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full max-w-2xl">
        <h1 className="text-2xl font-bold">MediSearch API Interface</h1>
        
        <MediSearchInterface setResponse={setResponse} />
        
        {response && (
          <div className="w-full mt-4">
            <h2 className="text-xl font-semibold mb-2">Response:</h2>
            <p className="p-2 bg-gray-100 rounded">{response}</p>
          </div>
        )}

        <DeploymentLinks />
      </main>
      <Footer />
    </div>
  );
}
