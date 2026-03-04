import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateDianaPoem(mood: string = "romantic") {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Write a beautiful, short romantic poem in Russian for a girl named Diana. 
      Her nicknames are Saturn and Saturnyashka. 
      She loves dogs. 
      Her birthday is November 17th. 
      The theme should be cosmic, stars, and infinite love. 
      The mood should be ${mood}. 
      Make it feel personal and heartfelt.
      
      IMPORTANT: Return ONLY the poem text. Do not include any introductory phrases, explanations, or conclusions. Just the verses.`,
      config: {
        temperature: 0.8,
        topP: 0.9,
      }
    });

    return response.text;
  } catch (error) {
    console.error("Error generating poem:", error);
    return "Звезды сегодня молчат, но мое сердце все равно поет о тебе, Диана...";
  }
}
