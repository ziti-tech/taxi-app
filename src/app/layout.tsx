import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { MobileConversionBar } from "@/components/layout/mobile-conversion-bar";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { WhatsAppAction } from "@/components/layout/whatsapp-action";
import { siteConfig } from "@/config/site";
import { createMetadata } from "@/lib/metadata";
import "./globals.css";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
const title = `${siteConfig.businessName} | Taxi booking in Villupuram`;
const description = "Request one-way, round-trip and outstation taxis from Villupuram. Choose your route and vehicle, then contact the operator to confirm your fare and ride.";
export const metadata: Metadata = {
  ...createMetadata({ title, description, path: "/" }),
  metadataBase: new URL(siteConfig.url),
  applicationName: siteConfig.businessName,
  title: { default: title, template: `%s | ${siteConfig.shortName}` },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={manrope.variable}><body className="font-sans antialiased">
    <a href="#main-content" className="fixed left-4 top-3 z-[100] -translate-y-20 rounded-lg bg-white px-4 py-3 font-bold text-navy-950 shadow-lg transition-transform focus:translate-y-0">Skip to content</a>
    <SiteHeader />{children}<SiteFooter /><WhatsAppAction /><MobileConversionBar />
  </body></html>;
}
