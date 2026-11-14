import { describe, expect, it } from "vitest";
import { siteConfig } from "@/config/site";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { createMetadata } from "./metadata";

describe("single-page discovery and sharing metadata", () => {
  it("uses the same absolute homepage URL for canonical and social sharing", () => {
    const metadata = createMetadata({ title: siteConfig.businessName, description: "Taxi booking", path: "/" });
    const homepage = new URL("/", siteConfig.url).toString();
    expect(metadata.alternates?.canonical?.toString()).toBe(homepage);
    expect(metadata.openGraph).toMatchObject({ url: new URL(homepage), siteName: siteConfig.businessName });
    expect(metadata.twitter).toMatchObject({ card: "summary_large_image", title: siteConfig.businessName, description: "Taxi booking" });
  });

  it("publishes only the live homepage and points crawlers to its sitemap", () => {
    expect(sitemap().map(({ url }) => url)).toEqual([new URL("/", siteConfig.url).toString()]);
    expect(robots().sitemap).toBe(new URL("/sitemap.xml", siteConfig.url).toString());
  });
});
