import { FileText, Link } from "lucide-react";
import { type JaneProfile, type JaneAppointment } from "../../services/jane";

interface MissionFilesCardProps {
    profile: JaneProfile | null;
    appointments: { upcoming: JaneAppointment[], past: JaneAppointment[] };
}

export default function MissionFilesCard({ profile, appointments }: MissionFilesCardProps) {
    return (
        <div className={`rounded-xl border p-8 transition-colors ${profile ? "border-surface-border bg-surface-dark hover:border-primary/50" : "border-yellow-900/30 bg-yellow-900/10"}`}>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-surface-border text-white">
                <FileText />
            </div>
            <h3 className="text-lg font-bold text-white uppercase tracking-wider">Performance Blueprint</h3>

            {profile ? (
                <div className="mt-4 space-y-4">
                    {appointments.upcoming.length > 0 ? (
                        appointments.upcoming.map(app => (
                            <div key={app.id} className="rounded bg-background-dark p-4 border-l-2 border-primary">
                                <p className="text-sm font-bold text-white">{app.treatment}</p>
                                <p className="text-xs text-text-muted mt-1">
                                    {new Date(app.start_at).toLocaleDateString()} @ {new Date(app.start_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        ))
                    ) : (
                        <div className="flex items-center justify-between rounded bg-background-dark p-3 text-sm text-text-muted">
                            <span>No active missions.</span>
                        </div>
                    )}
                </div>
            ) : (
                <div className="mt-4">
                    <p className="text-sm text-text-muted mb-4">We could not link your phone number to an active AXIS file.</p>
                    <button className="flex w-full items-center justify-center gap-2 rounded bg-yellow-600 px-4 py-2 text-sm font-bold text-black hover:bg-yellow-500">
                        <Link size={16} /> Link Account
                    </button>
                </div>
            )}
        </div>
    );
}
