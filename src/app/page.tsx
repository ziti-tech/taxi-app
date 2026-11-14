import { BookingProvider } from "@/components/booking/booking-context";
import { InlineBookingFlow } from "@/components/booking/inline-booking-flow";
import { FinalCta, FleetSection, Hero, RoutesSection, TrustStrip } from "@/components/home/home-sections";

export default async function Home({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const values = await searchParams;
  const params = new URLSearchParams();
  Object.entries(values).forEach(([key, value]) => {
    if (typeof value === "string") params.set(key, value);
  });

  return (
    <BookingProvider initialQuery={params.toString()}>
      <main id="main-content">
        <Hero />
        <InlineBookingFlow />
        <TrustStrip />
        <RoutesSection />
        <FleetSection />
        <FinalCta />
      </main>
    </BookingProvider>
  );
}
