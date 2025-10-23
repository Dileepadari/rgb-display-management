# Database Setup Guide

## Prerequisites
- Supabase account and project created
- Environment variables configured in Vercel

## Step 1: Access Supabase SQL Editor

1. Go to your Supabase project dashboard
2. Navigate to the "SQL Editor" section
3. Click "New Query"

## Step 2: Run Migration Script

Copy the entire content from `scripts/001_create_tables.sql` and paste it into the SQL editor.

Click "Run" to execute the migration.

## Step 3: Verify Tables

After successful execution, verify all tables were created:

1. Go to "Table Editor" in Supabase
2. You should see the following tables:
   - profiles
   - devices
   - scenes
   - playlists
   - playlist_assignments
   - moods
   - device_moods
   - device_configs
   - telemetry

## Step 4: Verify RLS Policies

1. For each table, click on it
2. Go to the "RLS" tab
3. Verify that RLS is enabled and policies are created

## Step 5: Test Connection

1. In your application, sign up for a new account
2. Navigate to the Devices page
3. Try adding a new device
4. Verify the device appears in the list

## Troubleshooting

### Issue: "Permission denied" errors
**Solution**: Ensure RLS policies are correctly created. Check the RLS tab for each table.

### Issue: Tables not appearing
**Solution**: Refresh the page or check the SQL execution logs for errors.

### Issue: Authentication errors
**Solution**: Verify environment variables are correctly set in Vercel project settings.

## Database Backup

To backup your database:
1. Go to Supabase project settings
2. Navigate to "Backups"
3. Click "Create backup"

## Database Restore

To restore from a backup:
1. Go to Supabase project settings
2. Navigate to "Backups"
3. Select the backup and click "Restore"

---

For more information, visit: https://supabase.com/docs
