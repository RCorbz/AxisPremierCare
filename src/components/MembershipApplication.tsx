import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CONTENT } from "../content";
import { ChevronRight, CheckCircle2, Activity, ShieldCheck, KeyRound } from "lucide-react";

export default function MembershipApplication() {
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState({ name: "", goal: "", accessCode: "" });
    const [isCorporate, setIsCorporate] = useState(false);

    const steps = CONTENT.application.steps;

    // Mock Database of Access Codes
    const CORPORATE_CODES: Record<string, string> = {
        "DELTA": "https://axisperformance.janeapp.com/#/staff_member/1/treatment/100", // Example Corp URL
        "VIP": "https://axisperformance.janeapp.com/#/staff_member/1/treatment/101"
    };

    const handleAccessCode = () => {
        if (formData.accessCode && CORPORATE_CODES[formData.accessCode.toUpperCase()]) {
            setIsCorporate(true);
        }
        setStep(1); // Move to Identity
    };

    const nextStep = () => setStep((prev) => Math.min(prev + 1, steps.length - 1));

    // JaneApp Deep Links
    const PUBLIC_URLS = {
        pain: "https://axisperformance.janeapp.com/#/staff_member/1/treatment/1",
        maintenance: "https://axisperformance.janeapp.com/#/staff_member/1/treatment/2"
    };

    const handleFinalSubmit = () => {
        let targetUrl;

        if (isCorporate && formData.accessCode) {
            // If corporate, route to their specific landing page
            targetUrl = CORPORATE_CODES[formData.accessCode.toUpperCase()];
        } else {
            // If public, route based on objective
            targetUrl = formData.goal === "pain" ? PUBLIC_URLS.pain : PUBLIC_URLS.maintenance;
        }

        window.location.href = targetUrl;
    };

    return (
        <section id="application" className="relative min-h-[600px] w-full bg-background-dark py-20 px-6 overflow-hidden">
            {/* Grid Background */}
            <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none"></div>

            <div className="relative mx-auto max-w-2xl">
                {/* Progress Bar */}
                <div className="mb-12 flex items-center justify-between">
                    {steps.map((s, idx) => (
                        <div key={idx} className="flex flex-col items-center gap-2">
                            <div className={`h-1 w-16 md:w-24 rounded-full transition-all duration-300 ${idx <= step ? "bg-primary shadow-[0_0_10px_rgba(204,255,0,0.5)]" : "bg-surface-border"}`}></div>
                            <span className={`text-[8px] md:text-[10px] font-bold uppercase tracking-widest ${idx <= step ? "text-primary" : "text-text-muted/30"}`}>
                                {s.label}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Wizard Card */}
                <div className={`relative overflow-hidden rounded-xl border border-surface-border bg-surface-dark p-8 md:p-12 shadow-2xl transition-all duration-500 ${isCorporate ? "border-primary shadow-[0_0_50px_rgba(204,255,0,0.2)]" : ""}`}>
                    <AnimatePresence mode="wait">

                        {/* STEP 0: ACCESS CODE */}
                        {step === 0 && (
                            <motion.div
                                key="step0"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <h2 className="text-4xl font-bold uppercase tracking-tighter text-white">{steps[0].title}</h2>
                                <p className="text-text-muted">{steps[0].desc}</p>
                                <div className="relative">
                                    <KeyRound className="absolute left-0 top-4 text-primary" />
                                    <input
                                        type="text"
                                        placeholder={steps[0].placeholder}
                                        className="w-full border-b-2 border-surface-border bg-transparent py-4 pl-10 text-2xl text-white outline-none focus:border-primary transition-all placeholder:text-surface-border uppercase tracking-widest"
                                        onChange={(e) => setFormData({ ...formData, accessCode: e.target.value })}
                                        value={formData.accessCode}
                                    />
                                </div>
                                <button
                                    onClick={handleAccessCode}
                                    className="group mt-8 flex w-full items-center justify-between rounded-sm bg-white px-6 py-4 text-black font-bold uppercase tracking-wider hover:bg-primary transition-colors"
                                >
                                    {formData.accessCode ? "Verify Code // Deploy" : "Skip // Continue Public"}
                                    <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </motion.div>
                        )}

                        {/* STEP 1: IDENTITY */}
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div className="flex justify-between items-start">
                                    <h2 className="text-4xl font-bold uppercase tracking-tighter text-white">{steps[1].title}</h2>
                                    {isCorporate && <span className="text-xs font-bold text-black bg-primary px-2 py-1 rounded">CORP: AUTHORIZED</span>}
                                </div>

                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder={steps[1].placeholder}
                                        className="w-full border-b-2 border-surface-border bg-transparent py-4 text-2xl text-white outline-none focus:border-primary transition-all placeholder:text-surface-border"
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        value={formData.name}
                                    />
                                </div>
                                <button
                                    onClick={nextStep}
                                    disabled={!formData.name}
                                    className="group mt-8 flex w-full items-center justify-between rounded-sm bg-white px-6 py-4 text-black font-bold uppercase tracking-wider hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {steps[1].button}
                                    <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </motion.div>
                        )}

                        {/* STEP 2: OBJECTIVE */}
                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <h2 className="text-4xl font-bold uppercase tracking-tighter text-white">{steps[2].title}</h2>
                                <div className="grid gap-4">
                                    {steps[2].options?.map((opt) => (
                                        <button
                                            key={opt.id}
                                            onClick={() => setFormData({ ...formData, goal: opt.id })}
                                            className={`flex items-center gap-4 border-2 p-6 text-left transition-all ${formData.goal === opt.id ? "border-primary bg-primary/10" : "border-surface-border hover:border-text-muted"} rounded-sm`}
                                        >
                                            <div className={`p-3 rounded-full ${formData.goal === opt.id ? "bg-primary text-black" : "bg-surface-border text-text-muted"}`}>
                                                {opt.id === 'pain' ? <Activity size={24} /> : <ShieldCheck size={24} />}
                                            </div>
                                            <div>
                                                <div className="text-lg font-bold text-white uppercase">{opt.label}</div>
                                                <div className="text-sm text-text-muted">{opt.desc}</div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={nextStep}
                                    disabled={!formData.goal}
                                    className="group mt-8 flex w-full items-center justify-between rounded-sm bg-white px-6 py-4 text-black font-bold uppercase tracking-wider hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {steps[2].button}
                                    <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </motion.div>
                        )}

                        {/* STEP 3: CLEARANCE (HANDOFF) */}
                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8 text-center"
                            >
                                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/20 text-primary">
                                    <CheckCircle2 size={40} />
                                </div>
                                <h2 className="text-4xl font-bold uppercase tracking-tighter text-white">{steps[3].title}</h2>
                                <p className="text-xl text-text-muted leading-relaxed">
                                    {steps[3].desc}
                                </p>

                                {isCorporate && (
                                    <div className="mt-4 p-4 border border-primary/50 bg-primary/10 rounded">
                                        <p className="text-primary font-bold">CORPORATE PROTOCOL ACTIVATED</p>
                                        <p className="text-sm text-text-muted">Subsidized rates applied.</p>
                                    </div>
                                )}

                                <div className="rounded-lg bg-surface-border/30 p-4 text-sm text-primary font-mono border border-primary/20 mt-4">
                                // SYSTEM NOTE: Redirecting to {isCorporate ? "Corporate" : "Standard"} Booking Channel...
                                </div>
                                <button
                                    onClick={handleFinalSubmit}
                                    className="group w-full rounded-sm bg-primary px-6 py-6 text-xl text-black font-black uppercase tracking-widest shadow-[0_0_30px_rgba(204,255,0,0.3)] hover:bg-white hover:text-black hover:shadow-white/20 transition-all mt-6"
                                >
                                    {steps[3].button}
                                </button>
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}
