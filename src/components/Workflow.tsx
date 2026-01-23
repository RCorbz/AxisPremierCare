import { CONTENT } from "../content";

export default function Workflow() {
  const { header, steps } = CONTENT.workflow;

  return (
    <section className="bg-surface-dark py-24 px-6 border-b border-surface-border">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-16 text-white">{header}</h2>
        <div className="grid md:grid-cols-3 gap-12">
          {steps.map((step) => (
            <div key={step.number} className="relative pl-8 border-l border-surface-border">
              <span className="absolute -left-3 top-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-black font-bold text-xs ring-4 ring-surface-dark">
                {step.number}
              </span>
              <h3 className="text-xl font-bold mb-4 text-white">{step.title}</h3>
              <p className="text-text-muted text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}