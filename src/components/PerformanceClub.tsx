import { Phone, Shield, Users } from "lucide-react";
import { CONTENT } from "../content";

export default function PerformanceClub() {
  const { header, perks } = CONTENT.membership;
  const icons = [Phone, Shield, Users]; // Order mapping for icons

  return (
    <section className="bg-background-dark py-24 px-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-surface-dark/20 to-transparent pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-start justify-between mb-16 gap-8">
          <h2 className="text-3xl font-bold text-white max-w-md">
            {header} <br />
            <span className="text-primary text-lg font-normal tracking-wider uppercase mt-2 block">Founding Member Status</span>
          </h2>
          <div className="p-6 bg-surface-dark border border-surface-border rounded-sm max-w-sm">
            <div className="h-8 w-12 bg-gradient-to-br from-white/20 to-transparent rounded mb-4"></div>
            <p className="font-mono text-xs text-text-muted/50 tracking-widest mb-1">AXIS MEMBER</p>
            <p className="font-mono text-lg text-white tracking-widest">0000 0000 0000 0001</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {perks.map((perk, idx) => {
            const Icon = icons[idx];
            return (
              <div key={idx} className="group p-8 border border-surface-border/50 hover:border-primary/50 transition-colors bg-surface-dark/20">
                <Icon className="w-8 h-8 text-primary mb-6" strokeWidth={1.5} />
                <h3 className="text-xl font-bold text-white mb-3">{perk.title}</h3>
                <p className="text-text-muted text-sm leading-relaxed">
                  {perk.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}