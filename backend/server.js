import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import pkg from "body-parser";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const { json } = pkg;

const app = express();
const PORT = 5000;
app.use(cors());
app.use(json());

const apiKey = process.env.GEMINI_API_KEY; 
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction:
    "Your name is Zudo ai(start conversation by telling your name)....Generate captions related to company, image, or video description based on input. Respond in a friendly tone. Also focus on captions only; don't discuss unrelated topics. If asked about non-caption topics, respond by requesting caption-related input only. If giving captions, number them. After providing responses, ask if hashtags are needed. If yes, give captions with hashtags(atmost 3...if needed more they will ask) too.(once agian im telling respond to caption topic only....no other conversations are allowed....but should approach in friendly manner only)",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

const chatSessions = {};

app.post("/api/chat", async (req, res) => {
  const { prompt, sessionId } = req.body;
  console.log("Received prompt:", prompt);

  if (!prompt || !sessionId) {
    return res.status(400).json({ message: "Bad Request: 'prompt' and 'sessionId' are required." });
  }

  if (!chatSessions[sessionId]) {
    chatSessions[sessionId] = [];
  }

  try {
    chatSessions[sessionId].push({ role: "user", parts: [{ text: prompt }] });

    const chatSession = model.startChat({
      generationConfig,
      history: chatSessions[sessionId],
    });

    const response = await chatSession.sendMessage(prompt);

    chatSessions[sessionId].push({ role: "model", parts: [{ text: response.response.text() }] });

    console.log("Response:", response.response.text());
    res.json({ message: response.response.text() });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Sorry, some problem occurred. Feel free to retry 😊" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
