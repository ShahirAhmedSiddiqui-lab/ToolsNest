import fileSaver from "file-saver";

export type StructuredAIOutput =
  | { kind: "json"; raw: string; value: unknown }
  | { kind: "text"; raw: string; value: string };

const fencedContent = (value: string) => {
  const trimmed = value.trim();
  const match = trimmed.match(/^```(?:json|markdown|md|txt|text)?\s*([\s\S]*?)\s*```$/i);
  return match ? match[1].trim() : trimmed;
};

export const normalizeAIOutput = (value: string) => {
  const cleaned = fencedContent(value).replace(/\r\n/g, "\n").trim();
  if (!cleaned) return { kind: "text", raw: value, value: "" } as StructuredAIOutput;

  if ((cleaned.startsWith("{") && cleaned.endsWith("}")) || (cleaned.startsWith("[") && cleaned.endsWith("]"))) {
    try {
      return { kind: "json", raw: value, value: JSON.parse(cleaned) } as StructuredAIOutput;
    } catch {
      return { kind: "text", raw: value, value: cleaned } as StructuredAIOutput;
    }
  }

  return { kind: "text", raw: value, value: cleaned } as StructuredAIOutput;
};

export const exportAIOutput = (fileName: string, content: string) => {
  fileSaver.saveAs(new Blob([content], { type: "text/plain;charset=utf-8" }), fileName);
};

export const buildChatTranscript = (messages: Array<{ role: "user" | "assistant"; text: string }>) => (
  messages
    .map((message, index) => `${message.role === "user" ? "User" : "Assistant"} ${index + 1}\n${message.text.trim()}`)
    .join("\n\n")
    .trim()
);
