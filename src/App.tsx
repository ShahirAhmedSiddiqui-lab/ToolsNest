import { Fragment, lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppLayout, SimpleLayout } from "./components/Layouts";
import { ScrollToTop } from "./components/ScrollToTop";
import { tools } from "./tools/registry";

const Home = lazy(() => import("./pages/Home").then((module) => ({ default: module.Home })));
const Pricing = lazy(() => import("./pages/Pricing").then((module) => ({ default: module.Pricing })));
const AllTools = lazy(() => import("./pages/AllTools").then((module) => ({ default: module.AllTools })));
const PDFSuite = lazy(() => import("./pages/PDFSuite").then((module) => ({ default: module.PDFSuite })));
const ImageLab = lazy(() => import("./pages/ImageLab").then((module) => ({ default: module.ImageLab })));
const AITools = lazy(() => import("./pages/AITools").then((module) => ({ default: module.AITools })));
const DeveloperTools = lazy(() => import("./pages/DeveloperTools").then((module) => ({ default: module.DeveloperTools })));
const StudentHub = lazy(() => import("./pages/StudentHub").then((module) => ({ default: module.StudentHub })));
const BusinessTools = lazy(() => import("./pages/BusinessTools").then((module) => ({ default: module.BusinessTools })));
const HealthCalculators = lazy(() => import("./pages/HealthCalculators").then((module) => ({ default: module.HealthCalculators })));
const Security = lazy(() => import("./pages/Security").then((module) => ({ default: module.Security })));
const Privacy = lazy(() => import("./pages/Privacy").then((module) => ({ default: module.Privacy })));

const LoadingScreen = () => (
  <div className="flex min-h-[45vh] items-center justify-center" role="status" aria-live="polite">
    <div className="h-9 w-9 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
    <span className="sr-only">Loading tool</span>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route element={<SimpleLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/pricing" element={<Pricing />} />
          </Route>
          <Route element={<AppLayout />}>
            <Route path="/all-tools" element={<AllTools />} />
            <Route path="/pdf-tools" element={<PDFSuite />} />
            <Route path="/image-tools" element={<ImageLab />} />
            <Route path="/ai-tools" element={<AITools />} />
            <Route path="/developer-tools" element={<DeveloperTools />} />
            <Route path="/student-tools" element={<StudentHub />} />
            <Route path="/business" element={<BusinessTools />} />
            <Route path="/calculators" element={<HealthCalculators />} />
            <Route path="/security" element={<Security />} />
            <Route path="/privacy" element={<Privacy />} />
            {tools.map(({ path, component: ToolPage }) => (
              <Fragment key={path}><Route path={path} element={<ToolPage />} /></Fragment>
            ))}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
