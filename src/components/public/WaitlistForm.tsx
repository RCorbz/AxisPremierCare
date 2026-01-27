"use client";

import { useState, useRef, useEffect } from "react";
import { submitLead } from "@/app/actions/leads";
import { cn } from "@/lib/utils";
import { Loader2, ArrowRight, CheckCircle, MapPin, Building2, AlertTriangle, Activity, Zap, ClipboardCheck, ArrowLeft, Users, Briefcase, Key, Timer, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Valid Corporate Codes (Mock)
const CORPORATE_CODES = ["AXIS-CORP-01", "VIP-ACCESS", "ELITE-2026"];

type MembershipMode = "private" | "corporate" | null;
type Step = "identity" | "objective" | "outcome" | "contact" | "success";

const STEPS: Step[] = ["identity", "objective", "outcome", "contact"];

export function WaitlistForm() {
    const [step, setStep] = useState<Step>("identity");
    const [mode, setMode] = useState<MembershipMode>(null);
    const [isPending, setIsPending] = useState(false);
    const [result, setResult] = useState<{ success: boolean; message?: string; errors?: any } | null>(null);

    // Selections
    const [objective, setObjective] = useState("");
    const [outcome, setOutcome] = useState("");
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");

    // Other values
    const [otherObjective, setOtherObjective] = useState("");
    const [otherOutcome, setOtherOutcome] = useState("");
    const [showOtherObjective, setShowOtherObjective] = useState(false);
    const [showOtherOutcome, setShowOtherOutcome] = useState(false);

    const phoneRef = useRef<HTMLInputElement>(null);
    const nameRef = useRef<HTMLInputElement>(null);

    const currentStepIndex = STEPS.indexOf(step);
    const progress = ((currentStepIndex + 1) / STEPS.length) * 100;

    const goToStep = (target: Step) => setStep(target);

    // Auto-focus logic
    useEffect(() => {
        if (step === "contact") {
            nameRef.current?.focus();
        }
    }, [step]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsPending(true);
        setResult(null);

        const formData = new FormData();
        formData.append("full_name", fullName);
        formData.append("phone", phone);
        formData.append("email", ""); // Omitted for low friction

        const finalObjective = showOtherObjective ? `Other: ${otherObjective}` : objective;
        const finalOutcome = showOtherOutcome ? `Other: ${otherOutcome}` : outcome;

        formData.append("activity_impacted", finalObjective);
        formData.append("notes", `Outcome Expectation: ${finalOutcome}`);
        formData.append("lead_type", mode === "corporate" ? "Corporate_New" : "Private");

        try {
            const response = await submitLead(formData);
            setResult(response);
            if (response.success) goToStep("success");
        } catch (err: any) {
            setResult({ success: false, message: "Secure connection failed. Please retry." });
        } finally {
            setIsPending(false);
        }
    }

    // --- Transitions ---
    const variants = {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 }
    };

    // --- Renders ---

    if (step === "success") {
        return (
            <motion.div initial="initial" animate="animate" variants={variants} className="bg-zinc-900 border border-zinc-800 p-12 text-center max-w-xl mx-auto shadow-2xl">
                <div className="w-16 h-16 bg-electric-yellow/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-8 h-8 text-electric-yellow" />
                </div>
                <h3 className="text-2xl text-white font-mono uppercase tracking-[0.2em] mb-4">Protocol Initiated</h3>
                <p className="text-zinc-400 font-mono text-xs leading-relaxed max-w-sm mx-auto">
                    Membership application received. Our concierge will reach out via focus channel within 24 hours.
                </p>
                <button onClick={() => window.location.reload()} className="mt-8 text-[10px] underline text-zinc-600 hover:text-white uppercase tracking-widest font-mono">
                    New Application
                </button>
            </motion.div>
        );
    }

    return (
        <div className="max-w-xl mx-auto px-4 md:px-0">
            {/* High-Visibility Progress Bar */}
            <div className="mb-12 space-y-4">
                <div className="flex justify-between items-end mb-2">
                    <div className="flex items-center gap-2">
                        <Timer className="w-4 h-4 text-electric-yellow animate-pulse" />
                        <span className="text-[10px] text-white uppercase tracking-[0.2em] font-mono">
                            Protocol Completion: <span className="text-electric-yellow">&lt; 60 Seconds</span>
                        </span>
                    </div>
                    <span className="text-[10px] text-zinc-600 font-mono italic">
                        Step {currentStepIndex + 1} of {STEPS.length}
                    </span>
                </div>
                <div className="h-[2px] w-full bg-zinc-900 overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-electric-yellow shadow-[0_0_10px_rgba(250,204,21,0.5)]"
                    />
                </div>
            </div>

            <AnimatePresence mode="wait">
                {/* Step 1: Identity */}
                {step === "identity" && (
                    <motion.div key="identity" initial="initial" animate="animate" exit="exit" variants={variants} className="space-y-6">
                        <div className="mb-10">
                            <h2 className="text-3xl text-white font-mono uppercase tracking-[0.2em] mb-2">Who are you?</h2>
                            <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest">Select your entry point</p>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            {[
                                { id: "private", label: "Private Member", icon: Users, desc: "Elite performance & acute recovery for individuals." },
                                { id: "corporate", label: "Corporate Partner", icon: Briefcase, desc: "Enterprise clinical logistics & onsite support." }
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => { setMode(item.id as MembershipMode); goToStep("objective"); }}
                                    className="group relative bg-zinc-900 border border-zinc-800 p-8 text-left hover:border-electric-yellow transition-all flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-6">
                                        <item.icon className="w-8 h-8 text-zinc-600 group-hover:text-electric-yellow transition-colors" />
                                        <div>
                                            <h4 className="text-white font-mono uppercase tracking-widest text-lg">{item.label}</h4>
                                            <p className="text-zinc-600 text-[10px] uppercase tracking-widest mt-1">{item.desc}</p>
                                        </div>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-zinc-800 group-hover:text-electric-yellow group-hover:translate-x-1 transition-all" />
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Step 2: Objective */}
                {step === "objective" && (
                    <motion.div key="objective" initial="initial" animate="animate" exit="exit" variants={variants} className="space-y-6">
                        <div className="mb-10">
                            <h2 className="text-3xl text-white font-mono uppercase tracking-[0.2em] mb-2 flex items-center gap-4">
                                How can we help?
                                <Sparkles className="w-6 h-6 text-electric-yellow" />
                            </h2>
                            <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest">Identify your primary focus</p>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                            {[
                                "Performance Optimization",
                                "Acute Recovery (Pain / Injury)",
                                "Chronic Maintenance (Mobility)",
                                "Executive Wellness Strategy"
                            ].map((opt) => (
                                <button
                                    key={opt}
                                    onClick={() => { setObjective(opt); setShowOtherObjective(false); goToStep("outcome"); }}
                                    className="p-5 border border-zinc-800 bg-zinc-900/50 text-left hover:border-electric-yellow text-zinc-400 hover:text-white font-mono text-xs uppercase tracking-widest transition-all"
                                >
                                    {opt}
                                </button>
                            ))}
                            {!showOtherObjective ? (
                                <button
                                    onClick={() => setShowOtherObjective(true)}
                                    className="p-5 border border-dashed border-zinc-700 text-zinc-600 text-[10px] uppercase tracking-widest font-mono hover:text-white transition-all text-left"
                                >
                                    + Other...
                                </button>
                            ) : (
                                <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                                    <input
                                        autoFocus
                                        value={otherObjective}
                                        onChange={(e) => setOtherObjective(e.target.value)}
                                        className="w-full bg-black border border-electric-yellow p-5 text-white font-mono text-xs uppercase tracking-widest focus:outline-none"
                                        placeholder="INPUT CUSTOM OBJECTIVE"
                                    />
                                    <button
                                        onClick={() => goToStep("outcome")}
                                        disabled={!otherObjective}
                                        className="w-full bg-electric-yellow text-black font-bold uppercase tracking-widest py-4 disabled:opacity-50"
                                    >
                                        Lock Objective
                                    </button>
                                </div>
                            )}
                        </div>
                        <button onClick={() => goToStep("identity")} className="text-[10px] text-zinc-600 uppercase tracking-widest flex items-center gap-2 hover:text-white mt-4">
                            <ArrowLeft className="w-3 h-3" /> Back
                        </button>
                    </motion.div>
                )}

                {/* Step 3: Outcome */}
                {step === "outcome" && (
                    <motion.div key="outcome" initial="initial" animate="animate" exit="exit" variants={variants} className="space-y-6">
                        <div className="mb-10">
                            <h2 className="text-3xl text-white font-mono uppercase tracking-[0.2em] mb-2">Outcome Goal</h2>
                            <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest">What is your expected result at visit completion?</p>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                            {[
                                "Immediate Treatment Session",
                                "Specialized Consultation",
                                "Long-term Planning / Roadmap",
                                "Concierge Performance Scan"
                            ].map((opt) => (
                                <button
                                    key={opt}
                                    onClick={() => { setOutcome(opt); setShowOtherOutcome(false); goToStep("contact"); }}
                                    className="p-5 border border-zinc-800 bg-zinc-900/50 text-left hover:border-electric-yellow text-zinc-400 hover:text-white font-mono text-xs uppercase tracking-widest transition-all"
                                >
                                    {opt}
                                </button>
                            ))}
                            {!showOtherOutcome ? (
                                <button
                                    onClick={() => setShowOtherOutcome(true)}
                                    className="p-5 border border-dashed border-zinc-700 text-zinc-600 text-[10px] uppercase tracking-widest font-mono hover:text-white transition-all text-left"
                                >
                                    + Other...
                                </button>
                            ) : (
                                <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                                    <input
                                        autoFocus
                                        value={otherOutcome}
                                        onChange={(e) => setOtherOutcome(e.target.value)}
                                        className="w-full bg-black border border-electric-yellow p-5 text-white font-mono text-xs uppercase tracking-widest focus:outline-none"
                                        placeholder="INPUT CUSTOM EXPECTATION"
                                    />
                                    <button
                                        onClick={() => goToStep("contact")}
                                        disabled={!otherOutcome}
                                        className="w-full bg-electric-yellow text-black font-bold uppercase tracking-widest py-4 disabled:opacity-50"
                                    >
                                        Lock Expectation
                                    </button>
                                </div>
                            )}
                        </div>
                        <button onClick={() => goToStep("objective")} className="text-[10px] text-zinc-600 uppercase tracking-widest flex items-center gap-2 hover:text-white mt-4">
                            <ArrowLeft className="w-3 h-3" /> Back
                        </button>
                    </motion.div>
                )}

                {/* Step 4: Contact */}
                {step === "contact" && (
                    <motion.div key="contact" initial="initial" animate="animate" exit="exit" variants={variants} className="bg-zinc-900/50 border border-zinc-800 p-8 shadow-2xl">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl text-white font-mono uppercase tracking-widest flex items-center gap-2">
                                <ClipboardCheck className="w-4 h-4 text-electric-yellow" /> Contact Intelligence
                            </h3>
                            <button onClick={() => goToStep("outcome")} className="text-[10px] text-zinc-600 uppercase tracking-widest flex items-center gap-1 hover:text-white">
                                <ArrowLeft className="w-3 h-3" /> Back
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono">Full Name</label>
                                <input
                                    ref={nameRef}
                                    required
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full bg-black border border-zinc-800 p-4 text-white focus:border-electric-yellow focus:outline-none font-mono text-sm rounded-none transition-colors"
                                    placeholder="J. DOE"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono">Secure Phone (SMS Priority)</label>
                                <input
                                    ref={phoneRef}
                                    required
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full bg-black border border-zinc-800 p-4 text-white focus:border-electric-yellow focus:outline-none font-mono text-sm rounded-none transition-colors"
                                    placeholder="000-000-0000"
                                />
                            </div>

                            {result?.message && !result.success && (
                                <p className="text-yellow-500 text-[9px] font-mono uppercase text-center border border-yellow-500/20 p-2 bg-yellow-500/5">
                                    {result.message}
                                </p>
                            )}

                            <button
                                disabled={isPending || !fullName || !phone}
                                className="w-full bg-electric-yellow text-black font-bold uppercase tracking-[0.2em] py-5 mt-4 hover:bg-yellow-400 transition-all flex items-center justify-center gap-3 group disabled:opacity-50 shadow-[0_10px_30px_-10px_rgba(250,204,21,0.5)] rounded-none"
                            >
                                {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Initiate Concierge Protocol <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>}
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="mt-16 text-center">
                <p className="text-[7px] text-zinc-800 uppercase tracking-[0.5em] font-mono animate-pulse mb-2">
                    Axis OS // End-to-End Encryption Active
                </p>
                <p className="text-[6px] text-zinc-900 uppercase tracking-[0.3em] font-mono">
                    Official clinical onboarding will follow via secure link
                </p>
            </div>
        </div>
    );
}
