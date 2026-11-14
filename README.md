# namma oneway drop taxi

A single-page taxi booking website for Villupuram and outstation travel across Tamil Nadu, built with Next.js and React.

The homepage contains trip booking, popular routes, vehicle choices and contact details. Navigation scrolls to sections on the same page, and the booking steps stay within the homepage.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The main page is `src/app/page.tsx`; business identity and contact details are in `src/config/site.ts`.

## Configuration

The default site origin is `https://www.nammaonewaydroptaxi.com`. Set `NEXT_PUBLIC_SITE_URL` in the deployment environment when using a different canonical origin.

Booking uses development adapters for location suggestions, fare estimates and request submission. Connect production services and configure approved pricing before treating development references as confirmed bookings. Phone and WhatsApp links use the contact details in `src/config/site.ts`.

## Checks

```bash
npm run lint
npm run typecheck
npm test
npm run build
```
