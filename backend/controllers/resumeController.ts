import { GenerateParams, AnalysisResult } from "../types";
import { generateSummary } from "../services/resumeService";

export async function analyzeResume(params: GenerateParams): Promise<AnalysisResult> {
  const summary = await generateSummary(params.text, params.kind);
  return {
    summary,
    inputLength: params.text.length,
    engine: process.env.OPENROUTER_API_KEY ? "openrouter" : "local-fallback",
    timestamp: new Date().toISOString(),
  };
}
