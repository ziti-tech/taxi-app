import type { FareEstimate, TripDetails } from "@/types/booking";
import type { FareEstimator } from "./fare-estimator";
export class MockFareEstimator implements FareEstimator {
  constructor(private readonly forcedStatus?: FareEstimate["status"]) {}
  async estimate(_trip: TripDetails, _vehicleId?: string) {
    void _trip; void _vehicleId;
    await new Promise((resolve) => setTimeout(resolve, 120));
    if (this.forcedStatus === "error") return { status: "error", message: "Fare service is temporarily unavailable. You can still continue with a confirmation request." } as const;
    if (this.forcedStatus === "unsupported") return { status: "unsupported", message: "Automatic fare information is unavailable for this route. The operator can confirm it manually." } as const;
    if (this.forcedStatus === "available") return { status: "available", amount: { amount: 1000, currency: "INR" }, disclaimer: "DEMO / NOT PRODUCTION", source: "demo" } as const;
    return { status: "confirmation-required", message: "Fare will be confirmed by the operator before your booking is accepted." } as const;
  }
}
export const mockFareEstimator = new MockFareEstimator();
