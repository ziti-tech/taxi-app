import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/content/page-hero";
import { FinalBookingCta } from "@/components/content/final-booking-cta";
import { publishedTaxiServices } from "@/data/taxi-services";
import { createMetadata } from "@/lib/metadata";
export const metadata: Metadata = createMetadata({ title: "Taxi Services in Villupuram", description: "Explore one-way, round-trip, airport, outstation, local and corporate taxi services in Villupuram and start a booking request.", path: "/services" });
export default function ServicesPage() { return <main id="main-content"><PageHero breadcrumbs={[{ label: "Home", href: "/" }, { label: "Services" }]} eyebrow="Travel options" title="Taxi services for every kind of trip" description="Choose the service that matches your journey, then enter your route and request current fare and availability."/><section className="container-site section-space"><div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{publishedTaxiServices.map((service) => <article key={service.slug} className="flex flex-col rounded-2xl border border-line bg-white p-6 shadow-[var(--shadow-card)]"><p className="eyebrow">{service.type.replace("-"," ")}</p><h2 className="mt-3 text-xl font-extrabold text-navy-950">{service.name}</h2><p className="mt-3 flex-1 text-sm leading-6 text-muted">{service.shortDescription}</p><Link href={`/services/${service.slug}`} className="mt-6 flex min-h-11 items-center justify-between rounded-xl bg-warm-50 px-4 text-sm font-extrabold text-navy-900 hover:bg-[#fff2cc]">Explore service <ArrowRight size={17}/></Link></article>)}</div></section><FinalBookingCta/></main>; }
