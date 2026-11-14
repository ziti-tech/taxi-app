"use client";
import { useEffect, useId, useImperativeHandle, useMemo, useRef, useState, type Ref } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Clock3, X } from "lucide-react";
import { bookingConfig } from "@/config/booking";
import { isValidDateString } from "@/lib/booking/date-time";
import { cn } from "@/lib/utils";

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const timeOptions = Array.from({ length: 96 }, (_, index) => `${String(Math.floor(index / 4)).padStart(2, "0")}:${String((index % 4) * 15).padStart(2, "0")}`);
function toIsoDate(date: Date) { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`; }
function parseDate(value: string) { if (!isValidDateString(value)) return null; const [year, month, day] = value.split("-").map(Number); return new Date(year, month - 1, day); }
function serviceToday() { const parts = new Intl.DateTimeFormat("en-CA", { timeZone: bookingConfig.timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date()); const part = (type: string) => Number(parts.find((item) => item.type === type)?.value); return new Date(part("year"), part("month") - 1, part("day")); }
function formatDate(value: string) { const date = parseDate(value); return date ? new Intl.DateTimeFormat("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" }).format(date) : "Choose date"; }
function formatTime(value: string) { if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) return "Choose time"; const [hours, minutes] = value.split(":").map(Number); return new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit" }).format(new Date(2000, 0, 1, hours, minutes)); }

export function DateTimePickerField({ mode, label, value, onChange, error, inputRef }: { mode: "date" | "time"; label: string; value: string; onChange: (value: string) => void; error?: string; inputRef?: Ref<HTMLButtonElement> }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const selectedDate = parseDate(value);
  const todayDate = serviceToday();
  const [month, setMonth] = useState(() => selectedDate && selectedDate >= todayDate ? selectedDate : todayDate);
  const [position, setPosition] = useState({ left: 16, top: 16 });
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  useImperativeHandle(inputRef, () => triggerRef.current!);
  const pendingDateFocus = useRef<string | null>(null);
  const Icon = mode === "date" ? CalendarDays : Clock3;
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!open) { if (dialog.open) dialog.close(); return; }
    if (!dialog.open) dialog.showModal();
    const frame = requestAnimationFrame(() => {
      const selected = dialog.querySelector<HTMLButtonElement>('button[aria-pressed="true"]:not(:disabled), button[data-today="true"]:not(:disabled)');
      (selected ?? dialog.querySelector<HTMLButtonElement>("button"))?.focus();
    });
    return () => cancelAnimationFrame(frame);
  }, [open]);
  useEffect(() => {
    if (!pendingDateFocus.current) return;
    const target = pendingDateFocus.current;
    pendingDateFocus.current = null;
    dialogRef.current?.querySelector<HTMLButtonElement>(`button[data-date="${target}"]`)?.focus();
  }, [month]);
  const calendarDays = useMemo(() => {
    const start = new Date(month.getFullYear(), month.getMonth(), 1);
    start.setDate(1 - start.getDay());
    return Array.from({ length: 42 }, (_, index) => { const date = new Date(start); date.setDate(start.getDate() + index); return date; });
  }, [month]);
  function openPicker() {
    const rect = triggerRef.current!.getBoundingClientRect();
    const width = Math.min(320, window.innerWidth - 32);
    const desiredHeight = mode === "date" ? 470 : 385;
    const availableBelow = window.innerHeight - rect.bottom - 16;
    setPosition({ left: Math.max(16, Math.min(rect.left, window.innerWidth - width - 16)), top: availableBelow >= desiredHeight ? rect.bottom + 8 : Math.max(16, rect.top - desiredHeight - 8) });
    if (mode === "date") setMonth(selectedDate && selectedDate >= todayDate ? selectedDate : todayDate);
    setOpen(true);
  }
  function closePicker() { setOpen(false); requestAnimationFrame(() => triggerRef.current?.focus({ preventScroll: true })); }
  function choose(next: string) { onChange(next); closePicker(); }
  function moveDate(event: React.KeyboardEvent<HTMLButtonElement>, date: Date) {
    const offsets: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7, Home: -date.getDay(), End: 6 - date.getDay() };
    if (!(event.key in offsets)) return;
    event.preventDefault();
    const next = new Date(date); next.setDate(next.getDate() + offsets[event.key]);
    if (next < todayDate) return;
    const iso = toIsoDate(next);
    const target = dialogRef.current?.querySelector<HTMLButtonElement>(`button[data-date="${iso}"]`);
    if (target) target.focus(); else { pendingDateFocus.current = iso; setMonth(next); }
  }
  function moveTime(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    const offset = event.key === "ArrowDown" || event.key === "ArrowRight" ? 1 : event.key === "ArrowUp" || event.key === "ArrowLeft" ? -1 : 0;
    if (!offset && !["Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === "Home" ? 0 : event.key === "End" ? timeOptions.length - 1 : Math.max(0, Math.min(timeOptions.length - 1, index + offset));
    dialogRef.current?.querySelector<HTMLButtonElement>(`button[data-time-index="${next}"]`)?.focus();
  }
  const today = toIsoDate(todayDate);
  const tomorrow = new Date(todayDate); tomorrow.setDate(tomorrow.getDate() + 1);
  return <div className="relative min-w-0">
    <span id={`${id}-label`} className="mb-1.5 block text-xs font-extrabold uppercase tracking-[.08em] text-muted">{label}</span>
    <button ref={triggerRef} type="button" data-picker-label={label} aria-haspopup="dialog" aria-expanded={open} aria-controls={`${id}-dialog`} aria-labelledby={`${id}-label ${id}-value`} data-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} onClick={openPicker} className={cn("flex min-h-[52px] w-full min-w-0 items-center gap-3 rounded-xl border bg-white px-3.5 text-left transition-colors", error ? "border-danger" : open ? "border-navy-900 ring-3 ring-amber-500/30" : "border-line hover:border-navy-800")}>
      <Icon aria-hidden="true" className="shrink-0 text-navy-800" size={18} /><span id={`${id}-value`} className={cn("min-w-0 flex-1 truncate text-base font-bold", value ? "text-ink" : "text-muted")}>{mode === "date" ? formatDate(value) : formatTime(value)}</span><ChevronRight aria-hidden="true" className="shrink-0 text-muted" size={17} />
    </button>
    {error && <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs font-bold text-danger">{error}</p>}
    {open && <dialog id={`${id}-dialog`} ref={dialogRef} aria-label={`Choose ${label.toLowerCase()}`} onCancel={closePicker} onClose={() => { setOpen(false); triggerRef.current?.focus({ preventScroll: true }); }} onClick={(event) => {
      if (event.target !== event.currentTarget) return;
      const bounds = event.currentTarget.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) closePicker();
    }} style={position} className="fixed m-0 max-h-[calc(100dvh-2rem)] w-[min(20rem,calc(100vw-2rem))] overflow-y-auto rounded-2xl border border-line bg-white p-3 text-ink shadow-2xl backdrop:bg-navy-950/25">
      <div className="flex items-center justify-between border-b border-line pb-3"><p className="text-sm font-extrabold text-navy-950">{mode === "date" ? "Select a date" : "Select a time (IST)"}</p><button type="button" onClick={closePicker} className="grid size-10 place-items-center rounded-lg text-muted hover:bg-warm-50" aria-label={`Close ${mode} picker`}><X aria-hidden="true" size={18} /></button></div>
      {mode === "date" ? <>
        <div className="grid grid-cols-[2.5rem_1fr_2.5rem] items-center gap-2 py-3"><button type="button" className="grid size-10 place-items-center rounded-lg border border-line bg-white text-navy-950 hover:bg-[#fff7df]" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))} aria-label="Previous month"><ChevronLeft aria-hidden="true" size={19} /></button><p aria-live="polite" className="text-center text-sm font-extrabold text-navy-950">{new Intl.DateTimeFormat("en-IN", { month: "long", year: "numeric" }).format(month)}</p><button type="button" className="grid size-10 place-items-center rounded-lg border border-line bg-[#fff7df] text-navy-950 hover:bg-amber-500" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))} aria-label="Next month"><ChevronRight aria-hidden="true" size={19} /></button></div>
        <div className="grid grid-cols-7 text-center">{weekDays.map((day) => <span key={day} className="py-2 text-[10px] font-extrabold uppercase text-muted">{day}</span>)}{calendarDays.map((date) => {
          const iso = toIsoDate(date); const past = date < todayDate; const selected = iso === value; const isToday = iso === today;
          return <button type="button" data-date={iso} data-today={isToday} key={iso} disabled={past} onKeyDown={(event) => moveDate(event, date)} onClick={() => choose(iso)} aria-label={new Intl.DateTimeFormat("en-IN", { dateStyle: "full" }).format(date)} aria-pressed={selected} className={cn("mx-auto grid size-10 place-items-center rounded-full text-sm font-bold", selected ? "bg-navy-900 text-white ring-2 ring-amber-500 ring-offset-2" : isToday ? "border-2 border-amber-500 bg-[#fffaf0] text-navy-950" : date.getMonth() !== month.getMonth() ? "text-muted hover:bg-warm-50" : "text-ink hover:bg-[#fff2cc]", past && "cursor-not-allowed opacity-35")}>{date.getDate()}</button>;
        })}</div>
        <div className="mt-3 grid grid-cols-3 gap-2 border-t border-line pt-3"><button type="button" onClick={() => choose(today)} className="min-h-10 rounded-lg bg-warm-50 px-2 text-xs font-extrabold text-navy-900 hover:bg-[#fff2cc]">Today</button><button type="button" onClick={() => choose(toIsoDate(tomorrow))} className="min-h-10 rounded-lg bg-warm-50 px-2 text-xs font-extrabold text-navy-900 hover:bg-[#fff2cc]">Tomorrow</button><button type="button" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))} className="min-h-10 rounded-lg bg-navy-900 px-2 text-xs font-extrabold text-white hover:bg-navy-800">Next month</button></div>
      </> : <div className="mt-3 grid max-h-72 grid-cols-2 gap-1 overflow-y-auto pr-1 sm:grid-cols-3">{timeOptions.map((time, index) => <button type="button" data-time-index={index} key={time} onKeyDown={(event) => moveTime(event, index)} onClick={() => choose(time)} aria-pressed={value === time} className={cn("min-h-11 rounded-lg px-2 text-sm font-bold", value === time ? "bg-navy-900 text-white ring-2 ring-amber-500 ring-offset-1" : "text-ink hover:bg-[#fff2cc]")}>{formatTime(time)}</button>)}</div>}
    </dialog>}
  </div>;
}
