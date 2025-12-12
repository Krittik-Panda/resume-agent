import { GenerateParams, AnalysisResult } from "../types";
import { generateSummary } from "../services/resumeService";
import { extractTextFromPDF, validatePDFFile } from "../services/pdfService";

export async function analyzeResume(params: GenerateParams): Promise<AnalysisResult> {
  const summary = await generateSummary(params.text, params.kind);
  return {
    summary,
    inputLength: params.text.length,
    engine: process.env.OPENROUTER_API_KEY ? "openrouter" : "local-fallback",
    timestamp: new Date().toISOString(),
  };
}

export async function analyzeResumePDF(pdfBuffer: Buffer, kind?: string): Promise<AnalysisResult> {
  // Validate PDF
  if (!validatePDFFile(pdfBuffer)) {
    throw new Error("Invalid PDF file. Please upload a valid PDF document.");
  }

  // Extract text from PDF
  const pdfResult = await extractTextFromPDF(pdfBuffer);

  // Generate summary using existing LLM service
  const summary = await generateSummary(pdfResult.text, kind);

  return {
    summary,
    inputLength: pdfResult.text.length,
    engine: process.env.OPENROUTER_API_KEY ? "openrouter" : "local-fallback",
    timestamp: new Date().toISOString(),
    pdfInfo: {
      pageCount: pdfResult.pageCount,
      extractedAt: pdfResult.extractedAt,
    }
  };
}
