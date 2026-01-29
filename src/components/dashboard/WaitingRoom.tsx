"use client";

import { useEffect, useState } from "react";
import { getLeads } from "@/app/actions/leads";
import { Loader2 } from "lucide-react";
import { Database } from "@/types/supabase";

type Lead = Database["public"]["Tables"]["leads"]["Row"];

interface WaitingRoomProps {
    ventureId?: string;
}

export function WaitingRoom({ ventureId }: WaitingRoomProps) {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const refreshLeads = async () => {
        setIsLoading(true);
        const data = await getLeads(ventureId);
        setLeads(data as Lead[]);
        setIsLoading(false);
    };

    useEffect(() => {
        refreshLeads();
    }, [ventureId]);

    return (
        <section>
            <div className="flex justify-between items-end mb-6">
                <h2 className="text-xl text-white font-mono uppercase tracking-widest">
                    Waiting Room <span className="text-base text-zinc-600 ml-2">/ LEADS</span>
                </h2>
                <button
                    onClick={refreshLeads}
                    disabled={isLoading}
                    className="text-xs text-electric-yellow uppercase tracking-widest border border-electric-yellow px-4 py-2 hover:bg-electric-yellow hover:text-black transition-colors disabled:opacity-50"
                >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Refresh Data"}
                </button>
            </div>

            <div className="border border-zinc-800 bg-zinc-900/50 min-h-[200px] flex flex-col">
                {/* Table Header */}
                <div className="grid grid-cols-4 p-4 border-b border-zinc-800 text-xs text-zinc-500 uppercase tracking-widest font-mono">
                    <div>Name</div>
                    <div>Status</div>
                    <div>Interest</div>
                    <div className="text-right">Action</div>
                </div>

                {/* Rows */}
                {leads.length > 0 ? (
                    leads.map((lead) => (
                        <div
                            key={lead.id}
                            className="grid grid-cols-4 p-4 border-b border-zinc-800/50 text-sm hover:bg-zinc-800/50 transition-colors group"
                        >
                            <div className="text-white font-medium">{lead.full_name}</div>
                            <div>
                                <span
                                    className={`px-2 py-1 text-[10px] uppercase tracking-widest border ${lead.status === "New"
                                        ? "bg-electric-yellow/10 text-electric-yellow border-electric-yellow/20"
                                        : "bg-zinc-800 text-zinc-400 border-zinc-700"
                                        }`}
                                >
                                    {lead.status}
                                </span>
                            </div>
                            <div className="text-zinc-400">{lead.interest_level}</div>
                            <div className="text-right">
                                <button className="text-xs text-white hover:text-electric-yellow underline decoration-zinc-700 underline-offset-4">
                                    Details
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex-1 flex items-center justify-center p-12 text-zinc-600 font-mono text-xs uppercase tracking-widest">
                        {isLoading ? "Fetching Signals..." : "No incoming signals detected."}
                    </div>
                )}
            </div>
        </section>
    );
}
