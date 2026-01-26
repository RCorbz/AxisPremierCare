"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ShieldCheck, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createClient();

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setIsLoading(false);
        } else {
            router.push("/admin");
            router.refresh();
        }
    }

    return (
        <div className="min-h-screen bg-carbon-black flex items-center justify-center p-6 selection:bg-electric-yellow selection:text-black">
            <div className="w-full max-w-sm space-y-8 animate-in fade-in zoom-in duration-500">
                <div className="text-center">
                    <div className="w-12 h-12 bg-electric-yellow mx-auto flex items-center justify-center rounded-none mb-4">
                        <ShieldCheck className="w-6 h-6 text-black" />
                    </div>
                    <h1 className="text-white font-mono uppercase tracking-widest text-2xl font-bold">
                        Axis OS // Login
                    </h1>
                    <p className="text-zinc-500 text-xs uppercase tracking-widest mt-2">
                        Restricted Access Level 4
                    </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs text-zinc-500 uppercase tracking-widest font-mono block mb-2">
                                Command ID (Email)
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-800 p-3 text-white focus:border-electric-yellow focus:outline-none rounded-none font-mono placeholder:text-zinc-700"
                                placeholder="DOC@AXIS.CARE"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-zinc-500 uppercase tracking-widest font-mono block mb-2">
                                Security Key (Password)
                            </label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-800 p-3 text-white focus:border-electric-yellow focus:outline-none rounded-none font-mono placeholder:text-zinc-700"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 p-3 text-red-500 text-xs font-mono uppercase tracking-wide text-center">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={cn(
                            "w-full bg-electric-yellow text-black font-bold uppercase tracking-widest py-3 hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2",
                            isLoading && "opacity-70 cursor-wait"
                        )}
                    >
                        {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            "Authenticate"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
