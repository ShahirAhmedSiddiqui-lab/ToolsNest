import { useState, useRef, useEffect } from "react";
import { Link2, Download, Trash2, AlertCircle } from "lucide-react";
import { Breadcrumbs } from "../components/Breadcrumbs";
import QRCode from "qrcode";

export const QRCodeGenerator = () => {
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateQR = async () => {
    if (!input.trim()) {
      setError("Please enter a URL or text to generate QR code");
      return;
    }

    setIsProcessing(true);
    setError("");
    try {
      if (canvasRef.current) {
        await QRCode.toCanvas(canvasRef.current, input, {
          errorCorrectionLevel: "H",
          type: "image/png",
          quality: 0.95,
          margin: 1,
          width: 300,
          color: {
            dark: "#0F172A",
            light: "#FFFFFF"
          }
        });
      }
    } catch (err: any) {
      setError(err.message || "Failed to generate QR code");
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadQR = () => {
    if (canvasRef.current) {
      const link = document.createElement("a");
      link.href = canvasRef.current.toDataURL("image/png");
      link.download = `qrcode-${Date.now()}.png`;
      link.click();
    }
  };

  const handleClear = () => {
    setInput("");
    setError("");
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  useEffect(() => {
    if (input.trim()) {
      generateQR();
    }
  }, [input]);

  return (
    <div className="flex-1 w-full px-margin-mobile md:px-margin-desktop py-8 lg:py-12 flex flex-col">
      <div className="max-w-4xl mx-auto w-full flex flex-col">
        <Breadcrumbs />
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-heading-navy mb-2 flex items-center gap-3">
            <div className="bg-primary/10 p-1.5 rounded-lg text-primary inline-flex">
              <Link2 className="w-6 h-6" />
            </div>
            QR Code Generator
          </h1>
          <p className="text-on-surface-variant max-w-2xl">
            Generate high-quality QR codes from URLs, text, or contact information instantly.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
            <p className="text-sm text-error">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="flex flex-col bg-surface-container-lowest border border-border-slate rounded-xl overflow-hidden shadow-sm">
            <div className="bg-surface-container-low border-b border-border-slate px-4 py-3">
              <span className="text-sm font-semibold text-heading-navy">Input</span>
            </div>
            <div className="flex flex-col p-6 gap-4">
              <div>
                <label className="text-sm font-semibold text-heading-navy block mb-2">URL or Text</label>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter URL or text (e.g., https://example.com or Contact info)"
                  className="w-full bg-surface border border-border-slate rounded-lg px-4 py-3 text-heading-navy placeholder:text-on-surface-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                />
              </div>

              <button
                onClick={() => handleClear()}
                className="text-error hover:bg-error/10 font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" /> Clear
              </button>
            </div>
          </div>

          {/* Output Section */}
          <div className="flex flex-col bg-surface-container-lowest border border-border-slate rounded-xl overflow-hidden shadow-sm">
            <div className="bg-surface-container-low border-b border-border-slate px-4 py-3">
              <span className="text-sm font-semibold text-heading-navy">QR Code</span>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center p-6">
              {input.trim() ? (
                <>
                  <canvas
                    ref={canvasRef}
                    className="max-w-full border-2 border-border-slate rounded-lg p-2 bg-white"
                  />
                  <button
                    onClick={downloadQR}
                    className="mt-4 bg-primary text-on-primary font-medium px-6 py-2.5 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" /> Download QR Code
                  </button>
                </>
              ) : (
                <div className="text-center text-on-surface-variant">
                  <p className="text-sm">Enter text or URL above to generate QR code</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
