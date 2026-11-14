"use client";

import { useEffect, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import dynamic from "next/dynamic";
import { useBooking } from "./booking-context";

const BookingFlow = dynamic(() => import("./booking-flow").then((module) => module.BookingFlow), {
  loading: () => <div className="container-site py-12" role="status">Preparing your booking form…</div>,
});

export function InlineBookingFlow() {
  const { request, closeBooking, syncDraft } = useBooking();
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (request) panelRef.current?.scrollIntoView({ block: "start" });
  }, [request]);

  function returnToForm() {
    closeBooking();
    requestAnimationFrame(() => {
      document.getElementById("book")?.scrollIntoView({ block: "start" });
      document.getElementById("booking-widget-title")?.focus({ preventScroll: true });
    });
  }

  if (!request) return null;

  return (
    <section id="booking-details" ref={panelRef} aria-label="Complete your booking request" className="scroll-mt-24 border-b border-line bg-warm-50 pb-5">
      <div className="container-site pt-6">
        <button type="button" onClick={returnToForm} className="inline-flex min-h-11 items-center gap-2 text-sm font-extrabold text-navy-900">
          <ArrowLeft size={17} /> Back to trip form
        </button>
      </div>
      <BookingFlow key={request.revision} initialQuery={request.query} startAtRide onDraftChange={syncDraft} onNewBooking={returnToForm} />
    </section>
  );
}
