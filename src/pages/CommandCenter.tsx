import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, Map, Users, TrendingUp, AlertCircle, CheckCircle2, ChevronRight, Info, DollarSign, Activity, BarChart3, Star, Megaphone, Calendar, Disc, Building2, ChevronDown } from "lucide-react";
import { db } from "../firebase";
import { collection, query, orderBy, onSnapshot, type DocumentData, addDoc, serverTimestamp } from "firebase/firestore";

// --- TYPES & DATA ---

type LocationId = 'all' | 'slc' | 'pc';

const LOCATIONS: { id: LocationId; label: string }[] = [
    { id: 'all', label: 'Global Operations' },
    { id: 'slc', label: 'Salt Lake HQ' },
    { id: 'pc', label: 'Park City Expansion' },
];

// Simulated Data Per Location
const MOCK_DATA = {
    all: {
        adSpend: 2450, cac: 142,
        revenue: 20100, revGrowth: 8.4,
        rating: 4.8, reviewCounts: [5, 5, 5, 4, 5, 5, 5, 3, 5, 5]
    },
    slc: {
        adSpend: 1800, cac: 125,
        revenue: 16500, revGrowth: 5.2,
        rating: 4.9, reviewCounts: [5, 5, 5, 5, 5, 4, 5, 5, 5, 5]
    },
    pc: {
        adSpend: 650, cac: 210,
        revenue: 3600, revGrowth: 15.8,
        rating: 4.5, reviewCounts: [5, 4, 3, 5, 5, 4, 2, 5, 4, 5]
    }
};

// --- COMPONENTS ---

const Tooltip = ({ text }: { text: string }) => {
    return (
        <div className="group relative flex items-center">
            <Info size={14} className="text-text-muted hover:text-white cursor-help ml-2 transition-colors" />
            <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 opacity-0 transition-opacity group-hover:opacity-100 bg-background-dark border border-surface-border p-2 rounded text-[10px] text-text-muted shadow-xl z-50">
                {text}
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-surface-border"></div>
            </div>
        </div>
    );
};

const TabButton = ({
    active,
    onClick,
    label,
    status
}: {
    active: boolean,
    onClick: () => void,
    label: string,
    status: 'green' | 'yellow' | 'red'
}) => {
    const colors = {
        green: "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]",
        yellow: "bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.6)]",
        red: "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"
    };

    return (
        <button
            onClick={onClick}
            className={`flex-1 flex items-center justify-center gap-2 md:gap-3 py-4 border-b-2 transition-all ${active
                    ? "border-primary bg-surface-dark/50 text-white"
                    : "border-transparent text-text-muted hover:text-white hover:bg-surface-dark/30"
                }`}
        >
            <span className="text-[10px] md:text-sm font-bold uppercase tracking-wider">{label}</span>
            <div className={`h-1.5 w-1.5 md:h-2 md:w-2 rounded-full ${colors[status]}`}></div>
        </button>
    );
};

const LocationSelector = ({ current, onChange }: { current: LocationId, onChange: (id: LocationId) => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selected = LOCATIONS.find(l => l.id === current) || LOCATIONS[0];

    return (
        <div className="relative z-50">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 bg-surface-dark border border-surface-border rounded px-3 py-2 text-sm font-bold uppercase tracking-wider text-white hover:bg-surface-border transition-colors w-48 justify-between"
            >
                <div className="flex items-center gap-2">
                    <Building2 size={14} className="text-primary" />
                    <span className="truncate">{selected.label}</span>
                </div>
                <ChevronDown size={14} className={`text-text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-background-dark border border-surface-border rounded shadow-xl overflow-hidden">
                    {LOCATIONS.map(loc => (
                        <button
                            key={loc.id}
                            onClick={() => { onChange(loc.id); setIsOpen(false); }}
                            className={`w-full text-left px-4 py-3 text-xs font-bold uppercase tracking-wider hover:bg-surface-border transition-colors ${current === loc.id ? "text-primary bg-primary/5" : "text-text-muted"
                                }`}
                        >
                            {loc.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

const Gatekeeper = ({ onUnlock }: { onUnlock: () => void }) => {
    const [code, setCode] = useState("");
    const [error, setError] = useState(false);

    const checkCode = () => {
        if (code === "AXIS-CMD") { // MVP Hardcoded Code
            sessionStorage.setItem("axis_cmd_access", "true");
            onUnlock();
        } else {
            setError(true);
            setTimeout(() => setError(false), 1000);
        }
    };

    return (
        <div className="flex h-screen w-full items-center justify-center bg-black text-white p-6">
            <div className="w-full max-w-sm space-y-8 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-surface-dark border border-surface-border">
                    <Lock size={32} className="text-text-muted" />
                </div>
                <h1 className="text-2xl font-bold uppercase tracking-widest text-text-muted">Executive Access</h1>

                <div className="relative">
                    <input
                        type="password"
                        placeholder="ENTER AUTH CODE"
                        className={`w-full bg-transparent border-b-2 py-4 text-center text-2xl outline-none transition-all placeholder:text-surface-border uppercase tracking-widest font-mono
                            ${error ? "border-red-500 text-red-500" : "border-surface-border text-white focus:border-primary"}`}
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && checkCode()}
                    />
                </div>

                <button
                    onClick={checkCode}
                    className="w-full rounded-sm bg-white px-6 py-4 text-sm font-bold uppercase tracking-widest text-black hover:bg-primary transition-colors"
                >
                    Authenticate
                </button>
            </div>
        </div>
    );
};

// --- WIDGETS ---

const HeatmapWidget = ({ entries }: { entries: DocumentData[] }) => {
    const zoneCounts = entries.reduce((acc: Record<string, number>, entry) => {
        const zip = entry.zip || "Unknown";
        acc[zip] = (acc[zip] || 0) + 1;
        return acc;
    }, {});

    const sortedZones = Object.entries(zoneCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5); // Top 5

    const maxCount = sortedZones[0]?.[1] || 1;

    return (
        <div className="rounded-xl border border-surface-border bg-surface-dark p-6">
            <div className="mb-6 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-text-muted">
                    <Map size={16} /> Regional Demand
                    <Tooltip text="Highest concentration of prospective clients by Zip Code." />
                </h3>
            </div>

            <div className="space-y-4">
                {sortedZones.map(([zip, count]) => {
                    const isPrime = ["84010", "84011", "84014", "84054", "84025"].includes(zip);
                    const intensity = (count / maxCount) * 100;

                    return (
                        <div key={zip} className="group cursor-default">
                            <div className="mb-1 flex justify-between text-xs font-mono uppercase">
                                <span className={isPrime ? "text-primary" : "text-yellow-500"}>
                                    {zip} {isPrime ? "[PRIME]" : "[EXPANSION]"}
                                </span>
                                <span className="text-white">{count} REQ</span>
                            </div>
                            <div className="h-2 w-full overflow-hidden rounded-full bg-surface-border">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${intensity}%` }}
                                    className={`h-full ${isPrime ? "bg-primary" : "bg-yellow-500"}`}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="mt-6 border-t border-surface-border pt-4 text-xs text-text-muted">
                <p>• Green: Active Service Zones</p>
                <p>• Yellow: Expansion Opportunities</p>
            </div>
        </div>
    );
};

const MarketingWidget = ({ location }: { location: LocationId }) => {
    const data = MOCK_DATA[location];

    return (
        <div className="rounded-xl border border-surface-border bg-surface-dark p-6">
            <div className="mb-4 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-text-muted">
                    <Megaphone size={16} /> Client Acquisition
                    <Tooltip text="Marketing Efficiency Metrics" />
                </h3>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-surface-border/20 p-3 rounded-lg">
                    <div className="text-[10px] text-text-muted uppercase mb-1">Ad Spend (Mo)</div>
                    <div className="text-xl font-bold text-white">${data.adSpend.toLocaleString()}</div>
                </div>
                <div className="bg-primary/5 border border-primary/20 p-3 rounded-lg">
                    <div className="text-[10px] text-primary uppercase mb-1">CAC Cost</div>
                    <div className="text-xl font-bold text-white">${data.cac}</div>
                </div>
            </div>
        </div>
    )
}

const ReputationWidget = ({ location }: { location: LocationId }) => {
    const data = MOCK_DATA[location];

    return (
        <div className="rounded-xl border border-surface-border bg-surface-dark p-6">
            <div className="mb-4 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-text-muted">
                    <Star size={16} /> Brand Reputation
                    <Tooltip text="Google Review Sentiment (Last 10)" />
                </h3>
                <div className="flex items-center gap-1 text-yellow-500 font-bold">
                    {data.rating} <Star size={12} fill="currentColor" />
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between items-end gap-1 h-8">
                    {data.reviewCounts.map((r, i) => (
                        <div key={i} className="w-full bg-surface-border rounded-sm relative group">
                            <div
                                className={`absolute bottom-0 w-full rounded-sm ${r >= 4 ? 'bg-green-500' : 'bg-yellow-500'}`}
                                style={{ height: `${(r / 5) * 100}%` }}
                            ></div>
                        </div>
                    ))}
                </div>
                <div className="text-[10px] text-text-muted text-center uppercase tracking-widest">Last 10 Reviews (Recency Bias)</div>
            </div>
        </div>
    )
}

const HardBookedWidget = ({ location }: { location: LocationId }) => {
    const data = MOCK_DATA[location];
    // Simple simulation of chart data based on revenue
    const base = data.revenue;
    const weeklyRevenue = [base * 0.22, base * 0.26, base * 0.24, base * 0.28];

    return (
        <div className="rounded-xl border border-surface-border bg-gradient-to-br from-surface-dark to-surface-dark/50 p-6 relative overflow-hidden">
            <div className="mb-4 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-text-muted">
                    <Calendar size={16} /> Hard Booked Revenue
                    <Tooltip text="Confirmed revenue from scheduled appointments (4-Week Rolling Avg)." />
                </h3>
            </div>

            <div className="flex items-end gap-2 mb-1">
                <div className="text-3xl font-black text-white tracking-tight">
                    ${data.revenue.toLocaleString()}
                </div>
                <div className={`text-xs ${data.revGrowth >= 0 ? 'text-green-500' : 'text-red-500'} font-bold mb-1.5 flex items-center`}>
                    <TrendingUp size={12} className="mr-1" /> {data.revGrowth > 0 ? '+' : ''}{data.revGrowth}%
                </div>
            </div>
            <div className="text-[10px] text-text-muted font-mono uppercase tracking-widest mb-4">
                4-Week Rolling Volume
            </div>

            {/* Sparkline Simulation */}
            <div className="h-10 flex items-end gap-1">
                {weeklyRevenue.map((val, i) => (
                    <div key={i} className="flex-1 bg-primary/20 border-t-2 border-primary" style={{ height: `${(val / (base * 0.3)) * 100}%` }}></div>
                ))}
                <div className="flex-1 border-t-2 border-dashed border-text-muted opacity-30 h-full"></div>
            </div>
            <div className="text-[10px] text-text-muted text-right mt-1">Projection</div>
        </div>
    )
}

const ForecastWidget = ({ entries }: { entries: DocumentData[] }) => {
    // 1. Funnel Metrics
    const totalLeads = entries.length;
    const maintClients = entries.filter(e => e.goal === "maintenance").length;
    const painClients = entries.filter(e => e.goal === "pain").length;

    // Assume 20% conversion for demo purposes until status tracking is live
    const conversionRate = totalLeads > 0 ? 18 : 0;

    // 2. Financial Metrics
    const PAIN_VAL = 2500; // $2500 LTV
    const MAINT_VAL = 6000; // $6000 Annual Value
    const activeMRR = maintClients * 500; // Monthly Recurring Revenue
    const pipelineValue = (painClients * PAIN_VAL) + (maintClients * MAINT_VAL);

    // Formatters
    const fmtUSD = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumSignificantDigits: 3 }).format(n);

    return (
        <div className="space-y-4">
            {/* TOP ROW: MRR & CONVERSION */}
            <div className="grid grid-cols-2 gap-4">
                {/* MRR WIDGET */}
                <div className="rounded-xl border border-surface-border bg-surface-dark p-6 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-text-muted">
                            <DollarSign size={14} /> MRR <Tooltip text="Monthly Recurring Revenue from active Retainer clients." />
                        </h3>
                    </div>
                    <div className="text-2xl font-black text-white tracking-tight">
                        {fmtUSD(activeMRR)}
                    </div>
                    <div className="text-[9px] text-text-muted font-mono uppercase tracking-widest mt-1">
                        Recurring / Mo
                    </div>
                </div>

                {/* CONVERSION WIDGET */}
                <div className="rounded-xl border border-surface-border bg-surface-dark p-6">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-text-muted">
                            <Activity size={14} /> Conversion
                        </h3>
                    </div>
                    <div className="text-2xl font-black text-white tracking-tight flex items-end gap-1">
                        {conversionRate}%
                        <div className="text-xs text-green-500 font-bold mb-1.5">▲</div>
                    </div>
                    <div className="text-[9px] text-text-muted font-mono uppercase tracking-widest mt-1">
                        Lead to Member
                    </div>
                </div>
            </div>

            {/* PIPELINE & RETENTION */}
            <div className="rounded-xl border border-surface-border bg-surface-dark p-6">
                <div className="mb-4 flex items-center justify-between border-b border-surface-border pb-4">
                    <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-text-muted">
                        <BarChart3 size={16} /> Asset Forecast
                        <Tooltip text="Total Projected Annual Value of current pipeline." />
                    </h3>
                    <div className="text-right">
                        <div className="text-xl font-black text-white tracking-tight">{fmtUSD(pipelineValue)}</div>
                        <div className="text-[9px] text-text-muted font-mono uppercase">Proj. Annual Value</div>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <div className="text-[10px] text-text-muted uppercase mb-1">Retention Rate</div>
                        <div className="text-lg font-bold text-white">98.5%</div>
                    </div>
                    <div>
                        <div className="text-[10px] text-text-muted uppercase mb-1">Avg Tenure</div>
                        <div className="text-lg font-bold text-white">14 Mo</div>
                    </div>
                    <div>
                        <div className="text-[10px] text-text-muted uppercase mb-1">LTV</div>
                        <div className="text-lg font-bold text-primary">$7k</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CommandCenter() {
    const [unlocked, setUnlocked] = useState(false);
    const [allEntries, setAllEntries] = useState<DocumentData[]>([]);
    const [filteredEntries, setFilteredEntries] = useState<DocumentData[]>([]);
    const [activeTab, setActiveTab] = useState<'strategy' | 'financials' | 'ops'>('strategy');
    const [location, setLocation] = useState<LocationId>('all');

    useEffect(() => {
        const isAuth = sessionStorage.getItem("axis_cmd_access");
        if (isAuth) setUnlocked(true);
    }, []);

    useEffect(() => {
        if (!unlocked) return;

        const q = query(collection(db, "waitlist"), orderBy("timestamp", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setAllEntries(data);
        });

        return () => unsubscribe();
    }, [unlocked]);

    // FILTER LOGIC
    useEffect(() => {
        if (location === 'all') {
            setFilteredEntries(allEntries);
        } else if (location === 'slc') {
            // Simulate SLC Logic (Zips starting with 840, 841 that aren't PC)
            setFilteredEntries(allEntries.filter(e => {
                const zip = parseInt(e.zip || "0");
                return zip < 84060;
            }));
        } else if (location === 'pc') {
            // Simulate PC Logic (Zips near 84060)
            setFilteredEntries(allEntries.filter(e => {
                const zip = parseInt(e.zip || "0");
                return zip >= 84060;
            }));
        }
    }, [allEntries, location]);

    if (!unlocked) return <Gatekeeper onUnlock={() => setUnlocked(true)} />;

    return (
        <div className="min-h-screen bg-background-dark text-white p-6 md:p-12">
            <header className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-white">Command Center</h1>
                    <p className="text-text-muted text-xs md:text-sm font-mono mt-1">AXIS PREMIER CARE // EXECUTIVE DASHBOARD</p>
                </div>

                <div className="flex flex-col-reverse md:flex-row items-end md:items-center gap-4 w-full md:w-auto">

                    <LocationSelector current={location} onChange={setLocation} />

                    <div className="flex items-center gap-4">
                        <div className="text-right hidden lg:block">
                            <div className="text-xs font-bold text-primary">SYSTEM: ACTIVE</div>
                            <div className="text-xs text-text-muted font-mono">{new Date().toLocaleTimeString()}</div>
                        </div>
                        <button
                            onClick={async () => {
                                // Seed data logic...
                                const dummydata = [
                                    { name: "Marcus Thorne", email: "m.thorne@example.com", phone: "(801) 555-0101", zip: "84010", goal: "pain", outOfArea: false, isCorporate: true, status: "new" },
                                    { name: "Sarah Jenkins", email: "sarah.j@example.com", phone: "(801) 555-0102", zip: "84010", goal: "maintenance", outOfArea: false, isCorporate: false, status: "new" },
                                    { name: "David Miller", email: "d.miller@example.com", phone: "(801) 555-0103", zip: "84105", goal: "pain", outOfArea: true, isCorporate: false, status: "review_needed" },
                                    { name: "Elena Rodriguez", email: "elena.r@example.com", phone: "(801) 555-0104", zip: "84060", goal: "maintenance", outOfArea: true, isCorporate: true, status: "review_needed" },
                                ];
                                try {
                                    for (const d of dummydata) await addDoc(collection(db, "waitlist"), { ...d, timestamp: serverTimestamp() });
                                    alert(`Successfully injected records.`);
                                } catch (e) { alert(e); }
                            }}
                            className="rounded-full bg-surface-border p-3 hover:bg-green-900/20 hover:text-green-500 transition-colors"
                        >
                            <Users size={18} />
                        </button>
                        <button
                            onClick={() => { sessionStorage.removeItem("axis_cmd_access"); setUnlocked(false); }}
                            className="rounded-full bg-surface-border p-3 hover:bg-red-900/20 hover:text-red-500 transition-colors"
                        >
                            <Lock size={18} />
                        </button>
                    </div>
                </div>
            </header>

            {/* TABBED NAVIGATION */}
            <div className="flex border-b border-surface-border mb-8 sticky top-0 bg-background-dark/95 backdrop-blur z-40">
                <TabButton
                    label="Strategy"
                    status="green"
                    active={activeTab === 'strategy'}
                    onClick={() => setActiveTab('strategy')}
                />
                <TabButton
                    label="Financials"
                    status="green"
                    active={activeTab === 'financials'}
                    onClick={() => setActiveTab('financials')}
                />
                <TabButton
                    label="Ops & Brand"
                    status="yellow"
                    active={activeTab === 'ops'}
                    onClick={() => setActiveTab('ops')}
                />
            </div>

            {/* TAB CONTENT */}
            <div className="min-h-[500px]">

                {/* STRATEGY CONTENT */}
                {activeTab === 'strategy' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-3xl mx-auto">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="rounded-xl border border-surface-border bg-surface-dark p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="text-text-muted"><Users size={20} /></div>
                                    <Tooltip text="Total number of unique profiles in the database." />
                                </div>
                                <div className="text-3xl font-bold text-white">{filteredEntries.length}</div>
                                <div className="text-xs text-text-muted uppercase">Client Database</div>
                            </div>
                            <div className="rounded-xl border border-surface-border bg-surface-dark p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="text-text-muted"><TrendingUp size={20} /></div>
                                    <Tooltip text="Clients located within primary service zones (Bountiful/Farmington)." />
                                </div>
                                <div className="text-3xl font-bold text-primary">
                                    {filteredEntries.filter(e => !e.outOfArea).length}
                                </div>
                                <div className="text-xs text-text-muted uppercase">In-Network</div>
                            </div>
                        </div>
                        <MarketingWidget location={location} />
                        <HeatmapWidget entries={filteredEntries} />
                    </motion.div>
                )}

                {/* FINANCIALS CONTENT */}
                {activeTab === 'financials' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-3xl mx-auto">
                        <HardBookedWidget location={location} />
                        <ForecastWidget entries={filteredEntries} />
                    </motion.div>
                )}

                {/* OPS CONTENT */}
                {activeTab === 'ops' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-3xl mx-auto">
                        <ReputationWidget location={location} />

                        {/* INTAKE STREAM */}
                        <div className="rounded-xl border border-surface-border bg-surface-dark overflow-hidden min-h-[400px]">
                            <div className="border-b border-surface-border p-6 flex justify-between items-center bg-surface-dark">
                                <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-white">
                                    <AlertCircle size={16} className="text-primary" /> Intake Stream
                                </h3>
                                <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-1 rounded">LIVE</span>
                            </div>

                            <div className="divide-y divide-surface-border/50">
                                {filteredEntries.length === 0 && (
                                    <div className="p-12 text-center text-text-muted italic">
                                        No activity in the stream.
                                    </div>
                                )}

                                {filteredEntries.map((entry) => (
                                    <div key={entry.id} className="p-4 hover:bg-white/5 transition-colors">
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="font-bold text-white text-sm">{entry.name}</h4>
                                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${entry.goal === 'pain' ? 'border-red-500/30 text-red-500' : 'border-blue-500/30 text-blue-500'}`}>
                                                {entry.goal === 'pain' ? 'ACUTE' : 'RETAINER'}
                                            </span>
                                        </div>
                                        <div className="text-[10px] text-text-muted font-mono">{entry.phone} • {entry.zip}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
