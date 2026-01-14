export default function FrictionFlow() {
    return (
      <section className="border-b border-surface-border bg-background-dark py-24 relative overflow-hidden" id="contrast">
        {/* Grid Background Pattern */}
        <div className="grid-bg absolute inset-0 opacity-20 pointer-events-none"></div>
  
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="mb-16">
            <h2 className="text-sm font-bold tracking-[0.2em] text-primary uppercase mb-2">Situation Report</h2>
            <h3 className="text-3xl font-bold text-white md:text-4xl">FRICTION VS. FLOW</h3>
          </div>
  
          <div className="grid gap-0 lg:grid-cols-2 lg:gap-8">
            
            {/* Left Card: The Old Way */}
            <div className="group relative flex flex-col justify-between overflow-hidden rounded-sm border border-surface-border bg-surface-dark/30 p-8 transition-all hover:bg-surface-dark/50">
              <div className="absolute right-4 top-4 opacity-20 group-hover:opacity-40 transition-opacity">
                <span className="material-symbols-outlined text-6xl">hourglass_disabled</span>
              </div>
              
              <div>
                <h4 className="text-xl font-bold text-text-muted mb-6">Standard Care</h4>
                <ul className="space-y-6">
                  <li className="flex items-start gap-4 opacity-60">
                    <span className="material-symbols-outlined text-red-900 mt-1">close</span>
                    <div>
                      <p className="font-bold text-text-muted">Commute & Traffic</p>
                      <p className="text-sm text-text-muted/60">Wasted hours in transit.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4 opacity-60">
                    <span className="material-symbols-outlined text-red-900 mt-1">close</span>
                    <div>
                      <p className="font-bold text-text-muted">Waiting Room Limbo</p>
                      <p className="text-sm text-text-muted/60">20+ minutes reading old magazines.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4 opacity-60">
                    <span className="material-symbols-outlined text-red-900 mt-1">close</span>
                    <div>
                      <p className="font-bold text-text-muted">Rush Hour Treatment</p>
                      <p className="text-sm text-text-muted/60">5 minutes of rushed adjustment.</p>
                    </div>
                  </li>
                </ul>
              </div>
              
              <div className="mt-8 border-t border-surface-border pt-4">
                <p className="font-mono text-xs uppercase tracking-wider text-red-900/50">Efficiency Rating: 12%</p>
              </div>
            </div>
  
            {/* Right Card: The AXIS Way (Glow Effect) */}
            <div className="relative flex flex-col justify-between overflow-hidden rounded-sm border border-primary/30 bg-surface-dark p-8 shadow-[0_0_50px_-20px_rgba(217,255,0,0.1)] transition-all">
              <div className="absolute right-4 top-4 text-primary opacity-20">
                <span className="material-symbols-outlined text-6xl">bolt</span>
              </div>
              
              <div>
                <h4 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  AXIS Protocol
                  <span className="rounded bg-primary/20 px-2 py-0.5 text-[10px] font-bold text-primary uppercase tracking-wide">Superior</span>
                </h4>
                <ul className="space-y-6">
                  <li className="flex items-start gap-4">
                    <span className="material-symbols-outlined text-primary mt-1">check_circle</span>
                    <div>
                      <p className="font-bold text-white">We Deploy to You</p>
                      <p className="text-sm text-text-muted">Home, office, or gym. Zero transit.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="material-symbols-outlined text-primary mt-1">check_circle</span>
                    <div>
                      <p className="font-bold text-white">Zero Friction</p>
                      <p className="text-sm text-text-muted">No waiting. We are ready when you are.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="material-symbols-outlined text-primary mt-1">check_circle</span>
                    <div>
                      <p className="font-bold text-white">Deep Work</p>
                      <p className="text-sm text-text-muted">60 minutes of manual therapy & optimization.</p>
                    </div>
                  </li>
                </ul>
              </div>
              
              <div className="mt-8 border-t border-primary/20 pt-4 flex justify-between items-center">
                <p className="font-mono text-xs uppercase tracking-wider text-primary">Efficiency Rating: 100%</p>
                <button className="text-xs font-bold text-white hover:text-primary uppercase tracking-wider flex items-center gap-1">
                  Deploy Now <span className="material-symbols-outlined text-sm">arrow_right_alt</span>
                </button>
              </div>
            </div>
  
          </div>
        </div>
      </section>
    );
  }
