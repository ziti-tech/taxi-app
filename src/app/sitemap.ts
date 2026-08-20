import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { publishedTaxiRoutes } from "@/data/taxi-routes";
import { publishedTaxiServices } from "@/data/taxi-services";
export default function sitemap(): MetadataRoute.Sitemap { const staticPages = [["",1,"weekly"],["/book",.9,"monthly"],["/tariff",.8,"monthly"],["/services",.9,"monthly"],["/routes",.9,"weekly"],["/about",.6,"yearly"],["/contact",.7,"monthly"]] as const; return [...staticPages.map(([path,priority,changeFrequency]) => ({ url: `${siteConfig.url}${path}`, priority, changeFrequency })), ...publishedTaxiServices.map((service) => ({ url: `${siteConfig.url}${service.seo.canonicalPath}`, priority: .8, changeFrequency: "monthly" as const })), ...publishedTaxiRoutes.map((route) => ({ url: `${siteConfig.url}${route.seo.canonicalPath}`, priority: .8, changeFrequency: "monthly" as const }))]; }
