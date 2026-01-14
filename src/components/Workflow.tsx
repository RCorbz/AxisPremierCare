export default function Workflow() {
  return (
    <section className="border-b border-surface-border bg-background-dark py-24" id="ops">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="text-sm font-bold tracking-[0.2em] text-text-muted uppercase mb-2">Operational Procedure</h2>
          <h3 className="text-3xl font-bold text-white md:text-4xl">THE WORKFLOW</h3>
        </div>

        <div className="relative grid gap-8 md:grid-cols-3">
          
          {/* Connector Line (Desktop Only) 
              This draws the dashed line behind the circles */}
          <div className="absolute top-12 left-0 hidden w-full -translate-y-1/2 md:block px-16 z-0">
            <div className="h-px w-full border-t border-dashed border-surface-border"></div>
          </div>

          {/* Step 1: SIGNAL */}
          <div className="relative z-10 flex flex-col items-center text-center group">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-sm border border-surface-border bg-background-dark text-text-muted transition-all duration-300 group-hover:border-primary group-hover:text-primary group-hover:scale-110 shadow-lg shadow-black">
              <span className="material-symbols-outlined text-4xl">cell_tower</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-mono text-xs font-bold text-primary">STEP 01</span>
              <h4 className="text-xl font-bold text-white">SIGNAL</h4>
              <p className="text-sm text-text-muted px-4">Secure your slot via text or our dedicated app. Instant confirmation.</p>
            </div>
          </div>

          {/* Step 2: DEPLOY */}
          <div className="relative z-10 flex flex-col items-center text-center group">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-sm border border-surface-border bg-background-dark text-text-muted transition-all duration-300 group-hover:border-primary group-hover:text-primary group-hover:scale-110 shadow-lg shadow-black">
              <span className="material-symbols-outlined text-4xl">local_shipping</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-mono text-xs font-bold text-primary">STEP 02</span>
              <h4 className="text-xl font-bold text-white">DEPLOY</h4>
              <p className="text-sm text-text-muted px-4">Provider dispatched to your coordinates in Davis County.</p>
            </div>
          </div>

          {/* Step 3: OPTIMIZE */}
          <div className="relative z-10 flex flex-col items-center text-center group">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-sm border border-surface-border bg-background-dark text-text-muted transition-all duration-300 group-hover:border-primary group-hover:text-primary group-hover:scale-110 shadow-lg shadow-black">
              <span className="material-symbols-outlined text-4xl">vital_signs</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-mono text-xs font-bold text-primary">STEP 03</span>
              <h4 className="text-xl font-bold text-white">OPTIMIZE</h4>
              <p className="text-sm text-text-muted px-4">Clinical-grade treatment performed on-site. Return to peak state.</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}