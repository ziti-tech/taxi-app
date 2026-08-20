export type TripType = "one-way" | "round-trip" | "outstation";
export type TripDetails = { tripType: TripType; pickup: string; drop: string; date: string; time: string; returnDate?: string; returnTime?: string; passengers: number };
export type PassengerDetails = { fullName: string; mobile: string; email?: string; pickupNote?: string };
export type Money = { amount: number; currency: "INR" };
export type FareEstimate =
  | { status: "available"; amount: Money; disclaimer: string; source: "demo" }
  | { status: "confirmation-required"; message: string }
  | { status: "unsupported"; message: string }
  | { status: "error"; message: string };
export type Vehicle = { id: string; name: string; exampleModels: string; passengers: number; luggage: number; ac: boolean; availability: "request" | "unavailable" };
export type BookingDraft = { trip: TripDetails | null; fare: FareEstimate | null; vehicleId: string | null; passenger: PassengerDetails | null };
export type BookingReference = { reference: string; status: "awaiting-confirmation"; receivedAt: string };
export type BookingStep = "trip" | "ride" | "details" | "review" | "confirmation";
export type AirportTripExtension = { direction?: "arrival" | "departure"; flightNumber?: string; terminal?: string };
