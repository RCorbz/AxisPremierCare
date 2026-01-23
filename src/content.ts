export const CONTENT = {
    brand: {
        name: "AXIS Performance Care",
        tagline: "High-Performance Recovery. Delivered.",
        overline: "AXIS PERFORMANCE CARE",
    },
    hero: {
        headline: {
            line1: "HIGH-PERFORMANCE",
            line2: "RECOVERY. DELIVERED."
        },
        subhead: "Skip the waiting room. Dr. Hanson brings hospital-grade structural care to your living room in Bountiful. Acute pain & mobility relief for high-performers.",
        cta: "REQUEST ACCESS",
        socialProof: "Limited to 50 Founding Members"
    },
    frictionFlow: {
        header: "Situation Report",
        subHeader: "FRICTION VS. FLOW",
        oldWay: {
            title: "Standard Care",
            items: [
                { title: "Commute & Traffic", desc: "Wasted hours in transit." },
                { title: "Waiting Room Limbo", desc: "20+ minutes reading old magazines." },
                { title: "Rush Hour Treatment", desc: "5 minutes of rushed adjustment." }
            ],
            efficiency: "Efficiency Rating: 12%"
        },
        newWay: {
            title: "AXIS Protocol",
            badge: "Superior",
            items: [
                { title: "We Deploy to You", desc: "Home, office, or gym. Zero transit." },
                { title: "Zero Friction", desc: "No waiting. We are ready when you are." },
                { title: "Deep Work", desc: "60 minutes of manual therapy & optimization." }
            ],
            efficiency: "Efficiency Rating: 100%",
            cta: "Deploy Now"
        }
    },
    workflow: {
        header: "THE AXIS WORKFLOW",
        steps: [
            { number: 1, title: "You Request Access", desc: "Fill out the secure intake. We limit our route to ensure availability for members." },
            { number: 2, title: "We Deploy", desc: "Dr. Hanson arrives. We set up a sterile field in your office or home in 3 minutes." },
            { number: 3, title: "You Perform", desc: "30 minutes of structural work. You return to velocity immediately. No driving." }
        ]
    },
    membership: {
        header: "MEMBERSHIP PRIVILEGES",
        perks: [
            { title: "The \"Bat Phone\"", desc: "Direct text access to Dr. Hanson. 90-minute triage response time for members." },
            { title: "Sterile Field Protocol", desc: "We use hospital-grade shoe covers and silicone mats. We respect your sanctuary." },
            { title: "Family Unlock", desc: "Waived travel fees for spouses or family members treated at the same location." }
        ]
    },
    // ... (existing content)
    footer: {
        descriptor: "Concierge mobile chiropractic for Davis County. Specializing in acute pain, sciatica, and performance mobility.",
        serviceAreas: "Bountiful, Centerville, North Salt Lake, Farmington."
    },
    application: {
        steps: [
            {
                id: "step-0",
                label: "ACCESS",
                title: "Have an Access Code?",
                desc: "If your organization provides AXIS coverage, enter your code here. Otherwise, continue as an Individual.",
                placeholder: "Enter Code (Optional)",
                button: "Verify // Continue"
            },
            {
                id: "step-1",
                label: "IDENTITY",
                title: "Identify Yourself.",
                placeholder: "Full Name",
                button: "Next // Confirm"
            },
            {
                id: "step-2",
                label: "OBJECTIVE",
                title: "Current Status?",
                options: [
                    { id: "pain", label: "Acute Pain / Injury", desc: "Need immediate structural repair." },
                    { id: "maintenance", label: "Performance Maintenance", desc: "Optimization & mobility work." }
                ],
                button: "Next // Status"
            },
            {
                id: "step-3",
                label: "CLEARANCE",
                title: "Ready to Deploy?",
                desc: "You are cleared for deployment.",
                button: "INITIATE BOOKING SEQUENCE"
            }
        ]
    }
};
