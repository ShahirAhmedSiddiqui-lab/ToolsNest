import { CheckCircle, Cloud, Database, Lock, ShieldAlert } from "lucide-react";
import { Breadcrumbs } from "../components/Breadcrumbs";

const practices = [
  [Lock, "Local by default", "PDF editing and conversion, image processing, calculators, document builders, and developer tools execute inside your browser."],
  [Cloud, "Explicit AI boundary", "AI document tools extract text locally first and send only the bounded text needed for the request."],
  [Database, "No application storage", "ToolsNest has no database or persistent file store. Compression uses temporary function memory, local buffers are released after use, and remote AI files are deleted by the application."],
  [CheckCircle, "Protected credentials", "The Gemini key exists only in Vercel Functions. It is never exposed through a VITE_ environment variable or browser bundle."],
] as const;

export const Security = () => <div className="flex-1 w-full p-margin-mobile md:p-margin-desktop"><div className="max-w-[1200px] mx-auto"><Breadcrumbs />
  <header className="mb-10 flex items-center gap-4"><div className="flex h-14 w-14 items-center justify-center rounded-full bg-success-teal/10"><ShieldAlert className="h-8 w-8 text-success-teal" /></div><div><h1 className="text-3xl font-bold text-heading-navy md:text-4xl">Security</h1><p className="mt-1 text-on-surface-variant">Clear trust boundaries and minimal infrastructure</p></div></header>
  <div className="grid gap-6 md:grid-cols-2">{practices.map(([Icon,title,description]) => <section key={title} className="rounded-xl border border-border-slate bg-surface-container-lowest p-7"><Icon className="h-6 w-6 text-success-teal" /><h2 className="mt-4 text-xl font-semibold text-heading-navy">{title}</h2><p className="mt-2 leading-7 text-on-surface-variant">{description}</p></section>)}</div>
  <section className="mt-8 rounded-xl border border-border-slate bg-surface-container-lowest p-7"><h2 className="text-xl font-semibold text-heading-navy">Operational safeguards</h2><ul className="mt-4 list-disc space-y-2 pl-5 text-on-surface-variant"><li>Strict file type, size, page-count, action, origin, and output limits.</li><li>No arbitrary server-side URL fetching or client-controlled model configuration.</li><li>AI endpoints return no-store responses and avoid logging document contents or upload URLs.</li><li>Anonymous AI endpoints must be protected by Vercel Firewall rate limits.</li></ul></section>
</div></div>;
