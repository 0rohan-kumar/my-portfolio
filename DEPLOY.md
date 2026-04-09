# Deployment Guide

## Bugs fixed in this diff

### page.tsx
| # | Bug | Fix |
|---|-----|-----|
| 1 | `AuraBackground` had `isDark` hardcoded `true` — light mode had dark bg | Now reads `theme` prop |
| 2 | Gmail `window.open("mailto:...")` silently fails in Chrome | Changed to `window.location.href` for mailto links |
| 3 | Orbit section wrapped `OrbitalSystem` in `position:absolute;inset:0` div — double-centering broke layout | Removed wrapper; ghost ROHAN now in its own isolated absolute div |
| 4 | `useDiscordStatus` used `window.location.hostname` at runtime — breaks SSR/Next.js | Removed; now purely reads `NEXT_PUBLIC_BACKEND_URL` env var |
| 5 | Polling every 5s hammered backend on every visitor tab | Raised to 15s |

### server.ts
| # | Bug | Fix |
|---|-----|-----|
| 1 | `PORT` hardcoded 8888, ignored `process.env.PORT` — Railway/Render inject their own port | Now `parseInt(process.env.PORT ?? "8888")` |
| 2 | `StatusData` interface had `activities[]` array but frontend expected `activity` object | Rewritten to match exactly what frontend reads |
| 3 | Activity picker could grab Spotify (type 2) as the "app" activity | Fixed priority: Game(0) > Stream(1) > Watch(3) > Listen(2 non-Spotify) |
| 4 | CORS was `app.use(cors())` — completely open | Now reads `FRONTEND_URL` env var and locks to it in production |
| 5 | Missing startup validation — silent failures if env vars empty | Now logs and exits early if tokens missing |

---

## Deploy: Frontend → Vercel (free)

```bash
npm i -g vercel
vercel login
vercel   # auto-detects Next.js
```

In Vercel dashboard → Settings → Environment Variables, add:
```
NEXT_PUBLIC_BACKEND_URL = https://your-railway-app.up.railway.app
```

If you don't have a backend yet, leave this unset — it falls back to Lanyard automatically.

---

## Deploy: Discord backend → Railway (free, no sleep)

1. Push your `discord-backend/` folder to GitHub (can be a separate repo or a subfolder)
2. railway.app → New Project → Deploy from GitHub
3. Set root directory to `discord-backend` if it's a subfolder
4. Add these environment variables in Railway dashboard:

```
DISCORD_BOT_TOKEN   = your_bot_token
DISCORD_USER_ID     = 1372232239751893074
FRONTEND_URL        = https://your-vercel-app.vercel.app
PORT                = (leave blank — Railway sets this)
```

5. Add `railway.toml` in `discord-backend/`:

```toml
[build]
builder = "nixpacks"
buildCommand = "npm install && npm run build"

[deploy]
startCommand = "node dist/server.js"
```

6. Make sure `tsconfig.json` has `"outDir": "dist"` and `package.json` has:
```json
"scripts": {
  "build": "tsc",
  "start": "node dist/server.js"
}
```

Railway runs build then start automatically on every push.

---

## After deploy checklist

- [ ] Visit `https://your-railway-app.up.railway.app/health` — should return `{"ok":true,"botReady":true}`
- [ ] Visit `https://your-railway-app.up.railway.app/status` — should return your presence
- [ ] Set `NEXT_PUBLIC_BACKEND_URL` in Vercel and redeploy frontend
- [ ] Test Gmail button opens mail client (not a blank tab)
- [ ] Test light mode — aura background should go light too now
- [ ] Ping me when Railway is set up — I'll help debug the bot intents

## Still to do (ping me)
- Bot needs Presence + Server Members intents enabled in Discord dev portal
- Bot needs to be in at least one server you're in
- Your Discord user ID `1372232239751893074` is already set in the code ✓
