// Business identity and contact details used throughout the site.
type SiteConfig = { businessName: string; shortName: string; url: string; phone: string; whatsapp: string; email: string; address: string; businessHours: string; serviceArea: string };

const productionOrigin = "https://www.nammaonewaydroptaxi.com";

export function resolveSiteOrigin(value: string | undefined): string {
  if (!value?.trim()) return productionOrigin;

  let url: URL;
  try {
    url = new URL(value.trim());
  } catch {
    throw new Error("NEXT_PUBLIC_SITE_URL must be an absolute HTTP or HTTPS URL.");
  }

  if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) {
    throw new Error("NEXT_PUBLIC_SITE_URL must be an HTTP or HTTPS URL without credentials.");
  }

  return url.origin;
}

export const siteConfig: SiteConfig = {
  businessName: "namma oneway drop taxi", shortName: "namma oneway drop taxi",
  url: resolveSiteOrigin(process.env.NEXT_PUBLIC_SITE_URL),
  phone: "9884744218", whatsapp: "919884744218", email: "", address: "Villupuram, Tamil Nadu",
  businessHours: "Booking support hours to be confirmed",
  serviceArea: "Villupuram and outstation travel across Tamil Nadu",
} as const;
export const phoneHref = siteConfig.phone ? `tel:${siteConfig.phone.replace(/\s/g, "")}` : "#contact";
export const phoneDisplay = siteConfig.phone.replace(/(\d{5})(\d{5})/, "$1 $2");
export const whatsappHref = siteConfig.whatsapp ? `https://wa.me/${siteConfig.whatsapp.replace(/\D/g, "")}` : null;
