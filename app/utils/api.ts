export function sendPromptToAPI(prompt: string, onUpdate: (text: string) => void): Promise<void> {
  return new Promise((resolve, reject) => {
    const apiKey = "51a456c2-e8af-4921-a0fe-934856a5fedd";
    const socket = new WebSocket("wss://public.backend.medisearch.io:443/ws/medichat/api");
    
    let timeoutId: NodeJS.Timeout;
    let lastSentText = "";

    socket.onopen = () => {
      console.log("WebSocket connection opened");
      const message = JSON.stringify({
        event: 'user_message',
        conversation: [prompt],
        key: apiKey,
        id: `conversation_${Date.now()}`,
        settings: {
          language: 'English',
        },
      });
      socket.send(message);
      console.log("Sent message:", message);

      timeoutId = setTimeout(() => {
        console.log("No response received within 30 seconds");
        socket.close();
        reject("Timeout: No response received from the API");
      }, 30000);
    };

    socket.onmessage = (event) => {
      console.log("Received message:", event.data);
      const data = JSON.parse(event.data);
      if (data.event === "error") {
        clearTimeout(timeoutId);
        reject(`API Error: ${data.error_code}`);
        socket.close();
      } else if (data.event === "llm_response") {
        const newText = data.text.slice(lastSentText.length);
        lastSentText = data.text;
        onUpdate(newText);
      } else if (data.event === "conversation_finished") {
        clearTimeout(timeoutId);
        resolve();
        socket.close();
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      clearTimeout(timeoutId);
      reject("An error occurred while connecting to the API.");
    };

    socket.onclose = (event) => {
      console.log("WebSocket connection closed:", event.code, event.reason);
      clearTimeout(timeoutId);
    };
  });
}

