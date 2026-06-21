import { Copy, Link as LinkIcon, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Breadcrumbs } from "../components/Breadcrumbs";

const encodeField = (value: string) => value.trim();

export const UTMLinkBuilder = () => {
  const [baseUrl, setBaseUrl] = useState("");
  const [source, setSource] = useState("");
  const [medium, setMedium] = useState("");
  const [campaign, setCampaign] = useState("");
  const [term, setTerm] = useState("");
  const [content, setContent] = useState("");
  const [copied, setCopied] = useState(false);

  const generatedUrl = useMemo(() => {
    const trimmedBase = baseUrl.trim();
    if (!trimmedBase) return "";

    try {
      const url = new URL(trimmedBase);
      const params = [
        ["utm_source", encodeField(source)],
        ["utm_medium", encodeField(medium)],
        ["utm_campaign", encodeField(campaign)],
        ["utm_term", encodeField(term)],
        ["utm_content", encodeField(content)],
      ];

      params.forEach(([key, value]) => {
        if (value) url.searchParams.set(key, value);
        else url.searchParams.delete(key);
      });

      return url.toString();
    } catch {
      return "";
    }
  }, [baseUrl, source, medium, campaign, term, content]);

  const clear = () => {
    setBaseUrl("");
    setSource("");
    setMedium("");
    setCampaign("");
    setTerm("");
    setContent("");
    setCopied(false);
  };

  const copy = async () => {
    if (!generatedUrl) return;
    await navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 w-full px-margin-mobile md:px-margin-desktop py-8 lg:py-12">
      <div className="max-w-5xl mx-auto">
        <Breadcrumbs />

        <header className="mb-8">
          <h1 className="flex items-center gap-3 text-3xl font-bold text-heading-navy">
            <LinkIcon className="h-8 w-8 text-primary" />
            UTM Link Builder
          </h1>
          <p className="mt-2 text-on-surface-variant">
            Build campaign tracking URLs locally with clean UTM parameters.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.9fr)]">
          <section className="rounded-2xl border border-border-slate bg-surface-container-lowest p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm font-semibold text-heading-navy md:col-span-2">
                Base URL
                <input value={baseUrl} onChange={(event) => setBaseUrl(event.target.value)} placeholder="https://yourdomain.com/page" className="mt-2 min-h-11 w-full rounded-lg border border-border-slate px-3" />
              </label>
              <label className="text-sm font-semibold text-heading-navy">
                Source
                <input value={source} onChange={(event) => setSource(event.target.value)} placeholder="Traffic source" className="mt-2 min-h-11 w-full rounded-lg border border-border-slate px-3" />
              </label>
              <label className="text-sm font-semibold text-heading-navy">
                Medium
                <input value={medium} onChange={(event) => setMedium(event.target.value)} placeholder="Traffic medium" className="mt-2 min-h-11 w-full rounded-lg border border-border-slate px-3" />
              </label>
              <label className="text-sm font-semibold text-heading-navy">
                Campaign
                <input value={campaign} onChange={(event) => setCampaign(event.target.value)} placeholder="Campaign name" className="mt-2 min-h-11 w-full rounded-lg border border-border-slate px-3" />
              </label>
              <label className="text-sm font-semibold text-heading-navy">
                Term
                <input value={term} onChange={(event) => setTerm(event.target.value)} placeholder="Keyword term (optional)" className="mt-2 min-h-11 w-full rounded-lg border border-border-slate px-3" />
              </label>
              <label className="text-sm font-semibold text-heading-navy md:col-span-2">
                Content
                <input value={content} onChange={(event) => setContent(event.target.value)} placeholder="Ad or variation label (optional)" className="mt-2 min-h-11 w-full rounded-lg border border-border-slate px-3" />
              </label>
            </div>

            <button type="button" onClick={clear} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-lg text-error hover:bg-error/10 px-3">
              <Trash2 className="h-4 w-4" />
              Clear
            </button>
          </section>

          <aside className="rounded-2xl border border-border-slate bg-surface-container-lowest p-6">
            <h2 className="text-lg font-bold text-heading-navy">Generated URL</h2>
            <div className="mt-4 rounded-xl border border-border-slate bg-surface p-4">
              {generatedUrl ? (
                <p className="break-all font-mono text-sm text-heading-navy">{generatedUrl}</p>
              ) : (
                <p className="text-sm text-on-surface-variant">Enter a valid base URL to generate a trackable link.</p>
              )}
            </div>

            <button
              type="button"
              onClick={copy}
              disabled={!generatedUrl}
              className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-5 font-semibold text-on-primary disabled:opacity-50"
            >
              <Copy className="h-4 w-4" />
              {copied ? "Copied" : "Copy URL"}
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
};
