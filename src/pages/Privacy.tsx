import { Lock, Eye, Database, UserCheck, Shield } from "lucide-react";
import { Breadcrumbs } from "../components/Breadcrumbs";

export const Privacy = () => {
  return (
    <div className="flex-1 w-full p-margin-mobile md:p-margin-desktop">
      {/* Header Section */}
      <div className="max-w-[1440px] mx-auto mb-12">
        <Breadcrumbs />
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-heading-navy">Privacy Policy</h1>
              <p className="text-lg text-on-surface-variant mt-1">Your data, your rights, your control</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto">
        {/* Privacy Principles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-surface-container-lowest border border-border-slate rounded-xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <UserCheck className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-semibold text-heading-navy">User Rights</h2>
            </div>
            <p className="text-on-surface-variant leading-relaxed">
              You have the right to access, modify, or delete any personal information associated with your account at any time.
            </p>
          </div>

          <div className="bg-surface-container-lowest border border-border-slate rounded-xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <Eye className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-semibold text-heading-navy">Transparency</h2>
            </div>
            <p className="text-on-surface-variant leading-relaxed">
              We clearly disclose what data we collect and how it's used. No hidden terms or surprise data practices.
            </p>
          </div>

          <div className="bg-surface-container-lowest border border-border-slate rounded-xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <Database className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-semibold text-heading-navy">Minimal Collection</h2>
            </div>
            <p className="text-on-surface-variant leading-relaxed">
              We collect only the minimum data necessary to provide our services. Extra data collection is never performed.
            </p>
          </div>

          <div className="bg-surface-container-lowest border border-border-slate rounded-xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-semibold text-heading-navy">No Third-Parties</h2>
            </div>
            <p className="text-on-surface-variant leading-relaxed">
              We never sell, share, or rent your personal information to third-party organizations or advertisers.
            </p>
          </div>
        </div>

        {/* What We Collect */}
        <div className="bg-surface-container-lowest border border-border-slate rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-semibold text-heading-navy mb-6">What Information We Collect</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-heading-navy mb-3">When Using Our Tools</h3>
              <ul className="space-y-2 text-on-surface-variant">
                <li>• Files you process are stored only in your browser's memory temporarily</li>
                <li>• No copies of your files are saved on our servers</li>
                <li>• Processing happens entirely client-side in your browser</li>
                <li>• Browser cache may temporarily store files until you clear it</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-heading-navy mb-3">Optional Information</h3>
              <ul className="space-y-2 text-on-surface-variant">
                <li>• Email address (only if you choose to contact us or subscribe)</li>
                <li>• Feedback or suggestions you voluntarily provide</li>
                <li>• Technical support information when you report issues</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-heading-navy mb-3">Technical Data</h3>
              <ul className="space-y-2 text-on-surface-variant">
                <li>• Browser type and version (from HTTP headers)</li>
                <li>• General location information (country/region level)</li>
                <li>• Aggregated usage statistics (no personally identifiable data)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Data Retention */}
        <div className="bg-surface-container-lowest border border-border-slate rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-semibold text-heading-navy mb-6">Data Retention</h2>
          <p className="text-on-surface-variant mb-4 leading-relaxed">
            Files processed through ToolsNest are <strong>never retained on our servers</strong>. Here's our retention policy:
          </p>
          <ul className="space-y-3 text-on-surface-variant">
            <li><strong>Processing Data:</strong> Deleted immediately after processing completes</li>
            <li><strong>Cache Data:</strong> Cleared when you close your browser or empty browser cache</li>
            <li><strong>Account Data:</strong> Can be deleted at any time through your account settings</li>
            <li><strong>Log Data:</strong> Server logs are anonymized and retained for 30 days maximum</li>
          </ul>
        </div>

        {/* Your Rights */}
        <div className="bg-surface-container-lowest border border-border-slate rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-semibold text-heading-navy mb-6">Your Privacy Rights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-heading-navy mb-2">Right to Access</h3>
              <p className="text-on-surface-variant text-sm">
                You can request a copy of all personal data we hold about you at any time.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-heading-navy mb-2">Right to Delete</h3>
              <p className="text-on-surface-variant text-sm">
                You can request deletion of your account and all associated data.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-heading-navy mb-2">Right to Correction</h3>
              <p className="text-on-surface-variant text-sm">
                You can update or correct any inaccurate personal information.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-heading-navy mb-2">Right to Opt-Out</h3>
              <p className="text-on-surface-variant text-sm">
                You can opt out of any optional data collection or communications.
              </p>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-8 text-center">
          <h3 className="text-xl font-semibold text-heading-navy mb-3">Privacy Questions?</h3>
          <p className="text-on-surface-variant mb-4">
            If you have any questions about our privacy practices or wish to exercise your privacy rights, please contact us.
          </p>
          <p className="text-sm text-on-surface-variant">
            This policy was last updated on June 3, 2026. We review this policy regularly and update it as needed.
          </p>
        </div>
      </div>
    </div>
  );
};
