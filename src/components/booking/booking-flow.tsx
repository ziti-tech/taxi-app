"use client";
import { useEffect, useReducer, useRef, useState } from "react";
import { bookingConfig } from "@/config/booking";
import { clearStoredDraft, emptyDraft, parsePreferredVehicle, parseStoredDraft, parseTripPrefill, parseTripSearchParams, saveDraft, updateDraftTrip } from "@/lib/booking/booking-draft";
import { mockBookingGateway } from "@/lib/booking/mock-booking-gateway";
import { mockFareEstimator } from "@/lib/booking/mock-fare-estimator";
import type { BookingDraft, BookingReference, BookingStep, FareEstimate, PassengerDetails, TripDetails } from "@/types/booking";
import { BookingProgress } from "./booking-progress";
import { BookingSummary } from "./booking-summary";
import { ConfirmationStep } from "./confirmation-step";
import { PassengerStep } from "./passenger-step";
import { ReviewStep } from "./review-step";
import { RideStep } from "./ride-step";
import { TripStep } from "./trip-step";

type State = { step: BookingStep; draft: BookingDraft; result: BookingReference | null };
type Action = { type: "hydrate"; draft: BookingDraft } | { type: "trip"; trip: TripDetails } | { type: "fare"; fare: FareEstimate } | { type: "vehicle"; id: string } | { type: "passenger"; passenger: PassengerDetails } | { type: "step"; step: BookingStep } | { type: "confirmed"; result: BookingReference };
function reducer(state: State, action: Action): State { switch (action.type) { case "hydrate": return { ...state, draft: action.draft }; case "trip": return { ...state, step: "ride", draft: updateDraftTrip(state.draft, action.trip) }; case "fare": return { ...state, draft: { ...state.draft, fare: action.fare } }; case "vehicle": return { ...state, draft: { ...state.draft, vehicleId: action.id } }; case "passenger": return { ...state, step: "review", draft: { ...state.draft, passenger: action.passenger } }; case "step": return { ...state, step: action.step }; case "confirmed": return { ...state, step: "confirmation", result: action.result }; } }
export function BookingFlow({ initialQuery }: { initialQuery: string }) {
  const [state, dispatch] = useReducer(reducer, { step: "trip", draft: emptyDraft, result: null }); const [hydrated, setHydrated] = useState(false); const [fareLoading, setFareLoading] = useState(false); const [submitting, setSubmitting] = useState(false); const submittingRef = useRef(false); const [submitError, setSubmitError] = useState<string | null>(null); const contentRef = useRef<HTMLDivElement>(null);
  const queryParams = new URLSearchParams(initialQuery); const prefill = parseTripPrefill(queryParams);
  useEffect(() => { let active = true; void Promise.resolve().then(() => { if (!active) return; const params = new URLSearchParams(initialQuery); const urlTrip = parseTripSearchParams(params); const preferredVehicle = parsePreferredVehicle(params); const stored = parseStoredDraft(sessionStorage.getItem(bookingConfig.storageKey)); const restored = urlTrip ? updateDraftTrip(stored, urlTrip) : stored; dispatch({ type: "hydrate", draft: { ...restored, vehicleId: preferredVehicle ?? restored.vehicleId } }); setHydrated(true); }); return () => { active = false; }; }, [initialQuery]);
  useEffect(() => { if (hydrated && state.step !== "confirmation") saveDraft(state.draft); }, [hydrated, state.draft, state.step]);
  useEffect(() => { contentRef.current?.querySelector<HTMLElement>("h1")?.focus(); }, [state.step]);
  const estimate = async (trip: TripDetails) => { setFareLoading(true); const fare = await mockFareEstimator.estimate(trip, state.draft.vehicleId ?? undefined); dispatch({ type: "fare", fare }); setFareLoading(false); };
  const handleTrip = (trip: TripDetails) => { dispatch({ type: "trip", trip }); void estimate(trip); };
  const submit = async () => { if (submittingRef.current) return; submittingRef.current = true; setSubmitting(true); setSubmitError(null); try { const result = await mockBookingGateway.submit(state.draft); clearStoredDraft(); dispatch({ type: "confirmed", result }); } catch (error) { setSubmitError(error instanceof Error ? error.message : "The request could not be submitted."); } finally { submittingRef.current = false; setSubmitting(false); } };
  if (!hydrated) return <div className="container-site py-12"><div className="mx-auto h-72 max-w-3xl animate-pulse rounded-2xl border border-line bg-white" aria-label="Loading booking"/></div>;
  return <div className="container-site py-8 md:py-12"><BookingProgress step={state.step}/><div className={state.step === "confirmation" ? "mx-auto max-w-3xl" : "grid min-w-0 gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(18rem,1fr)] xl:items-start xl:gap-8"}><div ref={contentRef} className="min-w-0 rounded-2xl border border-line bg-white p-5 shadow-[var(--shadow-card)] sm:p-7 lg:p-9">
    {state.step === "trip" && <TripStep initial={Object.keys(prefill).length ? { ...(state.draft.trip ?? {}), ...prefill } : state.draft.trip} onContinue={handleTrip}/>} {state.step === "ride" && state.draft.trip && <RideStep trip={state.draft.trip} fare={state.draft.fare} fareLoading={fareLoading} selected={state.draft.vehicleId} onSelect={(id) => dispatch({ type: "vehicle", id })} onRetry={() => void estimate(state.draft.trip!)} onBack={() => dispatch({ type: "step", step: "trip" })} onContinue={() => dispatch({ type: "step", step: "details" })}/>} {state.step === "details" && <PassengerStep initial={state.draft.passenger} onBack={() => dispatch({ type: "step", step: "ride" })} onContinue={(passenger) => dispatch({ type: "passenger", passenger })}/>} {state.step === "review" && <ReviewStep draft={state.draft} submitting={submitting} submitError={submitError} onEdit={(step) => dispatch({ type: "step", step })} onBack={() => dispatch({ type: "step", step: "details" })} onSubmit={() => void submit()}/>} {state.step === "confirmation" && state.result && <ConfirmationStep draft={state.draft} result={state.result}/>} 
  </div>{state.step !== "confirmation" && <div className="order-first xl:order-none xl:sticky xl:top-28"><BookingSummary draft={state.draft} compact={state.step === "trip"}/></div>}</div></div>;
}
