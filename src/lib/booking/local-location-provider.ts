import { developmentLocations } from "@/data/development-locations";
import type { LocationProvider } from "./location-provider";

/** Common place suggestions only; passengers may enter any full address or landmark. */
export const localLocationProvider: LocationProvider = {
  async search(query) {
    const value = query.trim().toLocaleLowerCase("en-IN");
    if (!value) return [];
    return developmentLocations.filter((label) => label.toLocaleLowerCase("en-IN").includes(value)).slice(0, 6).map((label) => ({ id: label.toLocaleLowerCase("en-IN").replace(/\W+/g, "-"), label }));
  },
  async resolve(id) {
    const label = developmentLocations.find((item) => item.toLocaleLowerCase("en-IN").replace(/\W+/g, "-") === id);
    return label ? { id, label } : null;
  },
};
