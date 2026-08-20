"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { faqs } from "@/data/content";
export function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(0);
  return <div className="min-w-0 divide-y divide-line rounded-2xl border border-line bg-white px-4 sm:px-7">{faqs.map(([question, answer], index) => { const active = open === index; return <div key={question} className="min-w-0"><h3><button type="button" onClick={() => setOpen(active ? null : index)} aria-expanded={active} aria-controls={`faq-panel-${index}`} className="flex min-h-[72px] w-full min-w-0 items-center justify-between gap-3 py-4 text-left font-extrabold text-navy-950"><span className="min-w-0">{question}</span><ChevronDown className={`shrink-0 transition-transform ${active ? "rotate-180" : ""}`} size={20} /></button></h3><div id={`faq-panel-${index}`} hidden={!active} className="min-w-0 pb-5 pr-2 text-sm leading-6 text-muted sm:pr-7">{answer}</div></div>; })}</div>;
}
