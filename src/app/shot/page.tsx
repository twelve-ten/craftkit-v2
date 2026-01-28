"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Download, Copy, RotateCcw, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const gradients = [
  { name: "Violet", colors: ["#667eea", "#764ba2"] },
  { name: "Rose", colors: ["#f093fb", "#f5576c"] },
  { name: "Ocean", colors: ["#4facfe", "#00f2fe"] },
  { name: "Sunset", colors: ["#fa709a", "#fee140"] },
  { name: "Forest", colors: ["#38ef7d", "#11998e"] },
  { name: "Night", colors: ["#0f0c29", "#302b63"] },
  { name: "Peach", colors: ["#ffecd2", "#fcb69f"] },
  { name: "Sky", colors: ["#a1c4fd", "#c2e9fb"] },
  { name: "Slate", colors: ["#232526", "#414345"] },
  { name: "Snow", colors: ["#e0e0e0", "#ffffff"] },
  { name: "Mint", colors: ["#00b09b", "#96c93d"] },
  { name: "Berry", colors: ["#8e2de2", "#4a00e0"] },
];

export default function ShotCraft() {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [gradient, setGradient] = useState(gradients[0]);
  const [padding, setPadding] = useState([64]);
  const [radius, setRadius] = useState([12]);
  const [shadow, setShadow] = useState([50]);
  const [showFrame, setShowFrame] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => setImage(img);
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const render = useCallback(() => {
    if (!image || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const pad = padding[0];
    const rad = radius[0];
    const shadowVal = shadow[0] / 100;
    const frameHeight = showFrame ? 32 : 0;

    canvas.width = image.width + pad * 2;
    canvas.height = image.height + pad * 2 + frameHeight;

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, gradient.colors[0]);
    grad.addColorStop(1, gradient.colors[1]);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Shadow
    if (shadowVal > 0) {
      ctx.shadowColor = `rgba(0, 0, 0, ${shadowVal * 0.5})`;
      ctx.shadowBlur = 40 * shadowVal;
      ctx.shadowOffsetY = 20 * shadowVal;
    }

    // Rounded rect
    const x = pad;
    const y = pad;
    const w = image.width;
    const h = image.height + frameHeight;

    ctx.beginPath();
    ctx.moveTo(x + rad, y);
    ctx.lineTo(x + w - rad, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + rad);
    ctx.lineTo(x + w, y + h - rad);
    ctx.quadraticCurveTo(x + w, y + h, x + w - rad, y + h);
    ctx.lineTo(x + rad, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - rad);
    ctx.lineTo(x, y + rad);
    ctx.quadraticCurveTo(x, y, x + rad, y);
    ctx.closePath();
    ctx.fillStyle = "#fff";
    ctx.fill();

    // Reset shadow
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    // Window frame
    if (showFrame) {
      ctx.save();
      ctx.clip();
      ctx.fillStyle = "#e4e4e4";
      ctx.fillRect(x, y, w, frameHeight);
      
      const dotY = y + frameHeight / 2;
      const dots = [
        { color: "#ff5f57", cx: x + 20 },
        { color: "#febc2e", cx: x + 40 },
        { color: "#28c840", cx: x + 60 },
      ];
      dots.forEach((dot) => {
        ctx.beginPath();
        ctx.arc(dot.cx, dotY, 6, 0, Math.PI * 2);
        ctx.fillStyle = dot.color;
        ctx.fill();
      });
      ctx.restore();
    }

    // Draw image
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y + frameHeight, w, image.height);
    ctx.clip();
    ctx.drawImage(image, x, y + frameHeight);
    ctx.restore();
  }, [image, gradient, padding, radius, shadow, showFrame]);

  // Re-render when settings change
  useState(() => {
    render();
  });

  // Effect to render on changes
  if (image && canvasRef.current) {
    render();
  }

  const download = () => {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = "shotcraft-screenshot.png";
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  };

  const copyToClipboard = async () => {
    if (!canvasRef.current) return;
    try {
      const blob = await new Promise<Blob>((resolve) =>
        canvasRef.current!.toBlob((b) => resolve(b!))
      );
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: download instead
      download();
    }
  };

  const reset = () => {
    setImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="border-b border-white/5">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <div className="h-4 w-px bg-white/10" />
          <h1 className="text-lg font-semibold">
            Shot<span className="text-violet-400">Craft</span>
          </h1>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid lg:grid-cols-[320px_1fr] gap-8">
          {/* Controls */}
          <div className="space-y-6 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <div>
              <Label className="text-xs uppercase tracking-wider text-white/50 mb-3 block">
                Background
              </Label>
              <div className="grid grid-cols-6 gap-2">
                {gradients.map((g) => (
                  <button
                    key={g.name}
                    onClick={() => setGradient(g)}
                    className={`aspect-square rounded-lg transition-all ${
                      gradient.name === g.name
                        ? "ring-2 ring-white ring-offset-2 ring-offset-[#0a0a0a] scale-110"
                        : "hover:scale-105"
                    }`}
                    style={{
                      background: `linear-gradient(135deg, ${g.colors[0]}, ${g.colors[1]})`,
                    }}
                    aria-label={`Select ${g.name} gradient`}
                  />
                ))}
              </div>
            </div>

            <div>
              <Label className="text-xs uppercase tracking-wider text-white/50 mb-3 block">
                Padding: {padding[0]}px
              </Label>
              <Slider
                value={padding}
                onValueChange={setPadding}
                min={20}
                max={150}
                step={1}
                className="w-full"
              />
            </div>

            <div>
              <Label className="text-xs uppercase tracking-wider text-white/50 mb-3 block">
                Corner Radius: {radius[0]}px
              </Label>
              <Slider
                value={radius}
                onValueChange={setRadius}
                min={0}
                max={32}
                step={1}
                className="w-full"
              />
            </div>

            <div>
              <Label className="text-xs uppercase tracking-wider text-white/50 mb-3 block">
                Shadow: {shadow[0]}%
              </Label>
              <Slider
                value={shadow}
                onValueChange={setShadow}
                min={0}
                max={100}
                step={1}
                className="w-full"
              />
            </div>

            <div className="flex items-center gap-3">
              <Checkbox
                id="frame"
                checked={showFrame}
                onCheckedChange={(checked) => setShowFrame(checked as boolean)}
              />
              <Label htmlFor="frame" className="text-sm cursor-pointer">
                Window frame
              </Label>
            </div>
          </div>

          {/* Preview Area */}
          <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.02] p-8 min-h-[500px]">
            {!image ? (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`w-full h-full min-h-[400px] flex flex-col items-center justify-center rounded-xl border-2 border-dashed cursor-pointer transition-all ${
                  isDragging
                    ? "border-violet-400 bg-violet-400/10"
                    : "border-white/20 hover:border-white/40"
                }`}
              >
                <div className="text-5xl mb-4">📸</div>
                <p className="text-white/60 text-center">
                  Drop your screenshot here
                  <br />
                  <span className="text-violet-400">or click to browse</span>
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center gap-6">
                <canvas
                  ref={canvasRef}
                  className="max-w-full max-h-[60vh] rounded-lg"
                />
                <div className="flex gap-3">
                  <Button onClick={download} className="gap-2">
                    <Download className="w-4 h-4" />
                    Download PNG
                  </Button>
                  <Button variant="secondary" onClick={copyToClipboard} className="gap-2">
                    {copied ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                  <Button variant="secondary" onClick={reset} className="gap-2">
                    <RotateCcw className="w-4 h-4" />
                    New
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
