"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent } from "react";

type SectionLinkProps = Omit<ComponentProps<"a">, "href"> & { href: string };

export function SectionLink({ href, onClick, children, ...props }: SectionLinkProps) {
  function navigate(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || props.download || (props.target && props.target !== "_self")) return;

    const destination = new URL(href, window.location.href);
    if (destination.origin !== window.location.origin || destination.pathname !== window.location.pathname || !destination.hash) return;
    const target = document.getElementById(destination.hash.slice(1));
    if (!target) return;

    event.preventDefault();
    if (window.location.hash !== destination.hash) {
      window.history.pushState(null, "", `${window.location.pathname}${window.location.search}${destination.hash}`);
    }
    requestAnimationFrame(() => {
      target.scrollIntoView({ block: "start" });
      const heading = target.querySelector<HTMLElement>("h1, h2") ?? target;
      if (!heading.hasAttribute("tabindex")) heading.setAttribute("tabindex", "-1");
      heading.focus({ preventScroll: true });
    });
  }

  return <Link {...props} href={href} onClick={navigate}>{children}</Link>;
}
