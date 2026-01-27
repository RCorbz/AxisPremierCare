"use server";

import { createClient } from "@/lib/supabase/server";
import { z } from "zod";
import { env } from "@/env";
import { revalidatePath } from "next/cache";

const leadSchema = z.object({
    full_name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email").optional().or(z.literal("")),
    phone: z.string().min(1, "Phone is required"),
    interest_level: z.enum(["High", "Medium", "Low"]).default("Medium"),
    notes: z.string().nullable().optional(),
    activity_impacted: z.string().nullable().optional(),
    deployment_priority: z.enum(["ASAP", "This Week", "General Inquiry"]).default("General Inquiry"),
    lead_type: z.enum(["Private", "Corporate_New", "Corporate_Employee"]).default("Private"),
    corporate_objective: z.string().nullable().optional(),
});

export async function submitLead(formData: FormData) {
    if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        return {
            success: false,
            message: "Configuration Error: Supabase keys are missing from the server environment. Please check Vercel settings."
        };
    }

    const supabase = await createClient();

    const rawData = {
        full_name: formData.get("full_name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        interest_level: formData.get("interest_level") || "Medium",
        notes: formData.get("notes"),
        zip_code: formData.get("zip_code"),
        corporate_code: formData.get("corporate_code"),
        activity_impacted: formData.get("activity_impacted"),
        deployment_priority: formData.get("deployment_priority") || "General Inquiry",
        lead_type: formData.get("lead_type") || "Private",
        corporate_objective: formData.get("corporate_objective"),
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

    // Determine out of area
    const ALLOWED_ZIPS = ["84010", "84011", "84014", "84025", "84037", "84054", "84087", "84015", "84037", "84040", "84041", "84056", "84067", "84075", "84401", "84403", "84404", "84405"];
    const zipCode = (rawData.zip_code as string) || "";
    // Corporate employees bypass zip check via code validation in UI, 
    // but we can still flag if needed.
    const isOutOfArea = zipCode && !ALLOWED_ZIPS.includes(zipCode) && !rawData.corporate_code;

    // Construct Payload
    const payload: any = {
        full_name: validation.data.full_name,
        email: validation.data.email || null,
        phone: validation.data.phone,
        interest_level: validation.data.interest_level,
        notes: validation.data.notes || null,
        activity_impacted: validation.data.activity_impacted || null,
        deployment_priority: validation.data.deployment_priority,
        zip_code: rawData.zip_code || null,
        corporate_code: rawData.corporate_code || null,
        is_out_of_area: !!isOutOfArea,
        lead_type: validation.data.lead_type,
        corporate_objective: validation.data.corporate_objective || null,
        status: "New"
    };

    console.log("Supabase Payload:", payload);

    try {
        const { error, status, statusText } = await supabase
            .from("leads")
            .insert(payload);

        if (error) {
            console.error("Supabase Error Details:", { error, status, statusText });
            return {
                success: false,
                message: `Submission Error: ${error.message} (${statusText || 'Unknown Connection Error'})`
            };
        }

        revalidatePath("/admin");

        return {
            success: true,
            message: validation.data.lead_type === "Corporate_New"
                ? "Partnership inquiry received. Our executive team will reach out shortly."
                : "Membership application initiated. Premium access protocols engaged."
        };
    } catch (err: any) {
        console.error("Unexpected submission error:", err);
        return {
            success: false,
            message: `Unexpected System Error: ${err.message || 'Check connection'}`
        };
    }
}
