import { useState } from "react";
import { Calendar, Trash2, AlertCircle } from "lucide-react";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { AIResultCard } from "../components/AIResultCard";
import { aiErrorMessage, generateContentCalendar } from "../services/gemini";
import { useAIHealth } from "../hooks/useAIHealth";

export const ContentCalendarGenerator = () => {
  const [topic, setTopic] = useState("");
  const [audience, setAudience] = useState("");
  const [platform, setPlatform] = useState("instagram");
  const [days, setDays] = useState("7");
  const [calendar, setCalendar] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const { aiReady, aiMessage } = useAIHealth();

  const handleGenerate = async () => {
    if (!topic.trim() || !audience.trim()) {
      setError("Please enter both topic and target audience");
      return;
    }

    if (!aiReady) {
      setError(aiMessage);
      return;
    }

    setIsProcessing(true);
    setError("");
    try {
      const numDays = parseInt(days) || 7;
      const calendarContent = await generateContentCalendar(
        topic,
        audience,
        platform,
        numDays
      );
      setCalendar(calendarContent);
    } catch (err) {
      setError(aiErrorMessage(err, "Failed to generate calendar. Please try again."));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClear = () => {
    setTopic("");
    setAudience("");
    setPlatform("instagram");
    setDays("7");
    setCalendar("");
    setError("");
  };

  return (
    <div className="flex-1 w-full px-margin-mobile md:px-margin-desktop py-8 lg:py-12 flex flex-col">
      <div className="max-w-5xl mx-auto w-full flex flex-col">
        <Breadcrumbs />
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-heading-navy mb-2 flex items-center gap-3">
            <div className="bg-primary/10 p-1.5 rounded-lg text-primary inline-flex">
              <Calendar className="w-6 h-6" />
            </div>
            Content Calendar Generator
          </h1>
          <p className="text-on-surface-variant max-w-2xl">
            Plan your social media content strategy with AI-generated ideas.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
            <p className="text-sm text-error">{error}</p>
          </div>
        )}
        {!aiReady && aiMessage && !error && (
          <div className="mb-6 rounded-lg border border-border-slate bg-surface-container-low p-4">
            <p className="text-sm text-on-surface-variant">{aiMessage}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Settings */}
          <div className="bg-surface-container-lowest border border-border-slate rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-semibold text-heading-navy">Settings</h3>

            <div>
              <label className="text-sm font-semibold text-heading-navy block mb-2">Brand/Topic</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                maxLength={500}
                placeholder="Enter the brand, topic, or campaign"
                className="w-full bg-surface border border-border-slate rounded-lg px-3 py-2 text-heading-navy focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-heading-navy block mb-2">Target Audience</label>
              <input
                type="text"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                maxLength={300}
                placeholder="Describe the target audience"
                className="w-full bg-surface border border-border-slate rounded-lg px-3 py-2 text-heading-navy focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-heading-navy block mb-2">Platform</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full bg-surface border border-border-slate rounded-lg px-3 py-2 text-heading-navy focus:outline-none focus:border-primary"
              >
                <option value="instagram">Instagram</option>
                <option value="twitter">Twitter/X</option>
                <option value="linkedin">LinkedIn</option>
                <option value="facebook">Facebook</option>
                <option value="tiktok">TikTok</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-heading-navy block mb-2">Days to Plan</label>
              <select
                value={days}
                onChange={(e) => setDays(e.target.value)}
                className="w-full bg-surface border border-border-slate rounded-lg px-3 py-2 text-heading-navy focus:outline-none focus:border-primary"
              >
                <option value="3">3 Days</option>
                <option value="7">7 Days</option>
                <option value="14">14 Days</option>
                <option value="30">30 Days</option>
              </select>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isProcessing || !topic.trim() || !audience.trim() || !aiReady}
              className="w-full bg-primary text-on-primary font-medium py-2.5 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isProcessing ? "Generating..." : "Generate Calendar"}
            </button>

            <button
              onClick={handleClear}
              className="w-full text-error hover:bg-error/10 font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" /> Clear
            </button>
          </div>

          {/* Output */}
          <div className="lg:col-span-2">
            <AIResultCard
              title="Generated Calendar"
              content={calendar}
              placeholder='Fill in the details and click "Generate Calendar" to create your content plan.'
              exportFileName={`${platform}-content-calendar.txt`}
              className="min-h-[420px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
