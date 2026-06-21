import { useEffect, useState } from "react";
import { getAIHealth } from "../services/gemini";

export const useAIHealth = () => {
  const [aiReady, setAiReady] = useState(false);
  const [aiMessage, setAiMessage] = useState("Checking AI service...");

  useEffect(() => {
    let active = true;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;

    const check = async (force = false) => {
      try {
        const configured = await getAIHealth(force);
        if (!active) return;
        setAiReady(configured);
        setAiMessage(configured ? "" : "AI service is not configured on this deployment.");
      } catch {
        if (!active) return;
        setAiReady(false);
        setAiMessage("AI service health could not be verified. Retrying...");
        if (!force) retryTimer = setTimeout(() => void check(true), 1_500);
        else setAiMessage("AI service could not be reached. Please refresh and try again.");
      }
    };

    void check();
    return () => {
      active = false;
      if (retryTimer) clearTimeout(retryTimer);
    };
  }, []);

  return { aiReady, aiMessage };
};
