import { ShieldAlert, Lock, CheckCircle, Database, Cloud } from "lucide-react";
import { Breadcrumbs } from "../components/Breadcrumbs";

export const Security = () => {
  return (
    <div className="flex-1 w-full p-margin-mobile md:p-margin-desktop">
      {/* Header Section */}
      <div className="max-w-[1440px] mx-auto mb-12">
        <Breadcrumbs />
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-success-teal/10 rounded-full flex items-center justify-center">
              <ShieldAlert className="w-8 h-8 text-success-teal" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-heading-navy">Security</h1>
              <p className="text-lg text-on-surface-variant mt-1">Built with security as a first-class citizen</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto">
        {/* Security Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-surface-container-lowest border border-border-slate rounded-xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-6 h-6 text-success-teal" />
              <h2 className="text-2xl font-semibold text-heading-navy">Local Processing</h2>
            </div>
            <p className="text-on-surface-variant leading-relaxed">
              All file processing happens entirely in your browser. Your data never leaves your device or gets uploaded to external servers. What you process stays with you.
            </p>
          </div>

          <div className="bg-surface-container-lowest border border-border-slate rounded-xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <Database className="w-6 h-6 text-success-teal" />
              <h2 className="text-2xl font-semibold text-heading-navy">No Data Storage</h2>
            </div>
            <p className="text-on-surface-variant leading-relaxed">
              ToolsNest never stores your files, documents, or any personal information. Each session is isolated and temporary data is cleared from memory immediately after processing.
            </p>
          </div>

          <div className="bg-surface-container-lowest border border-border-slate rounded-xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <Cloud className="w-6 h-6 text-success-teal" />
              <h2 className="text-2xl font-semibold text-heading-navy">Open Source</h2>
            </div>
            <p className="text-on-surface-variant leading-relaxed">
              Our codebase is publicly available for security audits. Anyone can review the source code to verify our security practices and ensure transparency.
            </p>
          </div>

          <div className="bg-surface-container-lowest border border-border-slate rounded-xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-success-teal" />
              <h2 className="text-2xl font-semibold text-heading-navy">HTTPS Only</h2>
            </div>
            <p className="text-on-surface-variant leading-relaxed">
              All connections are encrypted using industry-standard HTTPS protocols. Your browser ensures all data in transit is protected from interception.
            </p>
          </div>
        </div>

        {/* Security Practices */}
        <div className="bg-surface-container-lowest border border-border-slate rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-semibold text-heading-navy mb-6">Our Security Practices</h2>
          <ul className="space-y-4">
            <li className="flex gap-3">
              <CheckCircle className="w-5 h-5 text-success-teal flex-shrink-0 mt-1" />
              <span className="text-on-surface-variant">
                <strong>No Third-Party Tracking:</strong> We don't use analytics tools or trackers that monitor your behavior or collect personal data.
              </span>
            </li>
            <li className="flex gap-3">
              <CheckCircle className="w-5 h-5 text-success-teal flex-shrink-0 mt-1" />
              <span className="text-on-surface-variant">
                <strong>No Cookies:</strong> We don't use tracking cookies or persistent identifiers to follow you across the web.
              </span>
            </li>
            <li className="flex gap-3">
              <CheckCircle className="w-5 h-5 text-success-teal flex-shrink-0 mt-1" />
              <span className="text-on-surface-variant">
                <strong>Regular Updates:</strong> We maintain up-to-date dependencies and apply security patches promptly to address vulnerabilities.
              </span>
            </li>
            <li className="flex gap-3">
              <CheckCircle className="w-5 h-5 text-success-teal flex-shrink-0 mt-1" />
              <span className="text-on-surface-variant">
                <strong>Code Review:</strong> Security-sensitive code undergoes thorough peer review before deployment.
              </span>
            </li>
            <li className="flex gap-3">
              <CheckCircle className="w-5 h-5 text-success-teal flex-shrink-0 mt-1" />
              <span className="text-on-surface-variant">
                <strong>Secure Dependencies:</strong> All third-party libraries are carefully vetted and monitored for known vulnerabilities.
              </span>
            </li>
          </ul>
        </div>

        {/* Trust Banner */}
        <div className="bg-success-teal/5 border border-success-teal/20 rounded-xl p-8 text-center">
          <h3 className="text-xl font-semibold text-heading-navy mb-2">Security Through Clarity</h3>
          <p className="text-on-surface-variant max-w-2xl mx-auto">
            Your trust is paramount. We believe in transparency and security through clarity. Every feature is designed with your privacy and safety in mind.
          </p>
        </div>
      </div>
    </div>
  );
};
