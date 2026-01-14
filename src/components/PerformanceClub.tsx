export default function PerformanceClub() {
  return (
    <section className="border-b border-surface-border bg-[#0f0f0f] py-24" id="access">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-sm font-bold tracking-[0.2em] text-primary uppercase mb-2">Classified Access</h2>
            <h3 className="text-3xl font-bold text-white md:text-4xl">PERFORMANCE CLUB</h3>
          </div>
          <p className="max-w-md text-text-muted text-sm md:text-right">
            Exclusive tier for athletes and executives demanding priority logistics and continuous physiological monitoring.
          </p>
        </div>

        {/* 3-Column Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          
          {/* Card 1: The Bat Phone */}
          <div className="volt-glow flex flex-col justify-between rounded-sm bg-surface-dark border border-surface-border p-6 transition-all duration-300">
            <div className="mb-6">
              <div className="mb-4 inline-flex items-center justify-center rounded-sm bg-background-dark p-2 text-white border border-surface-border">
                <span className="material-symbols-outlined">call</span>
              </div>
              <h4 className="text-lg font-bold text-white mb-2">The Bat Phone</h4>
              <p className="text-sm text-text-muted">Direct SMS line to your provider. No receptionist. No hold music. Immediate intel.</p>
            </div>
            <div className="border-t border-surface-border pt-4">
              <ul className="space-y-2 text-xs font-mono text-text-muted/80">
                <li className="flex justify-between"><span>RESPONSE TIME</span> <span className="text-white">&lt; 15 MIN</span></li>
                <li className="flex justify-between"><span>AVAILABILITY</span> <span className="text-white">24/7</span></li>
              </ul>
            </div>
          </div>

          {/* Card 2: Priority Routing (Special Star Icon) */}
          <div className="volt-glow flex flex-col justify-between rounded-sm bg-surface-dark border border-surface-border p-6 transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2">
              <span className="material-symbols-outlined text-primary opacity-20 text-6xl rotate-12 transform translate-x-2 -translate-y-2">stars</span>
            </div>
            <div className="mb-6 relative z-10">
              <div className="mb-4 inline-flex items-center justify-center rounded-sm bg-background-dark p-2 text-white border border-surface-border">
                <span className="material-symbols-outlined">route</span>
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Priority Routing</h4>
              <p className="text-sm text-text-muted">Same-day scheduling privileges. You jump the queue. Your recovery cannot wait.</p>
            </div>
            <div className="border-t border-surface-border pt-4 relative z-10">
              <ul className="space-y-2 text-xs font-mono text-text-muted/80">
                <li className="flex justify-between"><span>SCHEDULING</span> <span className="text-white">PRIORITY 1</span></li>
                <li className="flex justify-between"><span>SLOTS</span> <span className="text-white">RESERVED</span></li>
              </ul>
            </div>
          </div>

          {/* Card 3: Sterile Field */}
          <div className="volt-glow flex flex-col justify-between rounded-sm bg-surface-dark border border-surface-border p-6 transition-all duration-300">
            <div className="mb-6">
              <div className="mb-4 inline-flex items-center justify-center rounded-sm bg-background-dark p-2 text-white border border-surface-border">
                <span className="material-symbols-outlined">medical_services</span>
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Sterile Field</h4>
              <p className="text-sm text-text-muted">Hospital-grade mobile setup delivered to your location. Clean, efficient, and precise.</p>
            </div>
            <div className="border-t border-surface-border pt-4">
              <ul className="space-y-2 text-xs font-mono text-text-muted/80">
                <li className="flex justify-between"><span>HYGIENE</span> <span className="text-white">CLINICAL</span></li>
                <li className="flex justify-between"><span>SETUP TIME</span> <span className="text-white">3 MIN</span></li>
              </ul>
            </div>
          </div>

        </div>

        {/* CTA Button */}
        <div className="mt-12 flex justify-center">
          <button className="flex min-w-[200px] cursor-pointer items-center justify-center rounded-sm bg-white h-12 px-6 text-black text-sm font-bold tracking-wide hover:bg-primary transition-colors">
            JOIN THE CLUB
          </button>
        </div>
      </div>
    </section>
  );
}