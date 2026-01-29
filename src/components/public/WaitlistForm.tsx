"use client";

/**
 * AXIS TONE GUARDRAIL:
 * - Brand: Industrial Luxury / High-End Concierge.
 * - Voice: Warm, Invitatory, Exclusive, Optimistic.
 * - BANNED: Military, Tactical, Command/Control, Protocol, Sector, Registry, Validate.
 * - PREFERRED: Journey, Selection, Curate, Unlock, Invitation, Pleasure, Welcome.
 */

import { useState, useRef, useEffect } from "react";
import { submitLead, getAvailabilityStatus } from "@/app/actions/leads";
import { env } from "@/env";
import { cn } from "@/lib/utils";
import { Loader2, ArrowRight, CheckCircle, MapPin, Building2, AlertTriangle, Activity, Sparkles, ClipboardCheck, ArrowLeft, Users, Briefcase, Crown, Timer, ShieldCheck, Info, UserCheck, BarChart3, Gem, Heart, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type MembershipMode = "private" | "corporate_new" | "corporate_employee" | null;
type Step = "identity" | "corp_triage" | "corp_verify" | "corp_qualify" | "objective" | "outcome" | "location" | "contact" | "success";

interface Message {
    id: string;
    type: "concierge" | "user";
    content: string | React.ReactNode;
    timestamp: Date;
}

export function WaitlistForm() {
    const [step, setStep] = useState<Step>("identity");
    const [mode, setMode] = useState<MembershipMode>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const [isLoadingAvailability, setIsLoadingAvailability] = useState(true);

    const goToStep = (target: Step) => setStep(target);

    // Logic States
    const [availability, setAvailability] = useState<Record<string, { whitelist?: string[];[key: string]: any }> | null>(null);
    const [isPending, setIsPending] = useState(false);
    const [result, setResult] = useState<{ success: boolean; message?: string; errors?: Record<string, string[]> } | null>(null);

    // Form Selections
    const [objective, setObjective] = useState("");
    const [outcome, setOutcome] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [accessCode, setAccessCode] = useState("");
    const [headcount, setHeadcount] = useState("");
    const [verifiedEntity, setVerifiedEntity] = useState<string | null>(null);
    const [isOutOfRange, setIsOutOfRange] = useState(false);

    // Progress Logic
    const progressMap: Record<Step, number> = {
        identity: 10,
        corp_triage: 25,
        corp_verify: 30,
        corp_qualify: 30,
        objective: 50,
        outcome: 70,
        location: 85,
        contact: 95,
        success: 100
    };
    const currentProgress = progressMap[step];

    const chatEndRef = useRef<HTMLDivElement>(null);
    const codeRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    // Initial sequence
    useEffect(() => {
        const sequence = async () => {
            setIsLoadingAvailability(true);
            try {
                const data = await getAvailabilityStatus();
                setAvailability(data);
            } catch (err) {
                console.error("Availability load failed");
            } finally {
                setIsLoadingAvailability(false);
            }

            await addConciergeMessage("Welcome to Axis Premier Care. Your journey to exceptional well-being begins here.");
            await addConciergeMessage("I am your personal Concierge. I will prepare your exclusive membership profile in less than 60 seconds.");
            await addConciergeMessage("To provide you with the most curated experience, how may we best serve you today?");
        };
        sequence();
    }, []);

    const addConciergeMessage = async (content: string | React.ReactNode, delay = 1000) => {
        setIsTyping(true);
        await new Promise(r => setTimeout(r, delay));
        setIsTyping(false);
        setMessages(prev => [...prev, {
            id: Math.random().toString(),
            type: "concierge",
            content,
            timestamp: new Date()
        }]);
    };

    const addUserMessage = (content: string) => {
        setMessages(prev => [...prev, {
            id: Math.random().toString(),
            type: "user",
            content,
            timestamp: new Date()
        }]);
    };

    // --- Step Logic ---
    const selectIdentity = async (id: "private" | "corp_triage") => {
        const label = id === "private" ? "Private Member" : "Corporate Client";
        addUserMessage(label);

        if (id === "private") {
            setMode("private");
            await addConciergeMessage(<>Preparing our premium availability for <strong>Private Access</strong>...</>);
            await addConciergeMessage("Wonderful. How can Axis optimize your performance and well-being?");
            setStep("objective");
        } else {
            setStep("corp_triage");
            await addConciergeMessage("Welcome. It is a pleasure to serve our corporate partners. Please share your current needs:");
        }
    };

    const selectCorpTriage = async (m: "corporate_new" | "corporate_employee") => {
        const label = m === "corporate_new" ? "New Partnership Inquiry" : "Exclusive Member Access";
        addUserMessage(label);
        setMode(m);

        if (m === "corporate_new") {
            await addConciergeMessage("We are delighted you are considering a partnership. To tailor our proposal, what is your organization's scale?");
            setStep("corp_qualify");
        } else {
            await addConciergeMessage("We had a feeling you were part of the club. Exclusive access awaits.");
            await addConciergeMessage("Please enter your corporate access code to unlock your personalized benefits:");
            setStep("corp_verify");
        }
    };

    const verifyAccessCode = async (e: React.FormEvent) => {
        e.preventDefault();
        const code = accessCode.trim().toUpperCase();

        if (code === "AXIS2026") {
            setVerifiedEntity("Axis Premier Partner");
            addUserMessage(`MEMBERSHIP UNLOCKED: ${code}`);
            await addConciergeMessage(
                <div className="flex items-center gap-2 text-emerald-500 font-mono">
                    <Crown className="w-4 h-4" />
                    <span>Welcome home, member of <strong>Axis Premier Partner</strong>.</span>
                </div>
            );
            await addConciergeMessage("Thanks for helping us zero in on your specific needs. What is your primary focus for today's session?");
            setStep("objective");
            setResult(null);
        } else {
            setAccessCode(""); // Auto-reset for better UX
            setResult({
                success: false,
                message: "We couldn't confirm that code. Please try again or contact Axis Concierge directly for priority assistance."
            });
        }
    };

    const selectHeadcount = async (h: string) => {
        setHeadcount(h);
        addUserMessage(`${h} Visionaries`);
        await addConciergeMessage("Thank you. What is your primary goal for this partnership?");
        setStep("objective");
    };

    const selectObjective = async (opt: string) => {
        setObjective(opt);
        addUserMessage(opt);
        await addConciergeMessage("Perfect choice. What specific outcome can we help you achieve during your first visit?");
        setStep("outcome");
    };

    const selectOutcome = async (opt: string) => {
        setOutcome(opt);
        addUserMessage(opt);
        await addConciergeMessage("Excellent. To ensure we have everything ready for your arrival, please tell us where you are located.");
        await addConciergeMessage("Your Zip Code allows us to curate the best experience for your neighborhood:");
        setStep("location");
    };

    const verifyLocation = async (e: React.FormEvent) => {
        e.preventDefault();
        const cleanZip = zipCode.trim();
        addUserMessage(`${cleanZip}`);

        let outOfRangeLocal = false;
        if (mode === "private") {
            const whitelist = availability?.private?.whitelist || ["84010"];
            outOfRangeLocal = !whitelist.includes(cleanZip);
        } else {
            outOfRangeLocal = !/^(840|841|843|844)/.test(cleanZip);
        }
        setIsOutOfRange(outOfRangeLocal);

        await addConciergeMessage("Wonderful. We've verified your location.");
        if (outOfRangeLocal) {
            await addConciergeMessage(
                <div className="flex items-center gap-2 text-yellow-500 font-mono">
                    <Info className="w-4 h-4" />
                    <span>You are just outside our primary service area, but we would love to review your application for a bespoke arrangement.</span>
                </div>
            );
        }
        await addConciergeMessage("Lastly, we simply need a name and number to finalize your invitation:");
        setStep("contact");
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsPending(true);
        setResult(null);

        const formData = new FormData();
        formData.append("full_name", fullName);
        formData.append("phone", phone);
        formData.append("zip_code", zipCode);
        formData.append("email", "");
        formData.append("venture_id", env.NEXT_PUBLIC_VENTURE_ID || "");

        let notes = `Outcome: ${outcome} | Out of Range: ${isOutOfRange}`;
        if (mode === "corporate_new") {
            notes += ` | Headcount: ${headcount}`;
            formData.append("corporate_objective", objective);
        }
        if (mode === "corporate_employee") notes += ` | Entity: ${verifiedEntity}`;

        formData.append("activity_impacted", objective);
        formData.append("notes", notes);
        formData.append("lead_type", mode?.startsWith("corporate") ? "Corporate_New" : "Private");

        try {
            const response = await submitLead(formData);
            setResult(response);
            if (response.success) {
                addUserMessage(`${fullName} | ${phone}`);
                await addConciergeMessage("Your luxury experience is being curated. Our concierge will be in touch with you shortly.");
                goToStep("success");
            }
        } catch (err: unknown) {
            setResult({ success: false, message: "System Error: Connection severed." });
        } finally {
            setIsPending(false);
        }
    }


    return (
        <div className="max-w-2xl mx-auto h-[700px] flex flex-col bg-black border border-zinc-900 shadow-2xl relative overflow-hidden">
            {/* Header / Progress */}
            <div className="p-5 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-xl flex flex-col gap-4 z-10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-electric-yellow shadow-[0_0_12px_rgba(250,204,21,0.8)]" />
                        <span className="text-[11px] text-zinc-100 font-mono tracking-[0.4em] uppercase font-bold text-shadow-glow">Axis // Private Selection</span>
                    </div>
                    <div className="flex items-center gap-2 opacity-50">
                        <Sparkles className="w-3 h-3 text-electric-yellow" />
                        <span className="text-[9px] text-zinc-400 font-mono uppercase tracking-widest">
                            {step === "success" ? "Invitation Prepared" : "Exclusive 60s Onboarding"}
                        </span>
                    </div>
                </div>

                {/* Prominent Progress Bar */}
                <div className="space-y-2">
                    <div className="flex justify-between items-end px-0.5">
                        <span className="text-[8px] text-zinc-400 font-mono uppercase tracking-[0.2em] font-medium italic">
                            {step === "success" ? "Selection Finalized" : `Curating Journey // ${step.replace('_', ' ')}`}
                        </span>
                        <span className="text-xs text-electric-yellow font-mono font-bold">{currentProgress}%</span>
                    </div>
                    <div className="h-2 w-full bg-zinc-900/50 rounded-full overflow-hidden border border-white/5">
                        <motion.div
                            className="h-full bg-gradient-to-r from-electric-yellow/80 to-electric-yellow shadow-[0_0_15px_rgba(250,204,21,0.5)]"
                            initial={{ width: "10%" }}
                            animate={{ width: `${currentProgress}%` }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        />
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                <AnimatePresence>
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={cn(
                                "flex flex-col max-w-[85%]",
                                msg.type === "user" ? "ml-auto items-end" : "items-start"
                            )}
                        >
                            <div className={cn(
                                "p-4 font-mono text-xs leading-relaxed",
                                msg.type === "user"
                                    ? "bg-electric-yellow text-black uppercase font-bold"
                                    : "bg-zinc-900/50 text-zinc-300 border border-zinc-900"
                            )}>
                                {msg.content}
                            </div>
                            <span className="text-[7px] text-zinc-700 mt-1 uppercase tracking-widest">
                                {msg.type === "concierge" ? "Your Concierge" : "Your Selection"} {"//"} {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </motion.div>
                    ))}
                    {isTyping && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-1 p-2">
                            <div className="w-1 h-1 bg-zinc-700 rounded-full animate-bounce" />
                            <div className="w-1 h-1 bg-zinc-700 rounded-full animate-bounce [animation-delay:0.2s]" />
                            <div className="w-1 h-1 bg-zinc-700 rounded-full animate-bounce [animation-delay:0.4s]" />
                        </motion.div>
                    )}
                </AnimatePresence>
                <div ref={chatEndRef} />
            </div>

            {/* Input Overlay / Step Actions */}
            <div className="p-6 bg-zinc-950/80 border-t border-zinc-900 backdrop-blur-md">
                <AnimatePresence mode="wait">
                    {/* Identity Buttons */}
                    {step === "identity" && !isTyping && (
                        <motion.div key="identity-inputs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-2 gap-3">
                            <button onClick={() => selectIdentity("private")} className="p-4 border border-zinc-800 hover:border-electric-yellow text-zinc-400 hover:text-white font-mono text-[10px] uppercase tracking-widest flex flex-col items-center gap-2 transition-all">
                                <Users className="w-4 h-4" /> Private
                            </button>
                            <button onClick={() => selectIdentity("corp_triage")} className="p-4 border border-zinc-800 hover:border-electric-yellow text-zinc-400 hover:text-white font-mono text-[10px] uppercase tracking-widest flex flex-col items-center gap-2 transition-all">
                                <Building2 className="w-4 h-4" /> Corporate
                            </button>
                        </motion.div>
                    )}

                    {/* Corp Triage Buttons */}
                    {step === "corp_triage" && !isTyping && (
                        <motion.div key="corp-triage-inputs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-2 gap-3">
                            <button onClick={() => selectCorpTriage("corporate_new")} className="p-4 border border-zinc-800 hover:border-electric-yellow text-zinc-400 hover:text-white font-mono text-[10px] uppercase tracking-widest flex flex-col items-center gap-2 transition-all">
                                <Gem className="w-4 h-4" /> Partnership
                            </button>
                            <button onClick={() => selectCorpTriage("corporate_employee")} className="p-4 border border-emerald-500/30 hover:border-emerald-500 text-zinc-400 hover:text-white font-mono text-[10px] uppercase tracking-widest flex flex-col items-center gap-2 transition-all">
                                <Crown className="w-4 h-4" /> Member
                            </button>
                        </motion.div>
                    )}

                    {/* Corp Verify Input */}
                    {step === "corp_verify" && !isTyping && (
                        <motion.form key="corp-verify-form" onSubmit={verifyAccessCode} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                            <input
                                ref={codeRef}
                                required
                                value={accessCode}
                                onChange={(e) => setAccessCode(e.target.value)}
                                className="w-full bg-black border border-zinc-800 p-4 text-white font-mono text-center text-lg focus:border-emerald-500 focus:outline-none transition-colors"
                                placeholder="CONFIRM ACCESS CODE"
                            />
                            {result?.message && !result.success && (
                                <div className="p-4 bg-yellow-500/5 border border-yellow-500/10 text-center space-y-2 animate-in fade-in zoom-in-95">
                                    <p className="text-yellow-500 text-[8px] font-mono uppercase tracking-widest leading-relaxed">
                                        {result.message}
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => window.location.href = 'mailto:concierge@axispremiercare.com'}
                                        className="text-[7px] text-zinc-600 underline hover:text-white font-mono uppercase tracking-[0.2em]"
                                    >
                                        Contact Axis Support
                                    </button>
                                </div>
                            )}
                            <button className="w-full bg-emerald-500 text-black font-bold uppercase tracking-widest py-4 text-[10px] shadow-[0_10px_30px_-10px_rgba(16,185,129,0.3)]">
                                Confirm Access Code
                            </button>
                        </motion.form>
                    )}

                    {/* Corp Qualify Buttons */}
                    {step === "corp_qualify" && !isTyping && (
                        <motion.div key="corp-qualify-inputs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-3 gap-2">
                            {["< 10", "10-50", "50+"].map(h => (
                                <button key={h} onClick={() => selectHeadcount(h)} className="p-3 border border-zinc-800 hover:border-electric-yellow text-zinc-400 hover:text-white font-mono text-[10px] uppercase tracking-widest transition-all">
                                    {h}
                                </button>
                            ))}
                        </motion.div>
                    )}

                    {/* Objective Buttons */}
                    {step === "objective" && !isTyping && (
                        <motion.div key="objective-inputs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 gap-2">
                            {(mode === "corporate_new" ? [
                                "Employee Wellness Program",
                                "Executive Health Suite",
                                "On-Site Recovery Lab",
                                "Performance Workshop"
                            ] : [
                                "Performance Optimization",
                                "Acute Recovery",
                                "Chronic Maintenance",
                                "Executive Strategy"
                            ]).map(opt => (
                                <button key={opt} onClick={() => selectObjective(opt)} className="p-3 border border-zinc-800 hover:border-electric-yellow text-zinc-400 hover:text-white font-mono text-[10px] uppercase tracking-widest text-left transition-all">
                                    {opt}
                                </button>
                            ))}
                        </motion.div>
                    )}

                    {/* Outcome Buttons */}
                    {step === "outcome" && !isTyping && (
                        <motion.div key="outcome-inputs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 gap-2">
                            {(mode === "corporate_new" ? [
                                "Implementation Proposal",
                                "On-Site Tour",
                                "Discovery Workshop",
                                "Scalability Review"
                            ] : [
                                "Treatment Session",
                                "Specialized Consult",
                                "Bespoke Roadmap",
                                "Readiness Scan"
                            ]).map(opt => (
                                <button key={opt} onClick={() => selectOutcome(opt)} className="p-3 border border-zinc-800 hover:border-electric-yellow text-zinc-400 hover:text-white font-mono text-[10px] uppercase tracking-widest text-left transition-all">
                                    {opt}
                                </button>
                            ))}
                        </motion.div>
                    )}

                    {/* Location Input */}
                    {step === "location" && !isTyping && (
                        <motion.form key="location-form" onSubmit={verifyLocation} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                            <input
                                autoFocus
                                required
                                value={zipCode}
                                onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                                className="w-full bg-black border border-zinc-800 p-4 text-white font-mono text-center text-2xl tracking-[0.3em] focus:border-electric-yellow focus:outline-none"
                                placeholder="84..."
                            />
                            <button disabled={zipCode.length < 5} className="w-full bg-white text-black font-bold uppercase tracking-widest py-4 text-[10px] disabled:opacity-50 transition-all hover:bg-zinc-200">
                                Personalize My Location
                            </button>
                        </motion.form>
                    )}

                    {/* Contact Inputs */}
                    {step === "contact" && !isTyping && (
                        <motion.form key="contact-form" onSubmit={handleSubmit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                            <input
                                required
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full bg-zinc-900/50 border border-zinc-800 p-3 text-white font-mono text-xs focus:border-electric-yellow focus:outline-none placeholder:text-zinc-600"
                                placeholder="YOUR FULL NAME"
                            />
                            <input
                                required
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full bg-zinc-900/50 border border-zinc-800 p-3 text-white font-mono text-xs focus:border-electric-yellow focus:outline-none placeholder:text-zinc-600"
                                placeholder="SECURE PHONE NUMBER"
                            />
                            <button disabled={isPending || !fullName || !phone} className="w-full bg-electric-yellow text-black font-bold uppercase tracking-widest py-4 text-[10px] shadow-[0_10px_40px_rgba(250,204,21,0.4)] transition-all hover:scale-[1.02]">
                                {isPending ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Request Member Invitation"}
                            </button>
                        </motion.form>
                    )}

                    {/* Success Message UI refinement if needed or keep existing */}
                    {step === "success" && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center p-6 space-y-4">
                            <div className="flex flex-col items-center gap-3 text-electric-yellow font-mono text-xs uppercase tracking-[0.3em] font-bold">
                                <Sparkles className="w-6 h-6 animate-pulse" />
                                <span>Experience Reserved</span>
                            </div>
                            <p className="text-zinc-500 font-mono text-[9px] uppercase tracking-widest leading-relaxed">
                                Our bespoke team has been notified of your interest. <br /> Expect a personalized connection shortly.
                            </p>
                            <button onClick={() => window.location.reload()} className="mt-8 text-[8px] text-zinc-700 underline font-mono uppercase tracking-widest hover:text-white transition-colors">
                                Reset Experience
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Terminal Footer */}
            <div className="p-4 bg-zinc-950/90 border-t border-zinc-900 flex justify-between items-center z-10">
                <div className="flex items-center gap-2">
                    <Crown className="w-3 h-3 text-zinc-800" />
                    <span className="text-[7px] text-zinc-800 font-mono uppercase tracking-[0.4em]">Axis // Private Member Concierge</span>
                </div>
                <div className="text-[7px] text-zinc-800 font-mono uppercase tracking-widest font-medium">
                    {"Exclusive Membership Selection Active"}
                </div>
            </div>
        </div>
    );
}
