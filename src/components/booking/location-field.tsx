"use client";
import { useEffect, useId, useRef, useState, type Ref } from "react";
import { LoaderCircle, MapPin } from "lucide-react";
import { localLocationProvider } from "@/lib/booking/local-location-provider";
import type { LocationSuggestion } from "@/lib/booking/location-provider";
import { cn } from "@/lib/utils";

export function LocationField({ label, value, onChange, error, placeholder, inputRef }: { label: string; value: string; onChange: (value: string) => void; error?: string; placeholder: string; inputRef?: Ref<HTMLInputElement> }) {
  const id = useId();
  const listId = `${id}-listbox`;
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchFailed, setSearchFailed] = useState(false);
  const [active, setActive] = useState(-1);
  const requests = useRef({ mounted: true, revision: 0 });
  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => { const guard = requests.current; guard.mounted = true; return () => { guard.mounted = false; guard.revision++; if (blurTimer.current) clearTimeout(blurTimer.current); }; }, []);
  function search(query: string) {
    const current = ++requests.current.revision;
    if (!query.trim()) { setSuggestions([]); setLoading(false); setActive(-1); return; }
    setLoading(true); setSearchFailed(false); setActive(-1);
    void localLocationProvider.search(query).then((items) => {
      if (requests.current.mounted && current === requests.current.revision) { setSuggestions(items); setLoading(false); }
    }).catch(() => {
      if (requests.current.mounted && current === requests.current.revision) { setSuggestions([]); setSearchFailed(true); setLoading(false); }
    });
  }
  function choose(suggestion: LocationSuggestion) { onChange(suggestion.label); setOpen(false); setActive(-1); requests.current.revision++; setLoading(false); }
  const visible = open && value.trim().length > 0;
  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") { setOpen(false); setActive(-1); return; }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault(); setOpen(true);
      setActive((index) => suggestions.length ? event.key === "ArrowDown" ? Math.min(index + 1, suggestions.length - 1) : Math.max(index - 1, 0) : -1);
    }
    if (event.key === "Enter" && visible && active >= 0 && suggestions[active]) { event.preventDefault(); choose(suggestions[active]); }
  }
  return <div className="relative min-w-0">
    <label id={`${id}-label`} htmlFor={id} className="mb-1.5 block text-xs font-extrabold uppercase tracking-[.08em] text-muted">{label}</label>
    <div className="relative"><MapPin aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-navy-800" size={18} />
      <input ref={inputRef} id={id} role="combobox" aria-labelledby={`${id}-label`} aria-expanded={visible} aria-controls={visible ? listId : undefined} aria-autocomplete="list" aria-activedescendant={visible && !loading && active >= 0 && suggestions[active] ? `${id}-option-${active}` : undefined} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} value={value} onChange={(event) => { onChange(event.target.value); setOpen(true); search(event.target.value); }} onFocus={() => { if (blurTimer.current) clearTimeout(blurTimer.current); setOpen(true); search(value); }} onBlur={() => { blurTimer.current = setTimeout(() => { if (requests.current.mounted) setOpen(false); }, 100); }} onKeyDown={onKeyDown} className={cn("field", error && "field-error")} placeholder={placeholder} maxLength={120} autoComplete="off" />
    </div>
    {error && <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs font-bold text-danger">{error}</p>}
    {visible && <div id={listId} role="listbox" aria-label={`${label} suggestions`} className="absolute inset-x-0 top-full z-30 mt-2 max-h-60 overflow-y-auto rounded-xl border border-line bg-white p-1.5 shadow-xl">
      {loading ? <p role="option" aria-disabled="true" aria-selected="false" className="flex items-center gap-2 px-3 py-3 text-sm text-muted"><LoaderCircle aria-hidden="true" className="animate-spin" size={16} />Finding common locations…</p> : suggestions.length ? suggestions.map((suggestion, index) => <button id={`${id}-option-${index}`} role="option" aria-selected={active === index} tabIndex={-1} type="button" key={suggestion.id} onMouseDown={(event) => event.preventDefault()} onClick={() => choose(suggestion)} className={cn("flex min-h-11 w-full items-center rounded-lg px-3 text-left text-sm font-bold", active === index ? "bg-[#fff2cc] text-navy-950" : "text-ink hover:bg-warm-50")}>{suggestion.label}</button>) : <p role="option" aria-disabled="true" aria-selected="false" className="px-3 py-3 text-sm text-muted">{searchFailed ? "Suggestions unavailable. Enter your full location." : "Keep your typed address or landmark."}</p>}
    </div>}
  </div>;
}
