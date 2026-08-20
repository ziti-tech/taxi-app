import type { BookingDraft, BookingReference } from "@/types/booking";
export interface BookingGateway { submit(draft: BookingDraft): Promise<BookingReference>; }
