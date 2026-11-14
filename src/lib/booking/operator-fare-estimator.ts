import type { FareEstimator } from "./fare-estimator";

/** No published tariff or fare API exists; the operator quotes the requested journey. */
export const operatorFareEstimator: FareEstimator = {
  async estimate() {
    return { status: "confirmation-required", message: "Send your journey details on WhatsApp. The operator will confirm the fare and availability before you book." };
  },
};
