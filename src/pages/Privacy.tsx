import { Cloud, Database, Eye, Lock, UserCheck } from "lucide-react";
import { Breadcrumbs } from "../components/Breadcrumbs";

const privacyAreas = [
  [Database, "Local tools", "PDF editing and conversion, image processing, calculators, builders, citations, QR, and developer tools use browser memory. Compression is the only PDF operation sent to a Vercel Function."],
  [Cloud, "Cloud operations", "Compression uses temporary function memory without persistence. AI text is sent to Gemini, and AI document tools require consent before direct Gemini upload."],
  [Eye, "Retention", "Compression buffers are discarded when the request ends. One-shot AI files are deleted after processing; chat files are deleted when the session ends."],
  [UserCheck, "Your control", "Every upload boundary is stated on its tool page. You may use local tools without sending content to Gemini and can end an AI document session at any time."],
] as const;

export const Privacy = () => <div className="flex-1 w-full p-margin-mobile md:p-margin-desktop"><div className="max-w-[1200px] mx-auto"><Breadcrumbs />
  <header className="mb-10 flex items-center gap-4"><div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10"><Lock className="h-8 w-8 text-primary" /></div><div><h1 className="text-3xl font-bold text-heading-navy md:text-4xl">Privacy</h1><p className="mt-1 text-on-surface-variant">What stays local and what cloud tools receive</p></div></header>
  <div className="grid gap-6 md:grid-cols-2">{privacyAreas.map(([Icon,title,description]) => <section key={title} className="rounded-xl border border-border-slate bg-surface-container-lowest p-7"><Icon className="h-6 w-6 text-primary" /><h2 className="mt-4 text-xl font-semibold text-heading-navy">{title}</h2><p className="mt-2 leading-7 text-on-surface-variant">{description}</p></section>)}</div>
  <section className="mt-8 rounded-xl border border-border-slate bg-surface-container-lowest p-7"><h2 className="text-xl font-semibold text-heading-navy">Technical data</h2><p className="mt-3 leading-7 text-on-surface-variant">Vercel and Gemini may process normal request metadata such as IP address, browser headers, timestamps, and service logs under their own policies. ToolsNest does not use a user account database, advertising tracker, or persistent application storage.</p></section>
</div></div>;
