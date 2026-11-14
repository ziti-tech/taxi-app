import { siteConfig } from "@/config/site";
import type { BreadcrumbItem } from "@/components/shared/breadcrumbs";
// Publish only the identity, contact details and service area already visible on the site.
// Rates, reviews, opening hours and availability remain unconfirmed and are omitted.
export function createTaxiServiceSchema() {
  const url = new URL("/", siteConfig.url).toString();
  return {
    "@context": "https://schema.org",
    "@type": "TaxiService",
    "@id": `${url}#taxi-service`,
    name: siteConfig.businessName,
    url,
    areaServed: siteConfig.serviceArea,
    provider: {
      "@type": "Organization",
      "@id": `${url}#organization`,
      name: siteConfig.businessName,
      url,
      address: siteConfig.address,
      ...(siteConfig.phone ? { telephone: siteConfig.phone } : {}),
    },
  };
}
export function createBreadcrumbSchema(items: BreadcrumbItem[]) { return { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: items.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.label, ...(item.href ? { item: new URL(item.href, siteConfig.url).toString() } : {}) })) }; }
export function createServiceSchema({ name, description, path, areaServed }: { name: string; description: string; path: string; areaServed?: string[] }) { return { "@context": "https://schema.org", "@type": "Service", name, description, url: new URL(path, siteConfig.url).toString(), provider: { "@type": "Organization", name: siteConfig.businessName }, ...(areaServed?.length ? { areaServed } : {}) }; }
export function createFaqSchema(items: { question: string; answer: string }[]) { return { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: items.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) }; }
