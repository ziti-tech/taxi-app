import type { FareEstimate, TripDetails } from "@/types/booking";
export interface FareEstimator { estimate(trip: TripDetails, vehicleId?: string): Promise<FareEstimate>; }
