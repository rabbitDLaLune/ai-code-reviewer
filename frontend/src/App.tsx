import { useState } from "react";
import Header from "./components/Header";
import InputPanel from "./components/InputPanel";
import OutputPanel from "./components/OutputPanel";
import type { Language, ReviewResult, Status, Theme } from "./types/review";
import { createReviewResult } from "./utils/reviewParser";

export default function App() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [language, setLanguage] = useState<Language>("auto");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [review, setReview] = useState<ReviewResult | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [reviewCount, setReviewCount] = useState(0);

  const [openSections, setOpenSections] = useState({
    summary: true,
    issues: true,
    suggestions: true,
    fullReview: true,
  });

  const lines = code ? code.split("\n").length : 0;
  const isDark = theme === "dark";

  const handleReview = async () => {
    if (!code.trim()) {
      alert("Please paste your code first.");
      return;
    }

    setStatus("loading");
    setReview(null);
    setErrorMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language,
          code,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus("error");
        setErrorMessage(data.message || "Failed to review code.");
        return;
      }

      const result = {
        ...data.review,
        rawReview:
          data.review.rawReview ||
          `Detected Language: ${data.review.detectedLanguage || "Unknown"}

Score: ${data.review.score} / 100

Summary:
${data.review.summary}

Potential Issues:
${data.review.issues && data.review.issues.length > 0
            ? data.review.issues.map((issue: string) => `• ${issue}`).join("\n")
            : "• No major issues found."
          }

Suggestions:
${data.review.suggestions && data.review.suggestions.length > 0
            ? data.review.suggestions
              .map((suggestion: string) => `• ${suggestion}`)
              .join("\n")
            : "• No suggestions available."
          }

Tags:
${data.review.tags && data.review.tags.length > 0
            ? data.review.tags
              .map((tag: { label: string; type: string }) => `• ${tag.label} (${tag.type})`)
              .join("\n")
            : "• No tags available."
          }`,
      };

      setReview(result);
      setReviewCount((count) => count + 1);
      setStatus("done");
    } catch {
      setStatus("error");
      setErrorMessage(
        "Cannot connect to backend. Make sure your backend is running."
      );
    }
  };

  const handleClear = () => {
    setCode("");
    setStatus("idle");
    setReview(null);
    setErrorMessage("");
  };

  const toggleSection = (key: keyof typeof openSections) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <main
      className={`min-h-screen overflow-hidden px-6 py-8 transition-colors duration-300 ${isDark
        ? "bg-[#0a0c10] text-slate-200"
        : "bg-gradient-to-br from-slate-50 via-white to-cyan-50 text-slate-900"
        }`}
    >
      <div
        className={`pointer-events-none fixed -left-48 -top-48 h-[600px] w-[600px] rounded-full blur-3xl ${isDark ? "bg-violet-600/10" : "bg-violet-300/30"
          }`}
      />

      <div
        className={`pointer-events-none fixed -bottom-48 -right-48 h-[700px] w-[700px] rounded-full blur-3xl ${isDark ? "bg-cyan-400/10" : "bg-cyan-300/30"
          }`}
      />

      <div className="relative z-10 mx-auto max-w-7xl">
        <Header
          theme={theme}
          reviewCount={reviewCount}
          lines={lines}
          onToggleTheme={() =>
            setTheme((current) => (current === "dark" ? "light" : "dark"))
          }
        />

        <div className={isDark ? "mb-8 h-px bg-white/10" : "mb-8 h-px bg-slate-200"} />

        <div className="grid gap-6 lg:grid-cols-2">
          <InputPanel
            theme={theme}
            language={language}
            code={code}
            status={status}
            lines={lines}
            onLanguageChange={setLanguage}
            onCodeChange={setCode}
            onReview={handleReview}
            onClear={handleClear}
          />

          <OutputPanel
            theme={theme}
            status={status}
            language={language}
            review={review}
            errorMessage={errorMessage}
            openSections={openSections}
            onToggleSection={toggleSection}
          />
        </div>

        <footer
          className={`mt-10 flex flex-wrap items-center justify-between gap-3 border-t pt-6 ${isDark ? "border-white/10" : "border-slate-200"
            }`}
        >
          <div
            className={`flex items-center gap-2 text-xs ${isDark ? "text-slate-500" : "text-slate-500"
              }`}
          >
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />
            Local AI — Running offline · Ollama
          </div>

          <div className="font-mono text-xs text-slate-500">
            v1.0.0 · {isDark ? "🌙 Dark Mode" : "☀️ Light Mode"}
          </div>
        </footer>
      </div>
    </main>
  );
}