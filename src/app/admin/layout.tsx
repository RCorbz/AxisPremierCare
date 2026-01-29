import Link from "next/link";
import { ShieldCheck, Activity, Users, LogOut } from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-carbon-black flex flex-col font-mono">
            {/* Top Bar - The Glass Cockpit Header */}
            <header className="h-16 border-b border-zinc-900 flex items-center justify-between px-6 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-none bg-electric-yellow flex items-center justify-center">
                        <Activity className="w-5 h-5 text-black" />
                    </div>
                    <span className="text-white tracking-widest uppercase font-bold text-sm">
                        AXIS <span className="text-zinc-500">OS</span> // v1.0
                    </span>
                </div>

                <nav className="flex items-center gap-8">
                    <Link
                        href="/admin"
                        className="text-zinc-400 hover:text-electric-yellow text-xs uppercase tracking-widest transition-colors flex items-center gap-2"
                    >
                        <ShieldCheck className="w-4 h-4" />
                        Command
                    </Link>
                    <button className="text-zinc-600 hover:text-red-500 transition-colors">
                        <LogOut className="w-4 h-4" />
                    </button>
                </nav>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 p-6 md:p-12 overflow-y-auto">
                <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-300">
                    {children}
                </div>
            </main>

            {/* Status Footer */}
            <footer className="h-8 border-t border-zinc-900 flex items-center justify-between px-6 text-[10px] text-zinc-600 uppercase tracking-widest bg-carbon-black font-mono">
                <div className="flex items-center gap-4">
                    <span>System Status: Nominal</span>
                    <span className="text-zinc-800">|</span>
                    <span className="text-electric-yellow/40">Dev Note: Separate AAI Command Core prior to Public Release</span>
                </div>
                <span>Secure Connection // Venture Sync v1.2</span>
            </footer>
        </div>
    );
}
