"use client";

import { useState, useCallback } from "react";
import { Hero } from "@/components/public/Hero";
import { FrictionVsFlow } from "@/components/public/FrictionVsFlow";
import { WaitlistForm } from "@/components/public/WaitlistForm";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [isRevealed, setIsRevealed] = useState(false);

  const triggerReveal = useCallback(() => {
    setIsRevealed(true);

    // John Wick / Charon style greeting
    const msg = new SpeechSynthesisUtterance("Welcome, friend.");
    msg.rate = 0.8; // Slow, deliberate
    msg.pitch = 0.6; // Deep voice
    window.speechSynthesis.speak(msg);

    // Scroll after a short delay for dramatic effect
    setTimeout(() => {
      document.getElementById('waitlist-reveal')?.scrollIntoView({ behavior: 'smooth' });
    }, 500);
  }, []);

  return (
    <main className="min-h-screen bg-carbon-black selection:bg-electric-yellow selection:text-black">
      {/* 1. Hero Section */}
      <Hero onApply={triggerReveal} isRevealed={isRevealed} />

      {/* 2. Comparison Section */}
      <FrictionVsFlow />

      <AnimatePresence>
        {isRevealed && (
          <motion.section
            id="waitlist-reveal"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="py-24 px-6 md:px-12 border-b border-zinc-900 bg-zinc-950"
          >
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <h2 className="text-3xl md:text-5xl text-white font-mono uppercase tracking-tighter mb-6">
                    Membership Application
                  </h2>
                  <p className="text-zinc-400 font-mono max-w-2xl mx-auto text-xs uppercase tracking-widest">
                    You have unlocked private access. <br />
                    Please complete your profile for exclusive review.
                  </p>
                </motion.div>
              </div>

              <WaitlistForm />
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* 4. Footer */}
      <footer className="py-12 px-6 border-t border-zinc-900 bg-black text-center md:text-left">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h4 className="text-white font-mono uppercase tracking-widest text-sm mb-2">Axis Performance Care</h4>
            <p className="text-zinc-500 text-xs">Concierge Mobile Chiropractic // Davis County, UT</p>
          </div>
          <div className="flex gap-6 text-zinc-600 text-xs uppercase tracking-widest">
            <span>Bountiful</span>
            <span>Centerville</span>
            <span>NSL</span>
            <span>Farmington</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
