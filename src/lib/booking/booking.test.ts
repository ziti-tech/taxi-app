import { describe, expect, it } from "vitest";
import { createTripSchema } from "@/schemas/booking";
import { normalizeIndianMobile } from "./phone";
import { emptyDraft, isVehicleEligible, parseTripSearchParams, updateDraftTrip } from "./booking-draft";
import { MockFareEstimator } from "./mock-fare-estimator";
import { MockBookingGateway } from "./mock-booking-gateway";
import type { BookingDraft, TripDetails } from "@/types/booking";

const now = new Date("2026-08-20T00:00:00Z");
const trip: TripDetails = { tripType: "one-way", pickup: "Villupuram", drop: "Chennai", date: "2026-08-21", time: "08:30", passengers: 2 };
describe("trip schema", () => {
  it("accepts a valid one-way trip", () => expect(createTripSchema(now).safeParse(trip).success).toBe(true));
  it("accepts a valid overnight round trip", () => expect(createTripSchema(now).safeParse({ ...trip, tripType: "round-trip", returnDate: "2026-08-22", returnTime: "01:00" }).success).toBe(true));
  it("rejects a past pickup", () => expect(createTripSchema(now).safeParse({ ...trip, date: "2026-08-19" }).success).toBe(false));
  it("rejects return before pickup", () => expect(createTripSchema(now).safeParse({ ...trip, tripType: "round-trip", returnDate: "2026-08-21", returnTime: "07:30" }).success).toBe(false));
});
describe("phone normalization", () => { it.each([["9876543210", "+919876543210"], ["+91 9876543210", "+919876543210"], ["12345", null]])("normalizes %s", (input, expected) => expect(normalizeIndianMobile(input)).toBe(expected)); });
describe("eligibility and draft invalidation", () => { it("disables undersized vehicles", () => expect(isVehicleEligible("sedan", 6)).toBe(false)); it("clears a selected vehicle after passenger count increases", () => { const draft = { ...emptyDraft, trip, vehicleId: "sedan" }; expect(updateDraftTrip(draft, { ...trip, passengers: 6 }).vehicleId).toBeNull(); }); });
describe("URL validation", () => { it("rejects an invalid prefill", () => expect(parseTripSearchParams(new URLSearchParams("pickup=X&drop=X&date=bad&time=99:00"), now)).toBeNull()); });
describe("mock fare estimator", () => { it.each(["available", "confirmation-required", "unsupported", "error"] as const)("supports %s state", async (status) => expect((await new MockFareEstimator(status).estimate(trip)).status).toBe(status)); });
describe("mock booking gateway", () => { const complete: BookingDraft = { trip, fare: { status: "confirmation-required", message: "Confirm" }, vehicleId: "sedan", passenger: { fullName: "Test Passenger", mobile: "+919876543210" } }; it("returns a development reference", async () => expect((await new MockBookingGateway().submit(complete)).reference).toMatch(/^DEV-[A-Z0-9]{8}$/)); it("exposes a submission error", async () => expect(new MockBookingGateway(true).submit(complete)).rejects.toThrow("development booking service")); });
