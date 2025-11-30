import { GoogleGenAI } from "@google/genai";
import { AIModelConfig, ChatMessage, ModelProvider } from "../types";

// Helper to simulate other APIs since we can't make direct cross-origin calls to arbitrary providers reliably in a purely frontend demo without a proxy.
// However, we implement full logic for Gemini.

export const generateAIResponse = async (
  messages: ChatMessage[],
  config: AIModelConfig
): Promise<string> => {
  
  // 1. Handle Gemini Provider
  if (config.provider === ModelProvider.GEMINI) {
    try {
      // Initialize client. In a real app, use the config.apiKey. 
      // For this demo environment, we use process.env.API_KEY if the config key is empty.
      const apiKey = config.apiKey || process.env.API_KEY || '';
      
      if (!apiKey) {
        throw new Error("API Key is missing for Gemini.");
      }

      const ai = new GoogleGenAI({ apiKey });
      
      const lastMessage = messages[messages.length - 1];
      
      // Construct parts
      const parts: any[] = [];
      
      // Add text
      parts.push({ text: lastMessage.content });

      // Add attachments if any (Images)
      if (lastMessage.attachments && lastMessage.attachments.length > 0) {
        lastMessage.attachments.forEach(att => {
          if (att.type.startsWith('image/')) {
            // Remove data URL prefix for Gemini SDK
            const base64Data = att.data.split(',')[1]; 
            parts.push({
              inlineData: {
                mimeType: att.type,
                data: base64Data
              }
            });
          } else {
             // For text/code files, append to text prompt
             const base64Content = att.data.split(',')[1];
             const decodedContent = atob(base64Content);
             parts[0].text += `\n\n[Attached File: ${att.name}]\n${decodedContent}\n`;
          }
        });
      }

      const response = await ai.models.generateContent({
        model: config.modelName || 'gemini-2.5-flash',
        contents: {
            role: 'user',
            parts: parts
        },
        config: {
            systemInstruction: "You are a helpful AI assistant in a FastAdmin plugin. You can execute simulated terminal commands by wrapping them in ```bash code blocks.",
        }
      });

      return response.text || "No response generated.";

    } catch (error: any) {
      console.error("Gemini API Error:", error);
      return `Error calling Gemini: ${error.message}`;
    }
  }

  // 2. Mock Other Providers (DeepSeek, SiliconFlow, etc.)
  // Since we cannot guarantee CORS headers on these 3rd party APIs for a browser-only demo:
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`[Simulated Response from ${config.provider} - ${config.modelName}]\n\nI received your message: "${messages[messages.length - 1].content}".\n\n(Note: In a real environment, this would call ${config.baseUrl || 'the API endpoint'} with key ${config.apiKey ? '******' : 'MISSING'}).`);
    }, 1500);
  });
};
