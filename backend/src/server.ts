import express, { Request, Response } from "express";
import cors from "cors";

const app = express();
const PORT = 5000;

function cleanAiJsonResponse(text: string): string {
  return text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();
}

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

app.use(express.json({ limit: "1mb" }));

app.get("/", (_req: Request, res: Response) => {
  res.json({
    message: "AI Code Reviewer backend is running",
  });
});

app.post("/api/review", async (req: Request, res: Response) => {
  try {
    const { language, code } = req.body as {
      language?: string;
      code?: string;
    };

    if (!language || !code) {
      return res.status(400).json({
        message: "Language and code are required.",
      });
    }

    if (code.length > 20000) {
      return res.status(400).json({
        message: "Code is too long. Please submit a smaller snippet.",
      });
    }

    const prompt = `
You are a strict AI code reviewer.

Your task:
1. Detect the programming language.
2. Review the code carefully.
3. Identify bugs, security risks, poor practices, and maintainability issues.
4. Return ONLY valid JSON.

Important:
- Do not wrap the JSON in markdown.
- Do not use \`\`\`json.
- Do not write any text before or after the JSON.
- Be strict. Do not give high score if the code has security problems.
- Hardcoded passwords, tokens, API keys, unsafe SQL queries, weak comparisons, missing validation, or unsafe user input must reduce the score.
- SQL injection risk must be treated as a serious issue.
- The tag type must only be: "good", "warn", or "bad".

User selected language: ${language}

Return this exact JSON structure:

{
  "detectedLanguage": "",
  "score": 0,
  "summary": "",
  "issues": [],
  "suggestions": [],
  "tags": []
}

Scoring guide:
- 90-100: clean, secure, well-structured code with no important issues.
- 70-89: mostly okay, but has minor or moderate issues.
- 40-69: has clear bugs, security risks, or maintainability problems.
- 0-39: serious security issue, broken logic, unsafe code, or invalid code.

Rules:
- detectedLanguage must be a string.
- score must be a number from 0 to 100.
- summary must be short and clear.
- issues must be an array of strings.
- suggestions must be an array of strings.
- tags must be an array of objects.
- each tag must use this format: { "label": "security", "type": "warn" }
- tag type must only be "good", "warn", or "bad".
- If there are no issues, return an empty issues array.
- If there are no suggestions, return an empty suggestions array.

Code:
\`\`\`
${code}
\`\`\`
`;

    const ollamaResponse = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "qwen2.5-coder:3b",
        prompt,
        stream: false,
      }),
    });

    if (!ollamaResponse.ok) {
      return res.status(500).json({
        message: "Failed to connect to Ollama.",
      });
    }

    const data = await ollamaResponse.json();

    let parsedReview;

    try {
      const cleanedResponse = cleanAiJsonResponse(data.response);
      parsedReview = JSON.parse(cleanedResponse);

      parsedReview.tags = Array.isArray(parsedReview.tags)
        ? parsedReview.tags.map((tag: any) => ({
            label: String(tag.label || "review"),
            type: ["good", "warn", "bad"].includes(tag.type)
              ? tag.type
              : "warn",
          }))
        : [];

      parsedReview.issues = Array.isArray(parsedReview.issues)
        ? parsedReview.issues
        : [];

      parsedReview.suggestions = Array.isArray(parsedReview.suggestions)
        ? parsedReview.suggestions
        : [];

      parsedReview.score =
        typeof parsedReview.score === "number" ? parsedReview.score : 70;

      parsedReview.detectedLanguage =
        parsedReview.detectedLanguage || language.toUpperCase();
    } catch {
      parsedReview = {
        detectedLanguage: language.toUpperCase(),
        score: 70,
        summary:
          "The AI response could not be parsed as JSON, so the raw review is shown instead.",
        issues: ["The model returned an invalid JSON format."],
        suggestions: ["Try reviewing again or improve the backend prompt."],
        tags: [
          { label: "Format Warning", type: "warn" },
          { label: language.toUpperCase(), type: "good" },
        ],
        rawReview: data.response,
      };
    }

    return res.json({
      review: parsedReview,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error while reviewing code.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
