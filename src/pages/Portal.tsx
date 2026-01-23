import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, ShieldCheck, FileText, Activity } from "lucide-react";

export default function Portal() {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!currentUser) {
            navigate("/login");
        }
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
            <main className="mx-auto max-w-7xl mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">

                {/* Card 1: Status */}
                <div className="rounded-xl border border-primary/20 bg-surface-dark p-8 shadow-[0_0_20px_-5px_rgba(204,255,0,0.1)]">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <ShieldCheck />
                    </div>
                    <h3 className="text-lg font-bold text-white uppercase tracking-wider">Clearance Status</h3>
                    <p className="mt-2 text-3xl font-black text-primary">ACTIVE</p>
                    <p className="mt-2 text-sm text-text-muted">You are authorized for deployment.</p>
                </div>

                {/* Card 2: Mission Files */}
                <div className="rounded-xl border border-surface-border bg-surface-dark p-8 transition-colors hover:border-primary/50">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-surface-border text-white">
                        <FileText />
                    </div>
                    <h3 className="text-lg font-bold text-white uppercase tracking-wider">After-Action Reports</h3>
                    <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-between rounded bg-background-dark p-3 text-sm text-text-muted">
                            <span>No reports on file.</span>
                        </div>
                    </div>
                </div>

                {/* Card 3: Intel */}
                <div className="rounded-xl border border-surface-border bg-surface-dark p-8 transition-colors hover:border-primary/50">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-surface-border text-white">
                        <Activity />
                    </div>
                    <h3 className="text-lg font-bold text-white uppercase tracking-wider">Intel Library</h3>
                    <button className="mt-4 w-full rounded bg-background-dark py-3 text-sm font-bold text-text-muted hover:text-white transition-colors">
                        Locked (Requires Deployment)
                    </button>
                </div>

            </main>
        </div>
    );
}
