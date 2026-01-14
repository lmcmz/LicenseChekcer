
import { GoogleGenAI, Type } from "@google/genai";
import { DependencyAudit, RiskLevel } from "../types";

export const auditDependenciesWithGemini = async (dependencies: { name: string, version: string }[]): Promise<DependencyAudit[]> => {
  if (dependencies.length === 0) return [];
  
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY is not set on the server');

  const ai = new GoogleGenAI({ apiKey });
  const depString = dependencies.map(d => `${d.name}@${d.version}`).join(', ');
  
  const prompt = `
    Task: Audit these software dependencies for license compliance.
    
    Dependencies: ${depString}

    STRICT GUIDELINES:
    1. For each dependency, find its OFFICIAL license and repo URL.
    2. RISK CATEGORIZATION:
       - SAFE (Green): MIT, Apache-2.0, BSD-3-Clause, BSD-2-Clause, ISC, Unlicense, Zlib.
       - CAUTION (Yellow): GPL-3.0, GPL-2.0, LGPL, MPL-2.0, EPL-2.0.
       - HIGH RISK (Red): AGPL-3.0, SSPL, BSL-1.1, Proprietary, or Unknown.
    3. If the license is MIT, it MUST be marked as "Safe".
    4. Provide a concise reason for the risk level.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              version: { type: Type.STRING },
              license: { type: Type.STRING },
              repository: { type: Type.STRING },
              riskLevel: { type: Type.STRING, enum: ["Safe", "Caution", "High Risk"] },
              reason: { type: Type.STRING },
              isFriendly: { type: Type.BOOLEAN },
              sources: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["name", "version", "license", "riskLevel", "isFriendly"]
          }
        }
      }
    });

    const resultText = response.text;
    if (!resultText) throw new Error("Empty response from AI");
    
    let audits = JSON.parse(resultText) as DependencyAudit[];

    // Extract grounding URLs and attach them to all results for transparency
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const groundingUrls = groundingChunks
      ?.map(chunk => chunk.web?.uri)
      .filter((uri): uri is string => !!uri) || [];

    return audits.map(audit => ({
      ...audit,
      sources: [...(audit.sources || []), ...groundingUrls]
    }));
  } catch (error) {
    console.error("Gemini Audit Error:", error);
    throw error;
  }
};
