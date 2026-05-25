import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      clients: {
        Row: {
          id: string;
          name: string;
          address: string;
          price: string;
          last_contact: number;
          status: 'active' | 'warming' | 'cold';
          current_stage: number;
          next_action: string;
          agent: string;
          source: string;
          entered_stage: number;
          type: 'seller' | 'buyer';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          address: string;
          price: string;
          last_contact: number;
          status: 'active' | 'warming' | 'cold';
          current_stage: number;
          next_action: string;
          agent: string;
          source: string;
          entered_stage: number;
          type: 'seller' | 'buyer';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          address?: string;
          price?: string;
          last_contact?: number;
          status?: 'active' | 'warming' | 'cold';
          current_stage?: number;
          next_action?: string;
          agent?: string;
          source?: string;
          entered_stage?: number;
          type?: 'seller' | 'buyer';
          updated_at?: string;
        };
      };
    };
  };
};
