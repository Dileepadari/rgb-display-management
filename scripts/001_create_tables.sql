-- Create users profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create devices table
CREATE TABLE IF NOT EXISTS public.devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  device_id TEXT NOT NULL UNIQUE,
  panel_width INTEGER DEFAULT 1,
  panel_height INTEGER DEFAULT 1,
  brightness INTEGER DEFAULT 100,
  color_mode TEXT DEFAULT 'RGB',
  update_interval INTEGER DEFAULT 1000,
  timezone TEXT DEFAULT 'UTC',
  is_online BOOLEAN DEFAULT FALSE,
  last_sync TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create scenes table
CREATE TABLE IF NOT EXISTS public.scenes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  panel_width INTEGER DEFAULT 1,
  panel_height INTEGER DEFAULT 1,
  elements JSONB DEFAULT '[]'::jsonb,
  thumbnail TEXT,
  is_active BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create playlists table
CREATE TABLE IF NOT EXISTS public.playlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  scenes JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT FALSE,
  loop BOOLEAN DEFAULT TRUE,
  shuffle BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create playlist assignments table
CREATE TABLE IF NOT EXISTS public.playlist_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  playlist_id UUID NOT NULL REFERENCES public.playlists(id) ON DELETE CASCADE,
  device_id UUID NOT NULL REFERENCES public.devices(id) ON DELETE CASCADE,
  schedule_type TEXT DEFAULT 'once',
  schedule_time TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create moods table
CREATE TABLE IF NOT EXISTS public.moods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT NOT NULL,
  icon TEXT,
  animation TEXT,
  is_custom BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create device moods table
CREATE TABLE IF NOT EXISTS public.device_moods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  device_id UUID NOT NULL REFERENCES public.devices(id) ON DELETE CASCADE,
  mood_id UUID NOT NULL REFERENCES public.moods(id) ON DELETE CASCADE,
  applied_at TIMESTAMP DEFAULT NOW()
);

-- Create device configurations table
CREATE TABLE IF NOT EXISTS public.device_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  device_id UUID NOT NULL REFERENCES public.devices(id) ON DELETE CASCADE,
  config_key TEXT NOT NULL,
  config_value JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create telemetry table
CREATE TABLE IF NOT EXISTS public.telemetry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  device_id UUID NOT NULL REFERENCES public.devices(id) ON DELETE CASCADE,
  temperature FLOAT,
  power_consumption FLOAT,
  signal_strength INTEGER,
  uptime INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scenes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlist_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_moods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.telemetry ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies for profiles
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- Create RLS Policies for devices
CREATE POLICY "devices_select_own" ON public.devices FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "devices_insert_own" ON public.devices FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "devices_update_own" ON public.devices FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "devices_delete_own" ON public.devices FOR DELETE USING (auth.uid() = user_id);

-- Create RLS Policies for scenes
CREATE POLICY "scenes_select_own" ON public.scenes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "scenes_insert_own" ON public.scenes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "scenes_update_own" ON public.scenes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "scenes_delete_own" ON public.scenes FOR DELETE USING (auth.uid() = user_id);

-- Create RLS Policies for playlists
CREATE POLICY "playlists_select_own" ON public.playlists FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "playlists_insert_own" ON public.playlists FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "playlists_update_own" ON public.playlists FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "playlists_delete_own" ON public.playlists FOR DELETE USING (auth.uid() = user_id);

-- Create RLS Policies for playlist_assignments
CREATE POLICY "playlist_assignments_select_own" ON public.playlist_assignments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "playlist_assignments_insert_own" ON public.playlist_assignments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "playlist_assignments_update_own" ON public.playlist_assignments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "playlist_assignments_delete_own" ON public.playlist_assignments FOR DELETE USING (auth.uid() = user_id);

-- Create RLS Policies for moods
CREATE POLICY "moods_select_own" ON public.moods FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "moods_insert_own" ON public.moods FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "moods_update_own" ON public.moods FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "moods_delete_own" ON public.moods FOR DELETE USING (auth.uid() = user_id);

-- Create RLS Policies for device_moods
CREATE POLICY "device_moods_select_own" ON public.device_moods FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "device_moods_insert_own" ON public.device_moods FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "device_moods_delete_own" ON public.device_moods FOR DELETE USING (auth.uid() = user_id);

-- Create RLS Policies for device_configs
CREATE POLICY "device_configs_select_own" ON public.device_configs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "device_configs_insert_own" ON public.device_configs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "device_configs_update_own" ON public.device_configs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "device_configs_delete_own" ON public.device_configs FOR DELETE USING (auth.uid() = user_id);

-- Create RLS Policies for telemetry
CREATE POLICY "telemetry_select_own" ON public.telemetry FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "telemetry_insert_own" ON public.telemetry FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create trigger for auto-creating profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create default moods
INSERT INTO public.moods (user_id, name, description, color, icon, animation, is_custom)
SELECT 
  auth.uid(),
  name,
  description,
  color,
  icon,
  animation,
  FALSE
FROM (
  VALUES
    ('Focus', 'Deep concentration mode', '#3B82F6', 'focus', 'pulse', FALSE),
    ('Creative', 'Creative inspiration mode', '#EC4899', 'sparkles', 'bounce', FALSE),
    ('Relaxed', 'Calm and peaceful mode', '#10B981', 'leaf', 'fade', FALSE),
    ('Energetic', 'High energy mode', '#F59E0B', 'zap', 'flash', FALSE)
) AS t(name, description, color, icon, animation)
WHERE NOT EXISTS (SELECT 1 FROM public.moods WHERE user_id = auth.uid());
