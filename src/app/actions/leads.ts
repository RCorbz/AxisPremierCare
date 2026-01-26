"use server";

import { createClient } from "@/lib/supabase/server";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const leadSchema = z.object({
    full_name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    phone: z.string().min(1, "Phone is required"),
    interest_level: z.enum(["High", "Medium", "Low"]).default("Medium"),
    notes: z.string().optional(),
});

export async function submitLead(formData: FormData) {
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
        return { success: false, errors: validation.error.flatten().fieldErrors };
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

    const { error } = await supabase
        .from("leads")
        .insert(payload as any);

    if (error) {
        console.error("Supabase Error:", error);
        return { success: false, message: "Failed to submit. Please try again." };
    }

    revalidatePath("/admin");
    return { success: true, message: "Request received. We will deploy shortly." };
}
