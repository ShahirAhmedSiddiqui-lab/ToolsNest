import { FormEvent, useState } from "react";
import { Check, Copy, Quote } from "lucide-react";
import { Breadcrumbs } from "../components/Breadcrumbs";

type Style = "APA" | "MLA" | "Chicago" | "IEEE";

const citationFor = (style: Style, data: { author: string; title: string; publisher: string; year: string; url: string; accessed: string }) => {
  const author = data.author.trim() || "Unknown author";
  const title = data.title.trim();
  const publisher = data.publisher.trim();
  const year = data.year.trim() || "n.d.";
  const url = data.url.trim();
  const accessed = data.accessed ? new Date(`${data.accessed}T00:00:00`).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }) : "";
  if (style === "APA") return `${author}. (${year}). ${title}.${publisher ? ` ${publisher}.` : ""}${url ? ` ${url}` : ""}`;
  if (style === "MLA") return `${author}. “${title}.”${publisher ? ` ${publisher},` : ""} ${year}.${url ? ` ${url}.` : ""}${accessed ? ` Accessed ${accessed}.` : ""}`;
  if (style === "Chicago") return `${author}. “${title}.”${publisher ? ` ${publisher}.` : ""} ${year}.${url ? ` ${url}.` : ""}`;
  return `${author}, “${title},”${publisher ? ` ${publisher},` : ""} ${year}.${url ? ` [Online]. Available: ${url}.` : ""}${accessed ? ` [Accessed: ${accessed}].` : ""}`;
};

export const CitationGenerator = () => {
  const [style, setStyle] = useState<Style>("APA");
  const [form, setForm] = useState({ author: "", title: "", publisher: "", year: "", url: "", accessed: "" });
  const [citation, setCitation] = useState("");
  const [copied, setCopied] = useState(false);
  const update = (name: keyof typeof form, value: string) => setForm((current) => ({ ...current, [name]: value }));
  const submit = (event: FormEvent) => { event.preventDefault(); setCitation(citationFor(style, form)); setCopied(false); };

  return <div className="flex-1 w-full px-margin-mobile md:px-margin-desktop py-8 lg:py-12"><div className="max-w-4xl mx-auto"><Breadcrumbs />
    <header className="mb-8"><h1 className="flex items-center gap-3 text-3xl font-bold text-heading-navy"><Quote className="h-8 w-8 text-primary" /> Citation Generator</h1><p className="mt-2 text-on-surface-variant">Format source details locally in four common citation styles.</p></header>
    <div className="grid gap-6 lg:grid-cols-2"><form onSubmit={submit} className="space-y-4 rounded-2xl border border-border-slate bg-surface-container-lowest p-6">
      <label className="block text-sm font-semibold">Style<select value={style} onChange={(event) => setStyle(event.target.value as Style)} className="mt-2 min-h-11 w-full rounded-lg border border-border-slate bg-surface px-3">{(["APA", "MLA", "Chicago", "IEEE"] as const).map((item) => <option key={item}>{item}</option>)}</select></label>
      {([['author','Author or organization'],['title','Source title'],['publisher','Website, journal, or publisher'],['year','Publication year'],['url','URL'],['accessed','Access date']] as const).map(([name, label]) => <label key={name} className="block text-sm font-semibold">{label}{name === "title" && " *"}<input type={name === "accessed" ? "date" : name === "url" ? "url" : "text"} value={form[name]} onChange={(event) => update(name, event.target.value)} required={name === "title"} maxLength={name === "url" ? 2000 : 300} className="mt-2 min-h-11 w-full rounded-lg border border-border-slate bg-surface px-3" /></label>)}
      <button type="submit" className="min-h-11 w-full rounded-lg bg-primary px-5 font-semibold text-on-primary">Generate citation</button>
    </form><section className="rounded-2xl border border-border-slate bg-surface-container-lowest p-6"><h2 className="text-lg font-bold text-heading-navy">Formatted citation</h2>{citation ? <><p className="mt-5 rounded-lg bg-surface-container-low p-5 leading-7 text-heading-navy" aria-live="polite">{citation}</p><button type="button" onClick={async () => { await navigator.clipboard.writeText(citation); setCopied(true); }} className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg border border-border-slate px-4">{copied ? <Check className="h-4 w-4 text-success-teal" /> : <Copy className="h-4 w-4" />}{copied ? "Copied" : "Copy citation"}</button></> : <p className="mt-5 text-on-surface-variant">Enter the source details to generate a citation.</p>}</section></div>
  </div></div>;
};
