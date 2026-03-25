import { createBrowserClient } from '@supabase/ssr';

export const createClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};

// Database types for your schema
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          name: string | null;
          avatar_url: string | null;
          subscription_status: 'free' | 'pro' | 'cancelled';
          subscription_id: string | null;
          subscription_end_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          name?: string | null;
          avatar_url?: string | null;
          subscription_status?: 'free' | 'pro' | 'cancelled';
          subscription_id?: string | null;
          subscription_end_date?: string | null;
        };
        Update: {
          email?: string | null;
          name?: string | null;
          avatar_url?: string | null;
          subscription_status?: 'free' | 'pro' | 'cancelled';
          subscription_id?: string | null;
          subscription_end_date?: string | null;
          updated_at?: string;
        };
      };
      focus_sessions: {
        Row: {
          id: string;
          user_id: string;
          mode: 'recharge' | 'inspiration' | 'pomodoro';
          duration_minutes: number;
          completed_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          mode: 'recharge' | 'inspiration' | 'pomodoro';
          duration_minutes: number;
          completed_at?: string;
        };
        Update: {
          mode?: 'recharge' | 'inspiration' | 'pomodoro';
          duration_minutes?: number;
          completed_at?: string;
        };
      };
      tasks: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          priority: 'low' | 'medium' | 'high';
          completed: boolean;
          due_date: string | null;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          priority?: 'low' | 'medium' | 'high';
          completed?: boolean;
          due_date?: string | null;
          completed_at?: string | null;
        };
        Update: {
          title?: string;
          description?: string | null;
          priority?: 'low' | 'medium' | 'high';
          completed?: boolean;
          due_date?: string | null;
          completed_at?: string | null;
          updated_at?: string;
        };
      };
      themes: {
        Row: {
          id: string;
          name: string;
          slug: string;
          thumbnail_url: string | null;
          is_premium: boolean;
          created_at: string;
        };
      };
    };
  };
};
