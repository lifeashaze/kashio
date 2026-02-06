const DATE_ONLY_REGEX = /^(\d{4})-(\d{2})-(\d{2})/;

function isValidDateParts(year: number, month: number, day: number): boolean {
  if (month < 1 || month > 12 || day < 1 || day > 31) return false;

  const candidate = new Date(year, month - 1, day);
  return (
    candidate.getFullYear() === year &&
    candidate.getMonth() === month - 1 &&
    candidate.getDate() === day
  );
}

function pad(value: number): string {
  return value.toString().padStart(2, "0");
}

export function dateToDateOnlyString(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}`;
}

export function normalizeDateInput(input: unknown): string | null {
  if (typeof input !== "string") return null;
  const trimmed = input.trim();

  const match = trimmed.match(DATE_ONLY_REGEX);
  if (match) {
    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);

    if (!isValidDateParts(year, month, day)) return null;
    return `${year}-${pad(month)}-${pad(day)}`;
  }

  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) return null;
  return dateToDateOnlyString(parsed);
}

export function dateOnlyStringToDate(value: string): Date | null {
  const normalized = normalizeDateInput(value);
  if (!normalized) return null;

  const [year, month, day] = normalized.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function formatRelativeDateLabel(value: string | Date): string {
  const date =
    typeof value === "string" ? dateOnlyStringToDate(value) : value;

  if (!date || Number.isNaN(date.getTime())) return "Invalid date";

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const dateKey = dateToDateOnlyString(date);
  const todayKey = dateToDateOnlyString(today);
  const yesterdayKey = dateToDateOnlyString(yesterday);

  if (dateKey === todayKey) return "Today";
  if (dateKey === yesterdayKey) return "Yesterday";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
