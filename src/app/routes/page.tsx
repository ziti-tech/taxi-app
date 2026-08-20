import type { Metadata } from "next";
import { PageHero } from "@/components/content/page-hero";
import { RouteCard } from "@/components/content/route-card";
import { FinalBookingCta } from "@/components/content/final-booking-cta";
import { publishedTaxiRoutes } from "@/data/taxi-routes";
import { createMetadata } from "@/lib/metadata";
export const metadata: Metadata = createMetadata({ title: "Popular Taxi Routes from Villupuram", description: "Explore useful taxi routes from Villupuram for one-way, round-trip, airport and outstation travel, then start a booking request.", path: "/routes" });
const groups = [{ key: "popular", label: "Popular" }, { key: "airport", label: "Airport" }, { key: "nearby", label: "Nearby" }, { key: "long-distance", label: "Long distance" }] as const;
export default function RoutesPage() { return <main id="main-content"><PageHero breadcrumbs={[{ label: "Home", href: "/" }, { label: "Routes" }]} eyebrow="Route directory" title="Popular taxi routes from Villupuram" description="Explore practical route information for one-way, return and airport travel. Current fare and availability are confirmed for your trip."/><div className="container-site section-space">{groups.map((group) => { const routes = publishedTaxiRoutes.filter((route) => route.category === group.key); if (!routes.length) return null; return <section key={group.key} className="mb-14 last:mb-0"><h2 className="section-title text-navy-950">{group.label} routes</h2><div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{routes.map((route) => <RouteCard key={route.slug} route={route}/>)}</div></section>; })}</div><FinalBookingCta/></main>; }
