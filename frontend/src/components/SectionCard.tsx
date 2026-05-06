import type { Theme } from "../types/review";

type SectionCardProps = {
  theme: Theme;
  icon: string;
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
};

export default function SectionCard({
  theme,
  icon,
  title,
  open,
  onToggle,
  children,
}: SectionCardProps) {
  const isDark = theme === "dark";

  return (
    <div
      className={`overflow-hidden rounded-xl border ${
        isDark ? "border-white/10 bg-slate-900" : "border-slate-200 bg-slate-50"
      }`}
    >
      <button
        onClick={onToggle}
        className={`flex w-full items-center gap-3 border-b px-4 py-3 text-left text-xs font-bold uppercase tracking-widest ${
          isDark
            ? "border-white/10 text-slate-200"
            : "border-slate-200 text-slate-700"
        }`}
      >
        <span>{icon}</span>
        <span className="flex-1">{title}</span>
        <span className="text-slate-500">{open ? "▾" : "▸"}</span>
      </button>

      {open && (
        <div
          className={`whitespace-pre-wrap p-4 text-sm leading-7 ${
            isDark ? "text-slate-400" : "text-slate-600"
          }`}
        >
          {children}
        </div>
      )}
    </div>
  );
}