# Rohan — Orbital Landing Page

## File layout
```
app/
  page.tsx              ← drop this in, replace your current one
discord-backend/
  server.ts             ← the Discord presence API
  package.json
```

---

## 1. Next.js setup (if not done)

```bash
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir
npm install lucide-react class-variance-authority
```

---

## 2. Drop in page.tsx

Replace `app/page.tsx` with the provided file.  
No extra imports needed — everything is self-contained.

---

## 3. Discord Lanyard (easy path — NO backend needed)

The page already uses **Lanyard** which reads your Discord presence publicly.

**You just need to:**
1. Join the [Lanyard Discord server](https://discord.gg/lanyard) — this registers your user ID
2. Update `DISCORD_USER_ID` in `page.tsx`:
   ```ts
   const DISCORD_USER_ID = "YOUR_REAL_DISCORD_ID_HERE";
   ```
   To get your ID: Discord Settings → Advanced → Enable Developer Mode → right-click your name → Copy User ID

That's it. Status updates live. No backend required.

---

## 4. Discord Bot Backend (optional — more data)

Only do this if you want richer data (Spotify song title, game activity etc).

### Step 1 — Create the bot

1. Go to https://discord.com/developers/applications
2. New Application → Bot → Reset Token → **save the token**
3. Under "Privileged Gateway Intents" enable:
   - ✅ Presence Intent
   - ✅ Server Members Intent
4. Invite URL: OAuth2 → URL Generator → `bot` scope → no permissions → copy URL → open in browser → invite to your server

### Step 2 — Run the backend

```bash
cd discord-backend
npm install
```

Create `.env`:
```
DISCORD_BOT_TOKEN=your_token_here
DISCORD_USER_ID=your_discord_user_id
FRONTEND_URL=http://localhost:3000
PORT=3001
```

```bash
npm run dev
```

### Step 3 — Point the frontend to your backend

In `page.tsx`, replace the `useDiscordStatus` hook's fetch URL:
```ts
// Replace:
const res = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`);

// With:
const res = await fetch("http://localhost:3001/status");
// (use your deployed URL in production)
```

### Step 4 — Deploy backend (free options)

- **Railway**: push to GitHub → connect → done
- **Render**: free tier, auto-sleep (15min warmup)
- **Fly.io**: free tier, no sleep

---

## Features implemented

| Feature | Status |
|---|---|
| Gmail mailto fix | ✅ |
| Magnetic cursor gravity | ✅ |
| Orbit pauses on hover | ✅ |
| Expanded node card on click | ✅ |
| Energy system (charge on hover, burst on click) | ✅ |
| Cinematic idle mode (8s idle → slow + blur) | ✅ |
| Glowing node trails | ✅ |
| Cursor trail | ✅ |
| Micro sounds (hover tick, click pulse) | ✅ |
| Dark/Light personality switch | ✅ |
| Memory — last clicked node highlighted | ✅ (localStorage) |
| Keyboard controls (space/arrows/enter) | ✅ |
| Physics inertia on speed changes | ✅ |
| Focus blur (others blur when one active) | ✅ |
| Easter egg — click orb 5× | ✅ |
| Easter egg — type "rho" | ✅ |
| Discord live status (Lanyard) | ✅ |
| Discord Spotify display | ✅ |
| Discord bot backend | ✅ |
| Center orb → ρ₁ initials + hover reveal | ✅ |
| Connecting trail lines | ✅ |
| Glitch text | ✅ |
| Typing effect | ✅ |
| Parallax background | ✅ |
