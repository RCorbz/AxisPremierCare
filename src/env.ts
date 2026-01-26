import { z } from "zod";

const envSchema = z.object({
    NEXT_PUBLIC_SUPABASE_URL: z.string().url().or(z.literal("")),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).or(z.literal("")),
    NODE_ENV: z
        .enum(["development", "test", "production"])
        .default("development"),
});

const getEnv = (key: string) => (process.env[key]?.trim() || "");

const processEnv = {
    NEXT_PUBLIC_SUPABASE_URL: getEnv("NEXT_PUBLIC_SUPABASE_URL"),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: getEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    NODE_ENV: process.env.NODE_ENV,
};

// Validate environment variables
const parsed = envSchema.safeParse(processEnv);

if (!parsed.success) {
    console.error(
        "❌ Invalid or missing environment variables:",
        parsed.error.flatten().fieldErrors,
    );
}

export const env = {
    NEXT_PUBLIC_SUPABASE_URL: getEnv("NEXT_PUBLIC_SUPABASE_URL"),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: getEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    NODE_ENV: (process.env.NODE_ENV as any) || "development",
};
