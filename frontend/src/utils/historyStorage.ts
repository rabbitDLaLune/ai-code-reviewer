import type { ReviewHistoryItem } from "../types/review";

const HISTORY_KEY = "ai_code_review_history_v1";

export function getReviewHistory(): ReviewHistoryItem[] {
  const raw = localStorage.getItem(HISTORY_KEY);

  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw) as ReviewHistoryItem[];
  } catch {
    return [];
  }
}

export function saveReviewHistory(items: ReviewHistoryItem[]) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(items));
}

export function clearReviewHistory() {
  localStorage.removeItem(HISTORY_KEY);
}