// REFERENCE COMPONENT STRUCTURE
// Use this code as the foundation, but ensure all sections from 03_content_copy.md are included.

import React from 'react';
import { ArrowRight, Check, MapPin, Shield, Smartphone } from 'lucide-react';

const AxisLanding = () => {
  return (
    <div className="min-h-screen bg-background-dark text-white font-sans selection:bg-primary selection:text-black">
      
      {/* SECTION 1: HERO */}
      <header className="px-6 py-24 md:py-32 max-w-7xl mx-auto flex flex-col items-start justify-center min-h-[80vh]">
        <span className="text-primary tracking-[0.2em] text-sm font-bold uppercase mb-6">
          Axis Performance Care
        </span>
        <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-8 tracking-tight">
          HIGH-PERFORMANCE <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
            RECOVERY. DELIVERED.
          </span>
        </h1>
        <p className="text-text-muted text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
          Skip the waiting room. Dr. Hanson brings hospital-grade structural care to your 
          living room in Bountiful. Acute pain & mobility relief for high-performers.
        </p>
        <button className="bg-primary text-black px-8 py-4 font-bold text-lg rounded-sm hover:bg-white transition-colors flex items-center gap-2 group">
          REQUEST ACCESS
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
        <div className="mt-12 flex items-center gap-4 text-sm text-gray-500">
          <div className="flex -space-x-2">
            {[1,2,3].map(i => (
              <div key={i} className="w-8 h-8 rounded-full bg-gray-700 border-2 border-[#0a0a0a]" />
            ))}
          </div>
          <p>Limited to 50 Founding Members</p>
        </div>
      </header>

      {/* SECTION 2: THE ANCHOR (Journey) */}
      <section className="bg-[#111111] py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-16">THE AXIS WORKFLOW</h2>
          <div className="grid md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div className="relative pl-8 border-l border-gray-800">
              <span className="absolute -left-3 top-0 w-6 h-6 bg-[#DFFF00] rounded-full flex items-center justify-center text-black font-bold text-xs">1</span>
              <h3 className="text-xl font-bold mb-4">You Request Access</h3>
              <p className="text-gray-400">Fill out the secure intake. We limit our route to ensure availability for members.</p>
            </div>
            {/* Step 2 */}
            <div className="relative pl-8 border-l border-gray-800">
              <span className="absolute -left-3 top-0 w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center text-white font-bold text-xs">2</span>
              <h3 className="text-xl font-bold mb-4">We Deploy</h3>
              <p className="text-gray-400">Dr. Hanson arrives. We set up a sterile field in your office or home in 3 minutes.</p>
            </div>
            {/* Step 3 */}
            <div className="relative pl-8 border-l border-gray-800">
              <span className="absolute -left-3 top-0 w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center text-white font-bold text-xs">3</span>
              <h3 className="text-xl font-bold mb-4">You Perform</h3>
              <p className="text-gray-400">30 minutes of structural work. You return to velocity immediately. No driving.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: MEMBERSHIP PRIVILEGES (See docs/03_content_copy.md for details) */}
      {/* SECTION 4: FOOTER (See docs/03_content_copy.md for details) */}
      
    </div>
  );
};
export default AxisLanding;
Please start by creating the main `LandingPage.jsx` component.
