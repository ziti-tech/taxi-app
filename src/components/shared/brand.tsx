import Link from "next/link";
import { CarFront } from "lucide-react";
import { siteConfig } from "@/config/site";
export function Brand({ inverted = false }: { inverted?: boolean }) {
  return <Link href="/" className="inline-flex min-h-12 max-w-full min-w-0 items-center gap-2.5 rounded-lg" aria-label={`${siteConfig.shortName} home`}>
    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-amber-500 text-navy-950 xl:size-12"><CarFront className="xl:size-6" size={22} strokeWidth={2.4} /></span>
    <span className={`min-w-0 leading-tight ${inverted ? "text-white" : "text-navy-950"}`}><strong className="block whitespace-nowrap text-sm tracking-[-.025em] min-[360px]:text-base">{siteConfig.shortName}</strong><span className={`hidden text-[9px] font-extrabold uppercase tracking-[.22em] md:block ${inverted ? "text-amber-500" : "text-amber-600"}`}>Taxi service</span></span>
  </Link>;
}
