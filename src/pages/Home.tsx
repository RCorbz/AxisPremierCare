import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import FrictionFlow from '../components/FrictionFlow';
import Workflow from '../components/Workflow';
import PerformanceClub from '../components/PerformanceClub';
import Footer from '../components/Footer';
import MembershipApplication from '../components/MembershipApplication';

export default function HomePage() {
    const [showBriefing, setShowBriefing] = useState(false);
    const briefingRef = useRef<HTMLDivElement>(null);

    const handleExplore = () => {
        setShowBriefing(true);
        setTimeout(() => {
            briefingRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    return (
        <>
            <Navbar />
            <main>
                <HeroSection onExplore={handleExplore} />

                <AnimatePresence>
                    {showBriefing && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.8, ease: "easeInOut" }}
                            className="overflow-hidden"
                        >
                            <div ref={briefingRef}>
                                <FrictionFlow />
                                <Workflow />
                                <PerformanceClub />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <MembershipApplication />
            </main>
            <Footer />
        </>
    );
}
