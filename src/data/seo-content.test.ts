import { describe, expect, it } from "vitest";
import { getTaxiRoute, publishedTaxiRoutes, taxiRoutes } from "./taxi-routes";
import { publishedTaxiServices } from "./taxi-services";
function duplicates(values: string[]) { return values.filter((value, index) => values.indexOf(value) !== index); }
describe("route publishing integrity", () => {
  it("uses unique published slugs", () => expect(duplicates(publishedTaxiRoutes.map((route) => route.slug))).toEqual([]));
  it("has complete metadata and canonical paths", () => publishedTaxiRoutes.forEach((route) => { expect(route.seo.title.length).toBeGreaterThan(0); expect(route.seo.description.length).toBeGreaterThan(0); expect(route.seo.canonicalPath).toBe(`/routes/${route.slug}`); }));
  it("does not expose unpublished routes", () => taxiRoutes.filter((route) => !route.publish).forEach((route) => expect(getTaxiRoute(route.slug)).toBeUndefined()));
  it("returns undefined for an invalid slug", () => expect(getTaxiRoute("not-a-real-route")).toBeUndefined());
  it("contains only valid related-route references", () => publishedTaxiRoutes.forEach((route) => route.relatedRoutes.forEach((slug) => expect(getTaxiRoute(slug), `${route.slug} → ${slug}`).toBeDefined())));
});
describe("service publishing integrity", () => {
  it("uses unique service slugs", () => expect(duplicates(publishedTaxiServices.map((service) => service.slug))).toEqual([]));
  it("has complete metadata and canonical paths", () => publishedTaxiServices.forEach((service) => { expect(service.seo.title.length).toBeGreaterThan(0); expect(service.seo.description.length).toBeGreaterThan(0); expect(service.seo.canonicalPath).toBe(`/services/${service.slug}`); }));
  it("references only published routes", () => publishedTaxiServices.forEach((service) => service.relatedRoutes.forEach((slug) => expect(getTaxiRoute(slug), `${service.slug} → ${slug}`).toBeDefined())));
});
