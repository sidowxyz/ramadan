// Local development proxy for the Quran Foundation Content API.
// Holds the OAuth2 client secret on this machine so it never ships in the app.
// Run: node server/qf-proxy.mjs   (app calls http://<this-pc>:8787/quran/...)
// For launch, move this logic to a hosted function (e.g. a Supabase Edge Function).
import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
for (const line of readFileSync(join(here, '.env.local'), 'utf8').split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}

const { QF_CLIENT_ID, QF_CLIENT_SECRET } = process.env;
const ENV = process.env.QF_ENV === 'production' ? 'production' : 'prelive';
const AUTH_URL = ENV === 'production' ? 'https://oauth2.quran.foundation' : 'https://prelive-oauth2.quran.foundation';
const API_URL = ENV === 'production' ? 'https://apis.quran.foundation' : 'https://apis-prelive.quran.foundation';
const PORT = Number(process.env.PORT || 8787);

if (!QF_CLIENT_ID || !QF_CLIENT_SECRET) {
  console.error('Missing QF_CLIENT_ID / QF_CLIENT_SECRET in server/.env.local');
  process.exit(1);
}

let token = null; // { value, expiresAt }

async function getToken(force = false) {
  if (!force && token && Date.now() < token.expiresAt) return token.value;
  const res = await fetch(`${AUTH_URL}/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${QF_CLIENT_ID}:${QF_CLIENT_SECRET}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials&scope=content',
  });
  if (!res.ok) throw new Error(`Token request failed: ${res.status} ${await res.text()}`);
  const json = await res.json();
  // Refresh a minute early so a request never races the expiry.
  token = { value: json.access_token, expiresAt: Date.now() + (json.expires_in - 60) * 1000 };
  return token.value;
}

async function callApi(path, retried = false) {
  const res = await fetch(`${API_URL}/content/api/v4${path}`, {
    headers: { 'x-auth-token': await getToken(retried), 'x-client-id': QF_CLIENT_ID },
  });
  if (res.status === 401 && !retried) return callApi(path, true);
  return res;
}

// Prelive only carries a sample of the Qur'an (2 surahs, 14 translations).
// Until production credentials are added, anything missing there is filled
// from the public Quran.com v4 API, which uses the same response format.
const PUBLIC_API = 'https://api.quran.com/api/v4';

function incomplete(path, json) {
  if (path.startsWith('/chapters?') && Array.isArray(json.chapters) && json.chapters.length < 114) return true;
  if (/[?&]translations=/.test(path) && Array.isArray(json.verses)) {
    return json.verses.some((v) => !v.translations || v.translations.length === 0);
  }
  return false;
}

async function load(path) {
  try {
    const upstream = await callApi(path);
    if (upstream.ok) {
      const body = await upstream.text();
      if (!incomplete(path, JSON.parse(body))) return { status: 200, body, source: 'quran.foundation' };
    }
  } catch (e) {
    console.warn(`QF failed for ${path}: ${e.message}`);
  }
  const res = await fetch(`${PUBLIC_API}${path}`);
  return { status: res.status, body: await res.text(), source: 'quran.com' };
}

// Short in-memory cache: Qur'an content doesn't change.
const cache = new Map();

createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.end();
  const url = new URL(req.url, 'http://localhost');
  if (!url.pathname.startsWith('/quran/')) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: 'Use /quran/<content-api-path>' }));
  }
  const path = url.pathname.slice('/quran'.length) + url.search;
  try {
    if (!cache.has(path)) {
      const result = await load(path);
      if (result.status !== 200) {
        res.writeHead(result.status, { 'Content-Type': 'application/json' });
        return res.end(result.body);
      }
      cache.set(path, result);
    }
    const hit = cache.get(path);
    res.writeHead(200, { 'Content-Type': 'application/json', 'x-source': hit.source });
    res.end(hit.body);
    console.log(`200 ${hit.source} ${path}`);
  } catch (e) {
    console.error(e);
    res.writeHead(502, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: String(e.message || e) }));
  }
}).listen(PORT, '0.0.0.0', () => {
  console.log(`Quran proxy (${ENV}) on http://0.0.0.0:${PORT}/quran/...`);
});
