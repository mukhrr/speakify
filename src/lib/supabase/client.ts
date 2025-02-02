import { createClient } from '@supabase/supabase-js';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);

// Types for your database schema
export type Database = {
  public: {
    tables: {
      speaking_test_results: {
        Row: {
          id: string;
          created_at: string;
          user_id: string;
          test_id: string;
          results: {
            partNumber: number;
            scores: {
              fluency: number;
              pronunciation: number;
              grammar: number;
              vocabulary: number;
              overall: number;
            };
            feedback: string[];
            summary: string;
            timestamp: string;
            audioUrl?: string;
          }[];
          overall_band_score: number;
        };
        Insert: Omit<
          Database['public']['tables']['speaking_test_results']['Row'],
          'id' | 'created_at'
        >;
      };
      users: {
        Row: {
          id: string;
          email: string;
          name?: string;
          created_at: string;
        };
      };
    };
  };
};
