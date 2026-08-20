export type ServiceType = "one-way" | "round-trip" | "airport" | "outstation" | "local" | "corporate";
export type TaxiRoute = {
  slug: string; origin: string; destination: string; title: string; shortDescription: string;
  serviceTypes: ServiceType[]; category: "popular" | "airport" | "nearby" | "long-distance"; airportRoute?: boolean;
  highlights: string[]; pickupGuidance: string[]; destinationGuidance: string[]; relatedRoutes: string[]; publish: boolean;
  seo: { title: string; description: string; canonicalPath: `/routes/${string}` };
};
export type TaxiService = {
  slug: string; type: ServiceType; name: string; title: string; shortDescription: string; intro: string;
  useCases: string[]; bookingSteps: string[]; relatedRoutes: string[]; publish: boolean;
  seo: { title: string; description: string; canonicalPath: `/services/${string}` };
};
