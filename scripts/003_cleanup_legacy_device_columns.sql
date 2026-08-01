-- Removes device columns that predate this repo's migration scripts (added
-- directly against the live database at some point - schema drift), and are
-- unreferenced anywhere in the codebase. Superseded by 002's typed
-- thingspeak_read_key/thingspeak_write_key/device_api_token/current_revision
-- and the device_assignments table.

ALTER TABLE public.devices
  DROP COLUMN IF EXISTS thingspeak_channel_id, -- was bigint; re-added as TEXT below
  DROP COLUMN IF EXISTS thingspeak_read_api_key,
  DROP COLUMN IF EXISTS thingspeak_write_api_key,
  DROP COLUMN IF EXISTS current_scene,
  DROP COLUMN IF EXISTS current_playlist;

ALTER TABLE public.devices
  ADD COLUMN IF NOT EXISTS thingspeak_channel_id TEXT;
