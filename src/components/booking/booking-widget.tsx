"use client";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { LocateFixed, MapPin, Plane, Repeat2, Route, Search, UsersRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { Controller, useForm, useWatch } from "react-hook-form";
import { createTripSchema, type TripFormValues } from "@/schemas/booking";
import { cn } from "@/lib/utils";
import { DateTimePickerField } from "./date-time-picker-field";
const tabs = [{ id: "one-way", label: "One way", icon: Route }, { id: "round-trip", label: "Round trip", icon: Repeat2 }, { id: "airport", label: "Airport", icon: Plane }] as const;

function Field({ label, error, icon: Icon, children }: { label: string; error?: string; icon: typeof MapPin; children: React.ReactNode }) {
  return <label className="block min-w-0"><span className="mb-1.5 block text-xs font-extrabold uppercase tracking-[.08em] text-muted">{label}</span><span className="relative block min-w-0"><Icon className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-navy-800" size={18} />{children}</span>{error && <span className="mt-1.5 block text-xs font-bold text-danger">{error}</span>}</label>;
}
export function BookingWidget() {
  const [status, setStatus] = useState<"idle" | "loading">("idle"); const router = useRouter();
  const { register, handleSubmit, control, getValues, setValue, formState: { errors } } = useForm<TripFormValues>({ resolver: zodResolver(createTripSchema()), defaultValues: { tripType: "one-way", pickup: "", drop: "", date: "", time: "", returnDate: "", returnTime: "", passengers: 1 } });
  const tripType = useWatch({ control, name: "tripType" });
  const submit = (values: TripFormValues) => { setStatus("loading"); const params = new URLSearchParams(); Object.entries(values).forEach(([key, value]) => { if (value !== undefined && value !== "") params.set(key, String(value)); }); router.push(`/book?${params.toString()}`); };
  const swap = () => { const pickup = getValues("pickup"); const drop = getValues("drop"); setValue("pickup", drop, { shouldValidate: true }); setValue("drop", pickup, { shouldValidate: true }); };
  return <div id="book" className="card min-w-0 scroll-mt-28 overflow-visible border-white/70 bg-[#fffefa] shadow-[0_24px_70px_rgba(0,9,20,.28)]">
    <div className="rounded-t-[1.25rem] border-b border-line bg-[#fffefa] px-4 py-4 sm:px-6 sm:py-5"><div className="flex items-center justify-between gap-3"><div><h2 className="text-2xl font-extrabold tracking-tight text-navy-950">Book Your Ride</h2><p className="mt-1 text-sm font-semibold text-muted">Simple. Transparent. Reliable.</p></div><span className="hidden rounded-full bg-[#fff3cf] px-3 py-1.5 text-xs font-bold text-navy-900 sm:block">No account needed</span></div></div>
    <form onSubmit={handleSubmit(submit)} noValidate className="bg-white p-4 sm:p-6">
      <fieldset className="min-w-0"><legend className="sr-only">Choose trip type</legend><div className="relative grid min-w-0 grid-cols-3 gap-1 rounded-xl bg-[#f1f4f6] p-1"><span aria-hidden="true" className="absolute bottom-1 left-1 top-1 w-[calc((100%-1rem)/3)] rounded-lg bg-navy-900 shadow-sm transition-transform duration-300 ease-out" style={{ transform: `translateX(calc(${tabs.findIndex((tab) => tab.id === tripType) * 100}% + ${tabs.findIndex((tab) => tab.id === tripType) * 4}px))` }}/>{tabs.map(({ id, label, icon: Icon }) => <label key={id} className={cn("relative z-10 flex min-h-12 min-w-0 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-lg px-0.5 text-center text-[11px] leading-tight font-extrabold transition-colors duration-300 min-[360px]:flex-row min-[360px]:gap-1 min-[360px]:text-xs sm:text-sm", tripType === id ? "text-white" : "text-muted hover:text-navy-950")}><input type="radio" value={id} className="sr-only" {...register("tripType")} /><Icon size={16} className="shrink-0 transition-transform duration-300" />{label}</label>)}</div></fieldset>
      <div className="relative mt-5 grid gap-4">
        <Field label="Pickup location" icon={LocateFixed} error={errors.pickup?.message}><input className={cn("field", errors.pickup && "field-error")} placeholder="Enter pickup area or landmark" autoComplete="street-address" {...register("pickup")} /></Field>
        <span className="-my-3 flex h-6 items-center justify-end pr-3"><button type="button" onClick={swap} className="z-20 grid size-10 shrink-0 place-items-center rounded-full border border-line bg-white text-navy-900 shadow-md transition-transform hover:rotate-180" aria-label="Swap pickup and drop locations"><Repeat2 size={17} className="rotate-90" /></button></span>
        <Field label="Drop location" icon={MapPin} error={errors.drop?.message}><input className={cn("field", errors.drop && "field-error")} placeholder="Enter destination" autoComplete="off" {...register("drop")} /></Field>
      </div>
      <div className="mt-4 grid min-w-0 gap-4 sm:grid-cols-2"><Controller name="date" control={control} render={({ field }) => <DateTimePickerField mode="date" label="Pickup date" value={field.value} onChange={field.onChange} error={errors.date?.message}/>}/><Controller name="time" control={control} render={({ field }) => <DateTimePickerField mode="time" label="Pickup time" value={field.value} onChange={field.onChange} error={errors.time?.message}/>} /></div>
      {tripType === "round-trip" && <div className="mt-4 grid min-w-0 gap-4 sm:grid-cols-2"><Controller name="returnDate" control={control} render={({ field }) => <DateTimePickerField mode="date" label="Return date" value={field.value ?? ""} onChange={field.onChange} error={errors.returnDate?.message}/>}/><Controller name="returnTime" control={control} render={({ field }) => <DateTimePickerField mode="time" label="Return time" value={field.value ?? ""} onChange={field.onChange} error={errors.returnTime?.message}/>} /></div>}
      <div className="mt-4"><Field label="Passengers" icon={UsersRound} error={errors.passengers?.message}><select className="field appearance-none" {...register("passengers", { valueAsNumber: true })}>{[1,2,3,4,5,6,7].map((n) => <option key={n} value={n}>{n} passenger{n > 1 ? "s" : ""}</option>)}</select></Field></div>
      <button type="submit" disabled={status === "loading"} className="btn btn-navy mt-5 w-full disabled:cursor-wait disabled:opacity-65">{status === "loading" ? <><span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> Checking…</> : <><Search size={19} /> Check fare</>}</button>
      <div aria-live="polite" className="min-h-6">{status === "loading" && <p className="mt-3 text-center text-xs font-bold text-muted">Opening your booking…</p>}</div>
    </form>
  </div>;
}
