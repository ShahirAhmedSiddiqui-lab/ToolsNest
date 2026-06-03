const fs = require('fs');
const path = require('path');

const tools = [
  { file: 'CGPACalculator.tsx', icon: 'GraduationCap', title: 'CGPA Calculator', desc: 'Calculate your GPA and CGPA easily.', btn: 'Calculate CGPA', fields: [{label: 'Total Credits Earned', type: 'number'}, {label: 'Current CGPA', type: 'number'}] },
  { file: 'CitationGenerator.tsx', icon: 'Quote', title: 'Citation Generator', desc: 'Instantly format sources in APA, MLA, Chicago, and IEEE.', btn: 'Generate Citation', fields: [{label: 'Source URL or Title', type: 'text'}, {label: 'Author Name (Optional)', type: 'text'}] },
  { file: 'InvoiceGenerator.tsx', icon: 'FileText', title: 'Invoice Generator', desc: 'Create professional invoices instantly.', btn: 'Generate Invoice', fields: [{label: 'Client Name', type: 'text'}, {label: 'Total Amount ($)', type: 'number'}] },
  { file: 'QRCodeGenerator.tsx', icon: 'Link2', title: 'QR Code Generator', desc: 'Create QR codes for your URLs or text.', btn: 'Generate QR Code', fields: [{label: 'URL or Text Content', type: 'text'}] },
  { file: 'ResumeBuilder.tsx', icon: 'Briefcase', title: 'Resume Builder', desc: 'Create professional resumes with AI assistance.', btn: 'Generate Resume', fields: [{label: 'Full Name', type: 'text'}, {label: 'Target Job Title', type: 'text'}] },
  { file: 'CoverLetterGenerator.tsx', icon: 'FileText', title: 'Cover Letter Generator', desc: 'Write tailored cover letters instantly.', btn: 'Generate Cover Letter', fields: [{label: 'Job Title', type: 'text'}, {label: 'Company Name', type: 'text'}] },
  { file: 'ContentCalendarGenerator.tsx', icon: 'Calendar', title: 'Content Calendar Generator', desc: 'Plan your social media content schedule.', btn: 'Generate Calendar', fields: [{label: 'Brand/Topic Name', type: 'text'}, {label: 'Target Audience', type: 'text'}] }
];

const dir = 'src/pages';

const template = (tool) => {
  const fieldsHtml = tool.fields.map(f => 
    '<div className="flex flex-col gap-2">' +
      '<label className="text-sm font-semibold text-heading-navy">' + f.label + '</label>' +
      '<input type="' + f.type + '" className="w-full bg-surface border border-border-slate rounded-lg px-4 py-2.5 text-base text-heading-navy outline-none focus:border-primary transition-colors" placeholder="Enter ' + f.label.toLowerCase() + '..." required />' +
    '</div>'
  ).join('');

  return `import { useState } from "react";
import { ${tool.icon === 'Quote' ? 'Quote' : tool.icon === 'Link2' ? 'Link2' : tool.icon === 'Calendar' ? 'Calendar' : tool.icon}, Play, CheckCircle2 } from "lucide-react";
import { Breadcrumbs } from "../components/Breadcrumbs";

export const ${tool.file.replace('.tsx', '')} = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setResult("Successfully generated! This is a placeholder result.");
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <div className="flex-1 w-full px-margin-mobile md:px-margin-desktop py-8 lg:py-12 flex flex-col">
      <div className="max-w-4xl mx-auto w-full flex flex-col">
        <Breadcrumbs />
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-heading-navy mb-2 flex items-center gap-3">
            <div className="bg-primary/10 p-1.5 rounded-lg text-primary inline-flex">
              <${tool.icon === 'Link2' || tool.icon === 'Calendar' ? tool.icon : tool.icon === 'Quote' ? 'Quote' : tool.icon} className="w-6 h-6" />
            </div>
            ${tool.title}
          </h1>
          <p className="text-on-surface-variant max-w-2xl">
            ${tool.desc}
          </p>
        </div>

        <div className="bg-surface-container-lowest border border-border-slate rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6 md:p-8 border-b border-border-slate">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              ${fieldsHtml}

              <button 
                type="submit"
                disabled={isProcessing}
                className="mt-2 bg-primary text-on-primary text-lg font-medium px-8 py-3.5 rounded-xl shadow-md hover:bg-primary-container transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isProcessing ? "Processing..." : "${tool.btn}"}
              </button>
            </form>
          </div>

          {/* Result Area */}
          {result && (
            <div className="p-6 md:p-8 bg-surface-container-low flex flex-col items-center justify-center text-center min-h-[200px]">
              <div className="w-16 h-16 bg-success-teal/20 rounded-full flex items-center justify-center mb-4 text-success-teal">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-heading-navy mb-2">Success!</h3>
              <p className="text-on-surface-variant max-w-md">{result}</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
`;
};

tools.forEach(tool => {
  const filePath = path.join(dir, tool.file);
  let content = template(tool);
  if (tool.icon === 'Link2') {
     content = content.replace('import { Link2', 'import { Link2'); // already correct
  }
  if (tool.icon === 'Calendar') {
     content = content.replace('import { Calendar', 'import { Calendar');
  }
  fs.writeFileSync(filePath, content);
});

console.log('Form tools updated');
