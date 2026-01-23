import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Loader2 } from "lucide-react";
import { JaneService, type JaneProfile, type JaneAppointment } from "../services/jane";
import StatusCard from "../components/portal/StatusCard";
import MissionFilesCard from "../components/portal/MissionFilesCard";
import IntelCard from "../components/portal/IntelCard";

export default function Portal() {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<JaneProfile | null>(null);
    const [appointments, setAppointments] = useState<{ upcoming: JaneAppointment[], past: JaneAppointment[] }>({ upcoming: [], past: [] });

    const [error, setError] = useState("");

    useEffect(() => {
        if (!currentUser) {
            navigate("/login");
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            setError("");
            try {
                // Step 1: Find Jane Profile by Phone (Linkage Logic)
                const janeProfile = await JaneService.findPatientByPhone(currentUser.phoneNumber);
                setProfile(janeProfile);

                if (janeProfile) {
                    // Step 2: Fetch Appointments if linked
                    const apps = await JaneService.getAppointments(janeProfile.id);
                    setAppointments(apps);
                }
            } catch (err) {
                console.error("Failed to fetch portal data:", err);
                setError("CONNECTION_FAILURE: Linkage System Unreachable.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();

    }, [currentUser, navigate]);

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    if (!currentUser) return null;

    return (
        <div className="min-h-screen bg-background-dark p-6">
            {/* Header */}
            <header className="mx-auto max-w-7xl flex items-center justify-between border-b border-surface-border pb-6">
                <div>
                    <h1 className="text-2xl font-bold uppercase tracking-tighter text-white">
                        AXIS <span className="text-primary">MEMBER</span>
                    </h1>
                    <p className="text-xs text-text-muted mt-1 font-mono">ID: {currentUser.uid.slice(0, 8)}</p>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 rounded-sm border border-surface-border px-4 py-2 text-xs font-bold text-text-muted hover:border-primary hover:text-white transition-colors uppercase tracking-wider"
                >
                    <LogOut size={14} />
                    Secure Logout
                </button>
            </header>

            {/* Main Dashboard */}
            {loading ? (
                <div className="flex h-[60vh] items-center justify-center">
                    <Loader2 className="animate-spin text-primary" size={48} />
                </div>
            ) : error ? (
                <div className="mx-auto mt-20 max-w-md text-center">
                    <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-900/20 text-red-500">
                        <span className="material-symbols-outlined text-[32px]">warning</span>
                    </div>
                    <h2 className="text-xl font-bold text-white uppercase tracking-wider">System Alert</h2>
                    <p className="mt-2 text-text-muted">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-6 rounded-sm border border-surface-border bg-surface-dark px-6 py-2 text-sm font-bold text-white hover:bg-white hover:text-black transition-colors uppercase"
                    >
                        Retry Connection
                    </button>
                </div>
            ) : (
                <main className="mx-auto max-w-7xl mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    <StatusCard profile={profile} />
                    <MissionFilesCard profile={profile} appointments={appointments} />
                    <IntelCard profile={profile} />
                </main>
            )}
        </div>
    );
}
