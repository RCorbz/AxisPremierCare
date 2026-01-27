"use client";

import { useState, useRef, useEffect } from "react";
import { submitLead, getAvailabilityStatus } from "@/app/actions/leads";
import { cn } from "@/lib/utils";
import { Loader2, ArrowRight, CheckCircle, MapPin, Building2, AlertTriangle, Activity, Zap, ClipboardCheck, ArrowLeft, Users, Briefcase, Key, Timer, Sparkles, ShieldCheck, Info, UserCheck, BarChart3, Terminal } from "lucide-react";
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
    const [availability, setAvailability] = useState<Record<string, any> | null>(null);
    const [isPending, setIsPending] = useState(false);
    const [result, setResult] = useState<{ success: boolean; message?: string; errors?: any } | null>(null);

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

    const chatEndRef = useRef<HTMLDivElement>(null);
    const nameRef = useRef<HTMLInputElement>(null);
    const codeRef = useRef<HTMLInputElement>(null);
    const zipRef = useRef<HTMLInputElement>(null);

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

            await addConciergeMessage("Initiating Axis OS Concierge Protocol...");
            await addConciergeMessage("Welcome. I am your Digital Concierge. I will guide you through the Membership Registry in less than 60 seconds.");
            await addConciergeMessage("To begin, please identify your mission profile:");
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
            await addConciergeMessage(<>Analyzing sector bandwidth for <strong>Private Experience</strong>...</>);
            await addConciergeMessage("Understood. How can Axis optimize your performance profile?");
            setStep("objective");
        } else {
            setStep("corp_triage");
            await addConciergeMessage("Corporate Service portal active. Please establish relationship context:");
        }
    };

    const selectCorpTriage = async (m: "corporate_new" | "corporate_employee") => {
        const label = m === "corporate_new" ? "New Partnership Inquiry" : "Employee Access";
        addUserMessage(label);
        setMode(m);

        if (m === "corporate_new") {
            await addConciergeMessage("Initializing Partnership Qualification. Please identify your relationship scale:");
            setStep("corp_qualify");
        } else {
            await addConciergeMessage("Acknowledged. Secure access required.");
            await addConciergeMessage("Please confirm your corporate access code below:");
            setStep("corp_verify");
        }
    };

    const verifyAccessCode = async (e: React.FormEvent) => {
        e.preventDefault();
        const code = accessCode.trim().toUpperCase();

        if (code === "AXIS2026") {
            setVerifiedEntity("Axis Premier Partner");
            addUserMessage(`CODE VERIFIED: ${code}`);
            await addConciergeMessage(
                <div className="flex items-center gap-2 text-emerald-500">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Welcome home, member of <strong>Axis Premier Partner</strong>.</span>
                </div>
            );
            await addConciergeMessage("Just a few quick questions before we get you scheduled. What is your primary focus?");
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
        addUserMessage(`Scale: ${h} Employees`);
        await addConciergeMessage("Scale logged. What is your primary partnership objective?");
        setStep("objective"); // Re-using objective for corp too
    };

    const selectObjective = async (opt: string) => {
        setObjective(opt);
        addUserMessage(opt);
        await addConciergeMessage("Objective locked. What outcome do you desire from your initial protocol session?");
        setStep("outcome");
    };

    const selectOutcome = async (opt: string) => {
        setOutcome(opt);
        addUserMessage(opt);
        await addConciergeMessage("Desired outcome identified. We now need to verify logistics.");
        await addConciergeMessage("Please provide the Zip Code for your deployment sector:");
        setStep("location");
    };

    const verifyLocation = async (e: React.FormEvent) => {
        e.preventDefault();
        const cleanZip = zipCode.trim();
        addUserMessage(`Sector: ${cleanZip}`);

        let outOfRangeLocal = false;
        if (mode === "private") {
            const whitelist = availability?.private?.whitelist || ["84010"];
            outOfRangeLocal = !whitelist.includes(cleanZip);
        } else {
            outOfRangeLocal = !/^(840|841|843|844)/.test(cleanZip);
        }
        setIsOutOfRange(outOfRangeLocal);

        await addConciergeMessage("Logistic verification complete.");
        if (outOfRangeLocal) {
            await addConciergeMessage(
                <div className="flex items-center gap-2 text-yellow-500">
                    <AlertTriangle className="w-4 h-4" />
                    <span>External Sector detected. Extended logistics review required.</span>
                </div>
            );
        }
        await addConciergeMessage("Registry finalizing. Please provide secure contact intelligence:");
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

        let notes = `Outcome: ${outcome} | Out of Range: ${isOutOfRange}`;
        if (mode === "corporate_new") notes += ` | Headcount: ${headcount}`;
        if (mode === "corporate_employee") notes += ` | Entity: ${verifiedEntity}`;

        formData.append("activity_impacted", objective);
        formData.append("notes", notes);
        formData.append("lead_type", mode?.startsWith("corporate") ? "Corporate_New" : "Private");

        try {
            const response = await submitLead(formData);
            setResult(response);
            if (response.success) {
                addUserMessage(`${fullName} | ${phone}`);
                await addConciergeMessage("Protocol Initiated. Secure connection established.");
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
            <div className="p-4 border-b border-zinc-900 bg-zinc-950/50 flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-electric-yellow animate-pulse shadow-[0_0_8px_rgba(250,204,21,0.5)]" />
                    <span className="text-[10px] text-white font-mono tracking-[0.3em] uppercase">Axis OS // Concierge v1.0</span>
                </div>
                <div className="flex items-center gap-2">
                    <Timer className="w-3 h-3 text-zinc-600" />
                    <span className="text-[8px] text-zinc-600 font-mono uppercase tracking-widest">Est. 60s To Completion</span>
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
                                {msg.type === "concierge" ? "Digital Concierge" : "Member Identity"} {"//"} {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
                                <Zap className="w-4 h-4" /> Partnership
                            </button>
                            <button onClick={() => selectCorpTriage("corporate_employee")} className="p-4 border border-emerald-500/30 hover:border-emerald-500 text-zinc-400 hover:text-white font-mono text-[10px] uppercase tracking-widest flex flex-col items-center gap-2 transition-all">
                                <Key className="w-4 h-4" /> Employee
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
                            {[
                                "Performance Optimization",
                                "Acute Recovery",
                                "Chronic Maintenance",
                                "Executive Strategy"
                            ].map(opt => (
                                <button key={opt} onClick={() => selectObjective(opt)} className="p-3 border border-zinc-800 hover:border-electric-yellow text-zinc-400 hover:text-white font-mono text-[10px] uppercase tracking-widest text-left transition-all">
                                    {opt}
                                </button>
                            ))}
                        </motion.div>
                    )}

                    {/* Outcome Buttons */}
                    {step === "outcome" && !isTyping && (
                        <motion.div key="outcome-inputs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 gap-2">
                            {[
                                "Treatment Session",
                                "Specialized Consult",
                                "Bespoke Roadmap",
                                "Readiness Scan"
                            ].map(opt => (
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
                            <button disabled={zipCode.length < 5} className="w-full bg-zinc-100 text-black font-bold uppercase tracking-widest py-4 text-[10px] disabled:opacity-50">
                                Validate Sector
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
                                className="w-full bg-black border border-zinc-800 p-3 text-white font-mono text-xs focus:border-electric-yellow focus:outline-none"
                                placeholder="FULL NAME"
                            />
                            <input
                                required
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full bg-black border border-zinc-800 p-3 text-white font-mono text-xs focus:border-electric-yellow focus:outline-none"
                                placeholder="SECURE PHONE (SMS)"
                            />
                            <button disabled={isPending || !fullName || !phone} className="w-full bg-electric-yellow text-black font-bold uppercase tracking-widest py-4 text-[10px] shadow-[0_10px_30px_rgba(250,204,21,0.3)]">
                                {isPending ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Initiate Protocol"}
                            </button>
                        </motion.form>
                    )}

                    {/* Success Message UI refinement if needed or keep existing */}
                    {step === "success" && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center p-4">
                            <div className="flex items-center justify-center gap-2 text-electric-yellow font-mono text-[10px] uppercase tracking-widest">
                                <ShieldCheck className="w-4 h-4" /> Registry Locked
                            </div>
                            <button onClick={() => window.location.reload()} className="mt-4 text-[8px] text-zinc-600 underline font-mono uppercase tracking-widest">
                                Restart Terminal
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Terminal Footer */}
            <div className="p-3 bg-zinc-950 border-t border-zinc-900 flex justify-between items-center z-10">
                <div className="flex items-center gap-2">
                    <Terminal className="w-3 h-3 text-zinc-800" />
                    <span className="text-[6px] text-zinc-800 font-mono uppercase tracking-[0.3em]">Axis Command & Control // Secure Shell</span>
                </div>
                <div className="text-[6px] text-zinc-800 font-mono uppercase tracking-widest">
                    {"AES-256 BIT ENCRYPTION"}
                </div>
            </div>
        </div>
    );
}
