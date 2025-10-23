(async () => {
  // Read .env manually to avoid adding dotenv dependency
  const fs = require('fs');
  const path = require('path');
  const envPath = path.resolve(__dirname, '..', '.env');
  let env = {};
  try {
    const content = fs.readFileSync(envPath, 'utf8');
    for (const line of content.split(/\r?\n/)) {
      const m = line.match(/^\s*([^#][^=\s]*)\s*=\s*(.*)$/);
      if (m) env[m[1]] = m[2].replace(/^['\"]|['\"]$/g, '');
    }
  } catch (e) {}

  const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || env.SUPABASE_URL;
  const SERVICE_ROLE = env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !SERVICE_ROLE) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
    process.exit(1);
  }

  const targetEmail = 'adaridileep@gmail.com';
  const password = process.env.MOCK_USER_PASSWORD || 'Delhigoogl@2004';

  const url = `${SUPABASE_URL.replace(/\/+$/, '')}/auth/v1/admin/users`;

  console.log('Creating user via', url);

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SERVICE_ROLE,
        Authorization: `Bearer ${SERVICE_ROLE}`,
      },
      body: JSON.stringify({ email: targetEmail, password, email_confirm: true }),
    });

    const text = await res.text();
    let body;
    try { body = JSON.parse(text); } catch { body = text; }
    console.log('Status:', res.status);
    console.log('Response:', JSON.stringify(body, null, 2));
  } catch (err) {
    console.error('Request failed:', err);
  }
})();
