"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Mail, MessageCircle } from "lucide-react";

// Lucide removed brand icons, so we define them manually
const Github = (props: any) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const Instagram = (props: any) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

// ─── TYPES ────────────────────────────────────────────────────────────────────

type Theme = "dark" | "light";
type Section = "hero" | "orbit";

interface DiscordStatus {
  status: "online" | "idle" | "dnd" | "offline";
  activity?: string;
  details?: string;
  state?: string;
  customStatus?: { text?: string; emoji?: string };
  assets?: { largeImage?: string; smallImage?: string };
  spotify?: { song: string; artist: string; album?: string; albumArt?: string };
}

interface NodeDef {
  id: string;
  Icon: React.ElementType;
  href: string;
  label: string;
  username: string;
  bio: string;
  color: string;
  glow: string;
}

// ─── DATA ─────────────────────────────────────────────────────────────────────

const NODES: NodeDef[] = [
  {
    id: "instagram",
    Icon: Instagram,
    href: "https://www.instagram.com/im.rho.one/",
    label: "Instagram",
    username: "@im.rho.one",
    bio: "shots, moments & random stuff",
    color: "#e1306c",
    glow: "rgba(225,48,108,0.7)",
  },
  {
    id: "discord",
    Icon: MessageCircle,
    href: "https://discord.com/users/1372232239751893074",
    label: "Discord",
    username: "rohankumar0855",
    bio: "ping me, i might respond",
    color: "#7289da",
    glow: "rgba(114,137,218,0.7)",
  },
  {
    id: "github",
    Icon: Github,
    href: "https://rohanofficial.netlify.app/git",
    label: "GitHub",
    username: "rohan",
    bio: "code, projects & side quests",
    color: "#c8d1da",
    glow: "rgba(200,209,218,0.6)",
  },
  {
    id: "gmail",
    Icon: Mail,
    href: "mailto:id.mail.rohan@gmail.com",
    label: "Gmail",
    username: "id.mail.rohan",
    bio: "for serious stuff only 🙃",
    color: "#ea4335",
    glow: "rgba(234,67,53,0.7)",
  },
];

const STATUS_COLORS = {
  online: "#3ba55d",
  idle: "#faa61a",
  dnd: "#ed4245",
  offline: "#747f8d",
};
const STATUS_LABELS = {
  online: "Online",
  idle: "Idle",
  dnd: "Do Not Disturb",
  offline: "Offline",
};

const ACTIVITY_THEMES = {
  coding: { color: "#00ffcc", glow: "rgba(0, 255, 204, 0.15)" },
  youtube: { color: "#ff4757", glow: "rgba(255, 71, 87, 0.15)" },
  gaming: { color: "#7d5fff", glow: "rgba(125, 95, 255, 0.15)" },
  idle: { color: "#54a0ff", glow: "rgba(84, 160, 255, 0.08)" },
};

function AuraBackground({ status }: { status: DiscordStatus }) {
  const isDark = true; // Assuming dark mode for the premium vibe

  // Decide theme
  let theme = ACTIVITY_THEMES.idle;
  if (status.activity === "Code" || status.details?.toLowerCase().includes("portfolio")) {
    theme = ACTIVITY_THEMES.coding;
  } else if (status.activity?.toLowerCase().includes("youtube")) {
    theme = ACTIVITY_THEMES.youtube;
  } else if (status.activity) {
    theme = ACTIVITY_THEMES.gaming;
  }

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: -1, pointerEvents: "none",
      background: "#060a12", overflow: "hidden"
    }}>
      {/* Primary breathing glow */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        width: "120vw", height: "120vh",
        transform: "translate(-50%, -50%)",
        background: `radial-gradient(circle at center, ${theme.glow} 0%, transparent 70%)`,
        transition: "background 3s ease-in-out",
        animation: "aura-breath 12s ease-in-out infinite"
      }} />

      {/* Grain/Texture overlay */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.03,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
      }} />
    </div>
  );
}

// ─── UTILS ────────────────────────────────────────────────────────────────────

function spawnRipple(x: number, y: number, color: string) {
  const el = document.createElement("div");
  el.style.cssText = `position:fixed;left:${x}px;top:${y}px;width:0;height:0;
    border-radius:50%;border:1.5px solid ${color};transform:translate(-50%,-50%);
    pointer-events:none;z-index:9999;animation:ripple-out 0.75s cubic-bezier(0.2,0.6,0.4,1) forwards;`;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 800);
}

function playTick(freq = 880, vol = 0.04) {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
    osc.start(); osc.stop(ctx.currentTime + 0.12);
    setTimeout(() => ctx.close(), 200);
  } catch { }
}

// ─── GLITCH TITLE ─────────────────────────────────────────────────────────────

function GlitchTitle({ theme }: { theme: Theme }) {
  const [g, setG] = useState(false);
  const eggRef = useRef(0);

  // Easter egg: click 5× unlocks hidden mode
  const handleClick = () => {
    eggRef.current++;
    if (eggRef.current >= 5) {
      eggRef.current = 0;
      triggerEasterEgg();
    }
  };

  const triggerEasterEgg = () => {
    for (let i = 0; i < 8; i++) {
      setTimeout(() => { setG(true); setTimeout(() => setG(false), 120); }, i * 160);
    }
    // type "rho" easter egg is handled globally
  };

  useEffect(() => {
    const schedule = () => setTimeout(() => {
      setG(true);
      setTimeout(() => setG(false), 280);
      schedule();
    }, 4500 + Math.random() * 4000);
    const t = schedule();
    return () => clearTimeout(t);
  }, []);

  // Type "rho" easter egg
  useEffect(() => {
    let seq = "";
    const onKey = (e: KeyboardEvent) => {
      seq = (seq + e.key).slice(-3);
      if (seq === "rho") {
        for (let i = 0; i < 10; i++) {
          setTimeout(() => { setG(true); setTimeout(() => setG(false), 100); }, i * 130);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const stroke = theme === "dark" ? "rgba(255,255,255,0.88)" : "rgba(0,0,0,0.82)";
  const base: React.CSSProperties = {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: "clamp(5.5rem,17vw,17rem)",
    letterSpacing: "0.06em", lineHeight: 1,
    color: "transparent", userSelect: "none",
  };

  return (
    <div style={{ position: "relative", display: "inline-block", cursor: "default" }} onClick={handleClick}>
      <div style={{ ...base, WebkitTextStroke: `1px ${stroke}`, position: "relative", zIndex: 2 }}>ROHAN</div>
      <div aria-hidden style={{
        ...base, WebkitTextStroke: "1px #ff7e5f", position: "absolute", top: 0, left: 0, zIndex: 1,
        opacity: g ? 0.72 : 0, transform: g ? "translate(-6px,2px) skewX(-4deg)" : "none",
        transition: "opacity 0.04s", clipPath: "polygon(0 26%,100% 26%,100% 52%,0 52%)"
      }}>ROHAN</div>
      <div aria-hidden style={{
        ...base, WebkitTextStroke: "1px #4fc3f7", position: "absolute", top: 0, left: 0, zIndex: 1,
        opacity: g ? 0.58 : 0, transform: g ? "translate(6px,-2px) skewX(2deg)" : "none",
        transition: "opacity 0.04s", clipPath: "polygon(0 56%,100% 56%,100% 76%,0 76%)"
      }}>ROHAN</div>
    </div>
  );
}

// ─── TYPING TAG ───────────────────────────────────────────────────────────────

const PHRASES = ["dev / builder", "coder / creator", "making things real", "open to collab"];

function TypingTag({ theme }: { theme: Theme }) {
  const [text, setText] = useState("");
  const [pi, setPi] = useState(0);
  const [del, setDel] = useState(false);
  const [vis, setVis] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVis(true), 900); return () => clearTimeout(t); }, []);
  useEffect(() => {
    const phrase = PHRASES[pi];
    let id: ReturnType<typeof setTimeout>;
    if (!del && text.length < phrase.length) id = setTimeout(() => setText(phrase.slice(0, text.length + 1)), 62);
    else if (!del) id = setTimeout(() => setDel(true), 2600);
    else if (del && text.length > 0) id = setTimeout(() => setText(text.slice(0, -1)), 36);
    else { setDel(false); setPi(i => (i + 1) % PHRASES.length); }
    return () => clearTimeout(id);
  }, [text, del, pi]);

  const tc = theme === "dark";
  return (
    <div style={{
      fontFamily: "'DM Sans',sans-serif", fontWeight: 300, fontSize: "clamp(0.8rem,1.7vw,1.05rem)",
      letterSpacing: "0.1em", color: tc ? "rgba(255,255,255,0.42)" : "rgba(0,0,0,0.45)",
      opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(14px)",
      transition: "opacity 0.6s ease, transform 0.6s ease",
      display: "flex", alignItems: "center", gap: "8px", marginTop: "0.75rem"
    }}>
      <span style={{ color: "#ff7e5f" }}>Rohan</span>
      <span style={{ color: tc ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.2)" }}>—</span>
      <span>{text}</span>
      <span style={{
        display: "inline-block", width: "2px", height: "1em",
        background: "#ff7e5f", animation: "blink 1s step-end infinite", verticalAlign: "middle"
      }} />
    </div>
  );
}

// ─── CURSOR TRAIL ─────────────────────────────────────────────────────────────

function CursorTrail({ theme }: { theme: Theme }) {
  useEffect(() => {
    const dots: HTMLDivElement[] = [];
    const pos = { x: 0, y: 0 };
    const N = 12;

    for (let i = 0; i < N; i++) {
      const d = document.createElement("div");
      const size = 6 - i * 0.35;
      d.style.cssText = `position:fixed;width:${size}px;height:${size}px;
        border-radius:50%;pointer-events:none;z-index:9998;
        background:rgba(255,126,95,${0.55 - i * 0.04});
        transform:translate(-50%,-50%);transition:none;`;
      document.body.appendChild(d);
      dots.push(d);
    }

    const positions = Array(N).fill({ x: 0, y: 0 });
    const onMove = (e: MouseEvent) => { pos.x = e.clientX; pos.y = e.clientY; };
    window.addEventListener("mousemove", onMove, { passive: true });

    let raf: number;
    const animate = () => {
      positions[0] = { x: pos.x, y: pos.y };
      for (let i = 1; i < N; i++) {
        positions[i] = {
          x: positions[i].x + (positions[i - 1].x - positions[i].x) * 0.35,
          y: positions[i].y + (positions[i - 1].y - positions[i].y) * 0.35,
        };
      }
      dots.forEach((d, i) => {
        d.style.left = positions[i].x + "px";
        d.style.top = positions[i].y + "px";
        d.style.background = theme === "dark"
          ? `rgba(255,126,95,${0.55 - i * 0.04})`
          : `rgba(180,60,30,${0.45 - i * 0.035})`;
      });
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      dots.forEach(d => d.remove());
    };
  }, [theme]);
  return null;
}

// ─── PARALLAX BG ──────────────────────────────────────────────────────────────

function ParallaxBg({ theme }: { theme: Theme }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (!ref.current) return;
      const dx = (e.clientX / window.innerWidth - 0.5) * 32;
      const dy = (e.clientY / window.innerHeight - 0.5) * 22;
      ref.current.style.transform = `translate(${dx}px,${dy}px)`;
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, []);

  const d = theme === "dark";
  return (
    <div ref={ref} style={{
      position: "absolute", inset: "-6%", pointerEvents: "none",
      transition: "transform 0.14s linear", zIndex: 0, opacity: d ? 0.72 : 0.5
    }}>
      <div style={{
        position: "absolute", width: "55vw", height: "55vw", borderRadius: "50%",
        background: `radial-gradient(circle,${d ? "rgba(255,126,95,0.06)" : "rgba(255,126,95,0.09)"} 0%,transparent 70%)`,
        top: "5%", left: "18%", filter: "blur(55px)"
      }} />
      <div style={{
        position: "absolute", width: "44vw", height: "44vw", borderRadius: "50%",
        background: `radial-gradient(circle,${d ? "rgba(36,59,85,0.14)" : "rgba(100,140,200,0.08)"} 0%,transparent 70%)`,
        bottom: "8%", right: "12%", filter: "blur(70px)"
      }} />
      <div style={{
        position: "absolute", width: "22vw", height: "22vw", borderRadius: "50%",
        background: `radial-gradient(circle,${d ? "rgba(114,137,218,0.05)" : "rgba(114,137,218,0.07)"} 0%,transparent 70%)`,
        top: "42%", left: "62%", filter: "blur(40px)"
      }} />
    </div>
  );
}

// ─── NODE CARD (expanded info) ────────────────────────────────────────────────

function NodeCard({ node, onClose, theme }: { node: NodeDef; onClose: () => void; theme: Theme }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { requestAnimationFrame(() => setMounted(true)); }, []);

  const isEmail = node.href.startsWith("mailto");
  const handleOpen = () => {
    spawnRipple(window.innerWidth / 2, window.innerHeight / 2, node.color);
    playTick(660, 0.06);
    setTimeout(() => {
      if (isEmail) window.location.href = node.href;
      else window.open(node.href, "_blank", "noopener,noreferrer");
    }, 200);
  };

  const d = theme === "dark";
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        background: d ? "rgba(0,0,0,0.7)" : "rgba(255,255,255,0.7)",
        backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        opacity: mounted ? 1 : 0, transition: "opacity 0.35s ease"
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: d ? "rgba(10,16,28,0.92)" : "rgba(255,255,255,0.95)",
          border: `1px solid ${node.color}44`,
          borderRadius: "20px",
          padding: "2rem 2.5rem",
          maxWidth: "340px", width: "90%",
          boxShadow: `0 0 60px 10px ${node.glow.replace("0.7", "0.3")}`,
          transform: mounted ? "scale(1) translateY(0)" : "scale(0.88) translateY(30px)",
          transition: "transform 0.4s cubic-bezier(0.22,1,0.36,1)",
          textAlign: "center",
        }}
      >
        {/* Icon circle */}
        <div style={{
          width: 72, height: 72, borderRadius: "50%", margin: "0 auto 1rem",
          background: `radial-gradient(circle at 35% 35%, ${node.color}33 0%, ${node.color}11 100%)`,
          border: `1.5px solid ${node.color}66`,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: `0 0 24px 6px ${node.glow.replace("0.7", "0.25")}`
        }}>
          <node.Icon size={30} strokeWidth={1.4} color={node.color} />
        </div>

        <div style={{
          fontFamily: "'Bebas Neue',sans-serif", fontSize: "1.6rem",
          letterSpacing: "0.06em", color: d ? "#fff" : "#111"
        }}>
          {node.label}
        </div>
        <div style={{
          fontFamily: "'DM Sans',sans-serif", fontSize: "0.9rem",
          color: node.color, marginTop: "2px", letterSpacing: "0.05em"
        }}>
          {node.username}
        </div>
        <div style={{
          fontFamily: "'DM Sans',sans-serif", fontSize: "0.82rem",
          color: d ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)",
          marginTop: "0.75rem", lineHeight: 1.5
        }}>
          {node.bio}
        </div>

        <div style={{ display: "flex", gap: "10px", marginTop: "1.5rem" }}>
          <button
            onClick={handleOpen}
            style={{
              flex: 1, padding: "10px 0", borderRadius: "10px", border: "none", cursor: "pointer",
              background: node.color, color: "#fff",
              fontFamily: "'DM Sans',sans-serif", fontWeight: 500, fontSize: "0.88rem",
              letterSpacing: "0.06em", transition: "filter 0.2s ease"
            }}
            onMouseEnter={e => (e.currentTarget.style.filter = "brightness(1.15)")}
            onMouseLeave={e => (e.currentTarget.style.filter = "brightness(1)")}
          >
            {isEmail ? "Send Email" : "Open →"}
          </button>
          <button
            onClick={onClose}
            style={{
              padding: "10px 16px", borderRadius: "10px", border: `1px solid ${node.color}44`,
              cursor: "pointer", background: "transparent",
              color: d ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)",
              fontFamily: "'DM Sans',sans-serif", fontSize: "0.88rem", transition: "border-color 0.2s"
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = node.color + "99")}
            onMouseLeave={e => (e.currentTarget.style.borderColor = node.color + "44")}
          >✕</button>
        </div>
      </div>
    </div>
  );
}

// ─── ORBITAL SYSTEM ───────────────────────────────────────────────────────────

const ORBIT_RX = 192;
const ORBIT_RY = 90;
const NODE_SIZE = 64;
const ORB_SIZE = 92;
const MAGNETIC_STRENGTH = 38;
const MAGNETIC_RADIUS = 180;

function OrbitalSystem({
  visible, theme, discordStatus,
}: {
  visible: boolean;
  theme: Theme;
  discordStatus: DiscordStatus;
}) {
  const nodesRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const angleRef = useRef(0);
  const speedRef = useRef(0.005);
  const targetSpeedRef = useRef(0.005);
  const rafRef = useRef<number | null>(null);
  const pausedRef = useRef(false);
  const hoveredIdx = useRef<number | null>(null);
  const cursorRef = useRef({ x: -9999, y: -9999 });
  const containerRef = useRef<HTMLDivElement>(null);
  const trailsRef = useRef<[number, number][][]>(NODES.map(() => []));
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const energyRef = useRef<number[]>(NODES.map(() => 0));
  const lastClickedRef = useRef<number | null>(null);
  const cinemaTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cinemaRef = useRef(false);

  // Keyboard state
  const keysRef = useRef({ space: false, left: false, right: false });

  const [orbExpanded, setOrbExpanded] = useState(false);
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [eggCount, setEggCount] = useState(0);
  const [eggMode, setEggMode] = useState(false);

  // Memory: restore last clicked
  useEffect(() => {
    try {
      const saved = localStorage.getItem("rohan_last_node");
      if (saved !== null) lastClickedRef.current = parseInt(saved);
    } catch { }
  }, []);

  // Lanyard Discord status
  // (passed in as prop from parent)

  // Keyboard controls
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.code === "Space") { e.preventDefault(); keysRef.current.space = !keysRef.current.space; }
      if (e.code === "ArrowLeft") { keysRef.current.left = true; }
      if (e.code === "ArrowRight") { keysRef.current.right = true; }
      if (e.code === "Enter" && hoveredIdx.current !== null) {
        const i = hoveredIdx.current;
        setActiveCard(i);
      }
    };
    const up = (e: KeyboardEvent) => {
      if (e.code === "ArrowLeft") keysRef.current.left = false;
      if (e.code === "ArrowRight") keysRef.current.right = false;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); };
  }, []);

  // Cursor tracking relative to container
  useEffect(() => {
    const move = (e: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      cursorRef.current = {
        x: e.clientX - rect.left - rect.width / 2,
        y: e.clientY - rect.top - rect.height / 2,
      };
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, []);

  // Cinematic idle mode
  const resetCinema = useCallback(() => {
    if (cinemaTimerRef.current) clearTimeout(cinemaTimerRef.current);
    cinemaRef.current = false;
    targetSpeedRef.current = 0.005;
    cinemaTimerRef.current = setTimeout(() => {
      cinemaRef.current = true;
      targetSpeedRef.current = 0.0018;
    }, 8000);
  }, []);

  useEffect(() => {
    resetCinema();
    const events = ["mousemove", "keydown", "click"];
    events.forEach(ev => window.addEventListener(ev, resetCinema, { passive: true }));
    return () => {
      if (cinemaTimerRef.current) clearTimeout(cinemaTimerRef.current);
      events.forEach(ev => window.removeEventListener(ev, resetCinema));
    };
  }, [resetCinema]);

  // Main animation
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const total = NODES.length;
    const d = theme === "dark";

    NODES.forEach((node, i) => {
      const base = (i / total) * Math.PI * 2;
      const a = base + angleRef.current;
      const nx = cx + Math.cos(a) * ORBIT_RX;
      const ny = cy + Math.sin(a) * ORBIT_RY;
      const depth = (Math.sin(a) + 1) / 2;
      const isHov = hoveredIdx.current === i;
      const energy = energyRef.current[i];
      const alpha = isHov ? 0.65 : 0.09 + 0.1 * depth + energy * 0.2;

      // Connecting line
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(nx, ny);
      ctx.strokeStyle = node.color + Math.round(alpha * 255).toString(16).padStart(2, "0");
      ctx.lineWidth = isHov ? 1.5 : 0.7;
      ctx.setLineDash([3, 8]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Trail
      const trail = trailsRef.current[i];
      if (trail.length > 1) {
        for (let t = 1; t < trail.length; t++) {
          const ta = (t / trail.length) * 0.4;
          ctx.beginPath();
          ctx.moveTo(trail[t - 1][0], trail[t - 1][1]);
          ctx.lineTo(trail[t][0], trail[t][1]);
          ctx.strokeStyle = node.color + Math.round(ta * 255).toString(16).padStart(2, "0");
          ctx.lineWidth = (t / trail.length) * 2.5;
          ctx.filter = `blur(${(1 - t / trail.length) * 1.5}px)`;
          ctx.stroke();
          ctx.filter = "none";
        }
      }

      // Cinematic highlight
      if (cinemaRef.current && lastClickedRef.current === i) {
        ctx.beginPath();
        ctx.arc(nx, ny, NODE_SIZE / 2 + 8, 0, Math.PI * 2);
        ctx.strokeStyle = node.color + "88";
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    });
  }, [theme]);

  useEffect(() => {
    const total = NODES.length;
    const TRAIL_MAX = 18;

    const animate = () => {
      // Keyboard speed control
      if (keysRef.current.space) {
        pausedRef.current = !pausedRef.current;
        keysRef.current.space = false; // toggle once
      }
      if (keysRef.current.left) angleRef.current -= 0.025;
      if (keysRef.current.right) angleRef.current += 0.025;

      // Smooth speed
      speedRef.current += (targetSpeedRef.current - speedRef.current) * 0.03;
      if (!pausedRef.current && !keysRef.current.left && !keysRef.current.right) {
        angleRef.current += speedRef.current;
      }

      // Energy decay
      energyRef.current = energyRef.current.map((e, i) =>
        hoveredIdx.current === i ? Math.min(e + 0.06, 1) : Math.max(e - 0.025, 0)
      );

      nodesRef.current.forEach((el, i) => {
        if (!el) return;
        const base = (i / total) * Math.PI * 2;
        const a = base + angleRef.current;

        // Base orbital position
        let bx = Math.cos(a) * ORBIT_RX;
        let by = Math.sin(a) * ORBIT_RY;

        // Magnetic cursor attraction
        const cx2 = cursorRef.current.x;
        const cy2 = cursorRef.current.y;
        const dist = Math.sqrt((bx - cx2) ** 2 + (by - cy2) ** 2);
        if (dist < MAGNETIC_RADIUS && dist > 0) {
          const strength = (1 - dist / MAGNETIC_RADIUS) * MAGNETIC_STRENGTH;
          bx += ((cx2 - bx) / dist) * strength;
          by += ((cy2 - by) / dist) * strength;
        }

        // Orb repulsion
        const orbDist = Math.sqrt(bx ** 2 + by ** 2);
        if (orbDist < 90 && orbDist > 0) {
          const repel = (1 - orbDist / 90) * 25;
          bx -= (bx / orbDist) * repel;
          by -= (by / orbDist) * repel;
        }

        const depth = (Math.sin(a) + 1) / 2;
        const isHov = hoveredIdx.current === i;
        const energy = energyRef.current[i];
        const scale = isHov ? 1.32 + energy * 0.1 : 0.76 + 0.27 * depth + energy * 0.05;
        const isLast = lastClickedRef.current === i;

        el.style.transform = `translate(${bx}px,${by}px) scale(${scale})`;
        el.style.zIndex = String(Math.round(depth * 10 + (isHov ? 6 : 0)));
        el.style.opacity = String(cinemaRef.current && !isLast ? 0.4 + 0.55 * depth : 0.55 + 0.45 * depth);

        // Blur non-active in cinema mode
        el.style.filter = cinemaRef.current && !isLast && !isHov
          ? "blur(1.5px)"
          : (isHov ? `drop-shadow(0 0 12px ${NODES[i].color}cc)` : "none");

        // Update trail (canvas coords)
        const W = (ORBIT_RX * 2 + NODE_SIZE + 70);
        const H = (ORBIT_RY * 2 + NODE_SIZE + 70);
        const tx = bx + W / 2;
        const ty = by + H / 2;
        trailsRef.current[i] = [[tx, ty], ...trailsRef.current[i].slice(0, TRAIL_MAX - 1)];
      });

      drawCanvas();
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [drawCanvas]);

  const W = ORBIT_RX * 2 + NODE_SIZE + 70;
  const H = ORBIT_RY * 2 + NODE_SIZE + 70;
  const d = theme === "dark";

  const handleOrbClick = (e: React.MouseEvent) => {
    spawnRipple(e.clientX, e.clientY, "#ff7e5f");
    playTick(440, 0.05);
    const next = eggCount + 1;
    setEggCount(next);
    if (next >= 5) {
      setEggMode(em => !em);
      setEggCount(0);
    }
  };

  const handleNodeClick = (e: React.MouseEvent, i: number) => {
    e.preventDefault();
    spawnRipple(e.clientX, e.clientY, NODES[i].color);
    playTick(880 + i * 80, 0.05);
    lastClickedRef.current = i;
    try { localStorage.setItem("rohan_last_node", String(i)); } catch { }
    setActiveCard(i);
    energyRef.current[i] = 1;
  };

  const discordNode = NODES.find(n => n.id === "discord");

  return (
    <>
      {activeCard !== null && (
        <NodeCard node={NODES[activeCard]} onClose={() => setActiveCard(null)} theme={theme} />
      )}

      <div
        ref={containerRef}
        style={{
          position: "relative", width: W, height: H,
          display: "flex", alignItems: "center", justifyContent: "center",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(50px)",
          transition: "opacity 1s ease, transform 1s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        <canvas ref={canvasRef} width={W} height={H}
          style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />

        {/* Orbit ring */}
        <div style={{
          position: "absolute", width: ORBIT_RX * 2, height: ORBIT_RY * 2,
          borderRadius: "50%",
          border: `1px solid ${d ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)"}`,
          boxShadow: eggMode ? "0 0 30px 4px rgba(255,215,0,0.15) inset" : "none",
          pointerEvents: "none", transition: "box-shadow 0.5s"
        }} />

        {/* ── CENTRAL ORB ── */}
        <div
          style={{
            position: "absolute", zIndex: 10, cursor: "pointer",
            transition: "transform 0.38s cubic-bezier(0.22,1,0.36,1)",
            transform: orbExpanded ? "scale(1.22)" : "scale(1)"
          }}
          onMouseEnter={() => { setOrbExpanded(true); playTick(600, 0.03); }}
          onMouseLeave={() => setOrbExpanded(false)}
          onClick={handleOrbClick}
        >
          {/* Spinning rings */}
          {[{ inset: -16, color: "rgba(255,126,95,0.22)", dur: "5s", dir: "normal" },
          { inset: -27, color: "rgba(36,59,85,0.35)", dur: "9s", dir: "reverse" }
          ].map((r, i) => (
            <div key={i} style={{
              position: "absolute", inset: r.inset, borderRadius: "50%",
              border: `1px ${i === 1 ? "dashed" : "solid"} ${eggMode ? "rgba(255,215,0,0.5)" : r.color}`,
              opacity: orbExpanded ? 1 : 0, transition: "opacity 0.3s ease",
              animation: `spin-slow ${r.dur} linear infinite ${r.dir}`
            }} />
          ))}

          {/* Discord status dot */}
          <div style={{
            position: "absolute", top: -2, right: -2, zIndex: 15,
            width: 16, height: 16, borderRadius: "50%",
            background: STATUS_COLORS[discordStatus.status],
            border: `2px solid ${d ? "#060a12" : "#f5f5f0"}`,
            boxShadow: `0 0 8px 2px ${STATUS_COLORS[discordStatus.status]}88`,
            transition: "background 0.5s, box-shadow 0.5s"
          }}
            title={STATUS_LABELS[discordStatus.status]} />

          {/* Orb body */}
          <div style={{
            width: ORB_SIZE, height: ORB_SIZE, borderRadius: "50%",
            background: eggMode
              ? "radial-gradient(circle at 32% 30%, gold 0%, #ff7e5f 40%, #1e1e1e 100%)"
              : "radial-gradient(circle at 32% 30%, #ffb3a0 0%, #ff7e5f 28%, #1e3a5f 68%, #0a1a2e 100%)",
            boxShadow: orbExpanded
              ? "0 0 55px 22px rgba(255,126,95,0.5), 0 0 110px 40px rgba(36,59,85,0.5)"
              : "0 0 30px 10px rgba(255,126,95,0.28), 0 0 70px 18px rgba(36,59,85,0.32)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexDirection: "column", animation: "pulse-orb 3.5s ease-in-out infinite",
            position: "relative", overflow: "hidden", transition: "box-shadow 0.35s ease, background 0.5s"
          }}>

            <span style={{
              fontFamily: "'Bebas Neue',sans-serif", fontSize: "1.9rem",
              letterSpacing: "0.04em", color: "rgba(255,255,255,0.92)", lineHeight: 1,
              opacity: orbExpanded ? 0 : 1, transition: "opacity 0.18s ease", userSelect: "none",
              position: "absolute"
            }}>{eggMode ? "🌟" : "ρ₁"}</span>

            <div style={{
              position: "absolute", inset: 0, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              opacity: orbExpanded ? 1 : 0, transition: "opacity 0.22s ease 0.1s"
            }}>
              <span style={{
                fontFamily: "'Bebas Neue',sans-serif", fontSize: "1.1rem",
                color: "rgba(255,255,255,0.96)", letterSpacing: "0.09em"
              }}>ROHAN</span>
              <span style={{
                fontFamily: "'DM Sans',sans-serif", fontSize: "0.48rem",
                color: "rgba(255,210,195,0.82)", letterSpacing: "0.18em", marginTop: "3px",
                textTransform: "uppercase"
              }}>
                {discordStatus.spotify ? `🎧 ${discordStatus.spotify.song}` : "DEV / BUILDER"}
              </span>
            </div>

            <div style={{
              position: "absolute", inset: 0, borderRadius: "50%",
              background: "radial-gradient(circle at 68% 18%, rgba(255,255,255,0.14) 0%, transparent 58%)",
              pointerEvents: "none"
            }} />
          </div>
        </div>

        {/* ── SOCIAL NODES ── */}
        {NODES.map((node, i) => {
          const isLast = lastClickedRef.current === i;
          const isDiscord = node.id === "discord";
          return (
            <a key={node.id}
              ref={el => { nodesRef.current[i] = el; }}
              href={node.href}
              target={node.href.startsWith("mailto") ? undefined : "_blank"}
              rel="noopener noreferrer"
              aria-label={node.label}
              onClick={e => handleNodeClick(e, i)}
              onMouseEnter={() => {
                hoveredIdx.current = i;
                pausedRef.current = true;
                playTick(1200 + i * 60, 0.025);
              }}
              onMouseLeave={() => {
                hoveredIdx.current = null;
                pausedRef.current = false;
              }}
              style={{
                position: "absolute", width: NODE_SIZE, height: NODE_SIZE, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                background: d ? "rgba(6,10,18,0.65)" : "rgba(245,245,240,0.75)",
                border: `1px solid ${isLast ? node.color + "aa" : node.color + "55"}`,
                backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)",
                color: node.color, willChange: "transform, opacity, filter",
                textDecoration: "none", cursor: "pointer",
                transition: "box-shadow 0.22s ease, border-color 0.22s ease",
                boxShadow: `0 0 14px 2px ${node.glow.replace("0.7", "0.18")}, inset 0 0 10px 0 ${node.color}0e`
              }}
              onMouseOver={e => {
                const el = e.currentTarget;
                el.style.boxShadow = `0 0 38px 12px ${node.glow}, 0 0 80px 24px ${node.glow.replace("0.7", "0.18")}, inset 0 0 22px 0 ${node.color}22`;
                el.style.borderColor = `${node.color}cc`;
              }}
              onMouseOut={e => {
                const el = e.currentTarget;
                el.style.boxShadow = `0 0 14px 2px ${node.glow.replace("0.7", "0.18")}, inset 0 0 10px 0 ${node.color}0e`;
                el.style.borderColor = `${node.color}${isLast ? "aa" : "55"}`;
              }}
            >
              <node.Icon size={24} strokeWidth={1.5} />
              {/* Memory indicator */}
              {isLast && (
                <div style={{
                  position: "absolute", top: -3, right: -3, width: 10, height: 10,
                  borderRadius: "50%", background: node.color,
                  boxShadow: `0 0 6px 2px ${node.glow}`,
                  animation: "pulse-orb 2s ease-in-out infinite"
                }} />
              )}
              {/* Discord presence dot */}
              {isDiscord && (
                <div style={{
                  position: "absolute", bottom: -2, right: -2, width: 14, height: 14,
                  borderRadius: "50%", background: STATUS_COLORS[discordStatus.status],
                  border: `2px solid ${d ? "#060a12" : "#f5f5f0"}`,
                  boxShadow: `0 0 6px 2px ${STATUS_COLORS[discordStatus.status]}88`,
                  transition: "background 0.5s"
                }} />
              )}
            </a>
          );
        })}
      </div>

      {/* Keyboard hint */}
      <div style={{
        position: "absolute", bottom: "2rem", left: "50%", transform: "translateX(-50%)",
        fontFamily: "'DM Sans',sans-serif", fontSize: "0.55rem", letterSpacing: "0.3em",
        color: d ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.18)", textTransform: "uppercase",
        opacity: visible ? 1 : 0, transition: "opacity 1s ease 1.5s",
        whiteSpace: "nowrap"
      }}>
        space — pause &nbsp;·&nbsp; ← → — rotate &nbsp;·&nbsp; enter — open
      </div>
    </>
  );
}

// ─── THEME TOGGLE ─────────────────────────────────────────────────────────────

function ThemeToggle({ theme, onToggle }: { theme: Theme; onToggle: () => void }) {
  const [flip, setFlip] = useState(false);
  const handleClick = () => {
    setFlip(true);
    setTimeout(() => { onToggle(); setFlip(false); }, 350);
  };
  const d = theme === "dark";
  return (
    <button
      onClick={handleClick}
      style={{
        position: "fixed", top: "1.5rem", right: "1.5rem", zIndex: 50,
        width: 44, height: 44, borderRadius: "50%", border: "none", cursor: "pointer",
        background: d ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
        backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "1.2rem", transition: "background 0.3s, box-shadow 0.3s",
        boxShadow: d ? "0 0 20px rgba(255,126,95,0.15)" : "0 0 20px rgba(0,0,0,0.08)",
        transform: flip ? "rotateY(180deg) scale(0.85)" : "rotateY(0) scale(1)",
        transitionProperty: "transform, background, box-shadow"
      }}
      aria-label="Toggle theme"
      title={d ? "Switch to light mode" : "Switch to dark mode"}
    >
      {d ? "☀️" : "🌑"}
    </button>
  );
}

// ─── DISCORD STATUS (Lanyard) ─────────────────────────────────────────────────

const DISCORD_USER_ID = "1372232239751893074"; // update with your real Discord user ID

function useDiscordStatus(): DiscordStatus {
  const [status, setStatus] = useState<DiscordStatus>({ status: "offline" });

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
        const BACKEND_URL = isLocal
          ? "http://127.0.0.1:8888"
          : (process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8888");

        const res = await fetch(`${BACKEND_URL}/status`);
        const json = await res.json();
        if (!json.success) return;

        const d = json.data;
        setStatus({
          status: d.status === "dnd" || d.status === "online" || d.status === "idle" ? d.status : "offline",
          activity: d.activity?.name,
          details: d.activity?.details,
          state: d.activity?.state,
          assets: { largeImage: d.activity?.largeImage },
          customStatus: d.customStatus,
          spotify: d.spotify ? {
            song: d.spotify.song ?? "",
            artist: d.spotify.artist ?? "",
            albumArt: d.spotify.albumArt ?? "",
          } : undefined,
        });
      } catch (err) {
        console.error("Backend Error:", err);
        setStatus({ status: "offline" });
      }
    };

    fetchStatus();
    const id = setInterval(fetchStatus, 5000);
    return () => clearInterval(id);
  }, []);

  return status;
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function Home() {
  const [section, setSection] = useState<Section>("hero");
  const [orbVisible, setOrbVisible] = useState(false);
  const [theme, setTheme] = useState<Theme>("dark");
  const containerRef = useRef<HTMLDivElement>(null);
  const transitioning = useRef(false);
  const discordStatus = useDiscordStatus();

  const goOrbit = useCallback(() => {
    if (transitioning.current || section === "orbit") return;
    transitioning.current = true;
    setSection("orbit");
    setTimeout(() => { setOrbVisible(true); transitioning.current = false; }, 80);
  }, [section]);

  const goHero = useCallback(() => {
    if (transitioning.current || section === "hero") return;
    transitioning.current = true;
    setOrbVisible(false);
    setTimeout(() => { setSection("hero"); transitioning.current = false; }, 560);
  }, [section]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY > 25) goOrbit();
      else if (e.deltaY < -25) goHero();
    };
    let ty = 0;
    const onTS = (e: TouchEvent) => { ty = e.touches[0].clientY; };
    const onTE = (e: TouchEvent) => {
      const d = ty - e.changedTouches[0].clientY;
      if (d > 40) goOrbit(); else if (d < -40) goHero();
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchstart", onTS, { passive: true });
    el.addEventListener("touchend", onTE, { passive: true });
    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onTS);
      el.removeEventListener("touchend", onTE);
    };
  }, [goOrbit, goHero]);

  const d = theme === "dark";

  const panelBase: React.CSSProperties = {
    position: "absolute", inset: 0,
    display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
    transition: "opacity 0.6s ease, transform 0.65s cubic-bezier(0.22,1,0.36,1)",
    zIndex: 2,
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@200;300&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body {
          width: 100%; height: 100%; overflow: hidden;
          background: ${d ? "#060a12" : "#f5f5f0"};
          transition: background 0.6s ease;
        }
        @keyframes pulse-orb {
          0%,100% { filter: brightness(1); }
          50%      { filter: brightness(1.13); }
        }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes ripple-out {
          0%   { width:0;      height:0;      opacity:0.9; }
          100% { width:200px;  height:200px;  opacity:0;   }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes fade-up {
          from { opacity:0; transform:translateY(22px); }
          to   { opacity:1; transform:translateY(0);    }
        }
        @keyframes scroll-bounce {
          0%,100% { opacity:0.2; transform:translateY(0);  }
          50%     { opacity:0.6; transform:translateY(7px); }
        }
        @keyframes aura-breath {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.8; }
          50% { transform: translate(-50%, -50%) scale(1.15); opacity: 1; }
        }
      /* Responsive Scaling */
      @media (max-width: 768px) {
        .hero-title { font-size: 15vw !important; }
        .orbital-system { transform: scale(0.65); transform-origin: center; }
        .rich-status-card { max-width: 90vw !important; }
      }

      @media (max-width: 480px) {
        .hero-title { font-size: 18vw !important; }
        .orbital-system { transform: scale(0.45); }
      }
      `}</style>

      <CursorTrail theme={theme} />
      <ThemeToggle theme={theme} onToggle={() => setTheme(t => t === "dark" ? "light" : "dark")} />

      {/* 🌪️ Reactive Global Atmosphere 🌪️ */}
      <AuraBackground status={discordStatus} />

      {/* Legacy Redirection Link */}
      <a
        href="https://rohanofficial.netlify.app"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: "fixed", bottom: "1.5rem", right: "2rem", zIndex: 100,
          fontFamily: "'DM Sans',sans-serif", fontSize: "0.55rem", letterSpacing: "0.2em",
          color: d ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.2)", textTransform: "uppercase",
          textDecoration: "none", transition: "all 0.3s ease", display: "flex", alignItems: "center", gap: "8px"
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#ff7e5f"; (e.currentTarget as HTMLElement).style.opacity = "1"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = d ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.2)"; }}
      >
        <span style={{ width: "20px", height: "1px", background: "currentColor", opacity: 0.3 }}></span>
        Legacy Version
      </a>

      <div ref={containerRef}
        style={{
          position: "fixed", inset: 0, overflow: "hidden",
          background: d ? "#060a12" : "#f5f5f0", transition: "background 0.6s ease"
        }}>

        <ParallaxBg theme={theme} />

        {/* ── HERO ── */}
        <div style={{
          ...panelBase,
          opacity: section === "hero" ? 1 : 0,
          transform: section === "hero" ? "translateY(0)" : "translateY(-55px)",
          pointerEvents: section === "hero" ? "auto" : "none"
        }}>

          <div style={{ animation: "fade-up 0.7s ease both" }}>
            <GlitchTitle theme={theme} />
          </div>
          <div style={{ animation: "fade-up 0.6s ease 0.18s both" }}>
            <TypingTag theme={theme} />
          </div>
          <div style={{
            width: "clamp(70px,12vw,160px)", height: "1px",
            background: "linear-gradient(90deg,transparent,rgba(255,126,95,0.5),transparent)",
            marginTop: "1.8rem", animation: "fade-up 0.5s ease 0.35s both"
          }} />

          {/* ⚡ RICH DISCORD STATUS CARD ⚡ */}
          <div className="rich-status-card" style={{ marginTop: "2rem", animation: "fade-up 0.5s ease 0.5s both", width: "100%", maxWidth: "320px" }}>
            <div style={{
              background: d ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)",
              border: `1px solid ${d ? "rgba(255,126,95,0.15)" : "rgba(180,60,30,0.1)"}`,
              borderRadius: "16px", padding: "12px", backdropFilter: "blur(10px)",
              display: "flex", gap: "12px", alignItems: "center"
            }}>
              {/* Media/App Cover */}
              <div style={{ position: "relative", flexShrink: 0 }}>
                {discordStatus.spotify?.albumArt || discordStatus.assets?.largeImage ? (
                  <img
                    src={discordStatus.spotify?.albumArt || discordStatus.assets?.largeImage}
                    alt="Cover"
                    style={{
                      width: "52px", height: "52px", borderRadius: "8px", objectFit: "cover",
                      filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.2))"
                    }}
                  />
                ) : (
                  <div style={{
                    width: "52px", height: "52px", borderRadius: "8px",
                    background: d ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                    display: "flex", alignItems: "center", justifyContent: "center"
                  }}>
                    <MessageCircle size={20} opacity={0.3} />
                  </div>
                )}
                {/* Small indicator */}
                <div style={{
                  position: "absolute", bottom: "-3px", right: "-3px", width: "16px", height: "16px",
                  borderRadius: "50%", background: STATUS_COLORS[discordStatus.status],
                  border: `2px solid ${d ? "#060a12" : "#f5f5f0"}`,
                  boxShadow: `0 0 8px ${STATUS_COLORS[discordStatus.status]}88`
                }} />
              </div>

              {/* Info text */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "2px" }}>
                  <span style={{
                    fontFamily: "'Bebas Neue',sans-serif", fontSize: "0.85rem", letterSpacing: "0.05em",
                    color: "#ff7e5f"
                  }}>
                    {discordStatus.activity || (discordStatus.customStatus ? "Thinking" : "Live Status")}
                  </span>
                  <span style={{ fontSize: "0.6rem", opacity: 0.3 }}>—</span>
                  <span style={{
                    fontFamily: "'DM Sans',sans-serif", fontSize: "0.58rem",
                    textTransform: "uppercase", letterSpacing: "0.1em", color: "#54a0ff", fontWeight: 700
                  }}>
                    {discordStatus.customStatus?.text || STATUS_LABELS[discordStatus.status]}
                  </span>
                </div>

                <div style={{
                  fontFamily: "'DM Sans',sans-serif", fontSize: "0.78rem", fontWeight: 500,
                  color: d ? "#fff" : "#000", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
                }}>
                  {discordStatus.spotify ? discordStatus.spotify.song : (discordStatus.details || "Chilling...")}
                </div>

                <div style={{
                  fontFamily: "'DM Sans',sans-serif", fontSize: "0.68rem", opacity: 0.6, color: "#ffb3a0",
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginTop: "1px"
                }}>
                  {discordStatus.spotify ? discordStatus.spotify.artist : (discordStatus.state || "")}
                </div>
              </div>
            </div>
          </div>

          {/* Scroll cue */}
          <div style={{
            position: "absolute", bottom: "2.5rem",
            display: "flex", flexDirection: "column", alignItems: "center", gap: "6px",
            animation: "scroll-bounce 2.2s ease-in-out infinite", cursor: "pointer"
          }}
            onClick={goOrbit}>
            <span style={{
              fontFamily: "'DM Sans',sans-serif", fontSize: "0.58rem",
              letterSpacing: "0.35em", color: d ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.2)",
              textTransform: "uppercase"
            }}>scroll</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1v12M3 9l4 4 4-4"
                stroke={d ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.2)"}
                strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* ── ORBIT ── */}
        <div style={{
          ...panelBase,
          opacity: section === "orbit" ? 1 : 0,
          transform: section === "orbit" ? "translateY(0)" : "translateY(55px)",
          pointerEvents: section === "orbit" ? "auto" : "none"
        }}>

          <h1 className="hero-title" style={{
            fontFamily: "'Bebas Neue',sans-serif",
            fontSize: "12vw",
            letterSpacing: "0.06em",
            color: "transparent",
            WebkitTextStroke: `1px ${d ? "rgba(255,255,255,0.032)" : "rgba(0,0,0,0.04)"}`,
            userSelect: "none", pointerEvents: "none"
          }}>ROHAN</h1>

          <div className="orbital-system" style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <OrbitalSystem visible={orbVisible} theme={theme} discordStatus={discordStatus} />
          </div>

          {/* Back */}
          <div style={{
            position: "absolute", top: "2rem", left: "50%", transform: "translateX(-50%)",
            display: "flex", alignItems: "center", gap: "6px", cursor: "pointer",
            opacity: orbVisible ? 0.28 : 0, transition: "opacity 0.5s ease", userSelect: "none"
          }}
            onClick={goHero}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "0.7"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = "0.28"; }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 13V1M3 5l4-4 4 4"
                stroke={d ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.5)"}
                strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{
              fontFamily: "'DM Sans',sans-serif", fontSize: "0.58rem",
              letterSpacing: "0.35em",
              color: d ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.4)",
              textTransform: "uppercase"
            }}>back</span>
          </div>
        </div>
      </div>
    </>
  );
}
