
import { GoogleGenAI, Type } from "@google/genai";
import { DependencyAudit } from "../types";

// Service to audit dependencies using Gemini with Search Grounding
export const auditDependenciesWithGemini = async (dependencies: { name: string, version: string }[]): Promise<DependencyAudit[]> => {
  if (dependencies.length === 0) return [];
  
  // Create a new instance right before making an API call to ensure it always uses the most up-to-date API key
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const depString = dependencies.map(d => `${d.name}@${d.version}`).join('\n');
  
  const prompt = `
    Task: Conduct a real-time audit of the following software dependencies for license compliance.
    
    Dependencies to Audit:
    ${depString}

    Instructions:
    1. For each dependency, use Google Search to find its LATEST official license and repository URL.
    2. Determine if the license is "Open Source Friendly" (Safe: MIT, Apache 2.0, BSD, ISC; Caution: GPL, LGPL, MPL; High Risk: AGPL, SSPL, BSL).
    3. Include source URLs used for verification in the 'sources' array.
    4. If a dependency is a wrapper or has critical known sub-dependencies, list them in the 'children' array.
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
              riskLevel: { type: Type.STRING },
              reason: { type: Type.STRING },
              isFriendly: { type: Type.BOOLEAN },
              sources: { type: Type.ARRAY, items: { type: Type.STRING } },
              children: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    version: { type: Type.STRING },
                    license: { type: Type.STRING },
                    riskLevel: { type: Type.STRING },
                    isFriendly: { type: Type.BOOLEAN }
                  },
                  required: ["name", "version", "license", "riskLevel", "isFriendly"]
                }
              }
            },
            required: ["name", "version", "license", "riskLevel", "isFriendly"]
          }
        }
      }
    });

    const resultText = response.text;
    if (!resultText) throw new Error("Empty response from AI");
    
    const audits = JSON.parse(resultText) as DependencyAudit[];

    // MUST ALWAYS extract the URLs from groundingChunks and list them on the web app
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (groundingChunks && audits.length > 0) {
      const groundingUrls = groundingChunks
        .map(chunk => chunk.web?.uri)
        .filter((uri): uri is string => !!uri);
      
      if (groundingUrls.length > 0) {
        // Ensure grounding URLs are present in the sources of the audited items
        audits.forEach(audit => {
          if (!audit.sources) audit.sources = [];
          groundingUrls.forEach(url => {
            if (!audit.sources!.includes(url)) {
              audit.sources!.push(url);
            }
          });
        });
      }
    }
    
    return audits;
  } catch (error) {
    console.error("Gemini Audit Error:", error);
    throw error;
  }
};
