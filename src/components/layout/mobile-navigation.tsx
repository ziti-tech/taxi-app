"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { navigation } from "@/data/content";
export function MobileNavigation() {
  const [open, setOpen] = useState(false);
  useEffect(() => { if (!open) return; const close = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false); const previousOverflow = document.body.style.overflow; document.body.style.overflow = "hidden"; document.addEventListener("keydown", close); return () => { document.body.style.overflow = previousOverflow; document.removeEventListener("keydown", close); }; }, [open]);
  return <div className="xl:hidden">
    <button type="button" onClick={() => setOpen(!open)} className="grid size-12 place-items-center rounded-xl border border-white/20 bg-white/5 text-white" aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? "Close menu" : "Open menu"}>{open ? <X /> : <Menu />}</button>
    {open && <><button className="fixed inset-0 top-[73px] z-40 bg-navy-950/40" onClick={() => setOpen(false)} aria-label="Close menu backdrop" /><nav id="mobile-menu" aria-label="Mobile navigation" className="fixed inset-x-0 top-[73px] z-50 max-h-[calc(100dvh-73px)] w-full overflow-y-auto border-y border-line bg-white px-4 py-3 shadow-2xl md:px-6 lg:px-8">{navigation.map((item) => <Link key={item.label} href={item.href} onClick={() => setOpen(false)} className="flex min-h-12 items-center rounded-xl px-4 font-bold text-navy-950 hover:bg-warm-50">{item.label}</Link>)}</nav></>}
  </div>;
}
