import { MessageCircle } from "lucide-react";
import { whatsappHref } from "@/config/site";
export function WhatsAppAction() {
  if (!whatsappHref) return null;
  return <a href={whatsappHref} className="fixed bottom-5 right-5 z-30 hidden min-h-12 max-w-[calc(100vw-2.5rem)] items-center gap-2 rounded-full bg-[#18794e] px-5 font-bold text-white shadow-xl md:flex lg:bottom-6 lg:right-6" aria-label="Book using WhatsApp"><MessageCircle className="shrink-0" size={20} /> WhatsApp</a>;
}
