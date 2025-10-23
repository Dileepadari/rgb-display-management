-- Insert a mock user profile and default moods for testing
-- Run this in Supabase SQL editor (recommended) or with psql against your database.

DO $$
DECLARE
  target_email TEXT := 'adaridileep@gmail.com';
  existing_id UUID;
  new_id UUID;
BEGIN
  -- If a profile already exists for this email, reuse its id
  SELECT id INTO existing_id FROM public.profiles WHERE email = target_email LIMIT 1;

  IF existing_id IS NOT NULL THEN
    RAISE NOTICE 'Profile already exists for % with id %', target_email, existing_id;
  ELSE
    new_id := gen_random_uuid();
    INSERT INTO public.profiles (id, email, full_name, created_at, updated_at)
    VALUES (new_id, target_email, 'Mock User', now(), now());
    existing_id := new_id;
    RAISE NOTICE 'Inserted new profile for % with id %', target_email, existing_id;
  END IF;

  -- Insert default moods for this user if they don't exist
  INSERT INTO public.moods (user_id, name, description, color, icon, animation, is_custom, created_at, updated_at)
  SELECT existing_id, name, description, color, icon, animation, FALSE, now(), now()
  FROM (VALUES
    ('Focus', 'Deep concentration mode', '#3B82F6', 'focus', 'pulse'),
    ('Creative', 'Creative inspiration mode', '#EC4899', 'sparkles', 'bounce'),
    ('Relaxed', 'Calm and peaceful mode', '#10B981', 'leaf', 'fade'),
    ('Energetic', 'High energy mode', '#F59E0B', 'zap', 'flash')
  ) AS t(name, description, color, icon, animation)
  WHERE NOT EXISTS (
    SELECT 1 FROM public.moods m WHERE m.user_id = existing_id AND m.name = t.name
  );

  RAISE NOTICE 'Default moods ensured for user id %', existing_id;
END $$;
