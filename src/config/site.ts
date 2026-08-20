// Provisional identity and contact values: replace only after client approval.
type SiteConfig = { businessName: string; shortName: string; url: string; phone: string; whatsapp: string; email: string; address: string; businessHours: string; serviceArea: string };
export const siteConfig: SiteConfig = {
  businessName: "Villupuram Taxi", shortName: "Villupuram Taxi",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com",
  phone: "9884744218", whatsapp: "", email: "", address: "Villupuram, Tamil Nadu",
  businessHours: "Booking support hours to be confirmed",
  serviceArea: "Villupuram and outstation travel across Tamil Nadu",
} as const;
export const phoneHref = siteConfig.phone ? `tel:${siteConfig.phone.replace(/\s/g, "")}` : "#contact";
export const phoneDisplay = siteConfig.phone.replace(/(\d{5})(\d{5})/, "$1 $2");
export const whatsappHref = siteConfig.whatsapp ? `https://wa.me/${siteConfig.whatsapp.replace(/\D/g, "")}` : null;
