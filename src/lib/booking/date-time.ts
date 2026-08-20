function wallClockValue(date: string, time: string) {
  const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  const timeMatch = /^(\d{2}):(\d{2})$/.exec(time);
  if (!dateMatch || !timeMatch) return Number.NaN;
  const [, year, month, day] = dateMatch; const [, hour, minute] = timeMatch;
  return Date.UTC(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute));
}
export function currentWallClockValue(now: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(now);
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? "0";
  return Date.UTC(Number(get("year")), Number(get("month")) - 1, Number(get("day")), Number(get("hour")), Number(get("minute")));
}
export function isPastLocalDateTime(date: string, time: string, now: Date, timeZone: string) { return wallClockValue(date, time) < currentWallClockValue(now, timeZone); }
export function isAfterLocalDateTime(laterDate: string, laterTime: string, earlierDate: string, earlierTime: string) { return wallClockValue(laterDate, laterTime) > wallClockValue(earlierDate, earlierTime); }
export function formatTripDateTime(date: string, time: string) { if (!date || !time) return ""; const [year, month, day] = date.split("-").map(Number); const [hour, minute] = time.split(":").map(Number); return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(year, month - 1, day, hour, minute)); }
