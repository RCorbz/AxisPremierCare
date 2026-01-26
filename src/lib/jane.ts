import { env } from "@/env";

// Types matching Jane App API response structure (simplified)
export interface JaneAppointment {
    id: number;
    start_at: string;
    end_at: string;
    state: "booked" | "arrived" | "checked_in";
    patient_name: string;
}

export interface JaneRevenue {
    total_sales: number;
    currency: string;
}

// Mock Data for "Glass Cockpit" demo
const MOCK_APPOINTMENTS: JaneAppointment[] = [
    { id: 1, start_at: new Date().toISOString(), end_at: new Date().toISOString(), state: "booked", patient_name: "Mock Patient 1" },
    { id: 2, start_at: new Date().toISOString(), end_at: new Date().toISOString(), state: "booked", patient_name: "Mock Patient 2" },
    { id: 3, start_at: new Date().toISOString(), end_at: new Date().toISOString(), state: "booked", patient_name: "Mock Patient 3" },
    { id: 4, start_at: new Date().toISOString(), end_at: new Date().toISOString(), state: "booked", patient_name: "Mock Patient 4" },
    { id: 5, start_at: new Date().toISOString(), end_at: new Date().toISOString(), state: "booked", patient_name: "Mock Patient 5" },
    { id: 6, start_at: new Date().toISOString(), end_at: new Date().toISOString(), state: "booked", patient_name: "Mock Patient 6" },
    { id: 7, start_at: new Date().toISOString(), end_at: new Date().toISOString(), state: "booked", patient_name: "Mock Patient 7" },
    { id: 8, start_at: new Date().toISOString(), end_at: new Date().toISOString(), state: "booked", patient_name: "Mock Patient 8" },
];

const MOCK_REVENUE: JaneRevenue = {
    total_sales: 12450.00,
    currency: "USD",
};

/**
 * Fetches today's appointment count from Jane App.
 * Currently returns Mock Data until API Keys are provided.
 */
export async function getDailyAppointments(): Promise<number> {
    // Simulator API latency
    await new Promise((resolve) => setTimeout(resolve, 500));
    return MOCK_APPOINTMENTS.length;
}

/**
 * Fetches Month-to-Date revenue from Jane App.
 * Currently returns Mock Data until API Keys are provided.
 */
export async function getMonthToDateRevenue(): Promise<JaneRevenue> {
    // Simulator API latency
    await new Promise((resolve) => setTimeout(resolve, 500));
    return MOCK_REVENUE;
}
