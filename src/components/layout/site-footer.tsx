import { Brand } from "@/components/shared/brand";
import { phoneDisplay, phoneHref, siteConfig, whatsappHref } from "@/config/site";
import { navigation } from "@/data/content";

export function SiteFooter() {
  return <footer id="contact" className="bg-navy-950 text-white">
    <div className="container-site grid min-w-0 gap-10 py-12 lg:grid-cols-[1fr_1.4fr] lg:py-16">
      <div className="min-w-0"><Brand inverted /><p className="mt-5 max-w-sm text-sm leading-6 text-white/60">Plan your one-way, round-trip or outstation ride from Villupuram. Choose your route and vehicle, or contact us to discuss your trip.</p><p className="mt-4 break-words text-sm font-bold text-amber-500">{siteConfig.address}</p></div>
      <div className="grid min-w-0 gap-8 sm:grid-cols-2">
        <div className="min-w-0"><h2 className="mb-3 text-sm font-extrabold">Explore</h2><ul className="space-y-2">{navigation.map((item) => <li key={item.label}><a href={item.href} className="inline-flex min-h-8 items-center text-sm text-white/60 hover:text-white">{item.label}</a></li>)}</ul></div>
        <div className="min-w-0"><h2 className="mb-3 text-sm font-extrabold">Contact</h2><ul className="space-y-2"><li><a href={phoneHref} className="inline-flex min-h-8 items-center text-sm font-bold text-amber-500 hover:text-white">Call {phoneDisplay}</a></li>{whatsappHref && <li><a href={whatsappHref} className="inline-flex min-h-8 items-center text-sm text-white/60 hover:text-white">Book through WhatsApp</a></li>}{siteConfig.email && <li><a href={`mailto:${siteConfig.email}`} className="inline-flex min-h-8 break-all text-sm text-white/60 hover:text-white">{siteConfig.email}</a></li>}</ul><p className="mt-3 max-w-xs text-sm leading-6 text-white/60">Contact us for the current fare and availability for your journey.</p></div>
      </div>
    </div>
    <div className="border-t border-white/10"><div className="container-site flex min-w-0 flex-col gap-2 py-5 text-xs leading-5 text-white/45 md:flex-row md:justify-between"><p className="min-w-0">© {new Date().getFullYear()} {siteConfig.shortName}.</p><p className="min-w-0">{siteConfig.serviceArea}</p></div></div>
  </footer>;
}
