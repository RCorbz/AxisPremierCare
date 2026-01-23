import { Activity } from "lucide-react";
import { type JaneProfile } from "../../services/jane";

interface IntelCardProps {
    profile: JaneProfile | null;
}

export default function IntelCard({ profile }: IntelCardProps) {
    return (
        <div className="rounded-xl border border-surface-border bg-surface-dark p-8 transition-colors hover:border-primary/50">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-surface-border text-white">
                <Activity />
            </div>
            <h3 className="text-lg font-bold text-white uppercase tracking-wider">Velocity Lab</h3>
            <button className="mt-4 w-full rounded bg-background-dark py-3 text-sm font-bold text-text-muted hover:text-white transition-colors">
                {profile ? "Access Archives" : "Locked (Requires Deployment)"}
            </button>
        </div>
    );
}
