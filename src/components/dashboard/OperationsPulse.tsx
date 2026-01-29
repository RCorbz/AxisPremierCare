"use client";

import { useEffect, useState } from "react";
import { getVentureTasks } from "@/app/actions/leads";
import { motion } from "framer-motion";
import { Clock, CheckCircle2 } from "lucide-react";

interface Task {
    id: string;
    title: string;
    status: string;
    complexity_score: number;
    ai_acceptance_criteria: string;
    created_at: string;
}

interface OperationsPulseProps {
    overrideVentureId?: string;
}

export function OperationsPulse({ overrideVentureId }: OperationsPulseProps) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTasks = async () => {
            const data = await getVentureTasks(overrideVentureId);
            setTasks(data);
            setLoading(false);
        };
        fetchTasks();
    }, [overrideVentureId]);

    if (loading) return (
        <div className="animate-pulse space-y-4">
            <div className="h-24 bg-zinc-900 border border-zinc-800 rounded-none w-full"></div>
            <div className="h-24 bg-zinc-900 border border-zinc-800 rounded-none w-full"></div>
        </div>
    );

    return (
        <section className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-zinc-500 font-mono text-xs uppercase tracking-[0.4em]">
                    Operations pulse // Sync Logic Active
                </h3>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {tasks.length === 0 ? (
                    <div className="p-8 border border-zinc-900 bg-zinc-950/50 text-center">
                        <p className="text-zinc-600 font-mono text-[10px] uppercase tracking-widest leading-relaxed">
                            No strategic dispatches at this time. <br />
                            Operational velocity stable.
                        </p>
                    </div>
                ) : (
                    tasks.map((task) => (
                        <motion.div
                            key={task.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="p-6 border border-zinc-900 bg-zinc-950 hover:border-zinc-700 transition-colors group relative overflow-hidden"
                        >
                            <div className="flex justify-between items-start gap-4 mb-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-white font-mono text-xs uppercase tracking-widest font-bold">
                                            {task.title}
                                        </span>
                                        <span className="text-[8px] text-zinc-600 font-mono uppercase tracking-[0.2em] px-1.5 py-0.5 border border-zinc-800">
                                            V: {task.complexity_score}
                                        </span>
                                    </div>
                                    <p className="text-zinc-500 font-mono text-[9px] uppercase tracking-widest">
                                        {new Date(task.created_at).toLocaleDateString()} {"//"} STATUS: {task.status}
                                    </p>
                                </div>
                                <div className="text-electric-yellow opacity-30 group-hover:opacity-100 transition-opacity">
                                    {task.status === "Done" ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                                </div>
                            </div>

                            {task.ai_acceptance_criteria && (
                                <div className="bg-zinc-900/30 border-l-2 border-electric-yellow/50 p-3">
                                    <span className="text-[7px] text-zinc-500 font-mono uppercase tracking-[0.3em] block mb-2">
                                        AI Acceptance Criteria
                                    </span>
                                    <p className="text-zinc-400 font-mono text-[9px] leading-relaxed">
                                        {task.ai_acceptance_criteria}
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    ))
                )}
            </div>
        </section>
    );
}
