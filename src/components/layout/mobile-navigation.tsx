"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { navigation } from "@/data/content";
import { SectionLink } from "./section-link";

export function MobileNavigation() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (!open || !dialogRef.current) return;
    const dialog = dialogRef.current;
    const trigger = triggerRef.current;
    const desktop = window.matchMedia("(min-width: 1280px)");
    const previousOverflow = document.body.style.overflow;
    const closeOnDesktop = () => { if (desktop.matches) setOpen(false); };

    dialog.showModal();
    document.body.style.overflow = "hidden";
    dialog.querySelector<HTMLAnchorElement>("nav a")?.focus();
    desktop.addEventListener("change", closeOnDesktop);

    return () => {
      desktop.removeEventListener("change", closeOnDesktop);
      document.body.style.overflow = previousOverflow;
      dialog.close();
      if (!desktop.matches) trigger?.focus({ preventScroll: true });
    };
  }, [open]);

  return <div className="xl:hidden">
    <button ref={triggerRef} type="button" onClick={() => setOpen(true)} className="grid size-12 place-items-center rounded-xl border border-white/20 bg-white/5 text-white" aria-expanded={open} aria-controls="mobile-menu" aria-haspopup="dialog" aria-label="Open menu"><Menu aria-hidden="true" /></button>
    <dialog ref={dialogRef} id="mobile-menu" aria-label="Navigation menu" className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none border-0 bg-transparent p-0 backdrop:bg-navy-950/50" onCancel={(event) => { event.preventDefault(); setOpen(false); }} onPointerDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}>
      <div className="max-h-dvh overflow-y-auto bg-white shadow-2xl">
        <div className="container-site flex items-center justify-between gap-4 border-b border-line py-3"><h2 className="font-extrabold text-navy-950">Menu</h2><button type="button" onClick={() => setOpen(false)} className="grid size-12 place-items-center rounded-xl border border-line text-navy-950" aria-label="Close menu"><X aria-hidden="true" /></button></div>
        <nav aria-label="Mobile navigation" className="container-site py-3">{navigation.map((item) => <SectionLink key={item.label} href={item.href} onClick={() => setOpen(false)} className="flex min-h-12 items-center rounded-xl px-4 font-bold text-navy-950 hover:bg-warm-50">{item.label}</SectionLink>)}</nav>
      </div>
    </dialog>
  </div>;
}
