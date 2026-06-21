import { useMemo, useState } from "react";
import { CheckCircle2, Copy, Download, Sparkles } from "lucide-react";
import { exportAIOutput, normalizeAIOutput } from "../lib/aiOutput";

type AIResultCardProps = {
  title: string;
  content: string;
  placeholder: string;
  exportFileName: string;
  className?: string;
};

type Block =
  | { type: "heading"; text: string }
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "pairs"; items: Array<{ label: string; value: string }> }
  | { type: "paragraph"; text: string };

const primitive = (value: unknown) => ["string", "number", "boolean"].includes(typeof value) || value === null;

const inline = (value: string) => value.replace(/\*\*(.*?)\*\*/g, "$1").replace(/`(.*?)`/g, "$1").trim();

const parseTextBlocks = (value: string): Block[] => {
  const normalized = value.replace(/\r\n/g, "\n").trim();
  if (!normalized) return [];

  return normalized
    .split(/\n{2,}/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk) => {
      const lines = chunk.split("\n").map((line) => line.trim()).filter(Boolean);
      if (!lines.length) return null;

      if (lines.length === 1 && /^(#{1,6}\s+|[A-Z][^.!?]{1,80}:)$/.test(lines[0])) {
        return { type: "heading", text: inline(lines[0].replace(/^#{1,6}\s+/, "").replace(/:$/, "")) } as Block;
      }

      const bulletItems = lines.map((line) => line.match(/^[-*\u2022]\s+(.*)$/)?.[1] ?? null);
      if (bulletItems.every(Boolean)) {
        return { type: "list", ordered: false, items: bulletItems.filter((item): item is string => Boolean(item)).map(inline) } as Block;
      }

      const orderedItems = lines.map((line) => line.match(/^\d+[\.\)]\s+(.*)$/)?.[1] ?? null);
      if (orderedItems.every(Boolean)) {
        return { type: "list", ordered: true, items: orderedItems.filter((item): item is string => Boolean(item)).map(inline) } as Block;
      }

      const pairs = lines.map((line) => {
        const match = line.match(/^([^:\n]{2,60}):\s+(.+)$/);
        return match ? { label: inline(match[1]), value: inline(match[2]) } : null;
      });
      if (pairs.every(Boolean) && pairs.length > 1) {
        return { type: "pairs", items: pairs.filter((item): item is { label: string; value: string } => Boolean(item)) } as Block;
      }

      return { type: "paragraph", text: lines.map(inline).join(" ") } as Block;
    })
    .filter((block): block is Block => Boolean(block));
};

function JsonValue({ label, value, depth = 0 }: { label?: string; value: unknown; depth?: number }) {
  if (primitive(value)) {
    return (
      <div className="rounded-xl border border-border-slate/70 bg-white/80 px-4 py-3">
        {label && <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">{label}</p>}
        <p className="text-sm leading-7 text-heading-navy">{String(value ?? "null")}</p>
      </div>
    );
  }

  if (Array.isArray(value)) {
    if (!value.length) return <JsonValue label={label} value="No items" depth={depth} />;

    if (value.every(primitive)) {
      return (
        <div className="rounded-2xl border border-border-slate bg-white/80 p-4">
          {label && <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">{label}</p>}
          <ul className="space-y-2">
            {value.map((item, index) => (
              <li key={`${label ?? "item"}-${index}`} className="rounded-xl bg-surface-container-low px-4 py-3 text-sm leading-7 text-heading-navy">
                {String(item ?? "null")}
              </li>
            ))}
          </ul>
        </div>
      );
    }

    return (
      <div className="rounded-2xl border border-border-slate bg-white/80 p-4">
        {label && <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">{label}</p>}
        <div className="space-y-3">
          {value.map((item, index) => (
            <div key={`${label ?? "group"}-${index}`}>
              <JsonValue label={`${label ? `${label} ` : ""}Item ${index + 1}`} value={item} depth={depth + 1} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const entries = Object.entries(value as Record<string, unknown>);
  return (
    <div className={`rounded-2xl border border-border-slate bg-white/80 p-4 ${depth === 0 ? "shadow-sm" : ""}`}>
      {label && <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">{label}</p>}
      <div className="grid gap-3">
        {entries.map(([key, nestedValue]) => (
          <div key={key}>
            <JsonValue label={key.replace(/[_-]+/g, " ")} value={nestedValue} depth={depth + 1} />
          </div>
        ))}
      </div>
    </div>
  );
}

export const AIResultBody = ({ content }: { content: string }) => {
  const parsed = useMemo(() => normalizeAIOutput(content), [content]);

  if (parsed.kind === "json") {
    return <JsonValue value={parsed.value} />;
  }

  const blocks = parseTextBlocks(parsed.value);

  return (
    <div className="space-y-4">
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          return <h3 key={`heading-${index}`} className="text-base font-semibold text-heading-navy">{block.text}</h3>;
        }

        if (block.type === "list") {
          const ListTag = block.ordered ? "ol" : "ul";
          return (
            <ListTag
              key={`list-${index}`}
              className={`space-y-2 rounded-2xl border border-border-slate bg-white/75 p-4 text-sm leading-7 text-heading-navy ${block.ordered ? "list-decimal pl-9" : "list-disc pl-9"}`}
            >
              {block.items.map((item, itemIndex) => <li key={`item-${itemIndex}`}>{item}</li>)}
            </ListTag>
          );
        }

        if (block.type === "pairs") {
          return (
            <dl key={`pairs-${index}`} className="grid gap-3 rounded-2xl border border-border-slate bg-white/75 p-4 sm:grid-cols-2">
              {block.items.map((item) => (
                <div key={`${item.label}-${item.value.slice(0, 12)}`} className="rounded-xl bg-surface-container-low px-4 py-3">
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">{item.label}</dt>
                  <dd className="mt-1 text-sm leading-7 text-heading-navy">{item.value}</dd>
                </div>
              ))}
            </dl>
          );
        }

        return <p key={`paragraph-${index}`} className="text-sm leading-7 text-heading-navy">{block.text}</p>;
      })}
    </div>
  );
};

export const AIResultCard = ({ title, content, placeholder, exportFileName, className = "" }: AIResultCardProps) => {
  const [copied, setCopied] = useState(false);
  const hasContent = Boolean(content.trim());

  const copy = async () => {
    if (!hasContent) return;
    await navigator.clipboard.writeText(content);
    setCopied(true);
    globalThis.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section className={`flex h-full min-h-0 flex-col rounded-2xl border border-border-slate bg-linear-to-br from-white via-surface-container-lowest to-surface-container p-5 shadow-sm ${className}`} aria-live="polite">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-border-slate/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-heading-navy">{title}</h2>
            <p className="text-xs text-on-surface-variant">{hasContent ? "Formatted and ready to reuse" : "Output will appear here"}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={copy} disabled={!hasContent} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-border-slate bg-white px-3 py-2 text-sm font-medium text-heading-navy transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50">
            {copied ? <CheckCircle2 className="h-4 w-4 text-success-teal" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied" : "Copy"}
          </button>
          <button type="button" onClick={() => exportAIOutput(exportFileName, content)} disabled={!hasContent} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-heading-navy px-3 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50">
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        {hasContent ? (
          <AIResultBody content={content} />
        ) : (
          <div className="flex h-full min-h-[220px] items-center justify-center rounded-2xl border border-dashed border-border-slate bg-white/55 p-8 text-center text-sm leading-7 text-on-surface-variant">
            {placeholder}
          </div>
        )}
      </div>
    </section>
  );
};
