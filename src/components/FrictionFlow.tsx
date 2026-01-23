import { Hourglass, Ban, Zap, CheckCircle2, ArrowRight } from "lucide-react";
import { CONTENT } from "../content";

export default function FrictionFlow() {
  const { header, subHeader, oldWay, newWay } = CONTENT.frictionFlow;

  return (
    <section className="border-b border-surface-border bg-background-dark py-24 relative overflow-hidden" id="contrast">
      {/* Grid Background Pattern */}
      <div className="grid-bg absolute inset-0 opacity-20 pointer-events-none"></div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">

        {/* Section Header */}
        <div className="mb-16">
          <h2 className="text-sm font-bold tracking-[0.2em] text-primary uppercase mb-2">{header}</h2>
          <h3 className="text-3xl font-bold text-white md:text-4xl">{subHeader}</h3>
        </div>

        <div className="grid gap-0 lg:grid-cols-2 lg:gap-8">

          {/* Left Card: The Old Way */}
          <div className="group relative flex flex-col justify-between overflow-hidden rounded-sm border border-surface-border bg-surface-dark/30 p-8 transition-all hover:bg-surface-dark/50">
            <div className="absolute right-4 top-4 opacity-20 group-hover:opacity-40 transition-opacity text-white">
              <Hourglass className="w-16 h-16" strokeWidth={1} />
            </div>

            <div>
              <h4 className="text-xl font-bold text-text-muted mb-6">{oldWay.title}</h4>
              <ul className="space-y-6">
                {oldWay.items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-4 opacity-60">
                    <Ban className="text-red-900 mt-1 w-5 h-5" />
                    <div>
                      <p className="font-bold text-text-muted">{item.title}</p>
                      <p className="text-sm text-text-muted/60">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 border-t border-surface-border pt-4">
              <p className="font-mono text-xs uppercase tracking-wider text-red-900/50">{oldWay.efficiency}</p>
            </div>
          </div>

          {/* Right Card: The AXIS Way (Glow Effect) */}
          <div className="relative flex flex-col justify-between overflow-hidden rounded-sm border border-primary/30 bg-surface-dark p-8 shadow-[0_0_50px_-20px_rgba(217,255,0,0.1)] transition-all">
            <div className="absolute right-4 top-4 text-primary opacity-20">
              <Zap className="w-16 h-16" strokeWidth={1} />
            </div>

            <div>
              <h4 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                {newWay.title}
                <span className="rounded bg-primary/20 px-2 py-0.5 text-[10px] font-bold text-primary uppercase tracking-wide">{newWay.badge}</span>
              </h4>
              <ul className="space-y-6">
                {newWay.items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-4">
                    <CheckCircle2 className="text-primary mt-1 w-5 h-5" />
                    <div>
                      <p className="font-bold text-white">{item.title}</p>
                      <p className="text-sm text-text-muted">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 border-t border-primary/20 pt-4 flex justify-between items-center">
              <p className="font-mono text-xs uppercase tracking-wider text-primary">{newWay.efficiency}</p>
              <button className="text-xs font-bold text-white hover:text-primary uppercase tracking-wider flex items-center gap-1">
                {newWay.cta} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
