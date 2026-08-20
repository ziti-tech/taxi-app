import type { BookingDraft } from "@/types/booking";
import type { BookingGateway } from "./booking-gateway";
export class MockBookingGateway implements BookingGateway {
  constructor(private readonly shouldFail = false) {}
  async submit(draft: BookingDraft) { await new Promise((resolve) => setTimeout(resolve, 180)); if (this.shouldFail) throw new Error("The development booking service could not receive your request. Please retry."); if (!draft.trip || !draft.vehicleId || !draft.passenger) throw new Error("Complete the booking before submitting."); const token = Math.random().toString(36).slice(2, 10).toUpperCase().padEnd(8, "0"); return { reference: `DEV-${token}`, status: "awaiting-confirmation" as const, receivedAt: new Date().toISOString() }; }
}
export const mockBookingGateway = new MockBookingGateway();
