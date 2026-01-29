import { StatCard } from "@/components/dashboard/StatCard";
import { WaitingRoom } from "@/components/dashboard/WaitingRoom";
import { OperationsPulse } from "@/components/dashboard/OperationsPulse";
import { BusinessEntitySelector } from "@/components/dashboard/BusinessEntitySelector";
import { getDailyAppointments, getMonthToDateRevenue } from "@/lib/jane";
import { env } from "@/env";

/**
 * AdminDashboard Page
 *
 * The primary "Glass Cockpit" view for the Doctor.
 * Integrates:
 * 1. Live Pulse (Jane App Data via StatCards)
 * 2. Waiting Room (Supabase Leads Table)
 * 
 * Extension:
 * 3. Strategic Mode (Multi-Entity AAI Sync) - Only visible when toggled.
 *
 * @returns {JSX.Element} The rendered dashboard
 */
export const dynamic = 'force-dynamic';

export default async function AdminDashboard({
    searchParams,
}: {
    searchParams: { venture?: string; mode?: string };
}) {
    // Standard Pulse Data
    const appointments = await getDailyAppointments();
    const revenue = await getMonthToDateRevenue();

    // Strategic Context
    const isStrategicMode = searchParams.mode === "strategic";
    const selectedVentureId = searchParams.venture || env.NEXT_PUBLIC_VENTURE_ID;

    return (
        <div className="space-y-12">
            {/* Header Area */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-4xl text-white font-mono font-bold uppercase tracking-tighter">
                            Morning Briefing
                        </h1>
                        {isStrategicMode && (
                            <span className="bg-electric-yellow/10 text-electric-yellow border border-electric-yellow/20 px-2 py-0.5 text-[8px] uppercase tracking-widest font-bold animate-in fade-in zoom-in duration-300">
                                Strategic Mode
                            </span>
                        )}
                    </div>
                    <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">
                        Dr. Corbaley // Bountiful, UT <span className="text-electric-yellow ml-4">■ LIVE FEED ACTIVE</span>
                    </p>
                </div>

                {isStrategicMode && (
                    <div className="animate-in slide-in-from-right-4 duration-500">
                        <BusinessEntitySelector currentVentureId={selectedVentureId} />
                    </div>
                )}
            </header>

            {/* Core Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard
                    label="Schedule // Today"
                    value={appointments.toString()}
                    subtext="Appointments Remaining"
                    actionLabel="Open Jane Schedule"
                />
                <StatCard
                    label="Revenue // MTD"
                    value={`$${revenue.total_sales.toLocaleString()}`}
                    subtext="+15% vs Last Month"
                    actionLabel="View Financials"
                />
            </div>

            {/* Section B: The Waiting Room */}
            <WaitingRoom />

            {/* Section C: Extended Command Center (AAI Sync) */}
            {isStrategicMode && (
                <div className="border-t border-zinc-900 pt-12 animate-in fade-in slide-up-4 duration-700">
                    <OperationsPulse overrideVentureId={selectedVentureId} />
                </div>
            )}
        </div>
    );
}
