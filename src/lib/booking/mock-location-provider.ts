import { developmentLocations } from "@/data/development-locations";
import type { LocationProvider, LocationSuggestion } from "./location-provider";
const locations: LocationSuggestion[] = developmentLocations.map((label) => ({ id: label.toLowerCase().replace(/\s+/g, "-"), label }));
export class MockLocationProvider implements LocationProvider {
  async search(query: string) { const normalized = query.trim().toLowerCase(); await Promise.resolve(); return normalized ? locations.filter((location) => location.label.toLowerCase().includes(normalized)).slice(0, 6) : locations.slice(0, 6); }
  async resolve(id: string) { return locations.find((location) => location.id === id) ?? null; }
}
export const mockLocationProvider = new MockLocationProvider();
