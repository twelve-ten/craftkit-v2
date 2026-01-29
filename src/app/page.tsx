import Link from "next/link";
import { ArrowRight, Sparkles, Zap, Lock } from "lucide-react";

const tools = [
  {
    name: "ShotCraft",
    description: "Turn bland screenshots into portfolio pieces. Drop, style, download.",
    href: "/shot",
    icon: "📸",
    tag: "Design",
    color: "from-violet-500 to-purple-600",
  },
  {
    name: "InvoiceCraft",
    description: "Professional invoices in 60 seconds. No account needed, ever.",
    href: "/invoice",
    icon: "📄",
    tag: "Business",
    color: "from-emerald-500 to-teal-600",
  },
  {
    name: "PolicyCraft",
    description: "GDPR-ready privacy policies without the lawyer fees.",
    href: "/policy",
    icon: "🔒",
    tag: "Legal",
    color: "from-amber-500 to-orange-600",
  },
  {
    name: "QRCraft",
    description: "QR codes that don't look like they're from 2010.",
    href: "/qr",
    icon: "📱",
    tag: "Utility",
    color: "from-cyan-500 to-blue-600",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Subtle grid background */}
      <div 
        className="fixed inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />
      
      {/* Header */}
      <header className="relative z-10 border-b border-white/5">
        <div className="mx-auto max-w-6xl px-6 py-5 flex items-center justify-between">
          <Link href="/" className="text-xl font-semibold tracking-tight">
            Craft<span className="text-violet-400">Kit</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm text-white/60">
            <Link href="#tools" className="hover:text-white transition-colors">Tools</Link>
            <Link 
              href="https://github.com/kai-1210" 
              target="_blank"
              className="hover:text-white transition-colors"
            >
              GitHub
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 px-6 pt-24 pb-20">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-white/70 mb-8">
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span>Free tools. No signup. No BS.</span>
          </div>
          
          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
            Stop paying for
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
              simple tools
            </span>
          </h1>
          
          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-white/50 max-w-xl mx-auto mb-10 leading-relaxed">
            Screenshot beautifier. Invoice generator. QR codes. Privacy policies.
            <br className="hidden sm:block" />
            All free. All in your browser. All yours.
          </p>
          
          {/* CTA */}
          <Link 
            href="#tools"
            className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-black hover:bg-white/90 transition-all"
          >
            Explore Tools
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Tools Grid */}
      <section id="tools" className="relative z-10 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Pick your tool</h2>
            <p className="text-white/50">Click any card to start instantly</p>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-4">
            {tools.map((tool) => (
              <Link
                key={tool.name}
                href={tool.href}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-6 hover:bg-white/[0.04] hover:border-white/20 transition-all duration-300"
              >
                {/* Gradient accent */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${tool.color} opacity-10 blur-3xl group-hover:opacity-20 transition-opacity`} />
                
                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-4xl">{tool.icon}</span>
                    <span className="text-xs font-medium text-white/40 uppercase tracking-wider">
                      {tool.tag}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-violet-300 transition-colors">
                    {tool.name}
                  </h3>
                  
                  <p className="text-white/50 text-sm leading-relaxed">
                    {tool.description}
                  </p>
                  
                  <div className="mt-4 flex items-center text-sm text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Open tool</span>
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-6 py-20 border-t border-white/5">
        <div className="mx-auto max-w-4xl">
          <div className="grid sm:grid-cols-3 gap-12 text-center">
            <div>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-violet-500/10 mb-4">
                <Zap className="w-6 h-6 text-violet-400" />
              </div>
              <h3 className="font-semibold mb-2">Instant</h3>
              <p className="text-sm text-white/50">
                No signup. No download. Open and start working in seconds.
              </p>
            </div>
            
            <div>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/10 mb-4">
                <Lock className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="font-semibold mb-2">Private</h3>
              <p className="text-sm text-white/50">
                Everything runs in your browser. Your data never touches our servers.
              </p>
            </div>
            
            <div>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-amber-500/10 mb-4">
                <Sparkles className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="font-semibold mb-2">Beautiful</h3>
              <p className="text-sm text-white/50">
                Thoughtfully designed to produce professional results, every time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-8 border-t border-white/5">
        <div className="mx-auto max-w-6xl flex items-center justify-between text-sm text-white/40">
          <span>Built with care</span>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-white/60 transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white/60 transition-colors">
              Terms
            </Link>
            <Link 
              href="https://github.com/kai-1210" 
              target="_blank"
              className="hover:text-white/60 transition-colors"
            >
              GitHub
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
