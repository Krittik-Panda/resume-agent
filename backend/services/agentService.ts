import fs from "fs";
import path from "path";
import { callOpenRouterLLM } from "../adapters/openrouterAdapter";

export class AgentService {
  static isReady(): boolean {
    return true;
  }

  static getAvailableRoles(): string[] {
    return [
      "backend-engineer",
      "frontend-engineer",
      "full-stack-developer",
      "devops-engineer",
    ];
  }

  static async chat(message: string): Promise<string> {
    const resumePath = path.join(
      process.cwd(),
      "data/raw/resume-content.json"
    );

    if (!fs.existsSync(resumePath)) {
      console.error("Resume file not found at:", resumePath);
      throw new Error("Resume not found. Please upload a resume PDF first.");
    }

    let raw: any;
    let resumeText: string;

    try {
      raw = JSON.parse(fs.readFileSync(resumePath, "utf-8"));
      resumeText = raw.extracted_text;
    } catch (error) {
      console.error("Error reading resume file:", error);
      throw new Error("Resume data is corrupted. Please re-upload your resume PDF.");
    }

    // Validate resume text
    if (!resumeText || typeof resumeText !== 'string' || resumeText.trim().length < 10) {
      console.error("Invalid resume text:", resumeText);
      throw new Error("Resume content appears to be empty or invalid. Please re-upload your resume PDF.");
    }

    console.log(`Processing chat request with resume text length: ${resumeText.length}`);

    const systemPrompt = `
You are an AI resume analyst. You MUST answer questions using ONLY the information contained in the resume provided below. Do NOT use any external knowledge, assumptions, or information not explicitly stated or clearly implied in the resume content.

RESUME CONTENT:
${resumeText}

STRICT INSTRUCTIONS:
- ONLY use information from the resume above - ignore any prior knowledge
- If asked about something not mentioned in the resume, explicitly state "This information is not available in the resume"
- Do NOT invent, assume, or extrapolate information not in the resume
- For skills, experience, or other lists: extract them directly from the resume text
- Format responses professionally using markdown:
  * Use bullet points (-) for lists
  * Use **bold** for emphasis
  * Use headings (# ##) for sections when appropriate
  * Keep responses clear, concise, and directly based on resume content
- If the resume doesn't contain relevant information, say so rather than making up details

Remember: Your responses must be 100% grounded in the resume content provided. Do not add external context or knowledge.
`.trim();

  const response = await callOpenRouterLLM(
      message,
      systemPrompt,
      "resume-chat",
      {}
    );
    return response ?? "This information is not available in the resume.";
  }
}
