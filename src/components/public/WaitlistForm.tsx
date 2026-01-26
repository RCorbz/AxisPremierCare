"use client";

import { useState } from "react";
import { submitLead } from "@/app/actions/leads";
import { cn } from "@/lib/utils";
import { Loader2, ArrowRight, CheckCircle, MapPin, Building2, AlertTriangle } from "lucide-react";

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

type Step = "location" | "intake" | "success";

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

    // Validate Location
    function handleLocationCheck(e: React.FormEvent) {
        e.preventDefault();
        setLocationError(null);

        if (useCorpCode) {
            if (CORPORATE_CODES.includes(corpCode.trim())) {
                setStep("intake");
            } else {
                setLocationError("Invalid Corporate Access Code.");
            }
        } else {
            if (ALLOWED_ZIPS.includes(zipCode.trim())) {
                setStep("intake");
            } else {
                // Out of Area Logic
                // We don't block, we just warn.
                setOutOfAreaConfirmed(true);
            }
        }
    }

    function handleOutOfAreaProceed() {
        setStep("intake");
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        console.log("Client: Form submission started");
        setIsPending(true);
        setResult(null);

        const formData = new FormData(e.currentTarget);

        // Append location data manually
        formData.append("zip_code", zipCode);
        if (useCorpCode) formData.append("corporate_code", corpCode);
        if (outOfAreaConfirmed) formData.append("notes", "[WARN] User accepted Out-of-Area travel fees.");

        console.log("Client: Sending data to server action...");

        try {
            const response = await submitLead(formData);
            console.log("Client: Server response received", response);
            setResult(response);
            if (response.success) {
                setStep("success");
            }
        } catch (err: any) {
            console.error("Client: Submission catch triggered", err);
            setResult({
                success: false,
                message: `Connection Error: ${err.message || "The server failed to respond. Check your internet or try again."}`
            });
        } finally {
            setIsPending(false);
            console.log("Client: Submission flow finished");
        }
    }

    if (step === "success") {
        return (
            <div className="bg-zinc-900 border border-zinc-800 p-8 md:p-12 text-center animate-in fade-in zoom-in duration-500">
                <div className="w-16 h-16 bg-electric-yellow/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-8 h-8 text-electric-yellow" />
                </div>
                <h3 className="text-2xl text-white font-mono uppercase tracking-widest mb-4">Request Received</h3>
                <p className="text-zinc-400 font-mono">
                    You have been added to the priority queue. <br />
                    We will contact you shortly to deploy.
                </p>
                <button
                    onClick={() => { setStep("location"); setResult(null); setZipCode(""); setCorpCode(""); }}
                    className="mt-8 text-xs underline text-zinc-600 hover:text-white uppercase tracking-widest"
                >
                    Start New Request
                </button>
            </div>
        );
    }

    if (outOfAreaConfirmed && step === "location") {
        return (
            <div className="bg-zinc-900 border border-yellow-500/30 p-8 md:p-12 text-center animate-in fade-in zoom-in duration-500 max-w-xl mx-auto">
                <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertTriangle className="w-8 h-8 text-yellow-500" />
                </div>
                <h3 className="text-xl text-white font-mono uppercase tracking-widest mb-4">Out of Standard Range</h3>
                <p className="text-zinc-400 font-mono mb-6 text-sm">
                    Your location ({zipCode}) is outside our primary deployment sector. <br /><br />
                    We can still review your request, but service may be subject to availability and additional travel fees.
                </p>

                <div className="grid gap-3">
                    <button
                        onClick={handleOutOfAreaProceed}
                        className="w-full bg-electric-yellow text-black font-bold uppercase tracking-widest py-3 hover:bg-yellow-400 transition-all"
                    >
                        Proceed to Review
                    </button>
                    <button
                        onClick={() => { setOutOfAreaConfirmed(false); setZipCode(""); }}
                        className="w-full bg-transparent border border-zinc-700 text-zinc-400 font-bold uppercase tracking-widest py-3 hover:bg-zinc-800 transition-all"
                    >
                        Re-Enter Location
                    </button>
                </div>
            </div>
        );
    }

    if (step === "location") {
        return (
            <div className="max-w-xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
                <div className="bg-zinc-900/50 border border-zinc-800 p-8">
                    <h3 className="text-xl text-white font-mono uppercase tracking-widest mb-6 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-electric-yellow" />
                        Verify Your Location
                    </h3>

                    <form onSubmit={handleLocationCheck} className="space-y-6">
                        {!useCorpCode ? (
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-zinc-500 font-mono">
                                    Zip Code
                                </label>
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
                                <label className="text-xs uppercase tracking-widest text-zinc-500 font-mono">
                                    Corporate Access Code
                                </label>
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
                            <p className="text-red-500 text-xs font-mono uppercase">{locationError}</p>
                        )}

                        <button
                            type="submit"
                            disabled={!useCorpCode ? zipCode.length < 5 : corpCode.length < 3}
                            className="w-full bg-zinc-100 text-black font-bold uppercase tracking-widest py-4 hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Check Availability
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-zinc-800 text-center">
                        <button
                            onClick={() => { setUseCorpCode(!useCorpCode); setLocationError(null); }}
                            className="text-xs text-zinc-500 hover:text-electric-yellow uppercase tracking-widest transition-colors flex items-center justify-center gap-2 mx-auto"
                        >
                            {!useCorpCode ? (
                                <>
                                    <Building2 className="w-4 h-4" />
                                    I have a Corporate Access Code
                                </>
                            ) : (
                                <>
                                    <MapPin className="w-4 h-4" />
                                    Check by Zip Code
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto animate-in slide-in-from-right-8 duration-500">
            {/* Context Header */}
            <div className="flex items-center justify-between mb-8 border-b border-zinc-800 pb-4">
                <div className="flex items-center gap-2 text-electric-yellow">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-xs uppercase tracking-widest font-mono">
                        {useCorpCode ? "Corporate Access Verified" : `Checking Access for ${zipCode}`}
                    </span>
                </div>
                <button
                    type="button"
                    onClick={() => setStep("location")}
                    className="text-[10px] text-zinc-600 hover:text-white uppercase tracking-widest underline"
                >
                    Change
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label htmlFor="full_name" className="text-xs uppercase tracking-widest text-zinc-500 font-mono">
                        Full Name
                    </label>
                    <input
                        id="full_name"
                        name="full_name"
                        type="text"
                        required
                        className="w-full bg-black border border-zinc-800 p-4 text-white focus:border-electric-yellow focus:outline-none transition-colors rounded-none font-mono"
                        placeholder="J. DOE"
                    />
                    {result?.errors?.full_name && (
                        <p className="text-red-500 text-[10px] uppercase font-mono mt-1">{result.errors.full_name[0]}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <label htmlFor="phone" className="text-xs uppercase tracking-widest text-zinc-500 font-mono">
                        Phone
                    </label>
                    <input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        className="w-full bg-black border border-zinc-800 p-4 text-white focus:border-electric-yellow focus:outline-none transition-colors rounded-none font-mono"
                        placeholder="(555) 000-0000"
                    />
                    {result?.errors?.phone && (
                        <p className="text-red-500 text-[10px] uppercase font-mono mt-1">{result.errors.phone[0]}</p>
                    )}
                </div>
            </div>

            <div className="space-y-2">
                <label htmlFor="email" className="text-xs uppercase tracking-widest text-zinc-500 font-mono">
                    Email Address
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="w-full bg-black border border-zinc-800 p-4 text-white focus:border-electric-yellow focus:outline-none transition-colors rounded-none font-mono"
                    placeholder="EXEC@EXAMPLE.COM"
                />
                {result?.errors?.email && (
                    <p className="text-red-500 text-[10px] uppercase font-mono mt-1">{result.errors.email[0]}</p>
                )}
            </div>

            <div className="space-y-2">
                <label htmlFor="interest_level" className="text-xs uppercase tracking-widest text-zinc-500 font-mono">
                    Urgency Level
                </label>
                <select
                    id="interest_level"
                    name="interest_level"
                    className="w-full bg-black border border-zinc-800 p-4 text-white focus:border-electric-yellow focus:outline-none transition-colors rounded-none font-mono appearance-none h-[58px]" // Fixed height to match inputs
                >
                    <option value="Medium">Standard Appointment (24-48 Hours)</option>
                    <option value="High">Acute Pain / Priority (ASAP)</option>
                    <option value="Low">Performance Maintenance (Weekly)</option>
                </select>
            </div>

            {result?.message && !result.success && (
                <div className="bg-red-500/10 border border-red-500/20 p-4 text-red-500 text-xs font-mono uppercase tracking-wide">
                    {result.message}
                </div>
            )}

            <button
                type="submit"
                disabled={isPending}
                className={cn(
                    "w-full bg-electric-yellow text-black font-bold uppercase tracking-widest py-4 hover:bg-yellow-400 transition-all flex items-center justify-center gap-2 group",
                    isPending && "opacity-70 cursor-wait"
                )}
            >
                {isPending ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Submitting Request...
                    </>
                ) : (
                    <>
                        Submit Application
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                )}
            </button>

            <p className="text-center text-zinc-600 text-[10px] uppercase tracking-widest mt-4">
                Secure & Confidential // HIPAA Compliant
            </p>
        </form>
    );
}
