import { useState, useRef } from "react";
import { Image as ImageIcon, Maximize, Download, Trash2, AlertCircle } from "lucide-react";
import { Breadcrumbs } from "../components/Breadcrumbs";

export const ImageResizer = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [width, setWidth] = useState("800");
  const [height, setHeight] = useState("600");
  const [maintainAspect, setMaintainAspect] = useState(true);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleImageUpload = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target?.result as string);
      setError("");
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleImageUpload(files[0]);
    }
  };

  const handleAspectRatioChange = (newWidth: string) => {
    setWidth(newWidth);
    if (maintainAspect && imgRef.current) {
      const ratio = imgRef.current.naturalHeight / imgRef.current.naturalWidth;
      setHeight(Math.round(parseInt(newWidth) * ratio).toString());
    }
  };

  const resizeImage = () => {
    if (!image || !canvasRef.current || !imgRef.current) return;

    const w = parseInt(width) || 800;
    const h = parseInt(height) || 600;

    canvasRef.current.width = w;
    canvasRef.current.height = h;

    const ctx = canvasRef.current.getContext("2d");
    if (ctx) {
      ctx.drawImage(imgRef.current, 0, 0, w, h);
    }
  };

  const downloadResized = () => {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.href = canvasRef.current.toDataURL("image/png");
    link.download = `resized-${width}x${height}.png`;
    link.click();
  };

  const handleClear = () => {
    setImage(null);
    setWidth("800");
    setHeight("600");
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="flex-1 w-full px-margin-mobile md:px-margin-desktop py-8 lg:py-12 flex flex-col">
      <div className="max-w-5xl mx-auto w-full flex flex-col">
        <Breadcrumbs />

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-heading-navy mb-2 flex items-center gap-3">
            <div className="bg-primary/10 p-1.5 rounded-lg text-primary inline-flex">
              <Maximize className="w-6 h-6" />
            </div>
            Image Resizer
          </h1>
          <p className="text-on-surface-variant max-w-2xl">
            Resize your images to any dimensions instantly in your browser.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
            <p className="text-sm text-error">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upload Section */}
          {!image ? (
            <div
              className={`lg:col-span-3 w-full bg-surface-container-lowest border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                isDragging ? "border-primary bg-primary/5" : "border-border-slate hover:border-primary/50"
              }`}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <ImageIcon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-heading-navy mb-2">Upload Image</h3>
              <p className="text-on-surface-variant mb-6 text-sm">Drag & Drop your image or click to browse</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-primary text-on-primary font-medium px-6 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
              >
                Select Image
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files && handleImageUpload(e.target.files[0])}
                className="hidden"
              />
            </div>
          ) : (
            <>
              {/* Settings */}
              <div className="bg-surface-container-lowest border border-border-slate rounded-xl p-6">
                <h3 className="text-lg font-semibold text-heading-navy mb-4">Resize Settings</h3>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-heading-navy block mb-2">Width (px)</label>
                    <input
                      type="number"
                      value={width}
                      onChange={(e) => handleAspectRatioChange(e.target.value)}
                      className="w-full bg-surface border border-border-slate rounded-lg px-3 py-2 text-heading-navy focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-heading-navy block mb-2">Height (px)</label>
                    <input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      disabled={maintainAspect}
                      className="w-full bg-surface border border-border-slate rounded-lg px-3 py-2 text-heading-navy focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
                    />
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={maintainAspect}
                      onChange={(e) => setMaintainAspect(e.target.checked)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-medium text-heading-navy">Maintain Aspect Ratio</span>
                  </label>

                  <button
                    onClick={resizeImage}
                    className="w-full bg-primary text-on-primary font-medium py-2.5 rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Resize Image
                  </button>

                  <button
                    onClick={handleClear}
                    className="w-full text-error hover:bg-error/10 font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" /> Clear
                  </button>
                </div>
              </div>

              {/* Preview and Output */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-surface-container-lowest border border-border-slate rounded-xl p-4">
                  <p className="text-sm font-semibold text-heading-navy mb-3">Original Image</p>
                  <img
                    ref={imgRef}
                    src={image}
                    alt="Original"
                    onLoad={resizeImage}
                    className="w-full max-h-48 object-contain rounded-lg"
                  />
                </div>

                <div className="bg-surface-container-lowest border border-border-slate rounded-xl p-4">
                  <p className="text-sm font-semibold text-heading-navy mb-3">Resized Image</p>
                  <canvas
                    ref={canvasRef}
                    className="w-full max-h-48 object-contain rounded-lg bg-white"
                  />
                  <button
                    onClick={downloadResized}
                    className="w-full mt-3 bg-success-teal text-heading-navy font-medium py-2 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" /> Download Resized Image
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};