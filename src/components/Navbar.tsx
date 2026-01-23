import Logo from "./Logo";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-surface-border bg-background-dark/90 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center text-primary">
              <Logo className="h-10 w-10" />
            </div>
            <span className="text-lg font-bold tracking-tighter text-white">
              AXIS <span className="text-primary">PREMIER</span> <span className="text-text-muted font-normal">CARE</span>
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
          <a href="#application" className="flex items-center justify-center gap-2 rounded-sm bg-primary px-5 py-2 text-sm font-bold text-black transition-all hover:bg-white">
            <span className="material-symbols-outlined text-[18px] font-bold">bolt</span>
            DEPLOY
          </a>

        </div>
      </div>
    </nav>
  );
}