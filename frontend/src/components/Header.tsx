import type { Theme } from "../types/review";

type HeaderProps = {
  theme: Theme;
  reviewCount: number;
  lines: number;
  onToggleTheme: () => void;
};

export default function Header({
  theme,
  reviewCount,
  lines,
  onToggleTheme,
}: HeaderProps) {
  const isDark = theme === "dark";

  return (
    <header className="mb-10 flex flex-wrap items-start justify-between gap-4">
      <div>
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-cyan-400 text-lg shadow-lg shadow-cyan-500/20">
            ⚡
          </div>

          <span
            className={`rounded-full border px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.15em] ${
              isDark
                ? "border-cyan-400/20 bg-cyan-400/10 text-cyan-400"
                : "border-cyan-500/30 bg-cyan-100 text-cyan-700"
            }`}
          >
            Local AI Tool
          </span>
        </div>

        <h1
          className={`bg-gradient-to-r bg-clip-text text-4xl font-extrabold tracking-tight text-transparent ${
            isDark
              ? "from-white to-cyan-400"
              : "from-slate-950 via-indigo-700 to-cyan-600"
          }`}
        >
          AI Code Reviewer
        </h1>

        <p
          className={`mt-3 max-w-xl text-sm leading-6 ${
            isDark ? "text-slate-400" : "text-slate-600"
          }`}
        >
          Paste your source code and get instant AI feedback on bugs, security,
          readability, and improvement suggestions.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-6">
        <div className="flex gap-6 text-right">
          <div>
            <div className="font-mono text-2xl font-extrabold text-cyan-500">
              {reviewCount}
            </div>
            <div className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
              Reviews
            </div>
          </div>

          <div>
            <div className="font-mono text-2xl font-extrabold text-cyan-500">
              {lines}
            </div>
            <div className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
              Lines
            </div>
          </div>
        </div>

        <button
          onClick={onToggleTheme}
          className={`rounded-xl border px-4 py-2 text-sm font-bold transition ${
            isDark
              ? "border-white/10 bg-slate-900 text-slate-200 hover:border-cyan-400/40"
              : "border-slate-200 bg-white text-slate-700 shadow-sm hover:border-cyan-400 hover:text-cyan-700"
          }`}
        >
          {isDark ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>
    </header>
  );
}