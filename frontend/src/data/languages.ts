import type { Language } from "../types/review";

export const LANGUAGES: { value: Language; label: string }[] = [
  { value: "auto", label: "Auto" },
  { value: "javascript", label: "JS" },
  { value: "typescript", label: "TS" },
  { value: "python", label: "Python" },
  { value: "php", label: "PHP" },
  { value: "csharp", label: "C#" },
  { value: "java", label: "Java" },
  { value: "vbnet", label: "VB.NET" },
];