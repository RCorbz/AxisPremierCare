import { ShieldCheck } from "lucide-react";
import { type JaneProfile } from "../../services/jane";

interface StatusCardProps {
    profile: JaneProfile | null;
}

export default function StatusCard({ profile }: StatusCardProps) {
    return (
        <div className="rounded-xl border border-primary/20 bg-surface-dark p-8 shadow-[0_0_20px_-5px_rgba(204,255,0,0.1)]">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <ShieldCheck />
            </div>
            <h3 className="text-lg font-bold text-white uppercase tracking-wider">Membership Status</h3>

            {profile ? (
                <>
                    <p className="mt-2 text-3xl font-black text-primary">ACTIVE</p>
                    <p className="mt-2 text-sm text-text-muted">Authorized: {profile.first_name} {profile.last_name}</p>
                </>
            ) : (
                <>
                    <p className="mt-2 text-3xl font-black text-yellow-500">PENDING</p>
                    <p className="mt-2 text-sm text-text-muted">Linkage Required.</p>
                </>
            )}
        </div>
    );
}
