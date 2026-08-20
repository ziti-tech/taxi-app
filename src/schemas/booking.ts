import { z } from "zod";
import { bookingConfig } from "@/config/booking";
import { isAfterLocalDateTime, isPastLocalDateTime } from "@/lib/booking/date-time";
import { normalizeIndianMobile } from "@/lib/booking/phone";

const normalizeLocation = (value: string) => value.trim().toLocaleLowerCase("en-IN").replace(/\s+/g, " ");
export function createTripSchema(now = new Date()) { return z.object({
  tripType: z.enum(["one-way", "round-trip", "airport"]), pickup: z.string().trim().min(2, "Enter a pickup location"), drop: z.string().trim().min(2, "Enter a drop location"),
  date: z.string().min(1, "Choose a pickup date"), time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Choose a valid pickup time"), returnDate: z.string().optional(), returnTime: z.string().optional(),
  passengers: z.number().int().min(bookingConfig.minPassengers).max(bookingConfig.maxPassengers),
}).superRefine((value, ctx) => {
  if (normalizeLocation(value.pickup) === normalizeLocation(value.drop)) ctx.addIssue({ code: "custom", path: ["drop"], message: "Pickup and drop must be different" });
  if (value.date && value.time && isPastLocalDateTime(value.date, value.time, now, bookingConfig.timeZone)) ctx.addIssue({ code: "custom", path: ["date"], message: "Pickup must be in the future" });
  if (value.tripType === "round-trip") {
    if (!value.returnDate) ctx.addIssue({ code: "custom", path: ["returnDate"], message: "Choose a return date" });
    if (!value.returnTime || !/^([01]\d|2[0-3]):[0-5]\d$/.test(value.returnTime)) ctx.addIssue({ code: "custom", path: ["returnTime"], message: "Choose a valid return time" });
    if (value.returnDate && value.returnTime && !isAfterLocalDateTime(value.returnDate, value.returnTime, value.date, value.time)) ctx.addIssue({ code: "custom", path: ["returnDate"], message: "Return must be after pickup" });
  }
}); }
export type TripFormValues = z.infer<ReturnType<typeof createTripSchema>>;
export const passengerSchema = z.object({ fullName: z.string().trim().min(2, "Enter the passenger name").max(80), mobile: z.string().refine((value) => normalizeIndianMobile(value) !== null, "Enter a valid 10-digit mobile number"), email: z.union([z.literal(""), z.email("Enter a valid email address")]).optional(), pickupNote: z.string().max(bookingConfig.pickupNoteMaxLength, `Keep the note under ${bookingConfig.pickupNoteMaxLength} characters`).optional() });
export type PassengerFormValues = z.infer<typeof passengerSchema>;
