const fs = require('fs');
const path = require('path');

const uploadTools = [
  {file: 'PDFToWord.tsx', icon: 'FileText', text: 'PDF document', btn: 'Select PDF'},
  {file: 'WordToPDF.tsx', icon: 'FileText', text: 'Word document', btn: 'Select Word Document'},
  {file: 'CompressPDF.tsx', icon: 'FileText', text: 'PDF document', btn: 'Select PDF'},
  {file: 'MergePDF.tsx', icon: 'FileText', text: 'multiple PDF documents', btn: 'Select PDFs'},
  {file: 'JPGToPDF.tsx', icon: 'ImageIcon', text: 'JPG image', btn: 'Select Image'},
  {file: 'SplitPDF.tsx', icon: 'FileText', text: 'PDF document', btn: 'Select PDF'},
  {file: 'PDFToJPG.tsx', icon: 'FileText', text: 'PDF document', btn: 'Select PDF'},
  {file: 'PDFToPPT.tsx', icon: 'FileText', text: 'PDF document', btn: 'Select PDF'},
  {file: 'ImageCompressor.tsx', icon: 'ImageIcon', text: 'image file', btn: 'Select Image'},
  {file: 'ImageResizer.tsx', icon: 'ImageIcon', text: 'image file', btn: 'Select Image'},
  {file: 'WebPConverter.tsx', icon: 'ImageIcon', text: 'image file', btn: 'Select Image'},
  {file: 'PDFSummarizer.tsx', icon: 'FileText', text: 'PDF document', btn: 'Select PDF'},
  {file: 'ChatWithPDF.tsx', icon: 'FileText', text: 'PDF document', btn: 'Select PDF'},
  {file: 'ResumeAnalyzer.tsx', icon: 'FileText', text: 'resume file', btn: 'Select Resume'}
];

const dir = 'src/pages';

uploadTools.forEach(tool => {
  const filePath = path.join(dir, tool.file);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace the generic texts
  content = content.replace('Upload your file here', 'Upload your ' + tool.text + ' here');
  content = content.replace('Select File', tool.btn);
  
  // Replace icon if needed
  if (tool.icon === 'ImageIcon') {
    if (!content.includes('Image as ImageIcon')) {
       content = content.replace(/import \{([^}]+)\} from "lucide-react";/, 'import { Image as ImageIcon, $1 } from "lucide-react";');
    }
  }
  
  content = content.replace(/<UploadCloud/g, '<' + tool.icon);
  
  fs.writeFileSync(filePath, content);
});

console.log('Upload tools updated');
