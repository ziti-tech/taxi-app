import { describe, expect, it } from "vitest";
import { createTripSchema } from "@/schemas/booking";
import type { BookingDraft } from "@/types/booking";
import { createWhatsAppHandoff } from "./whatsapp-handoff";
import { isValidDateString } from "./date-time";
import { parseTripPrefill } from "./booking-draft";

const now = new Date("2026-08-20T00:00:00Z");
const draft: BookingDraft = {
  trip: { tripType: "one-way", pickup: "Villupuram", drop: "Chennai", date: "2026-08-21", time: "08:30", passengers: 2 },
  vehicleId: "sedan", fare: null,
  passenger: { fullName: "Test Passenger", mobile: "9876543210", pickupNote: "Gate A & B? Follow #2" },
};
describe("validated user-controlled WhatsApp handoff", () => {
  it("prepares the existing business number and encoded journey without claiming receipt", () => {
    const result = createWhatsAppHandoff(draft, "919884744218", now);
    const url = new URL(result.url);
    expect(url.origin).toBe("https://wa.me");
    expect(url.pathname).toBe("/919884744218");
    expect([...url.searchParams.keys()]).toEqual(["text"]);
    expect(url.searchParams.get("text")).toContain("Gate A & B? Follow #2");
    expect(result.message).toContain("Mobile: +919876543210");
    expect(result.message).toContain("not a confirmed booking");
    expect(result.status).toBe("ready-to-send");
    expect(result.message).not.toContain("DEV-");
  });
  it("includes the return only for round trips", () => {
    const trip = { ...draft.trip!, returnDate: "2026-08-22", returnTime: "18:30" };
    expect(createWhatsAppHandoff({ ...draft, trip }, "919884744218", now).message).not.toContain("Return:");
    expect(createWhatsAppHandoff({ ...draft, trip: { ...trip, tripType: "round-trip" } }, "919884744218", now).message).toContain("Return:");
  });
  it("rejects incomplete, stale and undersized-vehicle requests", () => {
    expect(() => createWhatsAppHandoff({ ...draft, passenger: null }, "919884744218", now)).toThrow();
    expect(() => createWhatsAppHandoff(draft, "919884744218", new Date("2026-08-22T00:00:00Z"))).toThrow();
    expect(() => createWhatsAppHandoff({ ...draft, trip: { ...draft.trip!, passengers: 7 } }, "919884744218", now)).toThrow("suitable vehicle");
    expect(() => createWhatsAppHandoff(draft, "", now)).toThrow("WhatsApp booking is unavailable");
  });
});
describe("strict calendar validation", () => {
  it.each(["bad", "2026-02-30", "2026-13-01", "2026-00-12", "2026-08-32", "2026-8-21"])("rejects %s", (date) => {
    expect(isValidDateString(date)).toBe(false);
    expect(createTripSchema(now).safeParse({ ...draft.trip, date }).success).toBe(false);
  });
  it("accepts real leap days only", () => {
    expect(isValidDateString("2028-02-29")).toBe(true);
    expect(isValidDateString("2026-02-29")).toBe(false);
  });
  it("rejects impossible round-trip return dates and overlong locations", () => {
    expect(createTripSchema(now).safeParse({ ...draft.trip, tripType: "round-trip", returnDate: "2026-08-32", returnTime: "09:00" }).success).toBe(false);
    expect(createTripSchema(now).safeParse({ ...draft.trip, pickup: "x".repeat(121) }).success).toBe(false);
  });
  it("retains intentional empty URL fields as overrides rather than silently restoring a saved value", () => {
    expect(parseTripPrefill(new URLSearchParams("pickup=&drop=Chennai"))).toEqual({ pickup: "", drop: "Chennai" });
  });
});
