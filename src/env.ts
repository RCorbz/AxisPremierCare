import { z } from "zod";

const envSchema = z.object({
    NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
    NODE_ENV: z
        .enum(["development", "test", "production"])
        .default("development"),
});

const processEnv = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NODE_ENV: process.env.NODE_ENV,
};

// Validate environment variables
const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build' || process.env.CI === 'true';
const parsed = envSchema.safeParse(processEnv);

let validatedEnv: z.infer<typeof envSchema>;

if (!parsed.success) {
    if (isBuildTime) {
        console.warn(
            "⚠️ Missing environment variables during build. This is allowed if they are provided at runtime:",
            parsed.error.flatten().fieldErrors,
        );
        // Fallback to placeholders to allow build to continue
        validatedEnv = {
            NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
            NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder",
            NODE_ENV: (process.env.NODE_ENV as any) || "development",
        };
    } else {
        console.error(
            "❌ Invalid environment variables:",
            parsed.error.flatten().fieldErrors,
        );
        throw new Error("Invalid environment variables");
    }
} else {
    validatedEnv = parsed.data;
}

export const env = validatedEnv;
