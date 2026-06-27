import { formatDistanceToNow } from "date-fns";

export function formatRelativeDate(date: string): string {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
  });
}

export function formatDateTime(date: string): string {
  return new Date(date).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatSmartDate(date: string): string {
  const d = new Date(date);
  const now = new Date();

  const isSameDay =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();

  if (isSameDay) {
    return formatDistanceToNow(d, { addSuffix: true });
  }

  return d.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export const formatDuration = (seconds: number): string => {
  if (!seconds || isNaN(seconds)) return "0:00";

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};
