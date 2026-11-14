"use client";
import { useEffect, useReducer, useRef, useState } from "react";
import { bookingConfig } from "@/config/booking";
import { siteConfig } from "@/config/site";
import { emptyDraft, isVehicleEligible, parsePreferredVehicle, parseStoredDraft, parseTripSearchParams, saveDraft, updateDraftTrip } from "@/lib/booking/booking-draft";
import { operatorFareEstimator } from "@/lib/booking/operator-fare-estimator";
import { createWhatsAppHandoff, type WhatsAppHandoff } from "@/lib/booking/whatsapp-handoff";
import type { BookingDraft, BookingStep, FareEstimate, PassengerDetails, TripDetails } from "@/types/booking";
import { BookingProgress } from "./booking-progress";
import { BookingSummary } from "./booking-summary";
import { ConfirmationStep } from "./confirmation-step";
import { PassengerStep } from "./passenger-step";
import { ReviewStep } from "./review-step";
import { RideStep } from "./ride-step";
import { TripStep } from "./trip-step";

type State = { step: BookingStep; draft: BookingDraft; result: WhatsAppHandoff | null };
type Action = { type: "hydrate"; draft: BookingDraft; step: BookingStep } | { type: "trip"; trip: TripDetails } | { type: "fare"; fare: FareEstimate } | { type: "vehicle"; id: string } | { type: "passenger"; passenger: PassengerDetails } | { type: "step"; step: BookingStep } | { type: "prepared"; result: WhatsAppHandoff };
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "hydrate": return { ...state, draft: action.draft, step: action.step };
    case "trip": return { ...state, step: "ride", draft: updateDraftTrip(state.draft, action.trip) };
    case "fare": return { ...state, draft: { ...state.draft, fare: action.fare } };
    case "vehicle": return { ...state, draft: { ...state.draft, vehicleId: action.id } };
    case "passenger": return { ...state, step: "review", draft: { ...state.draft, passenger: action.passenger } };
    case "step": return { ...state, step: action.step };
    case "prepared": return { ...state, step: "confirmation", result: action.result };
  }
}
export function BookingFlow({ initialQuery, startAtRide = false, onDraftChange, onNewBooking }: { initialQuery: string; startAtRide?: boolean; onDraftChange: (draft: BookingDraft) => void; onNewBooking: () => void }) {
  const [state, dispatch] = useReducer(reducer, { step: "trip", draft: emptyDraft, result: null });
  const [hydrated, setHydrated] = useState(false);
  const [fareLoading, setFareLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const operations = useRef({ mounted: true, revision: 0 });
  useEffect(() => { const guard = operations.current; guard.mounted = true; return () => { guard.mounted = false; guard.revision++; }; }, []);
  useEffect(() => {
    let active = true;
    void Promise.resolve().then(async () => {
      if (!active) return;
      const params = new URLSearchParams(initialQuery);
      const urlTrip = parseTripSearchParams(params);
      const preferredVehicle = parsePreferredVehicle(params);
      let stored = emptyDraft;
      try { stored = parseStoredDraft(sessionStorage.getItem(bookingConfig.storageKey)); } catch { /* Continue without browser storage. */ }
      const restored = urlTrip ? updateDraftTrip(stored, urlTrip) : stored;
      const vehicleId = preferredVehicle && (!restored.trip || isVehicleEligible(preferredVehicle, restored.trip.passengers)) ? preferredVehicle : restored.vehicleId;
      const draft = { ...restored, vehicleId };
      const showRides = startAtRide && Boolean(urlTrip);
      dispatch({ type: "hydrate", draft, step: showRides ? "ride" : "trip" });
      setHydrated(true);
      if (showRides && urlTrip) {
        setFareLoading(true);
        try {
          const fare = await operatorFareEstimator.estimate(urlTrip, vehicleId ?? undefined);
          if (active) dispatch({ type: "fare", fare });
        } catch {
          if (active) dispatch({ type: "fare", fare: { status: "error", message: "Fare information is unavailable. You can still ask the operator on WhatsApp." } });
        } finally { if (active) setFareLoading(false); }
      }
    });
    return () => { active = false; };
  }, [initialQuery, startAtRide]);
  useEffect(() => {
    if (!hydrated) return;
    onDraftChange(state.draft);
    saveDraft(state.draft);
  }, [hydrated, state.draft, state.step, onDraftChange]);
  useEffect(() => {
    if (hydrated) contentRef.current?.querySelector<HTMLElement>("h2[tabindex]")?.focus();
  }, [hydrated, state.step]);
  async function estimate(trip: TripDetails) {
    const revision = ++operations.current.revision;
    setFareLoading(true);
    try {
      const fare = await operatorFareEstimator.estimate(trip, state.draft.vehicleId ?? undefined);
      if (operations.current.mounted && revision === operations.current.revision) dispatch({ type: "fare", fare });
    } catch {
      if (operations.current.mounted && revision === operations.current.revision) dispatch({ type: "fare", fare: { status: "error", message: "Fare information is unavailable. Please ask the operator to quote this journey." } });
    } finally { if (operations.current.mounted && revision === operations.current.revision) setFareLoading(false); }
  }
  function handleTrip(trip: TripDetails) { dispatch({ type: "trip", trip }); void estimate(trip); }
  function prepareWhatsApp() {
    setSubmitError(null);
    try {
      const result = createWhatsAppHandoff(state.draft, siteConfig.whatsapp);
      dispatch({ type: "prepared", result });
      // User-initiated navigation only. WhatsApp requires the user to review and tap Send.
      window.open(result.url, "_blank", "noopener,noreferrer");
    } catch {
      setSubmitError("Please recheck the trip date, contact details and vehicle. If the pickup time has passed, edit the trip before continuing.");
    }
  }
  if (!hydrated) return <div className="container-site py-12" role="status">Preparing your booking form…</div>;
  return <div className="container-site py-8 md:py-12">
    <BookingProgress step={state.step} />
    <div className={state.step === "confirmation" ? "mx-auto max-w-3xl" : "grid min-w-0 gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(18rem,1fr)] xl:items-start xl:gap-8"}>
      <div ref={contentRef} className="min-w-0 rounded-2xl border border-line bg-white p-5 shadow-[var(--shadow-card)] sm:p-7 lg:p-9">
        {state.step === "trip" && <TripStep initial={state.draft.trip} onContinue={handleTrip} />}
        {state.step === "ride" && state.draft.trip && <RideStep trip={state.draft.trip} fare={state.draft.fare} fareLoading={fareLoading} selected={state.draft.vehicleId} onSelect={(id) => dispatch({ type: "vehicle", id })} onRetry={() => void estimate(state.draft.trip!)} onBack={() => dispatch({ type: "step", step: "trip" })} onContinue={() => dispatch({ type: "step", step: "details" })} />}
        {state.step === "details" && <PassengerStep initial={state.draft.passenger} onBack={() => dispatch({ type: "step", step: "ride" })} onContinue={(passenger) => dispatch({ type: "passenger", passenger })} />}
        {state.step === "review" && <ReviewStep draft={state.draft} submitting={false} submitError={submitError} onEdit={(step) => dispatch({ type: "step", step })} onBack={() => dispatch({ type: "step", step: "details" })} onSubmit={prepareWhatsApp} />}
        {state.step === "confirmation" && state.result && <ConfirmationStep draft={state.draft} result={state.result} onNewBooking={onNewBooking} onEdit={() => dispatch({ type: "step", step: "review" })} />}
      </div>
      {state.step !== "confirmation" && <div className="xl:sticky xl:top-28"><BookingSummary draft={state.draft} compact={state.step === "trip"} /></div>}
    </div>
  </div>;
}
