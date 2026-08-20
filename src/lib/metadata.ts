import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
export function createMetadata({ title, description, path }: { title: string; description: string; path: string }): Metadata { return { title, description, alternates: { canonical: path }, openGraph: { title, description, url: new URL(path, siteConfig.url) } }; }
