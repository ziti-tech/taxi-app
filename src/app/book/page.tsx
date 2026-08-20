import type { Metadata } from "next";
import { BookingFlow } from "@/components/booking/booking-flow";
import { createMetadata } from "@/lib/metadata";
export const metadata: Metadata = createMetadata({ title: "Book a taxi", description: "Request a one-way, round-trip or airport taxi from Villupuram without creating an account.", path: "/book" });
export default async function BookPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) { const values = await searchParams; const params = new URLSearchParams(); Object.entries(values).forEach(([key, value]) => { if (typeof value === "string") params.set(key, value); }); return <main id="main-content" data-booking-page className="min-h-[70vh] bg-warm-50"><BookingFlow initialQuery={params.toString()}/></main>; }
