export function formatEventDate(iso: string, locale = "it-CH"): string {
  return new Date(iso).toLocaleString(locale, {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatPostDate(iso: string, locale = "it-CH"): string {
  return new Date(iso).toLocaleDateString(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function isUpcoming(iso: string, now = Date.now()): boolean {
  return new Date(iso).getTime() >= now;
}
