import { Router } from "express";
import multer from "multer";
import { analyzeResume, analyzeResumePDF } from "../controllers/resumeController";

const router = Router();

// Configure multer for PDF uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow only PDF files
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  }
});

// POST /api/resume/analyze
router.post("/analyze", upload.single('file'), async (req, res) => {
  try {
    // Check if this is a PDF upload or JSON text
    if (req.file) {
      // Handle PDF upload
      const { kind } = req.body;
      const result = await analyzeResumePDF(req.file.buffer, kind);
      return res.json(result);
    } else {
      // Handle JSON text (existing behavior)
      const { text, kind } = req.body;
      if (!text || typeof text !== "string") {
        return res.status(400).json({ error: "Missing or invalid 'text' in body" });
      }

      const result = await analyzeResume({ text, kind });
      return res.json(result);
    }
  } catch (err: any) {
    console.error("Error in /api/resume/analyze", err);
    return res.status(500).json({ error: err?.message || String(err) });
  }
});

export default router;
