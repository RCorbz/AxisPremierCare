export const CONTENT = {
    brand: {
        name: "AXIS PREMIER CARE",
        tagline: "High-Performance Recovery. Delivered.",
        overline: "AXIS PREMIER CARE",
    },
    hero: {
        headline: {
            line1: "UNLOCK YOUR",
            line2: "10X POTENTIAL."
        },
        subhead: "Hospital-grade structural optimization, delivered to your sanctuary. We handle the logistics; you focus on the win.",
        cta: "REQUEST ACCESS",
        socialProof: "Limited to 50 Founding Members"
    },
    frictionFlow: {
        header: "WHY AXIS?",
        subHeader: "THE LANDSCAPE", // Keeping as sub or removing? User said "rename and friction vs flow". I'll put "Why Axis?" as main.
        oldWay: {
            title: "Standard Care",
            items: [
                { title: "Commute & Traffic", desc: "Wasted hours in transit." },
                { title: "Waiting Room Limbo", desc: "20+ minutes reading old magazines." },
                { title: "Rush Hour Treatment", desc: "5 minutes of generic adjustment." }
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
            cta: "Request Access"
        }
    },
    workflow: {
        header: "WHAT NOW?",
        steps: [
            { number: 1, title: "Request Access", desc: "Fill out the performance intake. We limit our route to ensure availability for members." },
            { number: 2, title: "We Arrive", desc: "Dr. Corbaley arrives. We set up with zero footprint in your office or home in 3 minutes." },
            { number: 3, title: "You Perform", desc: "30 minutes of structural work. You return to velocity immediately. No driving." }
        ]
    },
    membership: {
        header: "MEMBERSHIP PRIVILEGES",
        perks: [
            { title: "Direct Access Line", desc: "Direct text access to Dr. Corbaley. 90-minute triage response time for members." },
            { title: "Sanctuary Protection", desc: "We honor your space with absolute reverence. Hospital-grade cleanliness, zero footprint." },
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
                button: "Verify // Check Eligibility"
            },
            {
                id: "step-location",
                label: "LOCATION",
                title: "Verify Your Location.",
                desc: "We currently deploy to Bountiful, Centerville, NSL, and Farmington.",
                placeholder: "Zip Code",
                button: "Verify // Confirm Range"
            },
            {
                id: "step-1",
                label: "PROFILE",
                title: "Your Profile.",
                placeholder: "Full Name",
                placeholderEmail: "Secure Email",
                placeholderPhone: "Mobile Number",
                button: "Next // Confirm"
            },
            {
                id: "step-2",
                label: "GOALS",
                title: "Your Goals?",
                options: [
                    { id: "pain", label: "Acute Pain / Injury", desc: "Need immediate structural repair." },
                    { id: "maintenance", label: "Performance Maintenance", desc: "Optimization & mobility work." }
                ],
                button: "Next // Status"
            },
            {
                id: "step-3",
                label: "CONFIRM",
                title: "WELCOME TO AXIS.",
                desc: "Your access is confirmed. Let's get a Specialist to your location immediately.",
                button: "SCHEDULE EXPERIENCE"
            }
        ]
    }
};
