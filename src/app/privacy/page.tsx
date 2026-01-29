import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Privacy Policy — CraftKit" };

export default function PrivacyPage() {
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
        <h1>Privacy Policy</h1>
        <p className="text-zinc-400">Last updated: January 29, 2025</p>

        <h2>What we collect</h2>
        <p>
          CraftKit is a suite of browser-based tools. Your files, images, and
          data are processed <strong>entirely in your browser</strong> — they
          never leave your device. We don&apos;t run backend servers that touch
          your content.
        </p>

        <h2>What we don&apos;t do</h2>
        <ul>
          <li>We don&apos;t track you across websites</li>
          <li>We don&apos;t sell your data to third parties</li>
          <li>We don&apos;t store your uploaded files or generated content</li>
          <li>We don&apos;t use your data for training AI models</li>
          <li>We don&apos;t require accounts, logins, or personal information</li>
        </ul>

        <h2>Analytics</h2>
        <p>
          We use Vercel Analytics to collect anonymous usage statistics (page
          views, country-level location). No personal data or cookies are
          involved.
        </p>

        <h2>Contact</h2>
        <p>
          Questions? Reach out at{" "}
          <a
            href="mailto:privacy@craftkit.tools"
            className="text-violet-400"
          >
            privacy@craftkit.tools
          </a>
          .
        </p>
      </main>
    </div>
  );
}
