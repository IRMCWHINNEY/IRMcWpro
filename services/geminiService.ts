import { GoogleGenAI, Type } from "@google/genai";
import { Doctor, AiMatchResult } from '../types';

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY not found in environment variables. AI features will fail.");
  }
  return new GoogleGenAI({ apiKey: apiKey || '' });
};

export const findSpecialist = async (symptoms: string, doctors: Doctor[]): Promise<AiMatchResult[]> => {
  try {
    const ai = getAiClient();
    
    // Create a minified list of doctors to save tokens and focus on relevant data
    const doctorProfiles = doctors.map(d => ({
      id: d.id,
      name: d.name,
      specialty: d.specialty,
      bio: d.bio,
      location: d.location
    }));

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
        You are a helpful medical receptionist assistant.
        Patient Symptoms/Query: "${symptoms}"
        
        Available Doctors List (JSON):
        ${JSON.stringify(doctorProfiles)}
        
        Task: Analyze the patient's query and identify the top 1-3 most suitable doctors from the provided list.
        Consider the specialty and bio.
        Return a JSON array of objects.
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              matchReason: { type: Type.STRING, description: "A brief explanation why this doctor is a good match for the symptoms." },
              confidence: { type: Type.NUMBER, description: "A number between 0 and 1 indicating match confidence." }
            },
            required: ["id", "matchReason", "confidence"]
          }
        }
      }
    });

    const resultText = response.text;
    if (!resultText) return [];
    
    return JSON.parse(resultText) as AiMatchResult[];
  } catch (error) {
    console.error("Error finding specialist:", error);
    return [];
  }
};

export const generateDoctorBio = async (name: string, specialty: string, experience: number, keywords: string): Promise<string> => {
  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
        Write a professional, trustworthy, and concise medical biography (max 40 words) for a doctor.
        Name: ${name}
        Specialty: ${specialty}
        Years of Experience: ${experience}
        Key Interests/Focus: ${keywords}
        
        Tone: Warm, professional, and competent.
        Do not use markdown formatting.
      `,
    });

    return response.text || "Experienced medical professional dedicated to patient care.";
  } catch (error) {
    console.error("Error generating bio:", error);
    return "Experienced medical professional dedicated to patient care.";
  }
};

export interface ClinicalSource {
  title: string;
  uri: string;
}

export interface ClinicalResponse {
  answer: string;
  sources: ClinicalSource[];
}

export const askClinicalQuestion = async (query: string): Promise<ClinicalResponse> => {
  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are a clinical AI assistant designed to help medical professionals. 
      Answer the following clinical question comprehensively using the provided search tools. 
      Focus on evidence-based medicine, recent studies, and clinical guidelines.
      
      Question: ${query}`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    // Extract sources from grounding metadata
    // The structure is typically inside groundingChunks -> web
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources: ClinicalSource[] = chunks
      .map((chunk: any) => chunk.web)
      .filter((web: any) => web && web.uri && web.title)
      .map((web: any) => ({
        title: web.title,
        uri: web.uri
      }));
      
    // Remove duplicates based on URI
    const uniqueSources = sources.filter((v, i, a) => a.findIndex(t => (t.uri === v.uri)) === i);

    return {
      answer: response.text || "No answer could be generated.",
      sources: uniqueSources
    };
  } catch (error) {
    console.error("Error asking clinical question:", error);
    return {
      answer: "An error occurred while retrieving clinical evidence. Please try again.",
      sources: []
    };
  }
};