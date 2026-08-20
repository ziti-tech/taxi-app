export type LocationSuggestion = { id: string; label: string };
export interface LocationProvider { search(query: string): Promise<LocationSuggestion[]>; resolve(id: string): Promise<LocationSuggestion | null>; }
