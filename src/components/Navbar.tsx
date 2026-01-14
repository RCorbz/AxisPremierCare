export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-surface-border bg-background-dark/90 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center bg-primary text-black font-black text-lg rounded-sm">
              A
            </span>
            <span className="text-lg font-bold tracking-tighter text-white">
              AXIS <span className="text-text-muted font-normal">CARE</span>
            </span>
          </div>

          {/* Desktop Links (Hidden on Mobile) */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-text-muted">
            <a className="hover:text-primary transition-colors" href="#mission">MISSION</a>
            <a className="hover:text-primary transition-colors" href="#contrast">INTEL</a>
            <a className="hover:text-primary transition-colors" href="#ops">OPS</a>
            <a className="hover:text-primary transition-colors" href="#access">ACCESS</a>
          </div>

          {/* CTA Button */}
          <button className="flex items-center justify-center gap-2 rounded-sm bg-primary px-5 py-2 text-sm font-bold text-black transition-all hover:bg-white">
            <span className="material-symbols-outlined text-[18px] font-bold">bolt</span>
            DEPLOY
          </button>
          
        </div>
      </div>
    </nav>
  );
}