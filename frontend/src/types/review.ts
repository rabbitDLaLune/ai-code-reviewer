export type Theme = "dark" | "light";

export type Language =
  | "auto"
  | "javascript"
  | "typescript"
  | "python"
  | "php"
  | "csharp"
  | "java"
  | "vbnet";

export type Status = "idle" | "loading" | "done" | "error";

export interface ReviewResult {
  score: number;
  summary: string;
  issues: string[];
  suggestions: string[];
  tags: {
    label: string;
    type: "good" | "warn" | "bad";
  }[];
  detectedLanguage?: string;
  rawReview?: string;
}