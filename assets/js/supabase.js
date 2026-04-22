// ======================================================
// MEYVƏÇİ.AZ - SUPABASE CONFIG
// Yalnız public anon key frontend-də istifadə olunur
// ======================================================

const SUPABASE_URL = "https://ozrcfjibufzfmvydccst.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96cmNmamlidWZ6Zm12eWRjY3N0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1NDcxMTIsImV4cCI6MjA5MjEyMzExMn0.rc9hmJm1DwltaI4VDOOsyIuYPT9Lod-xXWg7mf6QwWw";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
);


window.__sessionCache = { value: null, expiresAt: 0 };
window.__userCache = { value: null, expiresAt: 0 };

async function getCachedSession(force = false) {
  const now = Date.now();
  if (!force && window.__sessionCache.value && window.__sessionCache.expiresAt > now) {
    return { data: { session: window.__sessionCache.value }, error: null };
  }
  const res = await supabaseClient.auth.getSession();
  window.__sessionCache = {
    value: res?.data?.session || null,
    expiresAt: now + 10000
  };
  return res;
}

async function getCachedUser(force = false) {
  const now = Date.now();
  if (!force && window.__userCache.value && window.__userCache.expiresAt > now) {
    return { data: { user: window.__userCache.value }, error: null };
  }
  const res = await supabaseClient.auth.getUser();
  window.__userCache = {
    value: res?.data?.user || null,
    expiresAt: now + 10000
  };
  return res;
}

supabaseClient.auth.onAuthStateChange((_event, session) => {
  window.__sessionCache = { value: session || null, expiresAt: Date.now() + 10000 };
  window.__userCache = { value: session?.user || null, expiresAt: Date.now() + 10000 };
});

supabaseClient.auth.onAuthStateChange((_event, session) => { window.__roleCache = { value: session?.user ? null : null, expiresAt: 0 }; });
