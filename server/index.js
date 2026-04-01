import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "google-generative-ai";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/recommend", async (req, res) => {
  const { goal, interests = [], budget, category, constraints } = req.body ?? {};

  if (!goal || !category) {
    return res.status(400).json({
      error: "`goal` and `category` are required fields."
    });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({
      error: "Missing GEMINI_API_KEY in server/.env"
    });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are an expert recommendation engine.
Generate recommendations for the user in strict JSON format.

User profile:
- Goal: ${goal}
- Category: ${category}
- Budget: ${budget || "Not specified"}
- Interests: ${Array.isArray(interests) ? interests.join(", ") : interests}
- Constraints: ${constraints || "None"}

Return this exact JSON shape:
{
  "summary": "short explanation",
  "recommendations": [
    {
      "title": "name",
      "description": "why this fits",
      "reasonScore": 1-100,
      "nextStep": "concrete action"
    }
  ],
  "roadmap": [
    {
      "phase": "Phase name",
      "timeline": "week/month",
      "actions": ["action 1", "action 2"]
    }
  ]
}
No markdown. JSON only.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    let parsed;
    try {
      parsed = JSON.parse(responseText);
    } catch {
      const cleaned = responseText
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/```$/i, "")
        .trim();
      parsed = JSON.parse(cleaned);
    }

    return res.json(parsed);
  } catch (error) {
    console.error("Recommendation error:", error);
    return res.status(500).json({
      error: "Failed to generate recommendations.",
      details: error?.message || "Unknown error"
    });
  }
});

app.listen(port, () => {
  console.log(`Recommendation API running on http://localhost:${port}`);
});
