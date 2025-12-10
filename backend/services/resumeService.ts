import { callOpenRouterLLM } from "../adapters/openrouterAdapter";

/**
 * Generate a summary using OpenRouter LLM when configured,
 * otherwise fall back to a heuristic local summarizer.
 */
export async function generateSummary(text: string, kind?: string): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (apiKey) {
    try {
      const instruction = `You are a professional resume summarizer. Summarize the following resume text into a concise, professional summary of 2-3 sentences highlighting key skills and experience.`;
      const result = await callOpenRouterLLM(text, instruction, kind, { apiKey, retries: 2, timeoutMs: 15000 });
      if (result && typeof result === "string" && result.length > 0) return result;
    } catch (err) {
      console.warn("Error calling OpenRouter LLM, falling back to local summary.", err);
    }
  }

  // Local heuristic summarizer: take first 3 sentences or first 300 chars
  const sentences = text.replace(/\n+/g, " ").split(/(?<=[.?!])\s+/).filter(Boolean);
  const selected = sentences.slice(0, 3).join(" ");
  if (selected.length > 30) return selected;
  const trimmed = text.trim().slice(0, 300);
  return trimmed + (trimmed.length < text.trim().length ? "…" : "");
}
