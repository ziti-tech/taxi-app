import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { siteConfig } from "@/config/site";
import { createTaxiServiceSchema } from "@/lib/structured-data";
import { JsonLd } from "./json-ld";

describe("JSON-LD output", () => {
  it("cannot close the JSON-LD script when content contains HTML", () => {
    const data = { name: "</script><script>alert('test')</script>", description: "A < B & C" };
    const html = renderToStaticMarkup(JsonLd({ data }));
    expect(html.match(/<script/g)).toHaveLength(1);
    expect(html.match(/<\/script>/g)).toHaveLength(1);
    const payload = html.match(/<script[^>]*>([\s\S]*)<\/script>/)?.[1];
    expect(payload).toBeDefined();
    expect(JSON.parse(payload!)).toEqual(data);
  });

  it("describes the visible taxi business without unconfirmed offers or ratings", () => {
    const schema = createTaxiServiceSchema();
    expect(schema.name).toBe(siteConfig.businessName);
    expect(schema.provider).toMatchObject({ "@type": "Organization", address: siteConfig.address, telephone: siteConfig.phone });
    expect(schema).not.toHaveProperty("address");
    expect(schema).not.toHaveProperty("offers");
    expect(schema).not.toHaveProperty("aggregateRating");
    expect(schema).not.toHaveProperty("openingHours");
  });
});
