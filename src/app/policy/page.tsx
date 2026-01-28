"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Copy, Download, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function PolicyCraft() {
  const [siteName, setSiteName] = useState("");
  const [siteUrl, setSiteUrl] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [country, setCountry] = useState("US");
  
  const [collectEmail, setCollectEmail] = useState(true);
  const [collectName, setCollectName] = useState(true);
  const [collectPayment, setCollectPayment] = useState(false);
  const [collectLocation, setCollectLocation] = useState(false);
  const [collectAnalytics, setCollectAnalytics] = useState(true);
  
  const [useGoogle, setUseGoogle] = useState(true);
  const [useStripe, setUseStripe] = useState(false);
  const [useMailchimp, setUseMailchimp] = useState(false);
  const [useSocial, setUseSocial] = useState(false);
  
  const [copied, setCopied] = useState(false);

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const policy = useMemo(() => {
    const name = siteName || "[Your Company]";
    const url = siteUrl || "[your website]";
    const email = contactEmail || "[your email]";

    const collectedData = [];
    if (collectName) collectedData.push("Name and contact information");
    if (collectEmail) collectedData.push("Email address");
    if (collectPayment) collectedData.push("Payment and billing information");
    if (collectLocation) collectedData.push("Location data");
    if (collectAnalytics) collectedData.push("Usage data, cookies, and device information");

    const thirdParties = [];
    if (useGoogle) thirdParties.push({ name: "Google Analytics", desc: "for website analytics and performance monitoring" });
    if (useStripe) thirdParties.push({ name: "Stripe", desc: "for secure payment processing" });
    if (useMailchimp) thirdParties.push({ name: "Email service providers", desc: "for sending newsletters and marketing communications" });
    if (useSocial) thirdParties.push({ name: "Social media platforms", desc: "for social sharing and authentication features" });

    return { name, url, email, collectedData, thirdParties };
  }, [siteName, siteUrl, contactEmail, collectEmail, collectName, collectPayment, collectLocation, collectAnalytics, useGoogle, useStripe, useMailchimp, useSocial]);

  const copyText = () => {
    const text = document.getElementById("policy-preview")?.innerText;
    if (text) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadHTML = () => {
    const content = document.getElementById("policy-preview")?.innerHTML;
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Privacy Policy - ${policy.name}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px 20px; line-height: 1.7; color: #333; }
    h1 { margin-bottom: 10px; }
    h2 { margin-top: 30px; margin-bottom: 15px; font-size: 1.25rem; }
    ul { padding-left: 25px; }
    li { margin-bottom: 8px; }
    .date { color: #666; margin-bottom: 30px; }
  </style>
</head>
<body>
${content}
</body>
</html>`;
    
    const blob = new Blob([html], { type: "text/html" });
    const link = document.createElement("a");
    link.download = "privacy-policy.html";
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <div className="h-4 w-px bg-white/20" />
          <h1 className="text-lg font-semibold">
            Policy<span className="text-amber-400">Craft</span>
          </h1>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid lg:grid-cols-[400px_1fr] gap-10">
          {/* Form */}
          <div className="space-y-8">
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-6">
              <h2 className="text-xs uppercase tracking-wider text-white/50 font-medium">
                Your Website
              </h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="siteName">Website/App Name</Label>
                  <Input
                    id="siteName"
                    value={siteName}
                    onChange={(e) => setSiteName(e.target.value)}
                    placeholder="Acme Inc"
                    className="bg-white/5 border-white/10"
                  />
                </div>
                <div>
                  <Label htmlFor="siteUrl">Website URL</Label>
                  <Input
                    id="siteUrl"
                    value={siteUrl}
                    onChange={(e) => setSiteUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="bg-white/5 border-white/10"
                  />
                </div>
                <div>
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="privacy@example.com"
                    className="bg-white/5 border-white/10"
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Select value={country} onValueChange={setCountry}>
                    <SelectTrigger className="bg-white/5 border-white/10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="US">United States</SelectItem>
                      <SelectItem value="UK">United Kingdom</SelectItem>
                      <SelectItem value="EU">European Union</SelectItem>
                      <SelectItem value="CA">Canada</SelectItem>
                      <SelectItem value="AU">Australia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-4">
              <h2 className="text-xs uppercase tracking-wider text-white/50 font-medium">
                Data Collection
              </h2>
              {[
                { id: "email", label: "Email addresses", checked: collectEmail, set: setCollectEmail },
                { id: "name", label: "Names", checked: collectName, set: setCollectName },
                { id: "payment", label: "Payment information", checked: collectPayment, set: setCollectPayment },
                { id: "location", label: "Location data", checked: collectLocation, set: setCollectLocation },
                { id: "analytics", label: "Analytics & cookies", checked: collectAnalytics, set: setCollectAnalytics },
              ].map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <Checkbox
                    id={item.id}
                    checked={item.checked}
                    onCheckedChange={(checked) => item.set(checked as boolean)}
                  />
                  <Label htmlFor={item.id} className="cursor-pointer">
                    {item.label}
                  </Label>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-4">
              <h2 className="text-xs uppercase tracking-wider text-white/50 font-medium">
                Third-Party Services
              </h2>
              {[
                { id: "google", label: "Google Analytics", checked: useGoogle, set: setUseGoogle },
                { id: "stripe", label: "Stripe Payments", checked: useStripe, set: setUseStripe },
                { id: "mailchimp", label: "Email marketing", checked: useMailchimp, set: setUseMailchimp },
                { id: "social", label: "Social media integrations", checked: useSocial, set: setUseSocial },
              ].map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <Checkbox
                    id={item.id}
                    checked={item.checked}
                    onCheckedChange={(checked) => item.set(checked as boolean)}
                  />
                  <Label htmlFor={item.id} className="cursor-pointer">
                    {item.label}
                  </Label>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <Button onClick={copyText} variant="secondary" className="flex-1 gap-2">
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied!" : "Copy Text"}
              </Button>
              <Button onClick={downloadHTML} className="flex-1 gap-2 bg-amber-500 hover:bg-amber-600 text-black">
                <Download className="w-4 h-4" />
                Download HTML
              </Button>
            </div>
          </div>

          {/* Preview */}
          <div className="rounded-2xl bg-white text-gray-900 p-8 overflow-y-auto max-h-[80vh]">
            <div id="policy-preview">
              <h1 className="text-2xl font-bold mb-2">Privacy Policy</h1>
              <p className="date text-gray-500 mb-8">Effective Date: {today}</p>

              <p className="mb-6">
                {policy.name} (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) operates {policy.url}. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4">Information We Collect</h2>
              <p className="mb-2">We may collect the following types of information:</p>
              <ul className="list-disc pl-6 mb-6 space-y-1">
                {policy.collectedData.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>

              <h2 className="text-xl font-semibold mt-8 mb-4">How We Use Your Information</h2>
              <p className="mb-2">We use the information we collect to:</p>
              <ul className="list-disc pl-6 mb-6 space-y-1">
                <li>Provide, operate, and maintain our website</li>
                <li>Improve, personalize, and expand our website</li>
                <li>Understand and analyze how you use our website</li>
                <li>Communicate with you, including for customer service and updates</li>
                {collectPayment && <li>Process transactions and send related information</li>}
                {useMailchimp && <li>Send you marketing and promotional communications (with your consent)</li>}
              </ul>

              {policy.thirdParties.length > 0 && (
                <>
                  <h2 className="text-xl font-semibold mt-8 mb-4">Third-Party Services</h2>
                  <p className="mb-2">We may share your information with third-party service providers:</p>
                  <ul className="list-disc pl-6 mb-6 space-y-1">
                    {policy.thirdParties.map((tp, i) => (
                      <li key={i}><strong>{tp.name}</strong> &ndash; {tp.desc}</li>
                    ))}
                  </ul>
                </>
              )}

              {collectAnalytics && (
                <>
                  <h2 className="text-xl font-semibold mt-8 mb-4">Cookies and Tracking</h2>
                  <p className="mb-6">
                    We use cookies and similar tracking technologies to track activity on our website. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
                  </p>
                </>
              )}

              {(country === "EU" || country === "UK") && (
                <>
                  <h2 className="text-xl font-semibold mt-8 mb-4">Your Rights Under GDPR</h2>
                  <p className="mb-2">If you are located in the EEA or UK, you have certain data protection rights:</p>
                  <ul className="list-disc pl-6 mb-6 space-y-1">
                    <li><strong>Access</strong> &ndash; Request copies of your personal data</li>
                    <li><strong>Rectification</strong> &ndash; Request correction of inaccurate data</li>
                    <li><strong>Erasure</strong> &ndash; Request deletion of your personal data</li>
                    <li><strong>Restriction</strong> &ndash; Request restriction of processing</li>
                    <li><strong>Portability</strong> &ndash; Request transfer of your data</li>
                    <li><strong>Objection</strong> &ndash; Object to processing of your data</li>
                  </ul>
                </>
              )}

              {(country === "US" || country === "CA") && (
                <>
                  <h2 className="text-xl font-semibold mt-8 mb-4">California Privacy Rights</h2>
                  <p className="mb-2">If you are a California resident, you have the right to:</p>
                  <ul className="list-disc pl-6 mb-6 space-y-1">
                    <li>Know what personal information we collect about you</li>
                    <li>Request deletion of your personal information</li>
                    <li>Opt-out of the sale of your personal information (we do not sell personal information)</li>
                    <li>Non-discrimination for exercising your privacy rights</li>
                  </ul>
                </>
              )}

              <h2 className="text-xl font-semibold mt-8 mb-4">Data Security</h2>
              <p className="mb-6">
                We implement appropriate technical and organizational security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4">Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at:
                <br />
                <strong>{policy.name}</strong>
                <br />
                Email: {policy.email}
                <br />
                Website: {policy.url}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
