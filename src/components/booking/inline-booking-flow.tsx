"use client";

import { useEffect, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import { BookingFlow } from "./booking-flow";
import { useBooking } from "./booking-context";

export function InlineBookingFlow() {
  const { request, closeBooking, syncDraft } = useBooking();
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (request) panelRef.current?.scrollIntoView({ block: "start" });
  }, [request]);

  function returnToForm() {
    closeBooking();
    requestAnimationFrame(() => document.getElementById("booking-widget-title")?.focus());
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
