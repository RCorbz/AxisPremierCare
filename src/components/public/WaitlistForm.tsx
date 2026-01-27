"use client";

import { useState } from "react";
import { submitLead } from "@/app/actions/leads";
import { cn } from "@/lib/utils";
import { Loader2, ArrowRight, CheckCircle, MapPin, Building2, AlertTriangle, Activity, Zap, ClipboardCheck, ArrowLeft, Users, Briefcase, Key } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Allowed Zip Codes for Private Membership
const ALLOWED_ZIPS = [
    "84010", "84011", "84014", "84054", "84087", "84025", "84037",
];

// Valid Corporate Codes (Mock)
const CORPORATE_CODES = ["AXIS-CORP-01", "VIP-ACCESS", "ELITE-2026"];

type MembershipMode = "private" | "corporate" | null;
type CorporateSubMode = "new_partnership" | "employee_access" | null;
type Step = "mode" | "corp_choice" | "location" | "diagnostics" | "corp_inquiry" | "corp_access" | "contact" | "success";

export function WaitlistForm() {
    const [step, setStep] = useState<Step>("mode");
    const [mode, setMode] = useState<MembershipMode>(null);
    const [corpSubMode, setCorpSubMode] = useState<CorporateSubMode>(null);
    const [isPending, setIsPending] = useState(false);
    const [result, setResult] = useState<{ success: boolean; message?: string; errors?: any } | null>(null);

    // Form State
    const [zipCode, setZipCode] = useState("");
    const [corpCode, setCorpCode] = useState("");
    const [outOfAreaConfirmed, setOutOfAreaConfirmed] = useState(false);
    const [corpObjective, setCorpObjective] = useState("");
    const [activityImpacted, setActivityImpacted] = useState("");
    const [priority, setPriority] = useState("General Inquiry");
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");

    // Error State
    const [accessError, setAccessError] = useState<string | null>(null);

    const goToStep = (target: Step) => setStep(target);

    // --- Logic ---

    function handleLocationCheck(e: React.FormEvent) {
        e.preventDefault();
        if (ALLOWED_ZIPS.includes(zipCode.trim())) {
            goToStep("diagnostics");
        } else {
            setOutOfAreaConfirmed(true);
        }
    }

    function handleCorpCodeCheck(e: React.FormEvent) {
        e.preventDefault();
        setAccessError(null);
        if (CORPORATE_CODES.includes(corpCode.trim().toUpperCase())) {
            goToStep("diagnostics");
        } else {
            setAccessError("Verification unsuccessful. Please re-verify your access code or contact our concierge immediately at (801) 555-0123 for priority assistance.");
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsPending(true);
        setResult(null);

        const formData = new FormData();
        formData.append("full_name", fullName);
        formData.append("phone", phone);
        formData.append("email", email);
        formData.append("zip_code", zipCode);

        // Lead Type Mapping
        let leadType = "Private";
        if (mode === "corporate") {
            leadType = corpSubMode === "new_partnership" ? "Corporate_New" : "Corporate_Employee";
        }
        formData.append("lead_type", leadType);

        if (mode === "corporate" && corpSubMode === "new_partnership") {
            formData.append("corporate_objective", corpObjective);
            formData.append("deployment_priority", "General Inquiry");
        } else {
            formData.append("activity_impacted", activityImpacted);
            formData.append("deployment_priority", priority);
            if (corpCode) formData.append("corporate_code", corpCode.toUpperCase());
        }

        try {
            const response = await submitLead(formData);
            setResult(response);
            if (response.success) goToStep("success");
        } catch (err: any) {
            setResult({ success: false, message: "Connection to secure server failed. Please attempt protocol again." });
        } finally {
            setIsPending(false);
        }
    }

    // --- Transitions ---
    const variants = {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 }
    };

    // --- Renders ---

    if (step === "success") {
        return (
            <motion.div initial="initial" animate="animate" variants={variants} className="bg-zinc-900 border border-zinc-800 p-12 text-center max-w-xl mx-auto shadow-2xl">
                <div className="w-16 h-16 bg-electric-yellow/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-8 h-8 text-electric-yellow" />
                </div>
                <h3 className="text-2xl text-white font-mono uppercase tracking-[0.2em] mb-4">Access Granted</h3>
                <p className="text-zinc-400 font-mono text-xs leading-relaxed max-w-sm mx-auto">
                    {result?.message || "Your membership inquiry has been received. Our executive concierge will reach out via your preferred channel."}
                </p>
                <button onClick={() => window.location.reload()} className="mt-8 text-[10px] underline text-zinc-600 hover:text-white uppercase tracking-widest font-mono">
                    Reset Application
                </button>
            </motion.div>
        );
    }

    return (
        <div className="max-w-xl mx-auto">
            <AnimatePresence mode="wait">
                {/* Step 0: Mode Selection */}
                {step === "mode" && (
                    <motion.div key="mode" initial="initial" animate="animate" exit="exit" variants={variants} className="space-y-6">
                        <div className="text-center mb-10">
                            <h3 className="text-2xl text-white font-mono uppercase tracking-[0.3em] mb-2">Membership Inquiry</h3>
                            <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest">Select your focus area for expedited service</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button onClick={() => { setMode("private"); goToStep("location"); }} className="group relative bg-zinc-900 border border-zinc-800 p-8 text-left hover:border-electric-yellow transition-all">
                                <Users className="w-6 h-6 text-zinc-500 group-hover:text-electric-yellow mb-4 transition-colors" />
                                <h4 className="text-white font-mono uppercase tracking-widest mb-2">Private Experience</h4>
                                <p className="text-zinc-600 text-[10px] uppercase tracking-widest leading-relaxed">Individual membership for elite performance and acute treatment.</p>
                            </button>
                            <button onClick={() => { setMode("corporate"); goToStep("corp_choice"); }} className="group relative bg-zinc-900 border border-zinc-800 p-8 text-left hover:border-electric-yellow transition-all">
                                <Briefcase className="w-6 h-6 text-zinc-500 group-hover:text-electric-yellow mb-4 transition-colors" />
                                <h4 className="text-white font-mono uppercase tracking-widest mb-2">Corporate Service</h4>
                                <p className="text-zinc-600 text-[10px] uppercase tracking-widest leading-relaxed">Enterprise clinical integration and onsite performance logistics.</p>
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Corporate Sub-Choice */}
                {step === "corp_choice" && (
                    <motion.div key="corp_choice" initial="initial" animate="animate" exit="exit" variants={variants} className="space-y-6">
                        <button onClick={() => goToStep("mode")} className="text-[10px] text-zinc-600 uppercase tracking-widest flex items-center gap-1 hover:text-white mb-4">
                            <ArrowLeft className="w-3 h-3" /> Back to Mode
                        </button>
                        <div className="grid grid-cols-1 gap-4">
                            <button onClick={() => { setCorpSubMode("employee_access"); goToStep("corp_access"); }} className="group bg-black/40 border border-zinc-800 p-6 text-left hover:border-electric-yellow transition-all flex items-center justify-between">
                                <div>
                                    <h4 className="text-white font-mono uppercase tracking-widest text-sm mb-1">Employee of Member</h4>
                                    <p className="text-zinc-600 text-[10px] uppercase tracking-widest">Access your corporate membership benefits.</p>
                                </div>
                                <Key className="w-5 h-5 text-zinc-600 group-hover:text-electric-yellow" />
                            </button>
                            <button onClick={() => { setCorpSubMode("new_partnership"); goToStep("corp_inquiry"); }} className="group bg-black/40 border border-zinc-800 p-6 text-left hover:border-electric-yellow transition-all flex items-center justify-between">
                                <div>
                                    <h4 className="text-white font-mono uppercase tracking-widest text-sm mb-1">New Partnership Inquiry</h4>
                                    <p className="text-zinc-600 text-[10px] uppercase tracking-widest">Request information on corporate clinical packages.</p>
                                </div>
                                <Building2 className="w-5 h-5 text-zinc-600 group-hover:text-electric-yellow" />
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Location (Private) */}
                {step === "location" && !outOfAreaConfirmed && (
                    <motion.div key="location" initial="initial" animate="animate" exit="exit" variants={variants} className="bg-zinc-900/50 border border-zinc-800 p-8">
                        <button onClick={() => goToStep("mode")} className="text-[10px] text-zinc-600 uppercase tracking-widest flex items-center gap-1 hover:text-white mb-6">
                            <ArrowLeft className="w-3 h-3" /> Back
                        </button>
                        <h3 className="text-xl text-white font-mono uppercase tracking-widest mb-6 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-electric-yellow" /> Coverage Zone
                        </h3>
                        <form onSubmit={handleLocationCheck} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-zinc-500 font-mono">Service Zip Code</label>
                                <input required value={zipCode} onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))} className="w-full bg-black border border-zinc-800 p-4 text-white focus:border-electric-yellow focus:outline-none font-mono text-lg" placeholder="84..." />
                            </div>
                            <button disabled={zipCode.length < 5} className="w-full bg-zinc-100 text-black font-bold uppercase tracking-widest py-4 hover:bg-white transition-all disabled:opacity-50">Validate Sector</button>
                        </form>
                    </motion.div>
                )}

                {/* Out of Area Warning */}
                {outOfAreaConfirmed && (
                    <motion.div key="out_area" initial="initial" animate="animate" exit="exit" variants={variants} className="bg-zinc-900 border border-yellow-500/30 p-8 text-center shadow-[0_0_50px_-12px_rgba(234,179,8,0.3)]">
                        <AlertTriangle className="w-8 h-8 text-yellow-500 mx-auto mb-4" />
                        <h3 className="text-lg text-white font-mono uppercase tracking-widest mb-3">Outside Standard Range</h3>
                        <p className="text-zinc-400 font-mono text-[10px] uppercase tracking-widest leading-relaxed mb-6">Sector {zipCode} is outside our rapid-response concierge zone. <br /> Deployment may require additional logistics. Proceed with review?</p>
                        <div className="grid gap-3">
                            <button onClick={() => { setOutOfAreaConfirmed(false); goToStep("diagnostics"); }} className="bg-electric-yellow text-black font-bold uppercase tracking-widest py-3 text-xs">Proceed to Diagnostics</button>
                            <button onClick={() => { setOutOfAreaConfirmed(false); setZipCode(""); }} className="border border-zinc-700 text-zinc-500 py-3 text-xs uppercase tracking-widest font-mono">Re-enter Zip</button>
                        </div>
                    </motion.div>
                )}

                {/* Corporate Employee Access */}
                {step === "corp_access" && (
                    <motion.div key="corp_access" initial="initial" animate="animate" exit="exit" variants={variants} className="bg-zinc-900/50 border border-zinc-800 p-8">
                        <button onClick={() => goToStep("corp_choice")} className="text-[10px] text-zinc-600 uppercase tracking-widest flex items-center gap-1 hover:text-white mb-6">
                            <ArrowLeft className="w-3 h-3" /> Back
                        </button>
                        <h3 className="text-xl text-white font-mono uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Key className="w-5 h-5 text-electric-yellow" /> Concierge Access
                        </h3>
                        <form onSubmit={handleCorpCodeCheck} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-zinc-500 font-mono">Verify Access Code</label>
                                <input required value={corpCode} onChange={(e) => setCorpCode(e.target.value)} className="w-full bg-black border border-zinc-800 p-4 text-white focus:border-electric-yellow focus:outline-none font-mono text-lg uppercase" placeholder="ENTER CODE" />
                            </div>
                            {accessError && <p className="text-yellow-500 text-[9px] font-mono uppercase leading-relaxed text-center py-2 border-y border-yellow-500/20">{accessError}</p>}
                            <button disabled={corpCode.length < 3} className="w-full bg-zinc-100 text-black font-bold uppercase tracking-widest py-4 hover:bg-white transition-all">Verify Membership</button>
                        </form>
                    </motion.div>
                )}

                {/* Diagnostics (Private & Corp Employee) */}
                {step === "diagnostics" && (
                    <motion.div key="diagnostics" initial="initial" animate="animate" exit="exit" variants={variants} className="bg-zinc-900/50 border border-zinc-800 p-8">
                        <button onClick={() => goToStep(mode === "private" ? "location" : "corp_access")} className="text-[10px] text-zinc-600 uppercase tracking-widest flex items-center gap-1 hover:text-white mb-6">
                            <ArrowLeft className="w-3 h-3" /> Back
                        </button>
                        <h3 className="text-xl text-white font-mono uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-electric-yellow" /> Performance Diagnostics
                        </h3>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-zinc-500 font-mono">Activity Impacted</label>
                                <input required value={activityImpacted} onChange={(e) => setActivityImpacted(e.target.value)} className="w-full bg-black border border-zinc-800 p-4 text-white focus:border-electric-yellow focus:outline-none font-mono text-sm" placeholder="e.g. Executive Focus, Golf, Athletic Performance" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-zinc-500 font-mono">Session Priority</label>
                                <div className="grid grid-cols-1 gap-2">
                                    {["ASAP", "This Week", "General Inquiry"].map((p) => (
                                        <button key={p} onClick={() => setPriority(p)} className={cn("p-4 border font-mono text-[10px] uppercase tracking-[0.2em] text-left transition-all", priority === p ? "bg-electric-yellow/10 border-electric-yellow text-white shadow-[0_0_20px_-5px_rgba(250,204,21,0.2)]" : "bg-black border-zinc-800 text-zinc-600 hover:border-zinc-700")}>
                                            <div className="flex items-center justify-between">{p === "ASAP" ? "Acute Treatment / ASAP" : p === "This Week" ? "Standard Session / This Week" : "Membership Information"} {priority === p && <Zap className="w-3 h-3 text-electric-yellow" />}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <button onClick={() => goToStep("contact")} className="w-full bg-zinc-100 text-black font-bold uppercase tracking-widest py-4 hover:bg-white transition-all underline decoration-electric-yellow decoration-2 underline-offset-4">Continue to Intelligence</button>
                        </div>
                    </motion.div>
                )}

                {/* Corporate Inquiry */}
                {step === "corp_inquiry" && (
                    <motion.div key="corp_inquiry" initial="initial" animate="animate" exit="exit" variants={variants} className="bg-zinc-900/50 border border-zinc-800 p-8">
                        <button onClick={() => goToStep("corp_choice")} className="text-[10px] text-zinc-600 uppercase tracking-widest flex items-center gap-1 hover:text-white mb-6">
                            <ArrowLeft className="w-3 h-3" /> Back
                        </button>
                        <h3 className="text-xl text-white font-mono uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Briefcase className="w-5 h-5 text-electric-yellow" /> Partnership Objective
                        </h3>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-zinc-500 font-mono">Inquiry Type</label>
                                <div className="grid grid-cols-1 gap-2">
                                    {[
                                        { id: "demo", label: "Request Onsite Performance Demo" },
                                        { id: "business", label: "Executive Strategy & Scheduling Call" },
                                        { id: "info", label: "General Benefit Information" }
                                    ].map((obj) => (
                                        <button key={obj.id} onClick={() => setCorpObjective(obj.label)} className={cn("p-4 border font-mono text-[10px] uppercase tracking-widest text-left transition-all", corpObjective === obj.label ? "bg-electric-yellow/10 border-electric-yellow text-white" : "bg-black border-zinc-800 text-zinc-600 hover:border-zinc-700")}>
                                            {obj.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <button disabled={!corpObjective} onClick={() => goToStep("contact")} className="w-full bg-zinc-100 text-black font-bold uppercase tracking-widest py-4 hover:bg-white transition-all disabled:opacity-50">Proceed to Contact</button>
                        </div>
                    </motion.div>
                )}

                {/* Final step: Intelligence */}
                {step === "contact" && (
                    <motion.div key="contact" initial="initial" animate="animate" exit="exit" variants={variants} className="bg-zinc-900/50 border border-zinc-800 p-8 shadow-2xl">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl text-white font-mono uppercase tracking-widest flex items-center gap-2">
                                <ClipboardCheck className="w-4 h-4 text-electric-yellow" /> Contact Intelligence
                            </h3>
                            <button onClick={() => goToStep(mode === "corporate" && corpSubMode === "new_partnership" ? "corp_inquiry" : "diagnostics")} className="text-[10px] text-zinc-600 uppercase tracking-widest flex items-center gap-1 hover:text-white">
                                <ArrowLeft className="w-3 h-3" /> Back
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono">Exclusive Contact Name</label>
                                <input required value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full bg-black border border-zinc-800 p-3 text-white focus:border-electric-yellow focus:outline-none font-mono text-sm" placeholder="J. DOE" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono">Secure Phone</label>
                                    <input required value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-black border border-zinc-800 p-3 text-white focus:border-electric-yellow focus:outline-none font-mono text-sm" placeholder="000-000-0000" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono">Focus Email</label>
                                    <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-black border border-zinc-800 p-3 text-white focus:border-electric-yellow focus:outline-none font-mono text-sm" placeholder="EXEC@AXIS.COM" />
                                </div>
                            </div>
                            {result?.message && !result.success && <p className="text-yellow-500 text-[9px] font-mono uppercase text-center border border-yellow-500/20 p-2 bg-yellow-500/5">{result.message}</p>}
                            <button disabled={isPending} className="w-full bg-electric-yellow text-black font-bold uppercase tracking-[0.2em] py-5 mt-6 hover:bg-yellow-400 transition-all flex items-center justify-center gap-3 group disabled:opacity-50 shadow-[0_10px_30px_-10px_rgba(250,204,21,0.5)]">
                                {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Initiate Concierge Protocol <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>}
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="mt-12 text-center text-[7px] text-zinc-800 uppercase tracking-[0.4em] font-mono animate-pulse">
                Axis OS // Membership Protocol Active // Secure-Line Intelligence
            </div>
        </div>
    );
}
