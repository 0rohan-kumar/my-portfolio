// discord-backend/server.ts
// Run: npx ts-node server.ts  (or compile with tsc)
// Requires: npm install discord.js express cors

import { Client, GatewayIntentBits, Activity, PresenceStatus } from "discord.js";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

// ─── CONFIG ───────────────────────────────────────────────────────────────────
// 1. Go to https://discord.com/developers/applications
// 2. Create New Application → Bot → Reset Token → copy it below
// 3. Under "Privileged Gateway Intents" enable: PRESENCE INTENT + SERVER MEMBERS INTENT
// 4. Invite bot to a server you're in (needs no permissions, just needs to see you)
// 5. Get YOUR Discord user ID: Settings → Advanced → Developer Mode ON → right-click your name → Copy ID

const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const YOUR_USER_ID = process.env.DISCORD_USER_ID || "1372232239751893074";
const PORT = process.env.PORT || 8888;
const FRONTEND_URL = process.env.FRONTEND_URL || "*";

if (!BOT_TOKEN || BOT_TOKEN === "YOUR_BOT_TOKEN_HERE") {
  console.error("❌ ERROR: DISCORD_BOT_TOKEN is missing in .env");
  process.exit(1);
}

// ─── STATE ────────────────────────────────────────────────────────────────────

interface StatusData {
  status: string;
  customStatus: { text: string } | null;
  activity: { name: string; details: string; state: string; largeImage: string | null } | null;
  spotify: { song: string; artist: string; albumArt: string | null } | null;
  lastSeen: string;
}

let statusData: StatusData = {
  status: "offline",
  customStatus: null,
  activity: null,
  spotify: null,
  lastSeen: new Date().toISOString(),
};

// ─── DISCORD CLIENT ───────────────────────────────────────────────────────────

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMembers,
  ],
});

function parsePresence(presence: any) {
  if (!presence) return;
  try {
    const activities = presence.activities || [];
    
    // 1. Identify key activities with explicit priority
    const spotify = activities.find((a: any) => a.name === "Spotify");
    const custom = activities.find((a: any) => a.type === 4);
    
    // Priority: Game (0) -> Streaming (1) -> Watching (3) -> Listening non-Spotify (2)
    const app = activities.find((a: any) => a.type === 0) || 
                activities.find((a: any) => a.type === 1) ||
                activities.find((a: any) => a.type === 3) ||
                activities.find((a: any) => a.type === 2 && a.name !== "Spotify");

    // 2. Map only what we need safely
    statusData = {
      status: presence.status || "offline",
      customStatus: custom ? { text: custom.state || "" } : null,
      activity: app ? {
        name: app.name,
        details: app.details || "",
        state: app.state || "",
        largeImage: app.assets ? app.assets.largeImageURL?.() : null
      } : null,
      spotify: spotify ? {
        song: spotify.details || "",
        artist: spotify.state || "",
        albumArt: spotify.assets ? spotify.assets.largeImageURL?.() : null
      } : null,
      lastSeen: new Date().toISOString()
    };

    console.log(`[${new Date().toLocaleTimeString()}] Sync: ${presence.status}`);
  } catch (err) {
    console.error("Critical Parsing Error:", err);
  }
}

client.on("ready", async () => {
  console.log(`✅ Bot ready: ${client.user?.tag}`);
  for (const guild of client.guilds.cache.values()) {
    try {
      const member = await guild.members.fetch(YOUR_USER_ID);
      if (member && member.presence) {
        parsePresence(member.presence);
        break;
      }
    } catch (e) {}
  }
});

client.on("presenceUpdate", (_, newVal) => {
  if (newVal && newVal.userId === YOUR_USER_ID) {
    parsePresence(newVal);
  }
});

client.on("error", err => console.error("Discord error:", err));

// ─── EXPRESS API ──────────────────────────────────────────────────────────────

const app = express();
app.use(cors({ origin: FRONTEND_URL }));
app.use(express.json());

app.get("/status", (_req, res) => {
  console.log(`[${new Date().toLocaleTimeString()}] 🚀 Data served to Frontend: ${statusData.status}`);
  res.json({ success: true, data: statusData });
});

app.get("/health", (_req, res) => {
  res.json({ ok: true, botReady: client.isReady() });
});

// ─── START ────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`🚀 API running on http://localhost:${PORT}`);
  console.log(`📡 Watching presence for user: ${YOUR_USER_ID}`);
  client.login(BOT_TOKEN).catch(err => {
    console.error("❌ Bot login failed:", err.message);
    console.error("Check your BOT_TOKEN and that Presence/Server Members intents are enabled.");
  });
});
