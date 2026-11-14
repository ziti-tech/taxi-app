import { MessageCircle, Phone } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import { BookingSummary } from "./booking-summary";
import { phoneHref } from "@/config/site";
import type { BookingDraft } from "@/types/booking";
import type { WhatsAppHandoff } from "@/lib/booking/whatsapp-handoff";

export function ConfirmationStep({ draft, result, onNewBooking, onEdit }: { draft: BookingDraft; result: WhatsAppHandoff; onNewBooking: () => void; onEdit: () => void }) {
  return <section aria-labelledby="confirmation-title" className="text-center">
    <span className="mx-auto grid size-16 place-items-center rounded-full bg-[#edf7f1] text-success"><MessageCircle aria-hidden="true" size={34} /></span>
    <p className="eyebrow mt-5">Ready to send</p>
    <h2 id="confirmation-title" tabIndex={-1} className="mt-2 text-3xl font-extrabold tracking-tight text-navy-950">Your WhatsApp enquiry is ready</h2>
    <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-muted">Review the message in WhatsApp and tap <strong>Send</strong>. Your enquiry has not been sent by this website. The operator will confirm the fare and availability before your ride is booked.</p>
    <a href={result.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-6"><FaWhatsapp aria-hidden="true" size={20} />Open WhatsApp to send enquiry</a>
    <p className="mt-3 text-xs leading-5 text-muted">If WhatsApp did not open, use the button above or call us.</p>
    <div className="mx-auto mt-6 max-w-md text-left"><BookingSummary draft={draft} /></div>
    <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
      <button type="button" onClick={onEdit} className="btn border border-line bg-white text-navy-900">Edit enquiry</button>
      <button type="button" onClick={onNewBooking} className="btn border border-line bg-white text-navy-900">Back to trip form</button>
      <a href={phoneHref} className="btn border border-line bg-white text-navy-900"><Phone aria-hidden="true" size={18} />Call</a>
    </div>
  </section>;
}
