"use client";

import { useRef, useState } from "react";
import { ArrowRight, Phone } from "lucide-react";

export function SwipeToCall({ href, phone }: { href: string; phone: string }) {
  const trackRef = useRef<HTMLButtonElement>(null);
  const handleRef = useRef<HTMLSpanElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const startRef = useRef(0);
  const movedRef = useRef(false);
  const offsetRef = useRef(0);
  const draggingRef = useRef(false);
  const [dragging, setDragging] = useState(false);
  const [completed, setCompleted] = useState(false);

  const maximumOffset = () => Math.max(0, (trackRef.current?.clientWidth ?? 0) - 52);
  const updateOffset = (value: number) => {
    offsetRef.current = value;
    if (handleRef.current) handleRef.current.style.transform = `translate3d(${value}px,0,0)`;
    if (fillRef.current) fillRef.current.style.width = `${value + 48}px`;
  };
  const call = () => { setCompleted(true); setDragging(false); window.setTimeout(() => updateOffset(0), 140); window.setTimeout(() => { setCompleted(false); window.location.href = href; }, 420); };

  return <div className="mt-5 w-full min-w-0 rounded-2xl border border-white/15 bg-navy-950/75 p-2.5 shadow-[0_12px_35px_rgba(0,8,18,.18)] backdrop-blur-md sm:p-3">
    <p className="text-center text-[10px] font-extrabold uppercase tracking-[.11em] text-white/60 sm:text-[11px]">Need a taxi? Call us now</p>
    <button
      ref={trackRef}
      type="button"
      aria-label={`Swipe or tap to call ${phone}`}
      onClick={() => { if (!movedRef.current) call(); movedRef.current = false; }}
      onPointerDown={(event) => { startRef.current = event.clientX - offsetRef.current; movedRef.current = false; draggingRef.current = true; setDragging(true); event.currentTarget.setPointerCapture(event.pointerId); }}
      onPointerMove={(event) => { if (!draggingRef.current) return; const next = Math.min(maximumOffset(), Math.max(0, event.clientX - startRef.current)); if (Math.abs(next - offsetRef.current) > 4) movedRef.current = true; updateOffset(next); }}
      onPointerUp={() => { const max = maximumOffset(); draggingRef.current = false; setDragging(false); if (max > 0 && offsetRef.current >= max * .68) call(); else window.requestAnimationFrame(() => updateOffset(0)); }}
      onPointerCancel={() => { draggingRef.current = false; setDragging(false); window.requestAnimationFrame(() => updateOffset(0)); }}
      className={`relative mt-2 flex h-14 w-full touch-none select-none items-center overflow-hidden rounded-full border px-1.5 text-white shadow-inner transition-colors focus-visible:outline-offset-4 ${completed ? "border-amber-500 bg-amber-500/15" : "border-white/15 bg-white/[.06]"}`}
    >
      <span ref={fillRef} className="pointer-events-none absolute inset-y-0 left-0 w-12 rounded-full bg-gradient-to-r from-amber-500/40 to-amber-500/15 transition-opacity duration-100" style={{ opacity: dragging || completed ? 1 : .2 }} />
      <span className={`pointer-events-none absolute inset-0 flex items-center justify-center px-14 text-[clamp(1.25rem,5.5vw,1.75rem)] font-extrabold tracking-[-.025em] transition-colors ${dragging || completed ? "text-white" : "text-white/90"}`}>{completed ? "Calling…" : phone}</span>
      <span className={`pointer-events-none absolute right-3 flex items-center transition-all ${dragging ? "text-amber-500 opacity-100" : "text-amber-500/65"}`} aria-hidden="true"><ArrowRight size={14}/><ArrowRight className="-ml-1.5" size={14}/></span>
      <span
        ref={handleRef}
        className={`relative z-10 grid size-10 shrink-0 place-items-center rounded-full border border-amber-500 bg-navy-950 text-amber-500 shadow-[0_5px_18px_rgba(0,0,0,.28)] will-change-transform ${dragging ? "" : "transition-transform duration-300 ease-out"}`}
        aria-hidden="true"
      ><Phone size={19}/></span>
    </button>
    <p className="mt-1.5 text-center text-[9px] font-bold uppercase tracking-[.12em] text-white/45">Swipe or tap to call</p>
  </div>;
}
