"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowDown, HelpCircle, ChevronDown } from "lucide-react";

export function FrictionVsFlow() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                setIsVisible(false);
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [isVisible]);

    return (
        <div className="border-b border-zinc-900 bg-black">
            {/* The Trigger Button */}
            <div className="flex justify-center py-12">
                <button
                    onClick={() => setIsVisible(!isVisible)}
                    className="flex flex-col items-center gap-4 group transition-all"
                >
                    <span className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.4em] group-hover:text-electric-yellow transition-colors">
                        Discover the Advantage
                    </span>
                    <div className="flex items-center gap-3 px-8 py-4 border border-zinc-800 bg-zinc-950/50 hover:border-electric-yellow transition-all">
                        <Sparkles className="w-4 h-4 text-electric-yellow" />
                        <span className="text-white font-mono text-xs uppercase tracking-widest font-bold">Why Choose Axis?</span>
                        <motion.div
                            animate={{ rotate: isVisible ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <ChevronDown className="w-4 h-4 text-zinc-500" />
                        </motion.div>
                    </div>
                </button>
            </div>

            <AnimatePresence>
                {isVisible && (
                    <motion.section
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="grid grid-cols-1 md:grid-cols-2 overflow-hidden border-t border-zinc-900 bg-zinc-950"
                    >
                        {/* The Old Way (Friction) */}
                        <div className="p-12 md:p-24 flex flex-col justify-center border-b md:border-b-0 md:border-r border-zinc-900/50 brightness-[0.6]">
                            <h3 className="text-zinc-600 font-mono text-lg uppercase tracking-[0.2em] mb-8">
                                The Conventional Way
                            </h3>
                            <ul className="space-y-6 text-zinc-600 font-mono text-sm md:text-base">
                                <li className="flex gap-4 items-center">
                                    <span className="w-2 h-px bg-zinc-800"></span> Crowded Waiting Rooms
                                </li>
                                <li className="flex gap-4 items-center">
                                    <span className="w-2 h-px bg-zinc-800"></span> Fragmented Care Logic
                                </li>
                                <li className="flex gap-4 items-center">
                                    <span className="w-2 h-px bg-zinc-800"></span> Lost Productivity
                                </li>
                            </ul>
                        </div>

                        {/* The Axis Way (Flow) */}
                        <div className="p-12 md:p-24 flex flex-col justify-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-electric-yellow/5 blur-[100px] rounded-full"></div>

                            <h3 className="text-white font-mono text-xl uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                                The Axis Standard <div className="w-1.5 h-1.5 bg-electric-yellow shadow-[0_0_10px_rgba(250,204,21,0.5)]"></div>
                            </h3>
                            <ul className="space-y-6 text-zinc-100 font-mono text-sm md:text-base">
                                <li className="flex gap-4 items-center group">
                                    <span className="w-4 h-px bg-electric-yellow"></span> Private Home Restoration
                                </li>
                                <li className="flex gap-4 items-center group">
                                    <span className="w-4 h-px bg-electric-yellow"></span> Elite Productivity Recovery
                                </li>
                                <li className="flex gap-4 items-center group">
                                    <span className="w-4 h-px bg-electric-yellow"></span> Zero Friction Delivery
                                </li>
                            </ul>
                        </div>
                    </motion.section>
                )}
            </AnimatePresence>
        </div>
    );
}
