import { StatCard } from "@/components/dashboard/StatCard";
import { WaitingRoom } from "@/components/dashboard/WaitingRoom";
import { OperationsPulse } from "@/components/dashboard/OperationsPulse";
import { getDailyAppointments, getMonthToDateRevenue } from "@/lib/jane";

/**
 * AdminDashboard Page
 *
 * The primary "Glass Cockpit" view for the Doctor.
 * Integrates:
 * 1. Live Pulse (Jane App Data via StatCards)
 * 2. Waiting Room (Supabase Leads Table)
 *
 * @returns {JSX.Element} The rendered dashboard
 */
export const dynamic = 'force-dynamic'; // Ensure fresh data on every request

export default async function AdminDashboard() {
    // Fetch "Live Pulse" data
    const appointmentCount = await getDailyAppointments();
    const revenueData = await getMonthToDateRevenue();
    const revenueFormatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(revenueData.total_sales);

    return (
        <div className="space-y-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-zinc-900 pb-8">
                <div>
                    <h1 className="text-4xl text-white font-mono uppercase tracking-tighter mb-2">
                        Morning Briefing
                    </h1>
                    <p className="text-zinc-500 font-mono text-sm tracking-widest uppercase">
                        Dr. Corbaley // Bountiful, UT
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-electric-yellow animate-pulse rounded-none"></div>
                    <span className="text-electric-yellow text-xs uppercase tracking-widest font-mono">
                        Live Feed Active
                    </span>
                </div>
            </div>

            {/* Section A: The Live Pulse */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard
                    label="Schedule // Today"
                    value={appointmentCount.toString()}
                    subtext="Appointments Remaining"
                    actionLabel="Open Jane Schedule"
                />

                <StatCard
                    label="Revenue // MTD"
                    value={revenueFormatted}
                    subtext="+15% vs Last Month"
                    actionLabel="View Financials"
                />
            </section>

            {/* Section B: The Waiting Room */}
            <WaitingRoom />

            {/* Section C: Strategic Operations (AAI Pipeline) */}
            <div className="border-t border-zinc-900 pt-12">
                <OperationsPulse />
            </div>
        </div>
    );
}
