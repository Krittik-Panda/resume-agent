import { GenerateParams, AnalysisResult } from "../types";
import { generateSummary } from "../services/resumeService";

export async function analyzeResume(params: GenerateParams): Promise<AnalysisResult> {
  const summary = await generateSummary(params.text, params.kind);
  return {
    summary,
    inputLength: params.text.length,
    engine: process.env.TOGETHER_API_KEY ? "together-ai" : "local-fallback",
    timestamp: new Date().toISOString(),
  };
}
