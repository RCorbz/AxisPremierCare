import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
    label: string;
    value: string;
    subtext: string;
    actionLabel: string;
    onAction?: () => void;
    className?: string;
}

export function StatCard({
    label,
    value,
    subtext,
    actionLabel,
    onAction,
    className,
}: StatCardProps) {
    return (
        <div
            className={cn(
                "bg-zinc-900 border border-zinc-800 p-6 flex flex-col justify-between h-48 group hover:border-zinc-700 transition-colors",
                className
            )}
        >
            <div className="flex justify-between items-start">
                <span className="text-zinc-500 text-xs uppercase tracking-widest">
                    {label}
                </span>
                <ArrowUpRight className="w-4 h-4 text-zinc-600 group-hover:text-electric-yellow transition-colors" />
            </div>
            <div>
                <span className="text-5xl text-white font-mono block tracking-tighter">
                    {value}
                </span>
                <span className="text-electric-yellow text-sm mt-1 block">
                    {subtext}
                </span>
            </div>
            <button
                onClick={onAction}
                className="w-full bg-zinc-800 hover:bg-zinc-700 text-white text-xs uppercase tracking-widest py-2 mt-4 text-left px-3 flex justify-between items-center transition-colors"
            >
                {actionLabel} <span className="text-electric-yellow">→</span>
            </button>
        </div>
    );
}
