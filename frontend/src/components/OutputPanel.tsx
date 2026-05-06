import type { ReviewResult, Status, Theme } from "../types/review";
import ScoreCard from "./ScoreCard";
import SectionCard from "./SectionCard";

type OutputPanelProps = {
  theme: Theme;
  status: Status;
  language: string;
  review: ReviewResult | null;
  errorMessage: string;
  openSections: {
    summary: boolean;
    issues: boolean;
    suggestions: boolean;
    fullReview: boolean;
  };
  onToggleSection: (key: keyof OutputPanelProps["openSections"]) => void;
};

export default function OutputPanel({
  theme,
  status,
  language,
  review,
  errorMessage,
  openSections,
  onToggleSection,
}: OutputPanelProps) {
  const isDark = theme === "dark";

  return (
    <section
      className={`overflow-hidden rounded-2xl border shadow-2xl transition-colors duration-300 ${isDark
          ? "border-white/10 bg-slate-950 shadow-black/30"
          : "border-slate-200 bg-white shadow-slate-200/80"
        }`}
    >
      <div
        className={`flex items-center justify-between border-b px-5 py-4 ${isDark
            ? "border-white/10 bg-slate-900"
            : "border-slate-200 bg-slate-50"
          }`}
      >
        <div
          className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest ${isDark ? "text-slate-400" : "text-slate-500"
            }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${status === "done"
                ? "bg-emerald-400"
                : status === "loading"
                  ? "bg-yellow-400"
                  : status === "error"
                    ? "bg-red-400"
                    : "bg-slate-400"
              }`}
          />
          AI Output
        </div>

        <div className="flex gap-2">
          <span className="h-3 w-3 rounded-full bg-red-400" />
          <span className="h-3 w-3 rounded-full bg-yellow-400" />
          <span className="h-3 w-3 rounded-full bg-green-400" />
        </div>
      </div>

      <div className="h-[560px] overflow-y-auto p-5">
        {status === "idle" && (
          <div className="flex min-h-[500px] flex-col items-center justify-center gap-4 text-center">
            <div
              className={`flex h-16 w-16 items-center justify-center rounded-2xl border text-3xl ${isDark
                  ? "border-white/10 bg-slate-900"
                  : "border-slate-200 bg-slate-50"
                }`}
            >
              🔍
            </div>

            <h2 className={isDark ? "font-bold text-slate-200" : "font-bold text-slate-800"}>
              No review yet
            </h2>

            <p className="max-w-xs text-sm leading-6 text-slate-500">
              Paste your code on the left and click Review Code to get started.
            </p>
          </div>
        )}

        {status === "loading" && (
          <div className="flex min-h-[500px] flex-col items-center justify-center gap-5">
            <div
              className={`h-12 w-12 animate-spin rounded-full border-2 border-t-cyan-400 ${isDark ? "border-white/10" : "border-slate-200"
                }`}
            />

            <p className="font-mono text-sm text-slate-500">
              Analyzing your {language} code…
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="flex min-h-[500px] flex-col items-center justify-center gap-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-red-400/20 bg-red-400/10 text-3xl">
              ⚠️
            </div>

            <h2 className="font-bold text-red-400">Review failed</h2>

            <p className="max-w-sm text-sm leading-6 text-slate-500">
              {errorMessage}
            </p>
          </div>
        )}

        {status === "done" && review && (
          <div className="flex flex-col gap-3">
            <ScoreCard theme={theme} review={review} />

            {review.detectedLanguage && (
              <div
                className={`rounded-xl border px-4 py-3 text-sm ${theme === "dark"
                    ? "border-cyan-400/20 bg-cyan-400/10 text-cyan-300"
                    : "border-cyan-200 bg-cyan-50 text-cyan-700"
                  }`}
              >
                Detected Language:{" "}
                <span className="font-semibold">{review.detectedLanguage}</span>
              </div>
            )}

            <SectionCard
              theme={theme}
              icon="📋"
              title="Summary"
              open={openSections.summary}
              onToggle={() => onToggleSection("summary")}
            >
              {review.summary}
            </SectionCard>

            <SectionCard
              theme={theme}
              icon="⚠️"
              title="Potential Issues"
              open={openSections.issues}
              onToggle={() => onToggleSection("issues")}
            >
              {review.issues.map((item) => (
                <div key={item}>• {item}</div>
              ))}
            </SectionCard>

            <SectionCard
              theme={theme}
              icon="✨"
              title="Suggestions"
              open={openSections.suggestions}
              onToggle={() => onToggleSection("suggestions")}
            >
              {review.suggestions.map((item) => (
                <div key={item}>• {item}</div>
              ))}
            </SectionCard>

            <SectionCard
              theme={theme}
              icon="🤖"
              title="Full AI Review"
              open={openSections.fullReview}
              onToggle={() => onToggleSection("fullReview")}
            >
              {review.rawReview}
            </SectionCard>
          </div>
        )}
      </div>
    </section>
  );
}