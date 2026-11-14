"use client";

import { cloneElement, useId, type ReactElement, type ReactNode } from "react";
import { MapPin } from "lucide-react";

type ControlProps = { id?: string; "aria-labelledby"?: string; "aria-describedby"?: string; "aria-invalid"?: boolean };

export function BookingField({ label, error, icon: Icon, children }: { label: string; error?: string; icon: typeof MapPin; children: ReactNode }) {
  const id = useId();
  return <div className="block min-w-0">
    <label id={`${id}-label`} htmlFor={id} className="mb-1.5 block text-xs font-extrabold uppercase tracking-[.08em] text-muted">{label}</label>
    <div className="relative min-w-0">
      <Icon aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-navy-800" size={18} />
      {cloneElement(children as ReactElement<ControlProps>, { id, "aria-labelledby": `${id}-label`, "aria-describedby": error ? `${id}-error` : undefined, "aria-invalid": Boolean(error) })}
    </div>
    {error && <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs font-bold text-danger">{error}</p>}
  </div>;
}
