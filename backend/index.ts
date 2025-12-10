import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import resumeRouter from "./routes/resume";
import llmRouter from "./routes/together";

dotenv.config();

console.log("Environment loaded:");
console.log("OPENROUTER_API_KEY:", process.env.OPENROUTER_API_KEY ? "SET" : "NOT SET");
console.log("OPENROUTER_API_URL:", process.env.OPENROUTER_API_URL);

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/resume", resumeRouter);
app.use("/api/llm", llmRouter);

app.listen(port, () => {
  console.log(`Resume-agent backend listening on http://localhost:${port}`);
});

export default app;
