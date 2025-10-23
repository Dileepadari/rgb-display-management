// Load .env so environment variables from the project's .env are available
try {
  require('dotenv').config({ path: require('path').resolve(__dirname, '..', '.env') })
} catch (e) {
  // ignore if dotenv isn't installed; we'll fall back to process.env
}
// Use the global fetch available in Node 18+ to avoid installing node-fetch
const fs = require('fs')

const BASE = process.env.BASE_URL || 'http://localhost:3000'
let SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
if (!SUPABASE_URL) {
  // try to read .env manually
  try {
    const envPath = require('path').resolve(__dirname, '..', '.env')
    const content = fs.readFileSync(envPath, 'utf8')
    for (const line of content.split(/\r?\n/)) {
      const m = line.match(/^\s*(NEXT_PUBLIC_SUPABASE_URL|SUPABASE_URL)\s*=\s*(.*)\s*$/)
      if (m) {
        SUPABASE_URL = m[2].trim().replace(/(^['"]|['"]$)/g, '')
        break
      }
    }
  } catch (e) {
    // ignore
  }
}
// Ensure we have API key in environment; if not, try to parse .env manually
let API_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
if (!API_KEY) {
  try {
    const envPath = require('path').resolve(__dirname, '..', '.env')
    const content = fs.readFileSync(envPath, 'utf8')
    for (const line of content.split(/\r?\n/)) {
      const m = line.match(/^\s*(NEXT_PUBLIC_SUPABASE_ANON_KEY|SUPABASE_ANON_KEY|SUPABASE_SERVICE_ROLE_KEY)\s*=\s*(.*)\s*$/)
      if (m) {
        API_KEY = m[2].trim().replace(/(^['"]|['"]$)/g, '')
        break
      }
    }
    if (API_KEY) process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = API_KEY
  } catch (e) {
    // ignore
  }
}

async function signIn(email, password) {
  const url = `${SUPABASE_URL}/auth/v1/token?grant_type=password`
  const API_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
  let resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', apikey: API_KEY },
    body: JSON.stringify({ email, password }),
  })
  if (resp.status === 401) {
    // Try with apikey as query param
    const url2 = `${url}&apikey=${encodeURIComponent(API_KEY)}`
    resp = await fetch(url2, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
  }
  const data = await resp.json()
  return { status: resp.status, data, headers: Object.fromEntries(resp.headers.entries()) }
}

async function run() {
  const email = process.env.SUPABASE_TEST_EMAIL || 'adaridileep@gmail.com'
  const password = process.env.SUPABASE_TEST_PASSWORD || 'Delhigoogl@2004'

  console.log('Signing in...')
  console.log('SUPABASE_URL:', SUPABASE_URL)
  const API_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
  console.log('API_KEY present:', !!API_KEY, 'length=', API_KEY ? API_KEY.length : 0)
  const sign = await signIn(email, password)
  console.log('Sign-in status:', sign.status)
  // supabase returns access_token in response body and sets cookies when using browser flow.
  const accessToken = sign.data.access_token

  if (!accessToken) {
    console.error('No access token returned. Response body:')
    console.error(JSON.stringify(sign.data, null, 2))
    process.exit(1)
  }

  // We'll use Authorization: Bearer <access_token> when calling API routes
  const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` }

  const routes = [
    { method: 'GET', path: '/api/devices' },
    { method: 'POST', path: '/api/devices', body: { name: 'test-device', ip: '192.0.2.1', type: 'rgb', mqtt_topic: 'devices/test' } },
    { method: 'GET', path: '/api/device-configs' },
    { method: 'POST', path: '/api/device-configs', body: { device_id: 1, name: 'default', config: { brightness: 80 } } },
    { method: 'GET', path: '/api/moods' },
    { method: 'POST', path: '/api/moods', body: { name: 'Test Mood', colors: ['#ff0000'], transition: 1000 } },
    { method: 'GET', path: '/api/playlists' },
    { method: 'POST', path: '/api/playlists', body: { name: 'Test Playlist', items: [] } },
    { method: 'GET', path: '/api/scenes' },
    { method: 'POST', path: '/api/scenes', body: { name: 'Test Scene', steps: [] } },
    { method: 'POST', path: '/api/mqtt/publish', body: { topic: 'devices/test', message: 'hello' } },
    { method: 'GET', path: '/api/sync-config' },
    { method: 'POST', path: '/api/thingspeak/sync', body: { channel_id: '3128483', field1: 50 } },
  ]

  const results = []
  for (const r of routes) {
    const opts = { method: r.method, headers }
    if (r.body) opts.body = JSON.stringify(r.body)
    try {
      const res = await fetch(BASE + r.path, opts)
      const text = await res.text()
      let body = null
      try { body = JSON.parse(text) } catch { body = text }
      results.push({ path: r.path, method: r.method, status: res.status, body })
      console.log(`${r.method} ${r.path} -> ${res.status}`)
    } catch (err) {
      results.push({ path: r.path, method: r.method, error: String(err) })
      console.error('Request failed for', r.path, err)
    }
  }

  fs.writeFileSync('/tmp/authenticated_test_results.json', JSON.stringify(results, null, 2))
  console.log('Results written to /tmp/authenticated_test_results.json')
}

run().catch(e => { console.error(e); process.exit(1) })
