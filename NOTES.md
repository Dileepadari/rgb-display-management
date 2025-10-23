Environment and quick start

Required environment variables (set in .env or host):

- NEXT_PUBLIC_SUPABASE_URL - Supabase project URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY - Supabase anon/public key
- SUPABASE_SERVICE_ROLE_KEY - (optional) service role key for server operations
- NEXT_PUBLIC_MQTT_BROKER or MQTT_BROKER - MQTT broker URL (e.g. mqtt://broker.example.com)
- NEXT_PUBLIC_MQTT_PORT or MQTT_PORT - MQTT broker port (e.g. 1883)

Database migration

Run the SQL file `scripts/001_create_tables.sql` against your Supabase/Postgres database. Example:

psql "postgresql://<user>:<pass>@<host>:<port>/<db>" -f scripts/001_create_tables.sql

Notes
- API routes under `app/api` are wired to Supabase server client using `lib/supabase/server.ts`.
- The server includes a lightweight MQTT publisher helper at `lib/supabase/mqtt-server.ts` which uses `mqtt` package. Install mqtt in your project `pnpm add mqtt`.
- Frontend components `components/device-manager.tsx`, `components/device-config-panel.tsx`, and `components/scene-manager.tsx` now call the API endpoints for full CRUD operations.
