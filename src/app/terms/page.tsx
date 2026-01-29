import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Terms of Service — CraftKit" };

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-50">
      <header className="border-b border-zinc-800/50">
        <div className="mx-auto max-w-3xl px-6 py-5">
          <Link href="/" className="text-xl font-semibold tracking-tight">
            Craft<span className="text-violet-400">Kit</span>
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-6 py-16 prose prose-invert prose-zinc">
        <h1>Terms of Service</h1>
        <p className="text-zinc-400">Last updated: January 29, 2025</p>

        <h2>Service</h2>
        <p>
          CraftKit provides a collection of free, browser-based tools including
          screenshot beautification, invoice generation, QR code creation, and
          privacy policy drafting. The service is provided &quot;as is&quot;
          without warranties of any kind.
        </p>

        <h2>Usage</h2>
        <ul>
          <li>All tools are free to use — no account required</li>
          <li>
            Don&apos;t abuse the service (no automated scraping, no illegal
            content)
          </li>
          <li>
            We may rate-limit or block access that negatively impacts the
            service for others
          </li>
        </ul>

        <h2>No warranties</h2>
        <p>
          CraftKit tools are provided for convenience. We make no guarantees
          about output accuracy, availability, or fitness for any particular
          purpose. Use generated invoices, policies, and other outputs at your
          own discretion.
        </p>

        <h2>Changes</h2>
        <p>
          We may update these terms at any time. Continued use of CraftKit
          constitutes acceptance of the updated terms.
        </p>
      </main>
    </div>
  );
}
