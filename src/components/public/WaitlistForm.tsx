"use client";

import { useState } from "react";
import { submitLead } from "@/app/actions/leads";
import { cn } from "@/lib/utils";
import { Loader2, ArrowRight, CheckCircle, MapPin, Building2, AlertTriangle, Activity, Zap, ClipboardCheck, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Allowed Zip Codes for "Green" Status
const ALLOWED_ZIPS = [
    "84010", "84011", // Bountiful
    "84014",          // Centerville
    "84054",          // North Salt Lake
    "84087",          // Woods Cross
    "84025",          // Farmington
    "84037",          // Kaysville
];

// Valid Corporate Codes (Mock)
const CORPORATE_CODES = ["AXIS-CORP-01", "VIP-ACCESS"];

type Step = "location" | "diagnostics" | "contact" | "success";

export function WaitlistForm() {
    const [step, setStep] = useState<Step>("location");
    const [isPending, setIsPending] = useState(false);
    const [result, setResult] = useState<{ success: boolean; message?: string; errors?: any } | null>(null);

    // Location State
    const [zipCode, setZipCode] = useState("");
    const [corpCode, setCorpCode] = useState("");
    const [useCorpCode, setUseCorpCode] = useState(false);
    const [outOfAreaConfirmed, setOutOfAreaConfirmed] = useState(false);
    const [locationError, setLocationError] = useState<string | null>(null);

    // Diagnostic State
    const [activityImpacted, setActivityImpacted] = useState("");
    const [priority, setPriority] = useState("General Inquiry");

    // Contact State
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");

    // Step Transition Helper
    const goToStep = (target: Step) => setStep(target);

    // Validate Location
    function handleLocationCheck(e: React.FormEvent) {
        e.preventDefault();
        setLocationError(null);

        if (useCorpCode) {
            if (CORPORATE_CODES.includes(corpCode.trim().toUpperCase())) {
                goToStep("diagnostics");
            } else {
                setLocationError("Invalid Corporate Access Code.");
            }
        } else {
            if (ALLOWED_ZIPS.includes(zipCode.trim())) {
                goToStep("diagnostics");
            } else {
                setOutOfAreaConfirmed(true);
            }
        }
    }

    function handleOutOfAreaProceed() {
        setOutOfAreaConfirmed(false);
        goToStep("diagnostics");
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsPending(true);
        setResult(null);

        const formData = new FormData();
        formData.append("full_name", fullName);
        formData.append("phone", phone);
        formData.append("email", email);
        formData.append("activity_impacted", activityImpacted);
        formData.append("deployment_priority", priority);
        formData.append("zip_code", zipCode);
        if (useCorpCode) formData.append("corporate_code", corpCode);

        // Manual Interest Level mapping based on priority for backward compatibility
        const interestLevel = priority === "ASAP" ? "High" : priority === "This Week" ? "Medium" : "Low";
        formData.append("interest_level", interestLevel);

        try {
            const response = await submitLead(formData);
            setResult(response);
            if (response.success) {
                goToStep("success");
            }
        } catch (err: any) {
            setResult({
                success: false,
                message: `Connection Error: ${err.message || "Failed to reach command center."}`
            });
        } finally {
            setIsPending(false);
        }
    }

    // --- Renders ---

    const stepVariants = {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 }
    };

    if (step === "success") {
        return (
            <motion.div
                initial="initial" animate="animate" variants={stepVariants}
                className="bg-zinc-900 border border-zinc-800 p-8 md:p-12 text-center max-w-xl mx-auto"
            >
                <div className="w-16 h-16 bg-electric-yellow/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-8 h-8 text-electric-yellow" />
                </div>
                <h3 className="text-2xl text-white font-mono uppercase tracking-widest mb-4">Protocol Initiated</h3>
                <p className="text-zinc-400 font-mono text-sm leading-relaxed">
                    Application received. Priority level: <span className="text-electric-yellow">{priority}</span>. <br />
                    A concierge will reach out via focus channel shortly.
                </p>
                <button
                    onClick={() => {
                        setStep("location");
                        setResult(null);
                        setZipCode("");
                        setCorpCode("");
                        setActivityImpacted("");
                        setFullName("");
                        setPhone("");
                        setEmail("");
                    }}
                    className="mt-8 text-[10px] underline text-zinc-600 hover:text-white uppercase tracking-widest font-mono"
                >
                    Submit New Application
                </button>
            </motion.div>
        );
    }

    return (
        <div className="max-w-xl mx-auto">
            {/* Progress indicator */}
            <div className="flex gap-1 mb-8">
                {["location", "diagnostics", "contact"].map((s, i) => (
                    <div
                        key={s}
                        className={cn(
                            "h-1 flex-1 transition-all duration-500",
                            step === s || (i === 0 && step !== "location") || (i === 1 && step === "contact")
                                ? "bg-electric-yellow"
                                : "bg-zinc-800"
                        )}
                    />
                ))}
            </div>

            <AnimatePresence mode="wait">
                {/* Step 1: Location */}
                {step === "location" && !outOfAreaConfirmed && (
                    <motion.div
                        key="location" initial="initial" animate="animate" exit="exit" variants={stepVariants}
                        className="bg-zinc-900/50 border border-zinc-800 p-8"
                    >
                        <h3 className="text-xl text-white font-mono uppercase tracking-widest mb-6 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-electric-yellow" />
                            Verify Location
                        </h3>

                        <form onSubmit={handleLocationCheck} className="space-y-6">
                            {!useCorpCode ? (
                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-widest text-zinc-500 font-mono">Deployment Zip</label>
                                    <input
                                        type="text"
                                        value={zipCode}
                                        onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                                        className="w-full bg-black border border-zinc-800 p-4 text-white focus:border-electric-yellow focus:outline-none transition-colors rounded-none font-mono text-lg"
                                        placeholder="84..."
                                        maxLength={5}
                                        autoFocus
                                    />
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-widest text-zinc-500 font-mono">Corp Access Code</label>
                                    <input
                                        type="text"
                                        value={corpCode}
                                        onChange={(e) => setCorpCode(e.target.value)}
                                        className="w-full bg-black border border-zinc-800 p-4 text-white focus:border-electric-yellow focus:outline-none transition-colors rounded-none font-mono text-lg"
                                        placeholder="ENTER CODE"
                                    />
                                </div>
                            )}

                            {locationError && (
                                <p className="text-red-500 text-[10px] font-mono uppercase">{locationError}</p>
                            )}

                            <button
                                type="submit"
                                disabled={!useCorpCode ? zipCode.length < 5 : corpCode.length < 3}
                                className="w-full bg-zinc-100 text-black font-bold uppercase tracking-widest py-4 hover:bg-white transition-all disabled:opacity-50"
                            >
                                Validate Sector
                            </button>
                        </form>

                        <button
                            onClick={() => { setUseCorpCode(!useCorpCode); setLocationError(null); }}
                            className="mt-6 w-full text-[10px] text-zinc-600 hover:text-white uppercase tracking-widest font-mono flex items-center justify-center gap-2"
                        >
                            {useCorpCode ? <MapPin className="w-3 h-3" /> : <Building2 className="w-3 h-3" />}
                            {useCorpCode ? "Standard Zip Login" : "Use Corporate Access Code"}
                        </button>
                    </motion.div>
                )}

                {/* Out of Area Warning */}
                {outOfAreaConfirmed && (
                    <motion.div
                        key="out-of-area" initial="initial" animate="animate" exit="exit" variants={stepVariants}
                        className="bg-zinc-900 border border-yellow-500/30 p-8 text-center"
                    >
                        <AlertTriangle className="w-8 h-8 text-yellow-500 mx-auto mb-4" />
                        <h3 className="text-lg text-white font-mono uppercase tracking-widest mb-3">Outside Standard Range</h3>
                        <p className="text-zinc-400 font-mono text-xs leading-relaxed mb-6">
                            Sector {zipCode} is outside our rapid-response zone. <br /> Application will be flagged for manual review and travel surcharges.
                        </p>
                        <div className="grid gap-3">
                            <button onClick={handleOutOfAreaProceed} className="bg-electric-yellow text-black font-bold uppercase tracking-widest py-3 text-xs">Proceed Regardless</button>
                            <button onClick={() => { setOutOfAreaConfirmed(false); setZipCode(""); }} className="border border-zinc-700 text-zinc-500 py-3 text-xs uppercase tracking-widest font-mono">Cancel</button>
                        </div>
                    </motion.div>
                )}

                {/* Step 2: Diagnostics */}
                {step === "diagnostics" && (
                    <motion.div
                        key="diagnostics" initial="initial" animate="animate" exit="exit" variants={stepVariants}
                        className="bg-zinc-900/50 border border-zinc-800 p-8"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl text-white font-mono uppercase tracking-widest flex items-center gap-2">
                                <Activity className="w-5 h-5 text-electric-yellow" />
                                Diagnostics
                            </h3>
                            <button onClick={() => goToStep("location")} className="text-[10px] text-zinc-600 uppercase tracking-widest flex items-center gap-1">
                                <ArrowLeft className="w-3 h-3" /> Back
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-zinc-500 font-mono">Activity Impacted</label>
                                <input
                                    type="text"
                                    value={activityImpacted}
                                    onChange={(e) => setActivityImpacted(e.target.value)}
                                    className="w-full bg-black border border-zinc-800 p-4 text-white focus:border-electric-yellow focus:outline-none transition-colors rounded-none font-mono"
                                    placeholder="e.g. Golf, Running, High-Performance Work"
                                />
                                <p className="text-[10px] text-zinc-600 font-mono uppercase">What is being limited by your performance?</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-zinc-500 font-mono">Deployment Priority</label>
                                <div className="grid grid-cols-1 gap-2">
                                    {["ASAP", "This Week", "General Inquiry"].map((p) => (
                                        <button
                                            key={p}
                                            type="button"
                                            onClick={() => setPriority(p)}
                                            className={cn(
                                                "p-4 border font-mono text-xs uppercase tracking-widest text-left transition-all",
                                                priority === p ? "bg-electric-yellow/10 border-electric-yellow text-white" : "bg-black border-zinc-800 text-zinc-500 hover:border-zinc-700"
                                            )}
                                        >
                                            <div className="flex items-center justify-between">
                                                {p}
                                                {priority === p && <Zap className="w-3 h-3 text-electric-yellow" />}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={() => goToStep("contact")}
                                className="w-full bg-zinc-100 text-black font-bold uppercase tracking-widest py-4 hover:bg-white transition-all underline decoration-electric-yellow decoration-2 underline-offset-4"
                            >
                                Continue to Intelligence
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Step 3: Contact */}
                {step === "contact" && (
                    <motion.div
                        key="contact" initial="initial" animate="animate" exit="exit" variants={stepVariants}
                        className="bg-zinc-900/50 border border-zinc-800 p-8"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl text-white font-mono uppercase tracking-widest flex items-center gap-2">
                                <ClipboardCheck className="w-5 h-5 text-electric-yellow" />
                                Intelligence
                            </h3>
                            <button onClick={() => goToStep("diagnostics")} className="text-[10px] text-zinc-600 uppercase tracking-widest flex items-center gap-1">
                                <ArrowLeft className="w-3 h-3" /> Back
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono">Full Name</label>
                                <input
                                    required value={fullName} onChange={(e) => setFullName(e.target.value)}
                                    className="w-full bg-black border border-zinc-800 p-3 text-white focus:border-electric-yellow focus:outline-none font-mono text-sm rounded-none"
                                    placeholder="J. DOE"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono">Phone</label>
                                    <input
                                        required value={phone} onChange={(e) => setPhone(e.target.value)}
                                        className="w-full bg-black border border-zinc-800 p-3 text-white focus:border-electric-yellow focus:outline-none font-mono text-sm rounded-none"
                                        placeholder="000-000-0000"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono">Email</label>
                                    <input
                                        required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-black border border-zinc-800 p-3 text-white focus:border-electric-yellow focus:outline-none font-mono text-sm rounded-none"
                                        placeholder="EXEC@AXIS.COM"
                                    />
                                </div>
                            </div>

                            {result?.message && !result.success && (
                                <p className="text-red-500 text-[10px] font-mono uppercase text-center mt-2">{result.message}</p>
                            )}

                            <button
                                type="submit"
                                disabled={isPending}
                                className="w-full bg-electric-yellow text-black font-bold uppercase tracking-widest py-4 mt-4 hover:bg-yellow-400 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 rounded-none shadow-[0_4px_14px_0_rgba(250,204,21,0.39)]"
                            >
                                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Initiate Protocol"}
                                {!isPending && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <p className="text-center text-[8px] text-zinc-700 uppercase tracking-[0.2em] mt-8 font-mono">
                Axis OS // Secure Line // No PHI Storage
            </p>
        </div>
    );
}
