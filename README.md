# ToolsNest

A comprehensive, privacy-first web application offering a suite of essential productivity tools. All tools are designed to run securely and locally within your browser, ensuring your data remains private and is never stored on external servers.

## Project Overview

ToolsNest is a feature-rich toolbox designed for students, professionals, and everyday users. The application provides utilities for document processing, image manipulation, academic calculations, business operations, and AI-powered writing assistance—all without requiring file uploads to third-party services.

## Key Features

### 🔒 Privacy-First Architecture
- **100% Secure** - All files are processed locally in your browser
- **No Data Storage** - Files are deleted immediately after processing
- **Browser-Based** - No server-side file uploads or storage

### 🔍 Smart Search Functionality
- Global search across all tools
- Fuzzy matching algorithm for flexible queries
- Works from home page and all-tools page
- Example: Searching "PDF" shows all PDF-related tools

## Tools & Functionality

### 📄 PDF Suite
- **Word to PDF** - Convert Word documents to PDF format
- **PDF to Word** - Convert PDF documents to Word format
- **Compress PDF** - Reduce file size while maintaining quality
- **Merge PDF** - Combine multiple PDF files into one
- **Split PDF** - Extract specific pages from PDF documents
- **JPG to PDF** - Convert JPG images to PDF
- **PDF to JPG** - Convert PDF pages to JPG images
- **PDF to PPT** - Convert PDF presentations to PowerPoint format

### 🖼️ Image Lab
- **Image Compressor** - Optimize images for web and reduce file size
- **Image Resizer** - Resize images to specific dimensions
- **WebP Converter** - Convert images to/from WebP format

### 🧮 Health Calculators
- **BMI Calculator** - Calculate Body Mass Index with metric and imperial units
  - Support for both metric (cm/kg) and imperial (ft/lb) measurements
  - Visual circular progress indicator
  - Real-time BMI status display (Underweight, Healthy, Overweight, Obese)
- **Calorie Calculator** - Calculate daily calorie requirements
- **TDEE Calculator** - Calculate Total Daily Energy Expenditure

### 🎓 Student Hub
- **CGPA Calculator** - Advanced GPA/CGPA computation
  - Multi-semester support
  - Subject-wise grade and credit input
  - Automatic grade-to-point conversion
  - Real-time CGPA calculation
  - University selector (optional)
  - Interactive formula display and step-by-step guide
- **Word Counter** - Count words, characters, and sentences
- **Quiz Generator** - Generate quizzes from study materials
- **Citation Generator** - Create citations in various formats

### 💼 Business Tools
- **Invoice Generator** - Create professional invoices
- **QR Code Generator** - Generate high-resolution QR codes

### 💻 Developer Tools
- **JSON Formatter** - Format, validate, and prettify JSON code
- **Case Converter** - Convert text to various cases (camelCase, snake_case, etc.)

### 🤖 AI Writing Tools
- **AI PDF Summarizer** - Summarize large PDF files with AI
- **Chat with PDF** - Interact dynamically with your documents
- **Resume Builder** - Build ATS-friendly resumes with AI assistance
- **Resume Analyzer** - Analyze and improve your resume
- **Cover Letter Generator** - Generate customized cover letters
- **Email Writer** - Write professional emails with AI help
- **Text Rewriter** - Rewrite text for clarity, tone, and style
- **Grammar Fixer** - Instantly fix grammar and spelling errors
- **Content Calendar Generator** - Generate content calendars using AI

## Technical Architecture

### Core Components

#### Navigation
- **TopNav** - Main navigation bar with search integration
- **SideNav** - Sidebar navigation menu (collapsible)
- **Breadcrumbs** - Breadcrumb navigation for page hierarchy

#### Layout System
- **AppLayout** - Main layout with sidebar for tool pages
- **SimpleLayout** - Clean layout for home and pricing pages
- **Footer** - Responsive footer with links and branding

#### Pages
- **Home** - Landing page with featured tools and search bar
- **AllTools** - Comprehensive tools directory with advanced filtering
- **Individual Tool Pages** - Dedicated pages for each tool

### Utility Functions

#### Search Utilities
- **fuzzyMatch()** - Flexible string matching for search
  - Partial text matching
  - Character sequence matching
  - Case-insensitive searching

#### UI Components
- **cn()** - Classname utility for conditional Tailwind CSS styling
- **ScrollToTop** - Automatic scroll restoration on page navigation

## Design System

### Color Palette
- **Primary** - #004ac6 (Blue)
- **Secondary** - #006b5f (Teal)
- **Success** - #14B8A6 (Teal)
- **Error** - #ba1a1a (Red)
- **Surface Colors** - Layered backgrounds for depth

### Typography
- **Font Family** - Geist (UI), JetBrains Mono (Code)
- **Responsive Sizing** - Mobile-first approach

### Layout Constraints
- **Max Width** - 1440px for content
- **Responsive Padding** - 16px mobile, 48px desktop
- **Horizontal Scroll Protection** - Disabled for all pages

## User Experience Features

### Search Experience
- Real-time filtering as you type
- Search works across tool names, categories, and descriptions
- Home page search navigates to all-tools with pre-filled query
- Results update instantly with fuzzy matching

### Calculator Features
- Unit conversion support (metric/imperial)
- Visual feedback and results display
- Reset functionality for quick recalculation
- Formula and calculation guides

### Responsive Design
- Mobile-optimized layouts
- Tablet-friendly interfaces
- Desktop-enhanced features
- Collapsible sidebar navigation

## Security & Privacy

- ✅ All processing happens locally in the browser
- ✅ No file uploads to external servers
- ✅ No data persistence on servers
- ✅ HTTPS only for API communications
- ✅ No tracking or analytics collection
- ✅ Secure file deletion after processing

## Technology Stack

- **Frontend Framework** - React with TypeScript
- **Styling** - Tailwind CSS with custom design tokens
- **Build Tool** - Vite
- **Routing** - React Router
- **Icons** - Lucide React
- **Form State** - React hooks (useState)

## Browser Compatibility

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Project Structure

```
ToolsNest/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Breadcrumbs.tsx
│   │   ├── Footer.tsx
│   │   ├── Layouts.tsx
│   │   ├── SideNav.tsx
│   │   ├── TopNav.tsx
│   │   └── ScrollToTop.tsx
│   ├── pages/              # Individual tool pages
│   │   ├── Home.tsx
│   │   ├── AllTools.tsx
│   │   ├── BMICalculator.tsx
│   │   ├── CGPACalculator.tsx
│   │   └── [other tools...]
│   ├── lib/                # Utility functions
│   │   └── utils.ts
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # React entry point
│   └── index.css           # Global styles
├── index.html              # HTML template
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Project dependencies
```

## Core Functionalities Summary

| Category | Functionality |
|----------|---------------|
| **Search** | Fuzzy-based tool discovery across all categories |
| **PDF Processing** | Convert, merge, split, compress operations |
| **Image Tools** | Compression, resizing, format conversion |
| **Calculations** | BMI, CGPA, Calories, TDEE computations |
| **Academic** | Quiz generation, word counting, citations |
| **Business** | Invoice and QR code generation |
| **Development** | JSON formatting, case conversion utilities |
| **AI Writing** | Text generation, analysis, and optimization |

## Performance Highlights

- ⚡ Fast, browser-based processing
- 🎯 Responsive search with real-time filtering
- 📦 Lightweight with minimal dependencies
- 🔄 Instant calculations without API calls
- 🎨 Smooth animations and transitions

## Data Flow

```
User Input
    ↓
Client-Side Processing
    ↓
Instant Output
    ↓
(No Server Upload)
```

---

**ToolsNest** - Your secure, private toolbox for everything. Built with security and privacy as first-class citizens.
