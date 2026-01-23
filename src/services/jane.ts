// This service mocks the future "Middleware" that will sit between Firebase and JaneApp
// In production, this would be a set of Firebase Cloud Functions.

export interface JaneAppointment {
    id: number;
    treatment: string;
    start_at: string;
    end_at: string;
    status: "booked" | "arrived" | "no_show" | "cancelled";
    location: string;
}

export interface JaneProfile {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
}

// MOCK DATABASE
// We simulate that this phone number already exists in JaneApp
const MOCK_DB = {
    // The phone number you used for testing (formatted as Firebase returns it)
    // Replace this with your actual test number if different, or add logic to handle any number
    "+15555555555": {
        profile: {
            id: 9942,
            first_name: "Test",
            last_name: "Subject",
            email: "test@axis.care",
            phone: "+15555555555"
        },
        upcoming_appointments: [
            {
                id: 101,
                treatment: "Mobile Adjustment (Acute)",
                start_at: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
                end_at: new Date(Date.now() + 86400000 * 2 + 1800000).toISOString(),
                status: "booked",
                location: "Home Base: Bountiful"
            }
        ],
        past_appointments: [
            {
                id: 98,
                treatment: "Performance Maintenance",
                start_at: "2023-11-15T14:00:00Z",
                end_at: "2023-11-15T14:30:00Z",
                status: "arrived",
                location: "Home Base: Bountiful"
            }
        ]
    }
} as const;

export const JaneService = {
    // Simulate finding a patient by their Firebase Phone Number
    findPatientByPhone: async (phoneNumber: string | null): Promise<JaneProfile | null> => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));

        if (!phoneNumber) return null;

        // In a real app, we would normalize the phone number here
        // For this mock, we just check if the key exists
        // We'll also allow a "magic" number for demo purposes if the specific one isn't found
        const match = MOCK_DB[phoneNumber as keyof typeof MOCK_DB];

        if (match) return match.profile;

        // Fallback for "Demo Mode" - if number ends in 0000, treat as found
        if (phoneNumber.endsWith("0000")) {
            return {
                id: 8888,
                first_name: "Demo",
                last_name: "User",
                email: "demo@axis.care",
                phone: phoneNumber
            };
        }

        return null;
    },

    getAppointments: async (janePatientId: number): Promise<{ upcoming: JaneAppointment[], past: JaneAppointment[] }> => {
        await new Promise(resolve => setTimeout(resolve, 600));

        // Determine which mock data to return based on ID
        if (janePatientId === 9942 || janePatientId === 8888) {
            // Return mock data (using the first entry's data for the demo user too for simplicity)
            const data = MOCK_DB["+15555555555"];
            return {
                upcoming: data.upcoming_appointments as unknown as JaneAppointment[],
                past: data.past_appointments as unknown as JaneAppointment[]
            };
        }

        return { upcoming: [], past: [] };
    }
};
