import { Hero } from "@/components/public/Hero";
import { FrictionVsFlow } from "@/components/public/FrictionVsFlow";
import { WaitlistForm } from "@/components/public/WaitlistForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-carbon-black selection:bg-electric-yellow selection:text-black">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Comparison Section */}
      <FrictionVsFlow />

      {/* 3. The Waitlist (Request Protocol) */}
      <section id="waitlist" className="py-24 px-6 md:px-12 border-b border-zinc-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl text-white font-mono uppercase tracking-tighter mb-6">
              Membership Application
            </h2>
            <p className="text-zinc-400 font-mono max-w-2xl mx-auto">
              We strictly limit our client list to ensure rapid response times.
              Secure your availability in the Bountiful / Davis County service area.
            </p>
          </div>

          <WaitlistForm />
        </div>
      </section>

      {/* 4. Footer */}
      <footer className="py-12 px-6 border-t border-zinc-900 bg-black text-center md:text-left">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h4 className="text-white font-mono uppercase tracking-widest text-sm mb-2">Axis Performance Care</h4>
            <p className="text-zinc-500 text-xs">Concierge Mobile Chiropractic // Davis County, UT</p>
          </div>
          <div className="flex gap-6 text-zinc-600 text-xs uppercase tracking-widest">
            <span>Bountiful</span>
            <span>Centerville</span>
            <span>NSL</span>
            <span>Farmington</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
