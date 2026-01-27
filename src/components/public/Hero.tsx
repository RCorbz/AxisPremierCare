"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";

export function Hero() {
    return (
        <section className="relative min-h-[80vh] flex flex-col justify-center px-6 md:px-12 border-b border-zinc-900 bg-carbon-black overflow-hidden">
            {/* Background Texture Integration could go here */}

            <div className="max-w-4xl z-10">
                <span className="text-electric-yellow font-mono text-sm uppercase tracking-[0.2em] mb-4 block animate-in fade-in slide-in-from-bottom-4 duration-700">
                    Axis Performance Care
                </span>
                <h1 className="text-5xl md:text-7xl lg:text-8xl text-white font-mono font-bold uppercase tracking-tighter leading-[0.9] mb-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                    Elite <br />
                    <span className="text-zinc-600">Performance.</span> <br />
                    Bespoke Care.
                </h1>
                <p className="text-zinc-400 text-lg md:text-xl max-w-xl leading-relaxed mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                    Your concierge for high-performance living. Dr. Hanson brings
                    private structural optimization to your home in Bountiful.
                    Acute recovery & elite mobility for the world&apos;s highest producers.
                </p>

                <div className="flex flex-col md:flex-row gap-6 items-start animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                    <button
                        onClick={() => document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' })}
                        className="bg-electric-yellow text-black font-bold uppercase tracking-widest px-8 py-4 hover:bg-yellow-400 transition-colors flex items-center gap-2 group text-sm"
                    >
                        Apply for Membership
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <div className="flex items-center gap-3 py-4">
                        <div className="flex -space-x-2">
                            {/* Mock Avatars or Status Dots */}
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        </div>
                        <span className="text-zinc-500 text-xs uppercase tracking-widest">
                            Limited to 50 Founding Members
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}
