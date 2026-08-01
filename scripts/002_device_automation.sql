-- Device automation: per-device panel config, dedicated ThingSpeak channel,
-- device API token (auth for /api/device-feed/[token]), content revision
-- tracking, and what's currently assigned to each device.

ALTER TABLE public.devices
  ADD COLUMN IF NOT EXISTS panel_cols INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS panel_rows INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS panel_unit_size INTEGER NOT NULL DEFAULT 64,
  ADD COLUMN IF NOT EXISTS thingspeak_channel_id TEXT,
  ADD COLUMN IF NOT EXISTS thingspeak_read_key TEXT,
  ADD COLUMN IF NOT EXISTS thingspeak_write_key TEXT,
  ADD COLUMN IF NOT EXISTS device_api_token TEXT UNIQUE DEFAULT replace(gen_random_uuid()::text, '-', ''),
  ADD COLUMN IF NOT EXISTS current_revision INTEGER NOT NULL DEFAULT 0;

-- What's currently assigned to each device (one row per device). This is what
-- /api/device-feed/[token] reads, and what the Devices/Admin UI shows as
-- "what's live on this panel right now".
CREATE TABLE IF NOT EXISTS public.device_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  device_id UUID NOT NULL UNIQUE REFERENCES public.devices(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL CHECK (target_type IN ('scene', 'playlist')),
  scene_id UUID REFERENCES public.scenes(id) ON DELETE SET NULL,
  playlist_id UUID REFERENCES public.playlists(id) ON DELETE SET NULL,
  revision INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE public.device_assignments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "device_assignments_select_own" ON public.device_assignments;
DROP POLICY IF EXISTS "device_assignments_insert_own" ON public.device_assignments;
DROP POLICY IF EXISTS "device_assignments_update_own" ON public.device_assignments;
DROP POLICY IF EXISTS "device_assignments_delete_own" ON public.device_assignments;

CREATE POLICY "device_assignments_select_own" ON public.device_assignments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "device_assignments_insert_own" ON public.device_assignments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "device_assignments_update_own" ON public.device_assignments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "device_assignments_delete_own" ON public.device_assignments FOR DELETE USING (auth.uid() = user_id);
