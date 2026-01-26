export function FrictionVsFlow() {
    return (
        <section className="grid grid-cols-1 md:grid-cols-2 border-b border-zinc-900">
            {/* The Old Way (Friction) */}
            <div className="bg-zinc-900/50 p-12 md:p-24 flex flex-col justify-center border-b md:border-b-0 md:border-r border-zinc-800">
                <h3 className="text-zinc-500 font-mono text-xl uppercase tracking-widest mb-8">
                    The Old Way
                </h3>
                <ul className="space-y-6 text-zinc-500 font-mono text-sm md:text-base">
                    <li className="flex gap-4 items-center">
                        <span className="w-2 h-px bg-zinc-700"></span> Traffic.
                    </li>
                    <li className="flex gap-4 items-center">
                        <span className="w-2 h-px bg-zinc-700"></span> 40-minute wait.
                    </li>
                    <li className="flex gap-4 items-center">
                        <span className="w-2 h-px bg-zinc-700"></span> 5-minute adjustment.
                    </li>
                    <li className="flex gap-4 items-center">
                        <span className="w-2 h-px bg-zinc-700"></span> Lost productivity.
                    </li>
                </ul>
            </div>

            {/* The Axis Way (Flow) */}
            <div className="bg-carbon-black p-12 md:p-24 flex flex-col justify-center relative overflow-hidden">
                {/* Decorative Grid or Accent */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-electric-yellow/5 blur-3xl rounded-full"></div>

                <h3 className="text-white font-mono text-xl uppercase tracking-widest mb-8 flex items-center gap-3">
                    The Axis Way <div className="w-2 h-2 bg-electric-yellow rounded-none"></div>
                </h3>
                <ul className="space-y-6 text-white font-mono text-sm md:text-base">
                    <li className="flex gap-4 items-center group">
                        <span className="w-2 h-px bg-electric-yellow group-hover:w-4 transition-all"></span> We come to you.
                    </li>
                    <li className="flex gap-4 items-center group">
                        <span className="w-2 h-px bg-electric-yellow group-hover:w-4 transition-all"></span> Sterile setup in 3 mins.
                    </li>
                    <li className="flex gap-4 items-center group">
                        <span className="w-2 h-px bg-electric-yellow group-hover:w-4 transition-all"></span> 30-minute structural work.
                    </li>
                    <li className="flex gap-4 items-center group">
                        <span className="w-2 h-px bg-electric-yellow group-hover:w-4 transition-all"></span> You never leave your desk.
                    </li>
                </ul>
            </div>
        </section>
    );
}
