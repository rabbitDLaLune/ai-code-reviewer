import { LANGUAGES } from "../data/languages";
import type { Language, Status, Theme } from "../types/review";

type InputPanelProps = {
  theme: Theme;
  language: Language;
  code: string;
  status: Status;
  lines: number;
  onLanguageChange: (language: Language) => void;
  onCodeChange: (code: string) => void;
  onReview: () => void;
  onClear: () => void;
};

export default function InputPanel({
  theme,
  language,
  code,
  status,
  lines,
  onLanguageChange,
  onCodeChange,
  onReview,
  onClear,
}: InputPanelProps) {
  const isDark = theme === "dark";

  return (
    <section
      className={`overflow-hidden rounded-2xl border shadow-2xl transition-colors duration-300 ${
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
        <div
          className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest ${
            isDark ? "text-slate-400" : "text-slate-500"
          }`}
        >
          <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]" />
          Input
        </div>

        <div className="flex gap-2">
          <span className="h-3 w-3 rounded-full bg-red-400" />
          <span className="h-3 w-3 rounded-full bg-yellow-400" />
          <span className="h-3 w-3 rounded-full bg-green-400" />
        </div>
      </div>

      <div className="flex flex-col gap-5 p-5">
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-500">
            ⌨ Language
          </p>

          <div className="flex flex-wrap gap-2">
            {LANGUAGES.map((item) => {
              const active = language === item.value;

              return (
                <button
                  key={item.value}
                  onClick={() => onLanguageChange(item.value)}
                  className={`rounded-lg border px-4 py-2 font-mono text-xs font-semibold transition hover:-translate-y-0.5 ${
                    active
                      ? isDark
                        ? "border-cyan-400 bg-cyan-400/10 text-cyan-300"
                        : "border-cyan-500 bg-cyan-50 text-cyan-700"
                      : isDark
                      ? "border-white/10 text-slate-500 hover:border-cyan-400/40"
                      : "border-slate-200 bg-white text-slate-500 hover:border-cyan-400 hover:text-cyan-700"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-500">
            ◈ Code
          </p>

          <textarea
            value={code}
            onChange={(e) => onCodeChange(e.target.value)}
            rows={18}
            placeholder="// Paste your code here..."
            className={`w-full resize-y rounded-xl border p-4 font-mono text-sm leading-6 outline-none transition ${
              isDark
                ? "border-white/10 bg-black/40 text-green-300 placeholder:text-slate-600 focus:border-cyan-400/50 focus:ring-4 focus:ring-cyan-400/10"
                : "border-slate-200 bg-slate-50 text-slate-800 placeholder:text-slate-400 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
            }`}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="font-mono text-xs text-slate-500">
            {code.length} chars · {lines} lines
          </span>

          <div className="flex gap-2">
            <button
              onClick={onClear}
              className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                isDark
                  ? "border-white/10 text-slate-400 hover:border-red-400/40 hover:text-red-400"
                  : "border-slate-200 bg-white text-slate-500 hover:border-red-400 hover:text-red-500"
              }`}
            >
              Clear
            </button>

            <button
              onClick={onReview}
              disabled={status === "loading" || !code.trim()}
              className="rounded-xl bg-gradient-to-r from-violet-600 to-cyan-400 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-violet-600/30 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {status === "loading" ? "⏳ Analyzing…" : "▶ Review Code"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}