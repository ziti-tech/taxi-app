"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { bookingConfig } from "@/config/booking";
import { parsePreferredVehicle, parseStoredDraft, parseTripPrefill } from "@/lib/booking/booking-draft";
import type { BookingDraft, TripDetails } from "@/types/booking";

type Selection = { prefill: Partial<TripDetails>; vehicleId: string | null; revision: number };
type BookingRequest = { query: string; revision: number };
type BookingContextValue = {
  selection: Selection;
  request: BookingRequest | null;
  selectTrip: (prefill: Partial<TripDetails>, vehicleId?: string) => void;
  startBooking: (trip: TripDetails) => void;
  closeBooking: () => void;
  syncDraft: (draft: BookingDraft) => void;
};

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ initialQuery, children }: { initialQuery?: string; children: React.ReactNode }) {
  const [selection, setSelection] = useState<Selection>(() => {
    const params = new URLSearchParams(initialQuery ?? "");
    return { prefill: parseTripPrefill(params), vehicleId: parsePreferredVehicle(params), revision: 0 };
  });
  const [request, setRequest] = useState<BookingRequest | null>(null);

  useEffect(() => {
    let active = true;
    let lastQuery: string | null = null;
    function restore() {
      if (!active) return;
      const query = window.location.search;
      if (query === lastQuery) return;
      const changed = lastQuery !== null;
      lastQuery = query;
      const params = new URLSearchParams(query || initialQuery);
      let stored = parseStoredDraft(null);
      try { stored = parseStoredDraft(sessionStorage.getItem(bookingConfig.storageKey)); } catch { /* Storage is optional. */ }
      const prefill = parseTripPrefill(params);
      const preferredVehicle = parsePreferredVehicle(params);
      setSelection((previous) => ({
        prefill: { ...stored.trip, ...prefill },
        vehicleId: preferredVehicle ?? stored.vehicleId,
        revision: previous.revision + 1,
      }));
      if (changed) setRequest(null);
    }
    void Promise.resolve().then(restore);
    window.addEventListener("popstate", restore);
    return () => { active = false; window.removeEventListener("popstate", restore); };
  }, [initialQuery]);

  const syncDraft = useCallback((draft: BookingDraft) => {
    if (!draft.trip) return;
    const trip = draft.trip;
    setSelection((previous) => previous.prefill === trip && previous.vehicleId === draft.vehicleId ? previous : {
      prefill: trip,
      vehicleId: draft.vehicleId,
      revision: previous.revision + 1,
    });
  }, []);

  function selectTrip(prefill: Partial<TripDetails>, vehicleId?: string) {
    setSelection((previous) => ({ prefill, vehicleId: vehicleId ?? previous.vehicleId, revision: previous.revision + 1 }));
    setRequest(null);
  }

  function startBooking(trip: TripDetails) {
    const params = new URLSearchParams();
    Object.entries(trip).forEach(([key, value]) => {
      if (value !== undefined && value !== "") params.set(key, String(value));
    });
    if (selection.vehicleId) params.set("vehicle", selection.vehicleId);
    setRequest((previous) => ({ query: params.toString(), revision: (previous?.revision ?? 0) + 1 }));
  }

  return (
    <BookingContext value={{ selection, request, selectTrip, startBooking, closeBooking: () => setRequest(null), syncDraft }}>
      {children}
    </BookingContext>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) throw new Error("Booking controls must be inside BookingProvider.");
  return context;
}

export function BookingLink({ prefill = {}, vehicleId, children, ...props }: Omit<React.ComponentProps<"a">, "href"> & { prefill?: Partial<TripDetails>; vehicleId?: string }) {
  const { selectTrip } = useBooking();
  return <a {...props} href="#book" onClick={(event) => {
    props.onClick?.(event);
    if (!event.defaultPrevented) selectTrip(prefill, vehicleId);
  }}>{children}</a>;
}
