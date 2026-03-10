import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY   // recommended
});

const prompt = "";
async function IntelligentRequest(content){
    const response = await genAI.models.generateContent({
    model: "gemini-2.0-flash-exp",
    contents: `${prompt } --- ${content} `,
  });

  return response?.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

export default IntelligentRequest;


