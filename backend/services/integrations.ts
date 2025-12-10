import fetch from "node-fetch";

// Integrations adapters for hackathon-required tools.
// Each function is a light wrapper that calls a configured HTTP endpoint
// if the corresponding environment variables are present. These are
// intentionally defensive: they return null / noop if not configured.

export async function callTogetherLLM(apiUrl: string, apiKey: string, input: string, instruction = "Summarize") {
  if (!apiUrl || !apiKey) return null;
  try {
    const resp = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ input, instruction }),
    });
    if (!resp.ok) {
      const txt = await resp.text().catch(() => "");
      console.warn("Together LLM returned non-ok", resp.status, txt);
      return null;
    }
    const json = await resp.json().catch(() => null);
    return json?.output || json?.result || json?.summary || null;
  } catch (err) {
    console.warn("Error calling Together LLM", err);
    return null;
  }
}

export async function sendToCodeRabbit(reviewApiUrl: string | undefined, apiKey: string | undefined, repo: string, prNumber: number, diff: string) {
  if (!reviewApiUrl || !apiKey) return null;
  try {
    const resp = await fetch(reviewApiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ repo, prNumber, diff }),
    });
    if (!resp.ok) {
      console.warn("CodeRabbit review failed", resp.status);
      return null;
    }
    return await resp.json();
  } catch (err) {
    console.warn("Error sending to CodeRabbit", err);
    return null;
  }
}

export async function sendToOumi(oumiUrl: string | undefined, apiKey: string | undefined, responses: any[]) {
  if (!oumiUrl) return null;
  try {
    const resp = await fetch(oumiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}) },
      body: JSON.stringify({ items: responses }),
    });
    if (!resp.ok) {
      console.warn("Oumi ranking call failed", resp.status);
      return null;
    }
    return await resp.json();
  } catch (err) {
    console.warn("Error calling Oumi", err);
    return null;
  }
}

export async function triggerClineTask(clineUrl: string | undefined, apiKey: string | undefined, task: any) {
  if (!clineUrl) return null;
  try {
    const resp = await fetch(clineUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}) },
      body: JSON.stringify(task),
    });
    if (!resp.ok) {
      console.warn("Cline task trigger failed", resp.status);
      return null;
    }
    return await resp.json();
  } catch (err) {
    console.warn("Error triggering Cline task", err);
    return null;
  }
}

export async function triggerKestraWorkflow(kestraUrl: string | undefined, apiKey: string | undefined, workflowId: string, payload: any) {
  if (!kestraUrl) return null;
  try {
    const url = `${kestraUrl.replace(/\/$/, "")}/api/v1/executions/${workflowId}`;
    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}) },
      body: JSON.stringify(payload),
    });
    if (!resp.ok) {
      console.warn("Kestra trigger failed", resp.status);
      return null;
    }
    return await resp.json();
  } catch (err) {
    console.warn("Error triggering Kestra", err);
    return null;
  }
}
