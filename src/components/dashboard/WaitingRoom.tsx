"use client";

import { Database } from "@/types/supabase";

type Lead = Database["public"]["Tables"]["leads"]["Row"];

/* Mock Data - In real app, pass this as props */
const mockLeads: Partial<Lead>[] = [
    {
        id: "1",
        full_name: "Sarah Jenkins",
        status: "New",
        interest_level: "High",
    },
    {
        id: "2",
        full_name: "Mike Ross",
        status: "Contacted",
        interest_level: "Medium",
    },
];

export function WaitingRoom() {
    return (
        <section>
            <div className="flex justify-between items-end mb-6">
                <h2 className="text-xl text-white font-mono uppercase tracking-widest">
                    Waiting Room <span className="text-base text-zinc-600 ml-2">/ LEADS</span>
                </h2>
                <button className="text-xs text-electric-yellow uppercase tracking-widest border border-electric-yellow px-4 py-2 hover:bg-electric-yellow hover:text-black transition-colors">
                    Refresh Data
                </button>
            </div>

            <div className="border border-zinc-800 bg-zinc-900/50">
                {/* Table Header */}
                <div className="grid grid-cols-4 p-4 border-b border-zinc-800 text-xs text-zinc-500 uppercase tracking-widest font-mono">
                    <div>Name</div>
                    <div>Status</div>
                    <div>Interest</div>
                    <div className="text-right">Action</div>
                </div>

                {/* Rows */}
                {mockLeads.map((lead) => (
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
                ))}
            </div>
        </section>
    );
}
