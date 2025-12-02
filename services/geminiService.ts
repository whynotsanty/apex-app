import { GoogleGenAI, Type } from "@google/genai";
import { Routine, ChatMessage } from "../types";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

/**
 * Helper to clean Markdown code blocks from AI response
 * e.g. ```json [ ... ] ``` -> [ ... ]
 */
const cleanJSON = (text: string): string => {
  if (!text) return "[]";
  let cleaned = text.trim();
  // Remove markdown code blocks if present
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(json)?/, "").replace(/```$/, "");
  }
  return cleaned.trim();
};

export const generateRoutineSuggestions = async (goal: string, count: number = 3): Promise<Partial<Routine>[]> => {
  try {
    const model = "gemini-2.5-flash";
    const prompt = `I have a goal: "${goal}". Generate exactly ${count} specific, daily actionable habits/routines that will help me achieve this. 
    Return strictly JSON data. Categories must be one of: Career, Growth, Health, Mindset.`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "The daily habit action" },
              category: { type: Type.STRING, description: "Category of the habit" },
              description: { type: Type.STRING, description: "Short motivation why" }
            },
            required: ["title", "category"]
          }
        }
      }
    });

    const text = response.text || "[]";
    const cleanText = cleanJSON(text);
    
    const parsed = JSON.parse(cleanText);
    
    return parsed.map((item: any, index: number) => ({
      id: `ai-${Date.now()}-${index}`,
      title: item.title,
      category: item.category,
      consistency: 0,
      completedDays: [false, false, false, false, false, false, false],
      iconColor: getCategoryColor(item.category)
    }));

  } catch (error) {
    console.error("Error generating routines:", error);
    return [];
  }
};

export const chatWithGuru = async (history: ChatMessage[], newMessage: string, language: string): Promise<{ text: string, suggestedRoutines?: Partial<Routine>[] }> => {
  try {
    const model = "gemini-2.5-flash";
    
    const systemInstruction = `You are 'Apex Guru', a high-performance productivity coach. 
    Language: ${language === 'pt' ? 'Portuguese' : 'English'}.
    Tone: Motivating, concise, elite mindset.
    
    CRITICAL INSTRUCTION:
    If the user asks for a plan, a routine, or how to achieve a specific goal, give your advice in text first.
    THEN, if actionable habits are relevant, append a special separator "|||APEX_DATA|||" followed by a valid JSON array of habits.
    
    The JSON array structure must be:
    [
      { "title": "Habit Name", "category": "Health" (or Career, Growth, Mindset) }
    ]
    `;

    const chatHistory = history.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }]
    }));

    const chat = ai.chats.create({
      model: model,
      config: {
        systemInstruction: systemInstruction,
      },
      history: chatHistory
    });

    const result = await chat.sendMessage({ message: newMessage });
    const fullText = result.text || "";

    const parts = fullText.split("|||APEX_DATA|||");
    const displayText = parts[0].trim();
    let suggestedRoutines: Partial<Routine>[] | undefined = undefined;

    if (parts.length > 1) {
      try {
        const jsonStr = cleanJSON(parts[1]);
        const parsed = JSON.parse(jsonStr);
        if (Array.isArray(parsed)) {
           suggestedRoutines = parsed.map((item: any, index: number) => ({
            id: `guru-${Date.now()}-${index}`,
            title: item.title,
            category: item.category || 'Growth',
            consistency: 0,
            completedDays: [false, false, false, false, false, false, false],
            iconColor: getCategoryColor(item.category || 'Growth')
          }));
        }
      } catch (e) {
        console.error("Failed to parse Guru JSON", e);
      }
    }

    return { text: displayText, suggestedRoutines };

  } catch (error) {
    console.error("Guru chat error:", error);
    return { text: "Connection error. Stay focused and try again." };
  }
}

const getCategoryColor = (category: string): string => {
  switch (category) {
    case 'Career': return 'from-cyan-500 to-blue-600';
    case 'Growth': return 'from-pink-500 to-rose-500';
    case 'Health': return 'from-orange-400 to-red-500';
    case 'Mindset': return 'from-purple-500 to-indigo-600';
    default: return 'from-gray-500 to-gray-700';
  }
};
