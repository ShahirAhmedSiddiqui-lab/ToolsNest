import { Download, Receipt, Plus, MoreVertical, TrendingDown, QrCode, Link as LinkIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Breadcrumbs } from "../components/Breadcrumbs";

export const BusinessTools = () => {
  return (
    <div className="px-margin-mobile md:px-margin-desktop py-8 md:py-12 flex-1">
      {/* Page Header */}
      <div className="mb-8 md:mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-heading-navy">Business Tools</h1>
          <p className="text-lg text-on-surface-variant mt-2 max-w-2xl">
            High-utility professional tools to manage operations. All data processing is secure and localized where possible.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 flex items-center gap-2 bg-surface-container-lowest border border-border-slate text-heading-navy text-sm font-medium rounded-lg hover:bg-surface-container-low transition-colors">
            <Download className="w-5 h-5" />
            Export Report
          </button>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
        
        {/* Invoice Generator (Span 8) */}
        <div className="lg:col-span-8 bg-surface-container-lowest rounded-xl border border-border-slate p-6 flex flex-col h-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-heading-navy flex items-center gap-2">
              <Receipt className="w-6 h-6 text-primary" />
              Recent Invoices
            </h2>
            <Link to="/business/invoice-generator" className="px-3 py-1.5 bg-link-blue text-on-primary text-sm font-medium rounded-lg hover:opacity-90 flex items-center gap-1">
              <Plus className="w-5 h-5" />
              New Invoice
            </Link>
          </div>
          
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border-slate text-on-surface-variant">
                  <th className="pb-3 font-medium">Invoice ID</th>
                  <th className="pb-3 font-medium">Client</th>
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium text-right">Amount</th>
                  <th className="pb-3 font-medium text-center">Status</th>
                  <th className="pb-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border-slate hover:bg-surface/50 transition-colors">
                  <td className="py-4 font-mono text-[13px]">INV-2024-001</td>
                  <td className="py-4 font-medium text-heading-navy">Acme Corp</td>
                  <td className="py-4 text-on-surface-variant">Oct 24, 2024</td>
                  <td className="py-4 text-right font-medium">$1,250.00</td>
                  <td className="py-4 text-center">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-success-teal/10 text-success-teal text-xs font-medium">Paid</span>
                  </td>
                  <td className="py-4 text-right">
                    <button className="text-link-blue hover:underline">PDF</button>
                  </td>
                </tr>
                <tr className="border-b border-border-slate hover:bg-surface/50 transition-colors">
                  <td className="py-4 font-mono text-[13px]">INV-2024-002</td>
                  <td className="py-4 font-medium text-heading-navy">Stark Industries</td>
                  <td className="py-4 text-on-surface-variant">Oct 28, 2024</td>
                  <td className="py-4 text-right font-medium">$3,400.00</td>
                  <td className="py-4 text-center">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-surface-dim text-on-surface-variant text-xs font-medium">Pending</span>
                  </td>
                  <td className="py-4 text-right">
                    <button className="text-link-blue hover:underline">PDF</button>
                  </td>
                </tr>
                <tr className="hover:bg-surface/50 transition-colors">
                  <td className="py-4 font-mono text-[13px]">INV-2024-003</td>
                  <td className="py-4 font-medium text-heading-navy">Wayne Ent.</td>
                  <td className="py-4 text-on-surface-variant">Nov 01, 2024</td>
                  <td className="py-4 text-right font-medium">$850.00</td>
                  <td className="py-4 text-center">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-error/10 text-error text-xs font-medium">Overdue</span>
                  </td>
                  <td className="py-4 text-right">
                    <button className="text-link-blue hover:underline">PDF</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="pt-4 border-t border-border-slate flex justify-end">
            <button className="text-link-blue text-sm font-medium hover:underline flex items-center gap-1">
              View All Invoices
              <span className="ml-1 text-lg leading-none">&rarr;</span>
            </button>
          </div>
        </div>

        {/* Expenses (Span 4) */}
        <div className="lg:col-span-4 bg-surface-container-lowest rounded-xl border border-border-slate p-6 flex flex-col h-full">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-semibold text-heading-navy flex items-center gap-2">
              <Receipt className="w-6 h-6 text-primary" />
              Expenses
            </h2>
            <button className="p-1 text-on-surface-variant hover:bg-surface-container-low rounded-md">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
          
          <div className="mb-6">
            <div className="text-sm text-on-surface-variant mb-1">This Month</div>
            <div className="text-4xl font-bold text-heading-navy tracking-tight">$4,280.50</div>
            <div className="flex items-center gap-1 mt-1 text-success-teal text-sm font-medium">
              <TrendingDown className="w-4 h-4" />
              12% vs last month
            </div>
          </div>
          
          <div className="space-y-3 flex-1">
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-link-blue"></div>
                <span className="text-on-surface">Software Subscriptions</span>
              </div>
              <span className="font-medium text-heading-navy">$840.00</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-success-teal"></div>
                <span className="text-on-surface">Office Supplies</span>
              </div>
              <span className="font-medium text-heading-navy">$320.50</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-600"></div>
                <span className="text-on-surface">Travel</span>
              </div>
              <span className="font-medium text-heading-navy">$1,200.00</span>
            </div>
          </div>
          
          <button className="w-full mt-6 py-2 bg-surface-container-lowest border border-border-slate text-heading-navy text-sm font-medium rounded-lg hover:bg-surface-container-low flex justify-center items-center gap-2">
            <Plus className="w-5 h-5" />
            Log Expense
          </button>
        </div>

        {/* QR Code Maker (Span 6) */}
        <div className="lg:col-span-6 bg-surface-container-lowest rounded-xl border border-border-slate p-6">
          <div className="mb-6 flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-semibold text-heading-navy flex items-center gap-2">
                <QrCode className="w-6 h-6 text-primary" />
                QR Code Maker
              </h2>
              <p className="text-sm text-on-surface-variant mt-1">Generate high-res QR codes for print or digital use.</p>
            </div>
            <Link to="/business/qr-generator" className="bg-surface-container border border-border-slate px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-surface-container-low transition-colors">
              Open App
            </Link>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 space-y-4">
              <div>
                <label className="block text-sm font-medium text-heading-navy mb-1.5">Destination URL</label>
                <input type="url" placeholder="https://example.com/promo" className="w-full rounded-lg border border-border-slate bg-surface px-4 py-2" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-heading-navy mb-1.5">Foreground</label>
                  <div className="flex items-center gap-2 p-2 border border-border-slate rounded-lg bg-surface">
                    <div className="w-6 h-6 rounded bg-black"></div>
                    <span className="font-mono text-xs text-on-surface-variant">#000000</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-heading-navy mb-1.5">Background</label>
                  <div className="flex items-center gap-2 p-2 border border-border-slate rounded-lg bg-surface">
                    <div className="w-6 h-6 rounded bg-white border border-border-slate"></div>
                    <span className="font-mono text-xs text-on-surface-variant">#FFFFFF</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-40 flex flex-col items-center justify-center gap-4 border-l-0 md:border-l border-border-slate pl-0 md:pl-6">
              <div className="w-32 h-32 bg-white border border-border-slate p-2 rounded flex items-center justify-center">
                <QrCode className="w-full h-full opacity-80" />
              </div>
              <button className="w-full py-1.5 bg-surface-container-lowest border border-border-slate text-heading-navy text-sm font-medium rounded-lg flex justify-center items-center gap-1 hover:bg-surface-container-low">
                <Download className="w-4 h-4" /> PNG
              </button>
            </div>
          </div>
        </div>

        {/* UTM Link Builder (Span 6) */}
        <div className="lg:col-span-6 bg-surface-container-lowest rounded-xl border border-border-slate p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-heading-navy flex items-center gap-2">
              <LinkIcon className="w-6 h-6 text-primary" />
              UTM Link Builder
            </h2>
            <p className="text-sm text-on-surface-variant mt-1">Standardize campaign tracking parameters.</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-heading-navy mb-1.5">Base URL *</label>
              <input type="url" placeholder="https://yourwebsite.com" className="w-full rounded-lg border border-border-slate bg-surface px-4 py-2" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-heading-navy mb-1.5">Source</label>
                <input type="text" placeholder="e.g., google" className="w-full rounded-lg border border-border-slate bg-surface px-4 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-heading-navy mb-1.5">Medium</label>
                <input type="text" placeholder="e.g., cpc" className="w-full rounded-lg border border-border-slate bg-surface px-4 py-2" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-heading-navy mb-1.5">Campaign Name</label>
              <input type="text" placeholder="e.g., spring_sale_2024" className="w-full rounded-lg border border-border-slate bg-surface px-4 py-2" />
            </div>
            <div className="pt-2 border-t border-border-slate mt-4">
              <label className="block text-sm font-medium text-heading-navy mb-1.5">Generated URL</label>
              <div className="flex gap-2">
                <input readOnly type="text" value="https://yourwebsite.com/?utm_source=..." className="w-full font-mono text-xs rounded-lg border border-border-slate bg-surface px-3 py-2 text-on-surface-variant" />
                <button className="px-4 py-2 bg-link-blue text-on-primary text-sm font-medium rounded-lg hover:opacity-90">
                  Copy
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
