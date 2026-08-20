import { BriefcaseBusiness, Building2, CalendarCheck, CarFront, MapPinned, Plane, Repeat2, ShieldCheck, BadgeIndianRupee, Handshake } from "lucide-react";
export const navigation = [
  { label: "Home", href: "/" }, { label: "Book Taxi", href: "/book" }, { label: "Tariff", href: "/tariff" },
  { label: "Services", href: "/services" }, { label: "Routes", href: "/routes" }, { label: "About", href: "/about" }, { label: "Contact", href: "/contact" },
] as const;
export const trustItems = [
  { title: "Safe & Secure", note: "Safety-focused travel experience", icon: ShieldCheck }, { title: "Trusted Service", note: "Dependable local taxi service", icon: Handshake },
  { title: "Affordable Fares", note: "Clear fare information before confirmation", icon: BadgeIndianRupee }, { title: "Easy Booking", note: "Simple phone and online booking", icon: CalendarCheck },
] as const;
export const routes = ["Chennai", "Pondicherry", "Chennai Airport", "Bangalore", "Trichy", "Madurai"] as const;
export const fleet = [
  { name: "Sedan", model: "Dzire or similar", passengers: 4, luggage: 2, tone: "sedan" }, { name: "MPV", model: "Ertiga or similar", passengers: 6, luggage: 3, tone: "mpv" },
  { name: "Innova", model: "Toyota Innova or similar", passengers: 7, luggage: 3, tone: "innova" }, { name: "Innova Crysta", model: "Crysta or similar", passengers: 7, luggage: 4, tone: "crysta" },
] as const;
export const services = [
  { slug: "one-way-taxi", name: "One Way Taxi", text: "A simple drop to your destination, without paying for an unnecessary return.", icon: MapPinned }, { slug: "round-trip-taxi", name: "Round Trip", text: "A comfortable car and driver for your onward journey and planned return.", icon: Repeat2 },
  { slug: "airport-taxi", name: "Airport Transfer", text: "Pre-planned pickup or drop service for a calmer airport journey.", icon: Plane }, { slug: "outstation-taxi", name: "Outstation Taxi", text: "Intercity travel from Villupuram for family, work or leisure trips.", icon: CarFront },
  { slug: "local-taxi", name: "Local Taxi", text: "Point-to-point and local travel within Villupuram and nearby areas.", icon: Building2 }, { slug: "corporate-travel", name: "Corporate Travel", text: "Configurable travel support for teams, guests and business journeys.", icon: BriefcaseBusiness },
] as const;
export const faqs = [
  ["How is the taxi fare calculated?", "The final calculation method, minimum distance and applicable allowances are awaiting client confirmation. Your fare will be shown clearly before a booking is confirmed."],
  ["Can I book a one-way taxi?", "Yes, the planned service includes one-way requests from Villupuram. Final route availability will be confirmed when you submit your trip."],
  ["Can I book from Villupuram to Chennai Airport?", "Airport transfers are part of the planned service. Pickup timing, terminal details and any airport charges will be confirmed with your request."],
  ["Are toll and parking charges included?", "This policy is not yet client-approved. The production fare summary will clearly state what is included and what is payable separately."],
  ["Can I book through WhatsApp?", "WhatsApp booking will be enabled once the client confirms the official business number."],
  ["How early should I book?", "The recommended notice period and same-day availability are still to be confirmed by the taxi operator."],
] as const;
