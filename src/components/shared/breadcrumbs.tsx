import Link from "next/link";
import { ChevronRight } from "lucide-react";
export type BreadcrumbItem = { label: string; href?: string };
export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) { return <nav aria-label="Breadcrumb"><ol className="flex min-w-0 flex-wrap items-center gap-1.5 text-xs font-bold text-muted">{items.map((item, index) => <li key={item.label} className="flex min-w-0 items-center gap-1.5">{index > 0 && <ChevronRight className="shrink-0 text-line" size={14}/>} {item.href ? <Link className="rounded hover:text-navy-900" href={item.href}>{item.label}</Link> : <span aria-current="page" className="min-w-0 text-navy-900">{item.label}</span>}</li>)}</ol></nav>; }
