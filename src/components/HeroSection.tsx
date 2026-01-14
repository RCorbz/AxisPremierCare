export default function HeroSection() {
  return (
    <header className="relative flex min-h-[85vh] flex-col items-center justify-center border-b border-surface-border bg-background-dark overflow-hidden" id="mission">
      
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/80 to-transparent z-10"></div>
        {/* Swapped the broken Stitch link for a high-res Unsplash alternative */}
        <img 
          alt="Cinematic desaturated shot of an athlete focusing" 
          className="h-full w-full object-cover opacity-40 grayscale" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3Liotd6taB1Ec-vTHtURVDZ1kWn0ixjnOoGyPXlXk6gXLKKawEr43uSt_nPPrOR7LRijQGkSP3LPug3QjxID_ZaI-rRikmf7gPgw3_cJnMWG6-hHgzM-Ee3tcVsfG_Fyf7hB-eUF1_VvkHbJSQUP4yBsTVADuFZdC9OxPUBnWLrlqVuEXC6q36iGgf75xZrJgsvaeZDQxHzrZWyJRMIikNjMwps6gQEuIhfHT0t1OrPexKtQgotTefANqd0OAawIJzAxQK_sR1X3t" 
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 w-full">
        <div className="flex flex-col gap-6 max-w-3xl">
          
          {/* Status Indicator */}
          <div className="flex items-center gap-2 text-primary font-mono text-xs tracking-[0.2em] uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></span>
            System Status: Online
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl font-black leading-[0.95] tracking-[-0.03em] text-white md:text-7xl lg:text-8xl">
            HIGH-PERFORMANCE<br/>
            RECOVERY.<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-text-muted">DELIVERED.</span>
          </h1>

          {/* Subtext */}
          <p className="max-w-xl text-lg text-text-muted md:text-xl font-light leading-relaxed">
            We bring clinical-grade chiropractic care directly to your environment. No waiting rooms. No friction. Optimizing physiology in Bountiful, UT.
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button className="group flex h-14 items-center justify-center gap-3 rounded-sm bg-primary px-8 text-base font-bold text-black transition-all hover:bg-white hover:scale-[1.01]">
              REQUEST ACCESS
              {/* Material Symbols often need a wrapper or font import, using text fallback arrow for now if font missing */}
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">→</span>
            </button>
            <button className="flex h-14 items-center justify-center gap-3 rounded-sm border border-surface-border bg-surface-dark/50 px-8 text-base font-medium text-white transition-all hover:border-primary hover:text-primary backdrop-blur-sm">
              VIEW PROTOCOLS
            </button>
          </div>
        </div>
      </div>

      {/* Technical Decorative Text (Hidden on mobile) */}
      <div className="absolute bottom-8 right-8 hidden md:block text-right font-mono text-xs text-text-muted/40">
        <p>COORD: 40.8894° N, 111.8808° W</p>
        <p>SECTOR: DAVIS COUNTY</p>
        <p>ID: AXIS-01</p>
      </div>
    </header>
  );
}