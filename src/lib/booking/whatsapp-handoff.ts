import { bookingVehicles } from "@/data/booking-vehicles";
import { createTripSchema, passengerSchema } from "@/schemas/booking";
import type { BookingDraft } from "@/types/booking";
import { isVehicleEligible } from "./booking-draft";
import { formatTripDateTime } from "./date-time";
import { normalizeIndianMobile } from "./phone";

export type WhatsAppHandoff = { status: "ready-to-send"; url: string; message: string };

/** Prepares a user-controlled handoff. It neither sends nor confirms a booking. */
export function createWhatsAppHandoff(draft: BookingDraft, businessNumber: string, now = new Date()): WhatsAppHandoff {
  const trip = createTripSchema(now).parse(draft.trip);
  const passenger = passengerSchema.parse(draft.passenger);
  const vehicle = bookingVehicles.find((item) => item.id === draft.vehicleId);
  if (!vehicle || !isVehicleEligible(vehicle.id, trip.passengers)) throw new Error("Choose a suitable vehicle before continuing.");
  const number = businessNumber.replace(/\D/g, "");
  if (!/^[1-9]\d{7,14}$/.test(number)) throw new Error("WhatsApp booking is unavailable. Please call the operator.");
  const lines = [
    "Taxi booking enquiry",
    `Trip: ${trip.tripType === "round-trip" ? "Round trip" : trip.tripType === "outstation" ? "Outstation" : "One way"}`,
    `Pickup: ${trip.pickup}`,
    `Drop: ${trip.drop}`,
    `Pickup date and time: ${formatTripDateTime(trip.date, trip.time)} IST`,
    ...(trip.tripType === "round-trip" && trip.returnDate && trip.returnTime ? [`Return: ${formatTripDateTime(trip.returnDate, trip.returnTime)} IST`] : []),
    `Passengers: ${trip.passengers}`,
    `Vehicle: ${vehicle.name}`,
    `Name: ${passenger.fullName}`,
    `Mobile: ${normalizeIndianMobile(passenger.mobile)}`,
    ...(passenger.email ? [`Email: ${passenger.email}`] : []),
    ...(passenger.pickupNote ? [`Pickup note: ${passenger.pickupNote}`] : []),
    "Please confirm the fare and availability. This enquiry is not a confirmed booking.",
  ];
  const message = lines.join("\n");
  return { status: "ready-to-send", url: `https://wa.me/${number}?text=${encodeURIComponent(message)}`, message };
}
