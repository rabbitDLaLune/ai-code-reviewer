import type { ReviewResult, Theme } from "../types/review";

type ScoreCardProps = {
  theme: Theme;
  review: ReviewResult;
};

export default function ScoreCard({ theme, review }: ScoreCardProps) {
  const isDark = theme === "dark";

  const scoreColor =
    review.score >= 85
      ? "bg-emerald-400 text-emerald-400"
      : review.score >= 65
      ? "bg-yellow-400 text-yellow-400"
      : "bg-red-400 text-red-400";

  const textColor = scoreColor.split(" ")[1];
  const bgColor = scoreColor.split(" ")[0];

  return (
    <div
      className={`overflow-hidden rounded-xl border ${
        isDark ? "border-white/10 bg-slate-900" : "border-slate-200 bg-slate-50"
      }`}
    >
      <div className="flex items-center gap-5 p-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
            Quality Score
          </p>

          <div className={`font-mono text-4xl font-extrabold ${textColor}`}>
            {review.score}
          </div>
        </div>

        <div className="flex-1">
          <div
            className={`h-2 overflow-hidden rounded-full ${
              isDark ? "bg-white/10" : "bg-slate-200"
            }`}
          >
            <div
              className={`h-full rounded-full ${bgColor}`}
              style={{ width: `${review.score}%` }}
            />
          </div>

          <div className="mt-2 flex justify-between text-xs text-slate-500">
            <span>0</span>
            <span>{review.score} / 100</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 px-5 pb-5">
        {review.tags.map((tag) => (
          <span
            key={tag.label}
            className={`rounded-md border px-3 py-1 font-mono text-xs font-semibold ${
              tag.type === "good"
                ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-500"
                : tag.type === "warn"
                ? "border-yellow-400/20 bg-yellow-400/10 text-yellow-600"
                : "border-red-400/20 bg-red-400/10 text-red-500"
            }`}
          >
            {tag.label}
          </span>
        ))}
      </div>
    </div>
  );
}