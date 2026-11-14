import { BookingProvider } from "@/components/booking/booking-context";
import { InlineBookingFlow } from "@/components/booking/inline-booking-flow";
import { FinalCta, FleetSection, Hero, RoutesSection, TrustStrip } from "@/components/home/home-sections";
import { HomeStructuredData } from "@/components/seo/home-structured-data";

export default function Home() {
  return (
    <BookingProvider>
      <main id="main-content">
        <HomeStructuredData />
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
