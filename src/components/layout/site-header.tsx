import Link from "next/link";
import { Phone } from "lucide-react";
import { Brand } from "@/components/shared/brand";
import { phoneDisplay, phoneHref } from "@/config/site";
import { navigation } from "@/data/content";
import { MobileNavigation } from "./mobile-navigation";
export function SiteHeader() {
  return <header className="sticky top-0 z-50 border-b border-white/10 bg-navy-950/95 text-white backdrop-blur-xl"><div className="container-site flex h-[73px] min-w-0 items-center gap-2 xl:h-20"><div className="min-w-0 flex-1 xl:flex-none"><Brand inverted /></div>
    <nav aria-label="Primary navigation" className="hidden items-center gap-1 xl:flex">{navigation.map((item) => <Link key={item.label} href={item.href} className="rounded-lg px-3 py-2 text-sm font-bold text-white/75 transition-colors hover:bg-white/5 hover:text-amber-500">{item.label}</Link>)}</nav>
    <div className="ml-auto flex shrink-0 items-center gap-2"><a href={phoneHref} className="grid size-12 shrink-0 place-items-center rounded-xl border border-amber-500 bg-amber-500 text-navy-950 transition-colors hover:bg-[#ffc437] md:flex md:w-auto md:gap-2 md:px-4 md:text-sm md:font-extrabold" aria-label={`Call ${phoneDisplay}`}><Phone size={20} /><span className="hidden md:inline">{phoneDisplay}</span></a><MobileNavigation /></div>
  </div></header>;
}
