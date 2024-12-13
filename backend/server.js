import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import pkg from "body-parser";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

const { json } = pkg;

const app = express();
const PORT = 5000;
app.use(cors());
app.use(json());

const apiKey = process.env.GEMINI_API_KEY; // Access the API key from .env
if (!apiKey) {
  throw new Error("Missing GEMINI_API_KEY in environment variables.");
}

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction:
    "Generate captions related to company, image, or video description based on input. Respond in a friendly tone. Also focus on captions only. Don't tell anything unrelated to captions. If the user is asking about other things, then don't respond to it. Just ask for caption-related things only. If you give captions, then number them. After giving responses, ask if they need hashtags too. If yes, then give captions with hashtags also.",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

app.post("/api/chat", async (req, res) => {
  const userMessage = req.body.prompt;
  console.log("Received prompt:", userMessage);
  if (!userMessage) {
    return res.status(400).json({ message: "Bad Request: 'prompt' is required." });
  }

  try {
    const chatSession = model.startChat({
      generationConfig,
      history: [{ role: "user", parts: [{ text: userMessage }] }],
    });

    const response = await chatSession.sendMessage(userMessage);
    console.log(response.response.text());

    res.json({ message: response.response.text() });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Sorry some problem \n Feel free to retry 😊" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
