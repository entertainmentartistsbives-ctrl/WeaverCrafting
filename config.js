// ─────────────────────────────────────────────────────────────
// Weaver's Crafting — Central Configuration & Status Controller
// ─────────────────────────────────────────────────────────────

// ═══════════════════════════════════════════════════════════════
// 🔒 SITE STATUS CONTROLLER (PAYMENT / MAINTENANCE GATEWAY)
// ═══════════════════════════════════════════════════════════════
// Set SITE_ACTIVE to:
//   false -> Website is stopped (shows realistic 503 Database Error)
//   true  -> Website is live and functions normally
//
// 🔑 DEVELOPER BYPASS:
//   1. Visit with URL parameter: ?unlock=dev
//      e.g. https://weaverscrafting.in/?unlock=dev
//   2. Or press Ctrl + Shift + U (Cmd + Shift + U on Mac) on the error page and enter: dev
//   3. Or triple-click the "Ray / Trace ID" on the error page and enter: dev
//
// 🔒 RE-LOCK TEST:
//   To test what regular visitors see again, visit: ?lock=dev
// ═══════════════════════════════════════════════════════════════

const SITE_ACTIVE = false; // <-- CHANGE TO true ONCE PAYMENT IS RECEIVED
const DEV_SECRET = 'dev';

(function initSiteGateway() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  // 1. Process bypass flags in URL
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get('unlock') === DEV_SECRET || params.get('preview') === DEV_SECRET) {
      localStorage.setItem('wc_dev_unlocked', '1');
      sessionStorage.setItem('wc_dev_unlocked', '1');
      document.cookie = 'wc_dev_unlocked=1; path=/; max-age=2592000; SameSite=Lax';
    } else if (params.get('lock') === DEV_SECRET || params.get('relock') === '1') {
      localStorage.removeItem('wc_dev_unlocked');
      sessionStorage.removeItem('wc_dev_unlocked');
      document.cookie = 'wc_dev_unlocked=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
    }
  } catch (e) {}

  // 2. Check unlock state
  let isUnlocked = false;
  try {
    isUnlocked = localStorage.getItem('wc_dev_unlocked') === '1' ||
                 sessionStorage.getItem('wc_dev_unlocked') === '1' ||
                 (document.cookie && document.cookie.indexOf('wc_dev_unlocked=1') !== -1);
  } catch (e) {}

  // 3. If active or developer unlocked, allow normal rendering
  if (SITE_ACTIVE || isUnlocked) {
    if (isUnlocked && !SITE_ACTIVE) {
      window.addEventListener('DOMContentLoaded', function() {
        if (document.getElementById('wc-dev-pill')) return;
        const devBadge = document.createElement('div');
        devBadge.id = 'wc-dev-pill';
        devBadge.innerHTML = `
          <div style="position:fixed;bottom:16px;right:16px;z-index:999999;background:rgba(15,23,42,0.95);backdrop-filter:blur(10px);color:#10b981;border:1px solid rgba(16,185,129,0.3);border-radius:100px;padding:8px 16px;font-family:system-ui,-apple-system,sans-serif;font-size:12px;font-weight:600;display:flex;align-items:center;gap:10px;box-shadow:0 10px 25px rgba(0,0,0,0.5);letter-spacing:0.3px;">
            <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#10b981;box-shadow:0 0 10px #10b981;"></span>
            <span>Developer Preview (Site locked for public)</span>
            <button onclick="localStorage.removeItem('wc_dev_unlocked');sessionStorage.removeItem('wc_dev_unlocked');document.cookie='wc_dev_unlocked=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT';location.reload();" style="background:#ef4444;color:#fff;border:none;border-radius:20px;padding:4px 10px;font-size:11px;font-weight:600;cursor:pointer;margin-left:4px;">Test Public View</button>
          </div>
        `;
        document.body.appendChild(devBadge);
      });
    }
    return;
  }

  // 4. Halt execution & stop background network downloads
  try {
    if (window.stop) window.stop();
  } catch(e) {}

  document.title = '503 Service Unavailable';

  // Inject immediate blocker CSS to hide all page elements cleanly
  const hideStyle = document.createElement('style');
  hideStyle.textContent = 'html, body { background: #090d16 !important; margin: 0 !important; padding: 0 !important; overflow: hidden !important; } body * { display: none !important; }';
  (document.head || document.documentElement).appendChild(hideStyle);

  const errorHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>503 Service Unavailable</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: #090d16;
      color: #94a3b8;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      line-height: 1.5;
    }
    .container {
      width: 100%;
      max-width: 720px;
      background: #0f172a;
      border: 1px solid #1e293b;
      border-radius: 14px;
      box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 1px 1px rgba(255, 255, 255, 0.05);
      overflow: hidden;
    }
    .header {
      padding: 24px 32px;
      border-bottom: 1px solid #1e293b;
      background: #111a30;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 16px;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(239, 68, 68, 0.12);
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: #f87171;
      padding: 6px 14px;
      border-radius: 9999px;
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.5px;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    }
    .pulse-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #ef4444;
      box-shadow: 0 0 8px #ef4444;
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(0.85); }
    }
    .protocol {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 13px;
      color: #64748b;
    }
    .body {
      padding: 32px;
    }
    h1 {
      color: #f8fafc;
      font-size: 23px;
      font-weight: 600;
      margin-bottom: 10px;
      letter-spacing: -0.3px;
    }
    .desc {
      color: #94a3b8;
      font-size: 14.5px;
      margin-bottom: 22px;
    }
    .terminal {
      background: #030712;
      border: 1px solid #1f2937;
      border-radius: 8px;
      padding: 16px 18px;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 12.5px;
      line-height: 1.6;
      color: #e5e7eb;
      margin-bottom: 24px;
      overflow-x: auto;
    }
    .log-err { color: #f87171; }
    .log-warn { color: #fbbf24; }
    .log-info { color: #60a5fa; }
    .log-dim { color: #6b7280; }
    .meta-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 28px;
      background: #0b1120;
      padding: 16px 20px;
      border-radius: 8px;
      border: 1px solid #1e293b;
    }
    .meta-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .meta-label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: #64748b;
      font-weight: 600;
    }
    .meta-val {
      font-size: 13px;
      color: #cbd5e1;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      word-break: break-all;
    }
    .actions {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 16px;
      padding-top: 8px;
    }
    .retry-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: #1e293b;
      color: #f8fafc;
      border: 1px solid #334155;
      padding: 10px 22px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .retry-btn:hover {
      background: #334155;
      border-color: #475569;
    }
    .retry-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    .spinner {
      width: 14px;
      height: 14px;
      border: 2px solid rgba(255,255,255,0.2);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      display: none;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    .admin-note {
      font-size: 12.5px;
      color: #64748b;
    }
    .secret-trigger {
      cursor: pointer;
      user-select: none;
    }
  </style>
</head>
<body>
  <div class="container" id="error-container">
    <div class="header">
      <div class="badge">
        <span class="pulse-dot"></span>
        <span>503 SERVICE UNAVAILABLE</span>
      </div>
      <div class="protocol">HTTP/2.0 · Vercel Edge Network</div>
    </div>
    <div class="body">
      <h1>Database Cluster Connection Timeout</h1>
      <p class="desc">
        The application gateway was unable to establish an active handshake with the upstream database cluster. Upstream pool queue exceeded retention threshold.
      </p>

      <div class="terminal">
        <div><span class="log-err">[FATAL]</span> <span class="log-dim">[db-pool-01]</span> Connection to host 'db.owgqxbgjmoqlhzztvety.supabase.co:5432' timed out (30000ms).</div>
        <div><span class="log-err">[ERROR]</span> <span class="log-dim">[pg-core]</span> 503_UPSTREAM_SERVICE_UNAVAILABLE: Handshake rejected by host controller.</div>
        <div><span class="log-warn">[WARN]</span>  <span class="log-dim">[proxy]</span> Circuit breaker tripped for cluster region asia-south1. Retries paused.</div>
        <div><span class="log-info">[INFO]</span>  <span class="log-dim">[gateway]</span> Terminating request cycle with HTTP status 503.</div>
      </div>

      <div class="meta-grid">
        <div class="meta-item">
          <span class="meta-label">Upstream Cluster</span>
          <span class="meta-val">supabase-db-bom1</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Error Code</span>
          <span class="meta-val">503_DATABASE_TIMEOUT</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Trace / Ray ID</span>
          <span class="meta-val secret-trigger" id="rayId" title="Diagnostic Ray ID">req_` + Math.random().toString(16).substring(2, 10) + Math.random().toString(16).substring(2, 6) + `</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Incident Timestamp</span>
          <span class="meta-val">` + new Date().toISOString() + `</span>
        </div>
      </div>

      <div class="actions">
        <button class="retry-btn" id="retryBtn" onclick="handleRetry()">
          <span class="spinner" id="btnSpinner"></span>
          <span id="btnText">Retry Connection</span>
        </button>
        <span class="admin-note">If this persists, contact your infrastructure administrator.</span>
      </div>
    </div>
  </div>

  <script>
    let clicks = 0;
    const rayEl = document.getElementById('rayId');
    if (rayEl) {
      rayEl.addEventListener('click', function() {
        clicks++;
        if (clicks >= 3) {
          const pass = prompt('Enter developer authorization key:');
          if (pass === 'dev') {
            localStorage.setItem('wc_dev_unlocked', '1');
            sessionStorage.setItem('wc_dev_unlocked', '1');
            document.cookie = 'wc_dev_unlocked=1; path=/; max-age=2592000; SameSite=Lax';
            alert('Authorization verified. Restoring interface...');
            location.href = location.pathname;
          } else if (pass !== null) {
            alert('Invalid authorization key.');
          }
          clicks = 0;
        }
      });
    }

    window.addEventListener('keydown', function(e) {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'U' || e.key === 'u')) {
        e.preventDefault();
        const pass = prompt('Enter developer authorization key:');
        if (pass === 'dev') {
          localStorage.setItem('wc_dev_unlocked', '1');
          sessionStorage.setItem('wc_dev_unlocked', '1');
          document.cookie = 'wc_dev_unlocked=1; path=/; max-age=2592000; SameSite=Lax';
          alert('Authorization verified. Restoring interface...');
          location.href = location.pathname;
        } else if (pass !== null) {
          alert('Invalid authorization key.');
        }
      }
    });

    function handleRetry() {
      const btn = document.getElementById('retryBtn');
      const spinner = document.getElementById('btnSpinner');
      const text = document.getElementById('btnText');
      if (!btn) return;
      btn.disabled = true;
      spinner.style.display = 'inline-block';
      text.textContent = 'Reconnecting to cluster...';
      
      setTimeout(function() {
        text.textContent = 'Connection refused. Reloading...';
        setTimeout(function() {
          location.reload();
        }, 800);
      }, 2200);
    }
  <\/script>
</body>
</html>`;

  function renderError() {
    document.open();
    document.write(errorHtml);
    document.close();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderError);
  } else {
    renderError();
  }
})();

// ─────────────────────────────────────────────────────────────
// CENTRAL CONFIGURATION OBJECT
// ─────────────────────────────────────────────────────────────
var WC_CONFIG = window.WC_CONFIG || {
  // Supabase (safe to expose — controlled by RLS policies)
  SUPABASE_URL: 'https://owgqxbgjmoqlhzztvety.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93Z3F4YmdqbW9xbGh6enR2ZXR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwNTk1MTAsImV4cCI6MjA5NTYzNTUxMH0.YoqjisE2XjKTckEh6j-352X1MvyHi5PX5_dHnCHD6Q0',

  // Cloudinary (upload preset is public by design)
  CLOUDINARY_CLOUD_NAME: 'dccpzvexs',
  CLOUDINARY_UPLOAD_PRESET: 'Weaverscrafting',

  // Business Contact
  WHATSAPP_NUMBER: '919742630886',
  EMAIL: 'craftersofa974263@gmail.com',
  PHONE_PRIMARY: '+91 97426 30886',
  PHONE_SECONDARY: '+91 88814 23496',
};

// Derived helpers (do not edit)
WC_CONFIG.CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${WC_CONFIG.CLOUDINARY_CLOUD_NAME}/image/upload`;
WC_CONFIG.WHATSAPP_URL = `https://wa.me/${WC_CONFIG.WHATSAPP_NUMBER}`;
WC_CONFIG.SITEMAP_STORAGE_URL = `${WC_CONFIG.SUPABASE_URL}/storage/v1/object/public/site/sitemap.xml`;
WC_CONFIG.SITEMAP_FUNCTION_URL = `${WC_CONFIG.SUPABASE_URL}/functions/v1/sitemap`;
window.WC_CONFIG = WC_CONFIG;
