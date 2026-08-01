-- Public bucket for scene image assets (.raw pixel dumps). Public read is
-- required - the ESP32 fetches these over a plain HTTPS GET with no auth of
-- its own. Uploads are still restricted to their owner via RLS, scoped by a
-- per-user folder prefix (<user_id>/<filename>).

INSERT INTO storage.buckets (id, name, public)
VALUES ('scene-assets', 'scene-assets', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "scene_assets_public_read" ON storage.objects;
DROP POLICY IF EXISTS "scene_assets_owner_insert" ON storage.objects;
DROP POLICY IF EXISTS "scene_assets_owner_delete" ON storage.objects;

CREATE POLICY "scene_assets_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'scene-assets');

CREATE POLICY "scene_assets_owner_insert" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'scene-assets' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "scene_assets_owner_delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'scene-assets' AND (storage.foldername(name))[1] = auth.uid()::text);
