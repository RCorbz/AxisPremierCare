"use server";

import { createClient } from "@/lib/supabase/server";
import { z } from "zod";
import { env } from "@/env";
import { revalidatePath } from "next/cache";

const leadSchema = z.object({
    full_name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    phone: z.string().min(1, "Phone is required"),
    interest_level: z.enum(["High", "Medium", "Low"]).default("Medium"),
    notes: z.string().nullable().optional(),
});

export async function submitLead(formData: FormData) {
    if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        return {
            success: false,
            message: "Configuration Error: Supabase keys are missing from the server environment. Please check Vercel settings."
        };
    }

    // Diagnostic logging for API Key (Safe/Masked)
    const key = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    console.log(`[Diagnostic] Using Supabase URL: ${env.NEXT_PUBLIC_SUPABASE_URL}`);
    console.log(`[Diagnostic] API Key Masked: ${key.substring(0, 10)}...${key.substring(key.length - 10)}`);
    console.log(`[Diagnostic] Key Length: ${key.length} characters`);

    const supabase = await createClient();

    const rawData = {
        full_name: formData.get("full_name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        interest_level: formData.get("interest_level") || "Medium",
        notes: formData.get("notes"),
        zip_code: formData.get("zip_code"),
        corporate_code: formData.get("corporate_code"),
    };

    const validation = leadSchema.safeParse(rawData);

    if (!validation.success) {
        const fieldErrors = validation.error.flatten().fieldErrors;
        const errorDetails = Object.entries(fieldErrors)
            .map(([field, msgs]) => `${field}: ${msgs?.join(", ")}`)
            .join(" | ");

        console.warn("Validation Failed:", fieldErrors);
        return {
            success: false,
            message: `Validation Error: ${errorDetails}`,
            errors: fieldErrors
        };
    }

    // Append location info to notes
    let notes = validation.data.notes || "";
    if (rawData.zip_code) notes += `\n[Location] Zip: ${rawData.zip_code}`;
    if (rawData.corporate_code) notes += `\n[Location] Corporate Code: ${rawData.corporate_code}`;

    // Explicitly cast to unknown then to specific insert type if needed, 
    // or ensure validation.data properties match exactly.
    const payload = {
        full_name: validation.data.full_name,
        email: validation.data.email || null,
        phone: validation.data.phone,
        interest_level: validation.data.interest_level as "High" | "Medium" | "Low",
        notes: notes.trim() || null,
        status: "New" as "New"
    };

    console.log("Supabase Payload:", payload);

    try {
        const { error, status, statusText } = await supabase
            .from("leads")
            .insert(payload as any);

        if (error) {
            console.error("Supabase Error Details:", {
                error,
                status,
                statusText,
                url: env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 15) + "..."
            });
            return {
                success: false,
                message: `Submission Error: ${error.message} (${statusText || 'Unknown Connection Error'})`
            };
        }

        console.log("Supabase Success! Status:", status);

        revalidatePath("/admin");

        // Safety check for URL before string manipulation
        const url = env.NEXT_PUBLIC_SUPABASE_URL || "";
        const projectIdPrefix = url.includes('.') ? url.split('.')[0].replace('https://', '') : 'unknown';

        return {
            success: true,
            message: `Submission confirmed to project [${projectIdPrefix}...].`
        };
    } catch (err: any) {
        console.error("Unexpected submission error:", err);
        return {
            success: false,
            message: `Unexpected System Error: ${err.message || 'Check connection'}`
        };
    }
}
