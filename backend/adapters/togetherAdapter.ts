import fetch from "node-fetch";

export interface OpenRouterOptions {
  apiKey?: string;
  apiUrl?: string;
  timeoutMs?: number;
  retries?: number;
  model?: string;
}

async function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

export async function callOpenRouterLLM(
  input: string,
  instruction: string,
  kind = "resume",
  opts: OpenRouterOptions = {}
): Promise<string> {
  const apiKey = opts.apiKey || process.env.OPENROUTER_API_KEY;
  const apiUrl = opts.apiUrl || process.env.OPENROUTER_API_URL || "https://openrouter.ai/api/v1/chat/completions";
  const timeoutMs = opts.timeoutMs ?? 15_000;
  const retries = opts.retries ?? 2;
  const model = opts.model || process.env.OPENROUTER_MODEL || "mistralai/mistral-7b-instruct";

  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY must be set to call OpenRouter LLM");
  }

  const messages = [
    { role: "system", content: instruction },
    { role: "user", content: input },
  ];

  const body = { model, messages, max_tokens: 500 };

  let lastErr: any = null;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeoutMs);

      const resp = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(body),
        signal: controller.signal as any,
      });
      clearTimeout(id);

      const text = await resp.text();

      if (!resp.ok) {
        lastErr = new Error(`OpenRouter API ${resp.status}: ${text}`);
        throw lastErr;
      }

      try {
        const json = JSON.parse(text);
        // OpenRouter returns choices[0].message.content
        if (json.choices && json.choices[0] && json.choices[0].message && json.choices[0].message.content) {
          return json.choices[0].message.content.toString();
        }
        // Fallback for other response formats
        if (json.result) return json.result.toString();
        if (json.output) return json.output.toString();
        return JSON.stringify(json);
      } catch (parseErr) {
        return text;
      }
    } catch (err) {
      lastErr = err;
      if (attempt < retries) {
        // small exponential backoff
        await sleep(500 * Math.pow(2, attempt));
        continue;
      }
    }
  }

  throw lastErr || new Error("Unknown error calling OpenRouter LLM");
}
