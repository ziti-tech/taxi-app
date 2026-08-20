"use client";
import { CalendarCheck, Phone } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import { usePathname } from "next/navigation";
import { phoneHref, whatsappHref } from "@/config/site";
export function MobileConversionBar() {
  const pathname = usePathname();
  if (pathname.startsWith("/book")) return null;
  return <nav aria-label="Quick booking actions" className="fixed inset-x-0 bottom-0 z-40 max-w-full border-t border-line bg-white/95 px-2 pt-2 pb-[calc(.5rem+env(safe-area-inset-bottom))] shadow-[0_-8px_30px_rgba(7,26,46,.1)] backdrop-blur md:hidden"><div className="flex min-w-0 gap-1">
    <a href={phoneHref} className="flex min-h-14 min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-xl text-[11px] font-extrabold text-navy-900"><Phone size={19} />Call</a>
    {whatsappHref ? <a href={whatsappHref} className="flex min-h-14 min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-xl text-[11px] font-extrabold text-navy-900"><FaWhatsapp size={20} />WhatsApp</a> : <span aria-disabled="true" className="flex min-h-14 min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-xl bg-[#f5f7f8] text-[11px] font-extrabold text-muted"><FaWhatsapp size={20} />WhatsApp</span>}
    <a href="/book" className="flex min-h-14 min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-xl bg-amber-500 text-[11px] font-extrabold text-navy-950"><CalendarCheck size={19} />Book</a>
  </div></nav>;
}
