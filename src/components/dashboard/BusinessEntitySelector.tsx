"use client";

import { useEffect, useState } from "react";
import { getAllVentures } from "@/app/actions/leads";
import { ChevronDown, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Venture {
    id: string;
    name: string;
    description?: string;
}

import { useRouter, useSearchParams } from "next/navigation";

interface BusinessEntitySelectorProps {
    onSelect?: (ventureId: string) => void;
    currentVentureId?: string;
}

export function BusinessEntitySelector({ onSelect, currentVentureId }: BusinessEntitySelectorProps) {
    const [ventures, setVentures] = useState<Venture[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedVenture, setSelectedVenture] = useState<Venture | null>(null);

    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        async function fetchVentures() {
            const data = await getAllVentures();
            setVentures(data);

            // Default to Axis if found or the first one
            const defaultVenture = data.find((v: Venture) => v.id === currentVentureId) || data[0];
            if (defaultVenture) {
                setSelectedVenture(defaultVenture);
                onSelect(defaultVenture.id);
            }
        }
        fetchVentures();
    }, [currentVentureId, onSelect]);

    const handleSelect = (venture: Venture) => {
        setSelectedVenture(venture);
        const params = new URLSearchParams(searchParams.toString());
        params.set("venture", venture.id);
        router.push(`?${params.toString()}`);
        if (typeof onSelect === "function") {
            onSelect(venture.id);
        }
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 px-4 py-2 hover:border-zinc-700 transition-all group"
            >
                <div className="w-5 h-5 bg-electric-yellow flex items-center justify-center">
                    <Building2 className="w-3 h-3 text-black" />
                </div>
                <div className="text-left">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest block font-mono">
                        Active Entity
                    </span>
                    <span className="text-white text-xs uppercase tracking-widest font-bold font-mono">
                        {selectedVenture?.name || "Initializing..."}
                    </span>
                </div>
                <ChevronDown className={cn("w-4 h-4 text-zinc-600 group-hover:text-white transition-all", isOpen && "rotate-180")} />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-zinc-950 border border-zinc-800 shadow-2xl z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-2 space-y-1">
                        {ventures.map((venture) => (
                            <button
                                key={venture.id}
                                onClick={() => handleSelect(venture)}
                                className={cn(
                                    "w-full text-left px-3 py-2 text-xs uppercase tracking-widest font-mono transition-colors",
                                    selectedVenture?.id === venture.id
                                        ? "bg-electric-yellow text-black font-bold"
                                        : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                                )}
                            >
                                {venture.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
