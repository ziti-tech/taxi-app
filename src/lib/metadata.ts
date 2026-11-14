import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export function createMetadata({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  const canonical = new URL(path, siteConfig.url);
  const image = { url: new URL("/opengraph-image.png", siteConfig.url), width: 1200, height: 630, alt: `${siteConfig.businessName} — taxi booking in Villupuram` };

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical, siteName: siteConfig.businessName, locale: "en_IN", type: "website", images: [image] },
    twitter: { card: "summary_large_image", title, description, images: [{ url: image.url, alt: image.alt }] },
  };
}
