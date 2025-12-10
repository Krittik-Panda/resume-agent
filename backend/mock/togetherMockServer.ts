import express from "express";

const app = express();
app.use(express.json({ limit: "1mb" }));

// Mock OpenRouter API endpoint
app.post("/api/v1/chat/completions", (req, res) => {
  console.log("Mock server received request:", JSON.stringify(req.body, null, 2));
  const { messages, model, max_tokens } = req.body || {};
  const userMessage = (messages && messages.find((m: any) => m.role === "user")?.content) || "";
  const snippet = (userMessage && userMessage.toString().slice(0, 250)) || "";
  const summary = `MOCK SUMMARY (${model || "text"}): ${snippet.slice(0, 140)}${snippet.length > 140 ? "…" : ""}`;

  console.log("Mock server responding with:", summary);

  // Return JSON in OpenRouter format
  res.json({
    choices: [
      {
        message: {
          content: summary,
          role: "assistant",
        },
      },
    ],
    usage: { prompt_tokens: 10, completion_tokens: 10, total_tokens: 20 },
  });
});

const port = process.env.MOCK_LLM_PORT ? Number(process.env.MOCK_LLM_PORT) : 4000;
app.listen(port, () => {
  console.log(`Mock OpenRouter LLM server listening on http://localhost:${port}/api/v1/chat/completions`);
});

export default app;
