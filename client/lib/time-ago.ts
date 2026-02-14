import { m } from "framer-motion";

function timeAgo(
  inputDate: Date | string | number,
  nowText = "just now"
): string {
  const date =
    typeof inputDate === "string" || typeof inputDate === "number"
      ? new Date(inputDate)
      : inputDate;

  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const intervals: { [key: string]: number } = {
    y: 31536000,
    mon: 2592000,
    w: 604800,
    d: 86400,
    h: 3600,
    m: 60,
    s: 1,
  };

  for (const [unit, value] of Object.entries(intervals)) {
    const count = Math.floor(seconds / value);
    if (count >= 1) {
      return `${count}${unit}`;
    }
  }

  return nowText;
}

export default timeAgo;

export function formatMaxUnit(ms: number): string {
  const minutes = Math.floor(ms / (1000 * 60));
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  const years = Math.floor(days / 365); // simple approximation

  if (years >= 1) return `${years}y`;
  if (days >= 1) return `${days}d`;
  if (hours >= 1) return `${hours}h`;
  if (minutes <= 1) return "just now";
  return `${minutes}min`;
}
