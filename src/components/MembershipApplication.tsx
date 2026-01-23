import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CONTENT } from "../content";
import { ChevronRight, CheckCircle2, Activity, ShieldCheck, KeyRound, MapPin, AlertCircle } from "lucide-react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function MembershipApplication() {
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState({ name: "", email: "", phone: "", zip: "", goal: "", accessCode: "", outOfArea: false });
    const [isCorporate, setIsCorporate] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const steps = CONTENT.application.steps;

    // Service Area Logic
    const SERVICE_ZIPS = ["84010", "84011", "84014", "84054", "84025"];

    // Mock Database of Access Codes
    const CORPORATE_CODES: Record<string, string> = {
        "DELTA": "https://axisperformance.janeapp.com/#/staff_member/1/treatment/100", // Example Corp URL
        "VIP": "https://axisperformance.janeapp.com/#/staff_member/1/treatment/101"
    };

    const handleAccessCode = () => {
        setError(""); // Clear previous errors

        // 1. If user enters NOTHING, they are skipping -> Proceed as Public -> Step 1 (Location)
        if (!formData.accessCode) {
            setIsCorporate(false);
            setStep(1);
            return;
        }

        // 2. If user enters SOMETHING, verify it.
        const code = formData.accessCode.toUpperCase().trim();
        if (CORPORATE_CODES[code]) {
            // Corporate Bypass: Skip Location (Step 1) -> Go to Profile (Step 2)
            setIsCorporate(true);
            setStep(2);
        } else {
            // Invalid Code -> Error
            setError("Please confirm you have entered the code correctly. Contact us immediately if the code you were given is unaccounted for.");
        }
    };

    const handleLocationVerify = () => {
        setError("");
        const zip = formData.zip.trim();

        if (SERVICE_ZIPS.includes(zip)) {
            // Success -> In Range -> Proceed to Profile
            setFormData({ ...formData, outOfArea: false });
            setStep(2);
        } else {
            // Out of Range -> Waitlist Logic
            // We allow them to proceed, but flag them as 'outOfArea'
            setFormData({ ...formData, outOfArea: true });

            // Optional: We could show a toast here, but for flow, we just move them along
            // and notify them at the end.
            setStep(2);
        }
    };

    const nextStep = () => setStep((prev) => Math.min(prev + 1, steps.length - 1));

    const handleFinalSubmit = async () => {
        try {
            // WAITLIST PROTOCOL:
            // Capture data to Firestore
            await addDoc(collection(db, "waitlist"), {
                ...formData,
                isCorporate,
                timestamp: serverTimestamp(),
                status: formData.outOfArea ? "review_needed" : "new" // Tag specifically for review
            });
            console.log("Waitlist Securely Stored");
        } catch (error) {
            console.error("Waitlist Capture Failed", error);
        }

        // Show success state
        setSuccess(true);
    };

    if (success) {
        // CONDITIONAL SUCCESS SCREEN
        if (formData.outOfArea) {
            return (
                <section id="application" className="relative min-h-[600px] w-full bg-background-dark py-20 px-6 overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none"></div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative max-w-2xl w-full rounded-xl border border-yellow-500/50 bg-surface-dark p-12 text-center shadow-[0_0_50px_rgba(255,200,0,0.1)]"
                    >
                        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-yellow-500/20 text-yellow-500">
                            <AlertCircle size={48} />
                        </div>
                        <h2 className="mb-4 text-4xl font-bold uppercase tracking-tighter text-white">EXPANSION REQUEST RECEIVED</h2>
                        <p className="mb-8 text-xl text-text-muted">
                            You are currently outside our primary deployment zone. <br />
                            We have added you to our Expansion Waitlist. A Specialist will review your location on a case-by-case basis and contact you if coverage is possible.
                        </p>
                        <div className="flex justify-center">
                            <div className="rounded bg-surface-dark/50 px-6 py-3 text-sm font-mono text-yellow-500 border border-yellow-500/20">
                                CASE ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
                            </div>
                        </div>
                    </motion.div>
                </section>
            );
        }

        // STANDARD SUCCESS SCREEN
        return (
            <section id="application" className="relative min-h-[600px] w-full bg-background-dark py-20 px-6 overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none"></div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative max-w-2xl w-full rounded-xl border border-primary/50 bg-surface-dark p-12 text-center shadow-[0_0_50px_rgba(204,255,0,0.1)]"
                >
                    <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary/20 text-primary">
                        <Activity size={48} />
                    </div>
                    <h2 className="mb-4 text-4xl font-bold uppercase tracking-tighter text-white">DEPLOYMENT INITIATED</h2>
                    <p className="mb-8 text-xl text-text-muted">
                        Your profile has been secured in the AXIS Waitlist Protocol. <br />
                        A Deployment Specialist will contact you shortly to coordinate your first mission.
                    </p>
                    <div className="flex justify-center">
                        <div className="rounded bg-surface-dark/50 px-6 py-3 text-sm font-mono text-primary border border-primary/20">
                            REF ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
                        </div>
                    </div>
                </motion.div>
            </section>
        );
    }

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

                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-red-900/20 border border-red-500/50 p-4 rounded text-red-200 text-sm font-mono flex items-center gap-2"
                                    >
                                        <ShieldCheck className="w-4 h-4 text-red-500" />
                                        {error}
                                    </motion.div>
                                )}

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

                        {/* STEP 1: LOCATION (Non-Corporate Only) */}
                        {step === 1 && (
                            <motion.div
                                key="stepLocation"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <h2 className="text-4xl font-bold uppercase tracking-tighter text-white">{steps[1].title}</h2>
                                <p className="text-text-muted">{steps[1].desc}</p>

                                <div className="relative">
                                    <MapPin className="absolute left-0 top-4 text-primary" />
                                    <input
                                        type="text"
                                        placeholder={steps[1].placeholder}
                                        className="w-full border-b-2 border-surface-border bg-transparent py-4 pl-10 text-2xl text-white outline-none focus:border-primary transition-all placeholder:text-surface-border uppercase tracking-widest"
                                        onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                                        value={formData.zip}
                                    />
                                </div>
                                <button
                                    onClick={handleLocationVerify}
                                    className="group mt-8 flex w-full items-center justify-between rounded-sm bg-white px-6 py-4 text-black font-bold uppercase tracking-wider hover:bg-primary transition-colors"
                                >
                                    {steps[1].button}
                                    <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </motion.div>
                        )}

                        {/* STEP 2: PROFILE */}
                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div className="flex justify-between items-start">
                                    <h2 className="text-4xl font-bold uppercase tracking-tighter text-white">{steps[2].title}</h2>
                                    {isCorporate && <span className="text-xs font-bold text-black bg-primary px-2 py-1 rounded">CORP: AUTHORIZED</span>}
                                </div>

                                <div className="space-y-6">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder={steps[2].placeholder}
                                            className="w-full border-b-2 border-surface-border bg-transparent py-4 text-2xl text-white outline-none focus:border-primary transition-all placeholder:text-surface-border"
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            value={formData.name}
                                        />
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="relative">
                                            <input
                                                type="email"
                                                placeholder={steps[2].placeholderEmail || "Email"}
                                                className="w-full border-b-2 border-surface-border bg-transparent py-4 text-lg text-white outline-none focus:border-primary transition-all placeholder:text-surface-border"
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                value={formData.email}
                                            />
                                        </div>
                                        <div className="relative">
                                            <input
                                                type="tel"
                                                placeholder={steps[2].placeholderPhone || "Phone"}
                                                className="w-full border-b-2 border-surface-border bg-transparent py-4 text-lg text-white outline-none focus:border-primary transition-all placeholder:text-surface-border"
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                value={formData.phone}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={nextStep}
                                    disabled={!formData.name || !formData.email || !formData.phone}
                                    className="group mt-8 flex w-full items-center justify-between rounded-sm bg-white px-6 py-4 text-black font-bold uppercase tracking-wider hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {steps[2].button}
                                    <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </motion.div>
                        )}

                        {/* STEP 3: OBJECTIVE */}
                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <h2 className="text-4xl font-bold uppercase tracking-tighter text-white">{steps[3].title}</h2>
                                <div className="grid gap-4">
                                    {steps[3].options?.map((opt) => (
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
                                    {steps[3].button}
                                    <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </motion.div>
                        )}

                        {/* STEP 4: CLEARANCE (HANDOFF) */}
                        {step === 4 && (
                            <motion.div
                                key="step4"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8 text-center"
                            >
                                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/20 text-primary">
                                    <CheckCircle2 size={40} />
                                </div>
                                <h2 className="text-4xl font-bold uppercase tracking-tighter text-white">{steps[4].title}</h2>
                                <p className="text-xl text-text-muted leading-relaxed">
                                    {steps[4].desc}
                                </p>

                                {isCorporate && (
                                    <div className="mt-4 p-4 border border-primary/50 bg-primary/10 rounded">
                                        <p className="text-primary font-bold">CORPORATE PROTOCOL ACTIVATED</p>
                                        <p className="text-sm text-text-muted">Subsidized rates applied.</p>
                                    </div>
                                )}


                                <button
                                    onClick={handleFinalSubmit}
                                    className="group w-full rounded-sm bg-primary px-6 py-6 text-xl text-black font-black uppercase tracking-widest shadow-[0_0_30px_rgba(204,255,0,0.3)] hover:bg-white hover:text-black hover:shadow-white/20 transition-all mt-6"
                                >
                                    DEPLOY TO WAITLIST
                                </button>
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}
