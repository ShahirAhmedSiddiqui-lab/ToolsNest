import { Check, ShieldAlert, Layers, Code, Settings } from "lucide-react";

export const Pricing = () => {
  return (
    <div className="flex-grow w-full py-12 md:py-24">
      {/* Header */}
      <header className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-heading-navy mb-6 tracking-tight">
          Security through clarity.
        </h1>
        <p className="text-lg text-on-surface-variant">
          Simple, transparent pricing for professional-grade tools. Upgrade your workflow with zero data retention and advanced batch processing capabilities.
        </p>
      </header>

      {/* Pricing Cards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24 max-w-6xl mx-auto">
        {/* Free Tier */}
        <div className="bg-surface-container-lowest border border-border-slate rounded-lg p-8 flex flex-col h-full hover:shadow-md transition-shadow">
          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-heading-navy mb-2">Free</h3>
            <p className="text-sm text-on-surface-variant h-10">Essential tools for occasional use. Your current plan.</p>
          </div>
          <div className="mb-8 flex-grow">
            <div className="text-4xl font-bold text-heading-navy mb-1">
              $0 <span className="text-sm text-on-surface-variant font-normal">/month</span>
            </div>
            <ul className="mt-8 space-y-4">
              {[
                "Standard file conversions",
                "Up to 5 files per day",
                "Basic AI writing assistant"
              ].map(feature => (
                <li key={feature} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-outline shrink-0 mt-0.5" />
                  <span className="text-sm text-on-surface">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          <button className="w-full py-3 px-4 border border-border-slate rounded-lg font-medium text-sm text-heading-navy hover:bg-surface-container-low transition-colors" disabled>
            Current Plan
          </button>
        </div>

        {/* Pro Tier (Highlighted) */}
        <div className="bg-surface-container-lowest border-2 border-link-blue rounded-lg p-8 flex flex-col h-full relative shadow-lg transform md:-translate-y-4">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-link-blue text-white px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase">
            Most Popular
          </div>
          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-link-blue mb-2">Pro</h3>
            <p className="text-sm text-on-surface-variant h-10">Advanced features for individual professionals requiring privacy.</p>
          </div>
          <div className="mb-8 flex-grow">
            <div className="text-4xl font-bold text-heading-navy mb-1">
              $12 <span className="text-sm text-on-surface-variant font-normal">/month</span>
            </div>
            <ul className="mt-8 space-y-4">
              {[
                { title: "Zero-Retention OCR", highlight: true },
                { title: "Unlimited Batch Processing", highlight: true },
                { title: "Priority conversion speeds" },
                { title: "Advanced AI modeling" }
              ].map(feature => (
                <li key={feature.title} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-link-blue shrink-0 mt-0.5" />
                  <span className={`text-sm text-on-surface ${feature.highlight ? "font-medium" : ""}`}>
                    {feature.title}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <button className="w-full py-3 px-4 bg-link-blue text-white rounded-lg font-medium text-sm hover:opacity-90 transition-opacity focus:ring-4 focus:ring-link-blue/20 outline-none">
            Upgrade to Pro
          </button>
        </div>

        {/* Team Tier */}
        <div className="bg-surface-container-lowest border border-border-slate rounded-lg p-8 flex flex-col h-full hover:shadow-md transition-shadow">
          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-heading-navy mb-2">Team</h3>
            <p className="text-sm text-on-surface-variant h-10">Scalable security and access for organizations.</p>
          </div>
          <div className="mb-8 flex-grow">
            <div className="text-4xl font-bold text-heading-navy mb-1">
              $49 <span className="text-sm text-on-surface-variant font-normal">/month per user</span>
            </div>
            <ul className="mt-8 space-y-4">
               {[
                { title: "Full API Access", highlight: true },
                { title: "Centralized billing & admin" },
                { title: "Custom data retention policies" },
                { title: "Dedicated support channel" }
              ].map(feature => (
                <li key={feature.title} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-outline shrink-0 mt-0.5" />
                  <span className={`text-sm text-on-surface ${feature.highlight ? "font-medium" : ""}`}>
                    {feature.title}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <button className="w-full py-3 px-4 border border-border-slate rounded-lg font-medium text-sm text-heading-navy hover:bg-surface-container-low transition-colors">
            Contact Sales
          </button>
        </div>
      </section>

      {/* Feature Deep Dive */}
      <section className="mt-16 max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold text-heading-navy mb-8 text-center">Engineered for Privacy & Scale</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-surface-container-lowest border border-border-slate rounded-xl p-6 flex flex-col">
            <div className="w-12 h-12 bg-surface-container-high rounded-full flex items-center justify-center mb-4 text-primary">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-semibold text-heading-navy mb-2">Zero-Retention OCR</h4>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Your sensitive documents are processed purely in volatile memory. We do not write your files to disk, ensuring absolute data privacy during optical character recognition.
            </p>
          </div>
          
          <div className="bg-surface-container-lowest border border-border-slate rounded-xl p-6 flex flex-col">
            <div className="w-12 h-12 bg-surface-container-high rounded-full flex items-center justify-center mb-4 text-primary">
              <Layers className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-semibold text-heading-navy mb-2">Batch Processing</h4>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Select hundreds of PDFs or images at once. Our distributed processing engine handles parallel conversions, drastically reducing your operational time.
            </p>
          </div>

          <div className="bg-surface-container-lowest border border-border-slate rounded-xl p-6 flex flex-col md:col-span-2 lg:col-span-1">
            <div className="w-12 h-12 bg-surface-container-high rounded-full flex items-center justify-center mb-4 text-primary">
              <Code className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-semibold text-heading-navy mb-2">API Access</h4>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Integrate ToolsNest directly into your internal applications. Our RESTful API offers high rate limits and comprehensive documentation for seamless automation.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
