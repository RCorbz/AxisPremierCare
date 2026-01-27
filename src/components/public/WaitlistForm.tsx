"use client";

import { useState, useRef, useEffect } from "react";
import { submitLead, getAvailabilityStatus } from "@/app/actions/leads";
import { cn } from "@/lib/utils";
import { Loader2, ArrowRight, CheckCircle, MapPin, Building2, AlertTriangle, Activity, Zap, ClipboardCheck, ArrowLeft, Users, Briefcase, Key, Timer, Sparkles, ShieldCheck, Info, UserCheck, BarChart3 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type MembershipMode = "private" | "corporate_new" | "corporate_employee" | null;
type Step = "identity" | "corp_triage" | "corp_verify" | "corp_qualify" | "objective" | "outcome" | "location" | "contact" | "success";

const STEPS: Step[] = ["identity", "corp_triage", "corp_verify", "corp_qualify", "objective", "outcome", "location", "contact"];

export function WaitlistForm() {
    const [step, setStep] = useState<Step>("identity");
    const [mode, setMode] = useState<MembershipMode>(null);
    const [isPending, setIsPending] = useState(false);
    const [result, setResult] = useState<{ success: boolean; message?: string; errors?: any } | null>(null);

    // Availability Data
    const [availability, setAvailability] = useState<any>(null);
    const [isLoadingAvailability, setIsLoadingAvailability] = useState(true);

    // Form Selections
    const [objective, setObjective] = useState("");
    const [outcome, setOutcome] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [accessCode, setAccessCode] = useState("");
    const [headcount, setHeadcount] = useState("");

    // Welcome Banner Data
    const [verifiedEntity, setVerifiedEntity] = useState<string | null>(null);

    // State for "Other" inputs
    const [otherObjective, setOtherObjective] = useState("");
    const [otherOutcome, setOtherOutcome] = useState("");
    const [showOtherObjective, setShowOtherObjective] = useState(false);
    const [showOtherOutcome, setShowOtherOutcome] = useState(false);

    const [isOutOfRange, setIsOutOfRange] = useState(false);

    const nameRef = useRef<HTMLInputElement>(null);
    const codeRef = useRef<HTMLInputElement>(null);

    const currentStepIndex = STEPS.indexOf(step);
    const progress = ((currentStepIndex + 1) / STEPS.length) * 100;

    const goToStep = (target: Step) => setStep(target);

    // Fetch availability on mount
    useEffect(() => {
        async function fetchAvailability() {
            try {
                const data = await getAvailabilityStatus();
                setAvailability(data);
            } catch (err) {
                console.error("Failed to load availability");
            } finally {
                setIsLoadingAvailability(false);
            }
        }
        fetchAvailability();
    }, []);

    // Focus tracking
    useEffect(() => {
        if (step === "contact") nameRef.current?.focus();
        if (step === "corp_verify") codeRef.current?.focus();
    }, [step]);

    // Code Verification Logic (Mock for now, can be wired to doc_settings)
    function handleVerifyCode(e: React.FormEvent) {
        e.preventDefault();
        const code = accessCode.trim().toUpperCase();

        // Example codes: AXIS2026, VIP_MEMBER
        if (code === "AXIS2026") {
            setVerifiedEntity("Axis Premier Partner");
            goToStep("objective");
        } else {
            setResult({ success: false, message: "Invalid Access Code. Please contact your HR or Concierge." });
        }
    }

    // Location Intelligence
    function handleLocationCheck(e: React.FormEvent) {
        e.preventDefault();
        const cleanZip = zipCode.trim();

        if (mode === "private") {
            const whitelist = availability?.private?.whitelist || ["84010"];
            setIsOutOfRange(!whitelist.includes(cleanZip));
        } else {
            // Corporate Radius Check (Prefix Heatmap: 840, 841, 843, 844)
            setIsOutOfRange(!/^(840|841|843|844)/.test(cleanZip));
        }
        goToStep("contact");
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsPending(true);
        setResult(null);

        const formData = new FormData();
        formData.append("full_name", fullName);
        formData.append("phone", phone);
        formData.append("zip_code", zipCode);
        formData.append("email", ""); // Low Friction

        const finalObjective = showOtherObjective ? `Other: ${otherObjective}` : objective;
        const finalOutcome = showOtherOutcome ? `Other: ${otherOutcome}` : outcome;

        let notes = `Outcome: ${finalOutcome} | Out of Range: ${isOutOfRange}`;
        if (mode === "corporate_new") notes += ` | Headcount: ${headcount}`;
        if (mode === "corporate_employee") notes += ` | Entity: ${verifiedEntity}`;

        formData.append("activity_impacted", finalObjective);
        formData.append("notes", notes);
        formData.append("lead_type", mode?.startsWith("corporate") ? "Corporate_New" : "Private");

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

    const variants = {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 }
    };

    if (step === "success") {
        return (
            <motion.div initial="initial" animate="animate" variants={variants} className="bg-zinc-900 border border-zinc-800 p-12 text-center max-w-xl mx-auto shadow-2xl">
                <div className="w-16 h-16 bg-electric-yellow/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-8 h-8 text-electric-yellow" />
                </div>
                <h3 className="text-2xl text-white font-mono uppercase tracking-[0.2em] mb-4">Protocol Initiated</h3>
                <p className="text-zinc-400 font-mono text-[10px] uppercase leading-relaxed max-w-sm mx-auto tracking-widest">
                    {mode === "private" && availability?.private?.available === false
                        ? "Limited capacity reached. You have been placed on priority waitlist."
                        : "Application received. Our concierge will contact you within 24 hours."}
                </p>
                <button onClick={() => window.location.reload()} className="mt-8 text-[10px] underline text-zinc-600 hover:text-white uppercase tracking-widest font-mono">
                    Reset Protocol
                </button>
            </motion.div>
        );
    }

    return (
        <div className="max-w-xl mx-auto px-4 md:px-0">
            {/* 60-Second Membership Progress */}
            <div className="mb-12 space-y-4">
                <div className="flex justify-between items-end mb-2">
                    <div className="flex items-center gap-2">
                        <Timer className="w-4 h-4 text-electric-yellow animate-pulse" />
                        <span className="text-[10px] text-white uppercase tracking-[0.2em] font-mono">
                            Protocol Status: <span className="text-electric-yellow">{step === "identity" ? "Ready" : "In Progress"}</span>
                        </span>
                    </div>
                </div>
                <div className="h-[2px] w-full bg-zinc-900">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-electric-yellow shadow-[0_0_10px_rgba(250,204,21,0.5)]"
                    />
                </div>
            </div>

            {/* Welcome Banner for Verified Employees */}
            <AnimatePresence>
                {verifiedEntity && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        className="mb-8 border border-emerald-500/30 bg-emerald-500/5 p-4 flex items-center justify-between"
                    >
                        <div className="flex items-center gap-3">
                            <ShieldCheck className="w-5 h-5 text-emerald-500" />
                            <div>
                                <h4 className="text-white font-mono text-[10px] uppercase tracking-widest">Authenticated Access</h4>
                                <p className="text-zinc-500 text-[8px] uppercase tracking-widest">Welcome, employee of {verifiedEntity}</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
                {/* Step 1: Identity */}
                {step === "identity" && (
                    <motion.div key="identity" initial="initial" animate="animate" exit="exit" variants={variants} className="space-y-6">
                        <div className="mb-10">
                            <h2 className="text-3xl text-white font-mono uppercase tracking-[0.2em] mb-2">Identify Entity</h2>
                            <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest">Select your protocol entry point</p>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            {[
                                {
                                    id: "private",
                                    label: "Private Member",
                                    icon: Users,
                                    desc: "Individual Performance Concierge",
                                    action: () => { setMode("private"); goToStep("objective"); }
                                },
                                {
                                    id: "corp_triage",
                                    label: "Corporate Client",
                                    icon: Building2,
                                    desc: "Partnerships & Employee Benefits",
                                    action: () => goToStep("corp_triage")
                                }
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    onClick={item.action}
                                    className="group relative bg-zinc-900 border border-zinc-800 p-8 text-left hover:border-electric-yellow transition-all flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-6">
                                        <item.icon className="w-8 h-8 text-zinc-600 group-hover:text-electric-yellow" />
                                        <div>
                                            <h4 className="text-white font-mono uppercase tracking-widest text-lg">{item.label}</h4>
                                            <p className="text-zinc-600 text-[10px] uppercase tracking-widest mt-1">{item.desc}</p>
                                        </div>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-zinc-800 group-hover:text-electric-yellow" />
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Step Corp: Triage */}
                {step === "corp_triage" && (
                    <motion.div key="corp_triage" initial="initial" animate="animate" exit="exit" variants={variants} className="space-y-6">
                        <div className="mb-10 text-center">
                            <h2 className="text-2xl text-white font-mono uppercase tracking-[0.2em] mb-2">Corporate Portal</h2>
                            <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest">Establish relationship context</p>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            <button
                                onClick={() => { setMode("corporate_new"); goToStep("corp_qualify"); }}
                                className="p-8 bg-zinc-900 border border-zinc-800 hover:border-electric-yellow text-left group"
                            >
                                <Zap className="w-6 h-6 text-zinc-600 group-hover:text-electric-yellow mb-4" />
                                <h4 className="text-white font-mono uppercase tracking-widest text-sm">New Partnership Inquiry</h4>
                                <p className="text-zinc-600 text-[10px] uppercase tracking-widest mt-2">Explore clinical support for your team</p>
                            </button>
                            <button
                                onClick={() => { setMode("corporate_employee"); goToStep("corp_verify"); }}
                                className="p-8 bg-zinc-900 border border-zinc-800 hover:border-emerald-500 text-left group"
                            >
                                <Key className="w-6 h-6 text-zinc-600 group-hover:text-emerald-500 mb-4" />
                                <h4 className="text-white font-mono uppercase tracking-widest text-sm">Employee Access</h4>
                                <p className="text-zinc-600 text-[10px] uppercase tracking-widest mt-2">Verify membership via corporate code</p>
                            </button>
                        </div>
                        <button onClick={() => goToStep("identity")} className="text-[10px] text-zinc-600 uppercase tracking-widest flex items-center gap-2 hover:text-white mt-4 mx-auto">
                            <ArrowLeft className="w-3 h-3" /> Back
                        </button>
                    </motion.div>
                )}

                {/* Step Corp: Verify Code */}
                {step === "corp_verify" && (
                    <motion.div key="corp_verify" initial="initial" animate="animate" exit="exit" variants={variants} className="space-y-6">
                        <div className="mb-10">
                            <h2 className="text-2xl text-white font-mono uppercase tracking-[0.2em] mb-2">Verify Access</h2>
                            <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest">Input your unique corporate membership code</p>
                        </div>
                        <form onSubmit={handleVerifyCode} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono">Access Code</label>
                                <input
                                    ref={codeRef}
                                    required
                                    value={accessCode}
                                    onChange={(e) => setAccessCode(e.target.value)}
                                    className="w-full bg-black border border-zinc-800 p-5 text-white focus:border-emerald-500 focus:outline-none font-mono text-center text-xl tracking-[0.3em] uppercase"
                                    placeholder="••••••••"
                                />
                            </div>
                            {result?.message && (
                                <p className="text-yellow-500 text-[9px] font-mono uppercase text-center">{result.message}</p>
                            )}
                            <button className="w-full bg-emerald-500 text-black font-bold uppercase tracking-widest py-5 hover:bg-emerald-400 transition-all">
                                Authenticate
                            </button>
                        </form>
                        <button onClick={() => goToStep("corp_triage")} className="text-[10px] text-zinc-600 uppercase tracking-widest flex items-center gap-2 hover:text-white mt-4">
                            <ArrowLeft className="w-3 h-3" /> Back
                        </button>
                    </motion.div>
                )}

                {/* Step Corp: Qualify Partnership */}
                {step === "corp_qualify" && (
                    <motion.div key="corp_qualify" initial="initial" animate="animate" exit="exit" variants={variants} className="space-y-6">
                        <div className="mb-10">
                            <h2 className="text-2xl text-white font-mono uppercase tracking-[0.2em] mb-2">Qualify Partnership</h2>
                            <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest">Identify relationship scale and primary goal</p>
                        </div>
                        <div className="space-y-8">
                            <div className="space-y-3">
                                <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono flex items-center gap-2">
                                    <BarChart3 className="w-3 h-3" /> Estimated Headcount
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {["< 10", "10-50", "50+"].map(h => (
                                        <button
                                            key={h}
                                            onClick={() => setHeadcount(h)}
                                            className={cn(
                                                "p-3 border font-mono text-[10px] uppercase tracking-widest transition-all",
                                                headcount === h ? "bg-electric-yellow border-electric-yellow text-black" : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700"
                                            )}
                                        >
                                            {h}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono">Primary Partnership Goal</label>
                                <div className="grid grid-cols-1 gap-2">
                                    {[
                                        "Onsite Clinical Performance Demos",
                                        "Executive Health & Vitality Strategy",
                                        "Team Injury Recovery (Acute Support)",
                                        "General Employee Benefit Plan"
                                    ].map(g => (
                                        <button
                                            key={g}
                                            onClick={() => { setObjective(g); goToStep("outcome"); }}
                                            className="p-4 bg-zinc-900 border border-zinc-800 hover:border-electric-yellow text-left text-zinc-400 hover:text-white font-mono text-[10px] uppercase tracking-widest"
                                        >
                                            {g}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <button onClick={() => goToStep("corp_triage")} className="text-[10px] text-zinc-600 uppercase tracking-widest flex items-center gap-2 hover:text-white mt-4">
                            <ArrowLeft className="w-3 h-3" /> Back
                        </button>
                    </motion.div>
                )}

                {/* Step 2: Objective (Modified for "Just a few quick questions") */}
                {step === "objective" && (
                    <motion.div key="objective" initial="initial" animate="animate" exit="exit" variants={variants} className="space-y-6">
                        <div className="mb-10">
                            {verifiedEntity && (
                                <div className="mb-4 inline-block bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 font-mono text-[8px] uppercase tracking-widest text-emerald-500">
                                    Verified Member Access Active
                                </div>
                            )}
                            <h2 className="text-3xl text-white font-mono uppercase tracking-[0.2em] mb-2">
                                {verifiedEntity ? "Quick Triage" : "Primary Focus"}
                            </h2>
                            <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest">
                                {verifiedEntity ? "Just a few quick questions before we get you scheduled" : "How can we optimize your performance?"}
                            </p>
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
                        </div>
                        <button onClick={() => goToStep(verifiedEntity ? "corp_verify" : "identity")} className="text-[10px] text-zinc-600 uppercase tracking-widest flex items-center gap-2 hover:text-white mt-4">
                            <ArrowLeft className="w-3 h-3" /> Back
                        </button>
                    </motion.div>
                )}

                {/* Step 3: Outcome (as before) */}
                {step === "outcome" && (
                    <motion.div key="outcome" initial="initial" animate="animate" exit="exit" variants={variants} className="space-y-6">
                        <div className="mb-10">
                            <h2 className="text-3xl text-white font-mono uppercase tracking-[0.2em] mb-2">Expected Result</h2>
                            <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest">What outcome do you desire from your initial protocol session?</p>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                            {[
                                "Immediate Clinical Treatment",
                                "Specialized Consultation",
                                "Long-term Performance Strategy",
                                "Protocol Readiness Scan"
                            ].map((opt) => (
                                <button
                                    key={opt}
                                    onClick={() => { setOutcome(opt); setShowOtherOutcome(false); goToStep("location"); }}
                                    className="p-5 border border-zinc-800 bg-zinc-900/50 text-left hover:border-electric-yellow text-zinc-400 hover:text-white font-mono text-xs uppercase tracking-widest transition-all"
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                        <button onClick={() => goToStep("objective")} className="text-[10px] text-zinc-600 uppercase tracking-widest flex items-center gap-2 hover:text-white mt-4">
                            <ArrowLeft className="w-3 h-3" /> Back
                        </button>
                    </motion.div>
                )}

                {/* Step 4: Location (as before) */}
                {step === "location" && (
                    <motion.div key="location" initial="initial" animate="animate" exit="exit" variants={variants} className="space-y-6">
                        <div className="mb-10 text-center">
                            <MapPin className="w-8 h-8 text-electric-yellow mx-auto mb-4" />
                            <h2 className="text-2xl text-white font-mono uppercase tracking-[0.2em] mb-2">Deployment Sector</h2>
                            <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest">Verify clinical coverage area</p>
                        </div>
                        <form onSubmit={handleLocationCheck} className="space-y-6">
                            <input
                                required
                                value={zipCode}
                                onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                                className="w-full bg-black border border-zinc-800 p-6 text-white focus:border-electric-yellow focus:outline-none font-mono text-4xl text-center tracking-[0.5em]"
                                placeholder="84..."
                            />
                            <button disabled={zipCode.length < 5} className="w-full bg-zinc-100 text-black font-bold uppercase tracking-widest py-5 hover:bg-white disabled:opacity-50 transition-all">
                                Validate Logistics
                            </button>
                        </form>
                    </motion.div>
                )}

                {/* Step 5: Contact Intelligence */}
                {step === "contact" && (
                    <motion.div key="contact" initial="initial" animate="animate" exit="exit" variants={variants} className="space-y-6">
                        <div className="mb-10">
                            <h2 className="text-3xl text-white font-mono uppercase tracking-[0.2em] mb-2 flex items-center gap-3">
                                <ClipboardCheck className="w-6 h-6 text-electric-yellow" /> Finalize Registry
                            </h2>
                            <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest">Provide secure contact for protocol initiation</p>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono">Full Name</label>
                                <input
                                    ref={nameRef}
                                    required
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full bg-black border border-zinc-800 p-5 text-white focus:border-electric-yellow focus:outline-none font-mono text-sm"
                                    placeholder="J. DOE"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono">Secure Phone (SMS Priority)</label>
                                <input
                                    required
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full bg-black border border-zinc-800 p-5 text-white focus:border-electric-yellow focus:outline-none font-mono text-sm"
                                    placeholder="000-000-0000"
                                />
                            </div>

                            {isOutOfRange && (
                                <div className="p-4 border border-yellow-500/20 bg-yellow-500/5 text-[8px] text-yellow-500 font-mono uppercase tracking-widest flex items-center gap-3">
                                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                                    <span>Sector outside standard zone. Extended logistics review will be required.</span>
                                </div>
                            )}

                            <button
                                disabled={isPending || !fullName || !phone}
                                className="w-full bg-electric-yellow text-black font-bold uppercase tracking-widest py-6 mt-6 hover:bg-yellow-400 transition-all shadow-[0_15px_40px_-10px_rgba(250,204,21,0.5)]"
                            >
                                {isPending ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Initiate Concierge Protocol"}
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="mt-16 text-center">
                <p className="text-[7px] text-zinc-800 uppercase tracking-[0.5em] font-mono animate-pulse mb-2">
                    Axis OS // Deep Clinical Encryption Active
                </p>
            </div>
        </div>
    );
}
