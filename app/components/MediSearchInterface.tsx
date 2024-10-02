import { useState } from "react";
import { sendPromptToAPI } from "../utils/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";


interface MediSearchInterfaceProps {
  setResponse: React.Dispatch<React.SetStateAction<string>>;
}

export default function MediSearchInterface({ setResponse }: MediSearchInterfaceProps) {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendPrompt = async () => {
    setIsLoading(true);
    setResponse(""); // Clear previous response
    try {
      await sendPromptToAPI(prompt, (newText) => {
        setResponse((prevResponse) => prevResponse + newText);
      });
    } catch (error) {
      console.error("Error:", error);
      setResponse("An error occurred while sending the prompt.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="w-full">
        <Textarea
          className="w-full p-2 border border-gray-300 rounded"
          rows={4}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your medical query here..."
        />
      </div>
      
      <Button
        onClick={handleSendPrompt}
        disabled={isLoading}
      >
        {isLoading ? "Sending..." : "Send Prompt"}
      </Button>
    </>
  );
}