"use client";

import { useState } from "react";
import { submitLead } from "@/app/actions";
import { cn } from "@/lib/utils";
import { Loader2, ArrowRight, CheckCircle } from "lucide-react";

export function WaitlistForm() {
    const [isPending, setIsPending] = useState(false);
    const [result, setResult] = useState<{ success: boolean; message?: string; errors?: any } | null>(null);

    async function handleSubmit(formData: FormData) {
        setIsPending(true);
        setResult(null);

        // Add artificial delay for "processing" feel
        await new Promise(resolve => setTimeout(resolve, 800));

        const response = await submitLead(formData);
        setResult(response);
        setIsPending(false);
    }

    if (result?.success) {
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
            </div>
        );
    }

    return (
        <form action={handleSubmit} className="space-y-6 max-w-xl mx-auto">
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
                        <p className="text-red-500 text-xs">{result.errors.full_name[0]}</p>
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
                    <p className="text-red-500 text-xs">{result.errors.email[0]}</p>
                )}
            </div>

            <div className="space-y-2">
                <label htmlFor="interest_level" className="text-xs uppercase tracking-widest text-zinc-500 font-mono">
                    Urgency Level
                </label>
                <select
                    id="interest_level"
                    name="interest_level"
                    className="w-full bg-black border border-zinc-800 p-4 text-white focus:border-electric-yellow focus:outline-none transition-colors rounded-none font-mono appearance-none"
                >
                    <option value="Medium">Standard Deployment (24-48 Hours)</option>
                    <option value="High">Critical / Acute Pain (ASAP)</option>
                    <option value="Low">Performance Maintenance (Weekly)</option>
                </select>
                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                    {/* Custom caret could go here */}
                </div>
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
                        Initiating Protocol...
                    </>
                ) : (
                    <>
                        Request Access
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                )}
            </button>

            <p className="text-center text-zinc-600 text-[10px] uppercase tracking-widest mt-4">
                Secure Transmission // HIPAA Compliant Handshake
            </p>
        </form>
    );
}
