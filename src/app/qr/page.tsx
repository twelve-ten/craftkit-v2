"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const sizes = [128, 256, 512, 1024];

export default function QRCraft() {
  const [tab, setTab] = useState("url");
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [wifiSsid, setWifiSsid] = useState("");
  const [wifiPass, setWifiPass] = useState("");
  const [wifiSecurity, setWifiSecurity] = useState("WPA");
  const [vcardFname, setVcardFname] = useState("");
  const [vcardLname, setVcardLname] = useState("");
  const [vcardPhone, setVcardPhone] = useState("");
  const [vcardEmail, setVcardEmail] = useState("");
  const [vcardCompany, setVcardCompany] = useState("");
  const [size, setSize] = useState(256);
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [qrLib, setQrLib] = useState<typeof import("qrcode") | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Load QR library on client
  useEffect(() => {
    import("qrcode").then(setQrLib);
  }, []);

  const getData = () => {
    switch (tab) {
      case "url":
        return url || "https://example.com";
      case "text":
        return text || "Hello World";
      case "wifi":
        return `WIFI:T:${wifiSecurity};S:${wifiSsid || "Network"};P:${wifiPass};;`;
      case "vcard":
        return `BEGIN:VCARD
VERSION:3.0
N:${vcardLname};${vcardFname}
FN:${vcardFname} ${vcardLname}
TEL:${vcardPhone}
EMAIL:${vcardEmail}
ORG:${vcardCompany}
END:VCARD`;
      default:
        return "https://example.com";
    }
  };

  // Generate QR code
  useEffect(() => {
    if (!qrLib || !canvasRef.current) return;
    
    qrLib.toCanvas(canvasRef.current, getData(), {
      width: size,
      margin: 2,
      color: {
        dark: fgColor,
        light: bgColor,
      },
    });
  }, [qrLib, tab, url, text, wifiSsid, wifiPass, wifiSecurity, vcardFname, vcardLname, vcardPhone, vcardEmail, vcardCompany, size, fgColor, bgColor]);

  const downloadPNG = () => {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = "qrcode.png";
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  };

  const downloadSVG = async () => {
    if (!qrLib) return;
    const svg = await qrLib.toString(getData(), {
      type: "svg",
      width: size,
      margin: 2,
      color: { dark: fgColor, light: bgColor },
    });
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "qrcode.svg";
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="mx-auto max-w-5xl px-6 py-4 flex items-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <div className="h-4 w-px bg-white/20" />
          <h1 className="text-lg font-semibold">
            QR<span className="text-cyan-400">Craft</span>
          </h1>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="grid lg:grid-cols-[1fr_320px] gap-10">
          {/* Form */}
          <div className="space-y-8">
            <Tabs value={tab} onValueChange={setTab}>
              <TabsList className="grid grid-cols-4 bg-white/5">
                <TabsTrigger value="url">URL</TabsTrigger>
                <TabsTrigger value="text">Text</TabsTrigger>
                <TabsTrigger value="wifi">WiFi</TabsTrigger>
                <TabsTrigger value="vcard">Contact</TabsTrigger>
              </TabsList>

              <TabsContent value="url" className="mt-6">
                <div>
                  <Label htmlFor="url">Website URL</Label>
                  <Input
                    id="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="bg-white/5 border-white/10"
                  />
                </div>
              </TabsContent>

              <TabsContent value="text" className="mt-6">
                <div>
                  <Label htmlFor="text">Text Content</Label>
                  <Textarea
                    id="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Enter any text…"
                    className="bg-white/5 border-white/10"
                    rows={4}
                  />
                </div>
              </TabsContent>

              <TabsContent value="wifi" className="mt-6 space-y-4">
                <div>
                  <Label htmlFor="wifi-ssid">Network Name (SSID)</Label>
                  <Input
                    id="wifi-ssid"
                    value={wifiSsid}
                    onChange={(e) => setWifiSsid(e.target.value)}
                    placeholder="MyNetwork"
                    className="bg-white/5 border-white/10"
                  />
                </div>
                <div>
                  <Label htmlFor="wifi-pass">Password</Label>
                  <Input
                    id="wifi-pass"
                    value={wifiPass}
                    onChange={(e) => setWifiPass(e.target.value)}
                    placeholder="password123"
                    className="bg-white/5 border-white/10"
                  />
                </div>
                <div>
                  <Label htmlFor="wifi-security">Security</Label>
                  <Select value={wifiSecurity} onValueChange={setWifiSecurity}>
                    <SelectTrigger className="bg-white/5 border-white/10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="WPA">WPA/WPA2</SelectItem>
                      <SelectItem value="WEP">WEP</SelectItem>
                      <SelectItem value="nopass">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>

              <TabsContent value="vcard" className="mt-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="vcard-fname">First Name</Label>
                    <Input
                      id="vcard-fname"
                      value={vcardFname}
                      onChange={(e) => setVcardFname(e.target.value)}
                      placeholder="John"
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                  <div>
                    <Label htmlFor="vcard-lname">Last Name</Label>
                    <Input
                      id="vcard-lname"
                      value={vcardLname}
                      onChange={(e) => setVcardLname(e.target.value)}
                      placeholder="Doe"
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="vcard-phone">Phone</Label>
                  <Input
                    id="vcard-phone"
                    type="tel"
                    value={vcardPhone}
                    onChange={(e) => setVcardPhone(e.target.value)}
                    placeholder="+1 234 567 8900"
                    className="bg-white/5 border-white/10"
                  />
                </div>
                <div>
                  <Label htmlFor="vcard-email">Email</Label>
                  <Input
                    id="vcard-email"
                    type="email"
                    value={vcardEmail}
                    onChange={(e) => setVcardEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="bg-white/5 border-white/10"
                  />
                </div>
                <div>
                  <Label htmlFor="vcard-company">Company</Label>
                  <Input
                    id="vcard-company"
                    value={vcardCompany}
                    onChange={(e) => setVcardCompany(e.target.value)}
                    placeholder="Acme Inc"
                    className="bg-white/5 border-white/10"
                  />
                </div>
              </TabsContent>
            </Tabs>

            <div className="border-t border-white/10 pt-8 space-y-6">
              <div>
                <Label className="mb-3 block">Size</Label>
                <div className="flex gap-2">
                  {sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        size === s
                          ? "bg-cyan-500 text-black"
                          : "bg-white/5 text-white/60 hover:bg-white/10"
                      }`}
                    >
                      {s}px
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fg-color">Foreground</Label>
                  <div className="flex gap-2 mt-2">
                    <input
                      type="color"
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                      className="w-12 h-10 rounded-lg cursor-pointer border-0"
                    />
                    <Input
                      id="fg-color"
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="bg-color">Background</Label>
                  <div className="flex gap-2 mt-2">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-12 h-10 rounded-lg cursor-pointer border-0"
                    />
                    <Input
                      id="bg-color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="flex flex-col items-center gap-6">
            <div className="bg-white p-5 rounded-2xl shadow-2xl">
              <canvas ref={canvasRef} />
            </div>
            <div className="flex flex-col gap-3 w-full">
              <Button onClick={downloadPNG} className="w-full gap-2 bg-cyan-500 hover:bg-cyan-600 text-black">
                <Download className="w-4 h-4" />
                Download PNG
              </Button>
              <Button onClick={downloadSVG} variant="outline" className="w-full gap-2 border-white/20 hover:bg-white/10">
                <Download className="w-4 h-4" />
                Download SVG
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
