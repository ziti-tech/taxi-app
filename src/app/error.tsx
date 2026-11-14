"use client";

import { useEffect, useRef } from "react";
import { Phone, RefreshCw } from "lucide-react";
import { phoneHref } from "@/config/site";

export default function ErrorPage({ error, retry }: { error: unknown; retry: () => void }) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    console.error(error);
    headingRef.current?.focus();
  }, [error]);

  return <main id="main-content" className="container-site grid min-h-[65vh] place-items-center py-16 text-center">
    <div className="max-w-lg">
      <h1 ref={headingRef} tabIndex={-1} className="text-3xl font-extrabold text-navy-950">We couldn’t load this page</h1>
      <p className="mt-4 leading-7 text-muted">Please try again. You can also call us to arrange your trip.</p>
      <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
        <button type="button" onClick={retry} className="btn btn-primary"><RefreshCw aria-hidden="true" size={18} />Try again</button>
        <a href={phoneHref} className="btn btn-navy"><Phone aria-hidden="true" size={18} />Call for a taxi</a>
      </div>
    </div>
  </main>;
}
