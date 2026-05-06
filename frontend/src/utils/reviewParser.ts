import type { ReviewResult } from "../types/review";

export function createReviewResult(
  rawReview: string,
  code: string,
  lang: string
): ReviewResult {
  const lower = rawReview.toLowerCase();

  let score = 80;

  if (
    lower.includes("critical") ||
    lower.includes("sql injection") ||
    lower.includes("hardcoded password") ||
    lower.includes("security risk")
  ) {
    score = 55;
  } else if (
    lower.includes("bug") ||
    lower.includes("error") ||
    lower.includes("issue") ||
    lower.includes("missing validation")
  ) {
    score = 70;
  } else if (
    lower.includes("good") ||
    lower.includes("well-structured") ||
    lower.includes("readable")
  ) {
    score = 88;
  }

  return {
    score,
    summary: `Analyzed ${code.split("\n").length} lines of ${lang} code. The full AI review is shown below.`,
    issues: extractSection(rawReview, ["bugs", "errors", "security", "issues"]),
    suggestions: extractSection(rawReview, [
      "suggestions",
      "improvements",
      "recommendations",
    ]),
    tags: [
      {
        label:
          score >= 80
            ? "✓ Good Quality"
            : score >= 65
            ? "⚠ Needs Review"
            : "✗ Risky Code",
        type: score >= 80 ? "good" : score >= 65 ? "warn" : "bad",
      },
      {
        label: "AI Reviewed",
        type: "good",
      },
      {
        label: lang.toUpperCase(),
        type: "warn",
      },
    ],
    rawReview,
  };
}

function extractSection(text: string, keywords: string[]): string[] {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const matchedLines = lines.filter((line) => {
    const lower = line.toLowerCase();

    return (
      keywords.some((keyword) => lower.includes(keyword)) ||
      line.startsWith("-") ||
      line.startsWith("•") ||
      /^\d+\./.test(line)
    );
  });

  if (matchedLines.length === 0) {
    return ["No specific item was detected. Please refer to the full AI review below."];
  }

  return matchedLines
    .slice(0, 5)
    .map((line) => line.replace(/^[-•]\s*/, "").replace(/^\d+\.\s*/, ""));
}