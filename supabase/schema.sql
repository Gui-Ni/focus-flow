-- ===========================================
-- Focus Flow - Supabase Database Schema
-- ===========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===========================================
-- ENUMS
-- ===========================================

CREATE TYPE subscription_status AS ENUM ('free', 'pro', 'cancelled');
CREATE TYPE focus_mode AS ENUM ('recharge', 'inspiration', 'pomodoro');
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high');

-- ===========================================
-- TABLES
-- ===========================================

-- User profiles (extends Supabase auth.users)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT,
    name TEXT,
    avatar_url TEXT,
    subscription_status subscription_status DEFAULT 'free',
    subscription_id TEXT,
    subscription_end_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Focus sessions
CREATE TABLE public.focus_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    mode focus_mode NOT NULL,
    duration_minutes INTEGER NOT NULL,
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tasks
CREATE TABLE public.tasks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    priority task_priority DEFAULT 'medium',
    completed BOOLEAN DEFAULT FALSE,
    due_date TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Themes (predefined)
CREATE TABLE public.themes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    thumbnail_url TEXT,
    is_premium BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User theme preferences
CREATE TABLE public.user_themes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    theme_id UUID REFERENCES public.themes(id) ON DELETE CASCADE NOT NULL,
    is_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, theme_id)
);

-- ===========================================
-- FUNCTIONS
-- ===========================================

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ===========================================
-- ROW LEVEL SECURITY
-- ===========================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.focus_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_themes ENABLE ROW LEVEL SECURITY;

-- Profiles: users can only see/edit their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Focus sessions: users can only access their own sessions
CREATE POLICY "Users can manage own focus sessions" ON public.focus_sessions
    FOR ALL USING (auth.uid() = user_id);

-- Tasks: users can only access their own tasks
CREATE POLICY "Users can manage own tasks" ON public.tasks
    FOR ALL USING (auth.uid() = user_id);

-- User themes: users can only access their own theme preferences
CREATE POLICY "Users can manage own themes" ON public.user_themes
    FOR ALL USING (auth.uid() = user_id);

-- Themes: everyone can view themes
CREATE POLICY "Everyone can view themes" ON public.themes
    FOR SELECT USING (true);

-- ===========================================
-- SEED DATA
-- ===========================================

-- Insert default themes
INSERT INTO public.themes (name, slug, is_premium) VALUES
    ('Deep Ocean', 'deep-ocean', false),
    ('Forest Morning', 'forest-morning', false),
    ('Northern Lights', 'northern-lights', false),
    ('Tokyo Night', 'tokyo-night', false),
    ('Aurora Dreams', 'aurora-dreams', true),
    ('Space Odyssey', 'space-odyssey', true),
    ('Zen Garden', 'zen-garden', true),
    ('Arctic Silence', 'arctic-silence', true);
