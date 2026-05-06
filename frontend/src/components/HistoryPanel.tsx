import type { ReviewHistoryItem, Theme } from "../types/review";

type HistoryPanelProps = {
  theme: Theme;
  history: ReviewHistoryItem[];
  onSelect: (item: ReviewHistoryItem) => void;
  onClear: () => void;
};

export default function HistoryPanel({
  theme,
  history,
  onSelect,
  onClear,
}: HistoryPanelProps) {
  const isDark = theme === "dark";

  return (
    <section
      className={`mt-6 overflow-hidden rounded-2xl border shadow-2xl transition-colors duration-300 ${
        isDark
          ? "border-white/10 bg-slate-950 shadow-black/30"
          : "border-slate-200 bg-white shadow-slate-200/80"
      }`}
    >
      <div
        className={`flex items-center justify-between border-b px-5 py-4 ${
          isDark
            ? "border-white/10 bg-slate-900"
            : "border-slate-200 bg-slate-50"
        }`}
      >
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500">
          🕘 Review History
        </div>

        <button
          onClick={onClear}
          disabled={history.length === 0}
          className={`rounded-lg border px-3 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
            isDark
              ? "border-white/10 text-slate-400 hover:border-red-400/40 hover:text-red-400"
              : "border-slate-200 bg-white text-slate-500 hover:border-red-400 hover:text-red-500"
          }`}
        >
          Clear History
        </button>
      </div>

      <div className="max-h-[280px] overflow-y-auto p-4">
        {history.length === 0 ? (
          <p className="text-sm text-slate-500">
            No review history yet. Review some code first.
          </p>
        ) : (
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {history.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelect(item)}
                className={`rounded-xl border p-4 text-left transition hover:-translate-y-0.5 ${
                  isDark
                    ? "border-white/10 bg-slate-900 hover:border-cyan-400/40"
                    : "border-slate-200 bg-slate-50 hover:border-cyan-400"
                }`}
              >
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="font-mono text-xs font-bold text-cyan-500">
                    {item.review.detectedLanguage ||
                      item.detectedLanguage ||
                      item.language}
                  </span>

                  <span
                    className={`rounded-full px-2 py-1 font-mono text-xs font-bold ${
                      item.review.score >= 85
                        ? "bg-emerald-400/10 text-emerald-500"
                        : item.review.score >= 65
                        ? "bg-yellow-400/10 text-yellow-600"
                        : "bg-red-400/10 text-red-500"
                    }`}
                  >
                    {item.review.score}/100
                  </span>
                </div>

                <p
                  className={`line-clamp-2 text-sm ${
                    isDark ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  {item.review.summary}
                </p>

                <p className="mt-3 text-xs text-slate-500">
                  {new Date(item.createdAt).toLocaleString()}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}