import { ArrowRight } from "lucide-react";
import { CONTENT } from "../content";
import heroBg from "../assets/hero-bg.jpg";

interface HeroSectionProps {
  onExplore: () => void;
}

export default function HeroSection({ onExplore }: HeroSectionProps) {

  const { headline, subhead, cta, socialProof } = CONTENT.hero;

  return (
    <header className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-6 pt-16 text-center">
      {/* Background Gradients */}
      {/* Background Gradients & Image */}
      <div className="absolute inset-0 bg-background-dark">
        <div className="absolute inset-0 z-0 opacity-40">
          <img
            src={heroBg}
            alt="Doctor in dark clothing"
            className="w-full h-full object-cover grayscale brightness-50"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/80 to-transparent z-10"></div>
        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/5 blur-[120px] z-10"></div>
      </div>

      <div className="relative z-10 max-w-4xl">

        <h1 className="mb-8 text-5xl font-bold leading-tight tracking-tight text-white md:text-7xl lg:text-8xl">
          {headline.line1} <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-text-muted">
            {headline.line2}
          </span>
        </h1>
        <p className="mx-auto mb-10 max-w-2xl text-lg text-text-muted md:text-xl leading-relaxed">
          {subhead}
        </p>

        <div className="flex flex-col items-center gap-6">
          <a href="#application" className="group flex items-center gap-2 rounded-sm bg-primary px-8 py-4 text-lg font-bold text-black transition-all hover:bg-white hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]">
            {cta}
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </a>

          {/* Progressive Disclosure Trigger */}
          <button
            onClick={onExplore}
            className="mt-8 flex flex-col items-center gap-2 text-xs font-bold tracking-[0.2em] text-text-muted/50 transition-colors hover:text-primary uppercase"
          >
            Explore Protocol
            <span className="animate-bounce">↓</span>
          </button>
        </div>
      </div>

      {/* Social Proof (moved to bottom absolute or keep here? The original design had it in the list. Let's keep it minimal as requested.) */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center">
        <p className="text-sm text-text-muted/30 flex items-center gap-2">
          <span className="flex -space-x-1">
            {[1, 2, 3].map((i) => (
              <span key={i} className="h-1.5 w-1.5 rounded-full bg-primary/50 ring-2 ring-background-dark"></span>
            ))}
          </span>
          {socialProof}
        </p>
      </div>
    </header>
  );
}