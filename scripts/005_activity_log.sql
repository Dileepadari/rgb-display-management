-- Chronological record of things that happened to a user's devices/content,
-- surfaced as the dashboard's Activity Feed. Written at the points that
-- already mutate device state: assigning a scene/playlist (which also bumps
-- the revision and notifies over ThingSpeak) and the heartbeat cron noticing
-- a device changed online/offline.

CREATE TABLE IF NOT EXISTS public.activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('assign', 'device_online', 'device_offline')),
  message TEXT NOT NULL,
  device_id UUID REFERENCES public.devices(id) ON DELETE CASCADE,
  scene_id UUID REFERENCES public.scenes(id) ON DELETE SET NULL,
  playlist_id UUID REFERENCES public.playlists(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- The feed is always "this user's rows, newest first".
CREATE INDEX IF NOT EXISTS activity_log_user_created_idx
  ON public.activity_log (user_id, created_at DESC);

ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "activity_log_select_own" ON public.activity_log;
DROP POLICY IF EXISTS "activity_log_insert_own" ON public.activity_log;
DROP POLICY IF EXISTS "activity_log_delete_own" ON public.activity_log;

CREATE POLICY "activity_log_select_own" ON public.activity_log FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "activity_log_insert_own" ON public.activity_log FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "activity_log_delete_own" ON public.activity_log FOR DELETE USING (auth.uid() = user_id);
