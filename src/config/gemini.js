import Groq from "groq-sdk";

// Model (fast + free tier friendly)
const MODEL_NAME = "llama-3.1-8B-instant";

// Get API key from .env (Vite)
const API_KEY = import.meta.env.VITE_GROQ_KEY;

if (!API_KEY) {
  console.error("roq API Key not found in .env file");
}

const groq = new Groq({
  apiKey: API_KEY,
  dangerouslyAllowBrowser: true, // required for frontend
});

async function runChat(prompt) {
  try {
    const response = await groq.chat.completions.create({
      model: MODEL_NAME,
      messages: [
    {
      role: "user",
      content: `${prompt}\n\nProvide a complete and properly finished answer.`,
    },
  ],
      temperature: 0.7,
      max_tokens: 800,
    });

    const reply = response.choices[0].message.content;

    console.log("Groq:", reply);

    return reply;

  } catch (error) {
    console.error("Groq Error:", error);
    return "Error: Unable to fetch response.";
  }
}

export default runChat;