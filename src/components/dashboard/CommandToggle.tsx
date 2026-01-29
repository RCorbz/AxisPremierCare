"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function CommandToggle() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const isStrategic = searchParams.get("mode") === "strategic";

    const handleToggle = () => {
        const params = new URLSearchParams(searchParams.toString());
        if (isStrategic) {
            params.delete("mode");
        } else {
            params.set("mode", "strategic");
        }
        router.push(`?${params.toString()}`);
    };

    return (
        <button
            onClick={handleToggle}
            className={cn(
                "text-xs uppercase tracking-widest transition-colors flex items-center gap-2 px-3 py-1.5 border border-transparent",
                isStrategic
                    ? "text-electric-yellow border-electric-yellow/20 bg-electric-yellow/5 font-bold"
                    : "text-zinc-400 hover:text-white"
            )}
        >
            <ShieldCheck className={cn("w-4 h-4", isStrategic && "fill-electric-yellow/20")} />
            Command {isStrategic ? "Active" : ""}
        </button>
    );
}
