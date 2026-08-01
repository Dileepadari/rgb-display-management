-- Moods become "reactions": a character that enters the panel on top of
-- whatever scene is playing, performs an emote, then either stays or leaves.
--
-- Before this, applying a mood wrote a row to device_moods that nothing ever
-- read - no revision bump, no ThingSpeak notification, nothing in the device
-- feed. The panel never learned a mood existed. These columns are what the
-- feed and firmware now render.

-- What the reaction looks like.
ALTER TABLE public.moods ADD COLUMN IF NOT EXISTS character TEXT NOT NULL DEFAULT 'cat';
ALTER TABLE public.moods ADD COLUMN IF NOT EXISTS emote TEXT NOT NULL DEFAULT 'happy';

-- How it arrives, how long it performs, and what happens afterwards.
ALTER TABLE public.moods ADD COLUMN IF NOT EXISTS entrance TEXT NOT NULL DEFAULT 'slide-left';
ALTER TABLE public.moods ADD COLUMN IF NOT EXISTS hold_seconds INT NOT NULL DEFAULT 5;
ALTER TABLE public.moods ADD COLUMN IF NOT EXISTS after_reaction TEXT NOT NULL DEFAULT 'leave';
ALTER TABLE public.moods ADD COLUMN IF NOT EXISTS position TEXT NOT NULL DEFAULT 'bottom-left';
ALTER TABLE public.moods ADD COLUMN IF NOT EXISTS scale INT NOT NULL DEFAULT 2;

-- The existing `color` column is reused as the tint wash over the scene.
ALTER TABLE public.moods ADD COLUMN IF NOT EXISTS tint_strength INT NOT NULL DEFAULT 20;

-- Constrain to the vocabularies the firmware actually implements. Written as
-- drop-then-add so re-running the migration after a vocabulary change works.
ALTER TABLE public.moods DROP CONSTRAINT IF EXISTS moods_entrance_check;
ALTER TABLE public.moods ADD CONSTRAINT moods_entrance_check
  CHECK (entrance IN ('slide-left', 'slide-right', 'drop', 'fade', 'pop'));

ALTER TABLE public.moods DROP CONSTRAINT IF EXISTS moods_after_check;
ALTER TABLE public.moods ADD CONSTRAINT moods_after_check
  CHECK (after_reaction IN ('stay', 'leave'));

ALTER TABLE public.moods DROP CONSTRAINT IF EXISTS moods_position_check;
ALTER TABLE public.moods ADD CONSTRAINT moods_position_check
  CHECK (position IN ('bottom-left', 'bottom-right', 'top-left', 'top-right', 'center'));

ALTER TABLE public.moods DROP CONSTRAINT IF EXISTS moods_tint_check;
ALTER TABLE public.moods ADD CONSTRAINT moods_tint_check
  CHECK (tint_strength BETWEEN 0 AND 100);

ALTER TABLE public.moods DROP CONSTRAINT IF EXISTS moods_hold_check;
ALTER TABLE public.moods ADD CONSTRAINT moods_hold_check
  CHECK (hold_seconds BETWEEN 1 AND 300);

-- icon/animation were written as hardcoded literals by the create form and
-- read by nothing. Superseded by character/emote.
ALTER TABLE public.moods DROP COLUMN IF EXISTS icon;
ALTER TABLE public.moods DROP COLUMN IF EXISTS animation;

-- Which mood is currently live on a device, and when it started - the
-- firmware needs the start time to know how far through the entrance/hold/exit
-- lifecycle it is.
ALTER TABLE public.device_assignments ADD COLUMN IF NOT EXISTS active_mood_id UUID
  REFERENCES public.moods(id) ON DELETE SET NULL;
ALTER TABLE public.device_assignments ADD COLUMN IF NOT EXISTS mood_started_at TIMESTAMPTZ;

-- Moods now produce activity entries like scene/playlist pushes do.
ALTER TABLE public.activity_log DROP CONSTRAINT IF EXISTS activity_log_type_check;
ALTER TABLE public.activity_log ADD CONSTRAINT activity_log_type_check
  CHECK (type IN ('assign', 'device_online', 'device_offline', 'mood', 'mood_cleared'));

-- device_moods stays as the historical record of what was applied when; it is
-- no longer the mechanism by which a mood reaches a panel.
