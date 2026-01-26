export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            leads: {
                Row: {
                    id: string
                    created_at: string
                    full_name: string
                    email: string | null
                    phone: string | null
                    interest_level: 'High' | 'Medium' | 'Low' | null
                    status: 'New' | 'Contacted' | 'Converted' | 'Archived' | null
                    notes: string | null
                }
                Insert: {
                    id?: string
                    created_at?: string
                    full_name: string
                    email?: string | null
                    phone?: string | null
                    interest_level?: 'High' | 'Medium' | 'Low' | null
                    status?: 'New' | 'Contacted' | 'Converted' | 'Archived' | null
                    notes?: string | null
                }
                Update: {
                    id?: string
                    created_at?: string
                    full_name?: string
                    email?: string | null
                    phone?: string | null
                    interest_level?: 'High' | 'Medium' | 'Low' | null
                    status?: 'New' | 'Contacted' | 'Converted' | 'Archived' | null
                    notes?: string | null
                }
            }
        }
    }
}
