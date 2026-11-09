import { CanvasTexture, SRGBColorSpace } from "three";

/* Textures drawn on a canvas once and shared: the light pools on the wall,
   the spotlight beams, the starry window and the emoji game tiles. */
const cache = new Map<string, CanvasTexture>();

function make(key: string, w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, color = false) {
  const hit = cache.get(key);
  if (hit) return hit;
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  draw(c.getContext("2d")!);
  const t = new CanvasTexture(c);
  if (color) t.colorSpace = SRGBColorSpace;
  cache.set(key, t);
  return t;
}

/* soft oval of light, brightest near the top, as if from a ceiling spot */
export const poolTexture = () => make("pool", 256, 256, (g) => {
  const r = g.createRadialGradient(128, 90, 0, 128, 110, 128);
  r.addColorStop(0, "rgba(255,255,255,1)");
  r.addColorStop(.35, "rgba(255,255,255,.45)");
  r.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = r;
  g.fillRect(0, 0, 256, 256);
});

/* the beam fades out as it falls (alpha maps read the green channel) */
export const beamTexture = () => make("beam", 4, 256, (g) => {
  const l = g.createLinearGradient(0, 0, 0, 256);
  l.addColorStop(0, "#fff");
  l.addColorStop(.55, "#555");
  l.addColorStop(1, "#000");
  g.fillStyle = l;
  g.fillRect(0, 0, 4, 256);
});

/* the night outside the entrance window: stars, a glow and a crescent moon */
export const skyTexture = () => make("sky", 1600, 900, (g) => {
  const l = g.createLinearGradient(0, 0, 0, 900);
  l.addColorStop(0, "#090515");
  l.addColorStop(.7, "#1d0f3d");
  l.addColorStop(1, "#3b1a6b");
  g.fillStyle = l;
  g.fillRect(0, 0, 1600, 900);
  const glow = g.createRadialGradient(800, 980, 0, 800, 980, 700);
  glow.addColorStop(0, "rgba(232,121,249,.35)");
  glow.addColorStop(1, "rgba(232,121,249,0)");
  g.fillStyle = glow;
  g.fillRect(0, 0, 1600, 900);
  let seed = 11;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < 520; i++) {
    const x = rnd() * 1600, y = rnd() * 820, r = rnd() * 1.7 + .3;
    g.globalAlpha = .35 + rnd() * .65;
    g.fillStyle = i % 6 ? "#ffffff" : "#c4b5fd";
    g.beginPath(); g.arc(x, y, r, 0, 6.283); g.fill();
  }
  g.globalAlpha = 1;
  /* crescent: a bright disc with a sky-coloured disc over it */
  g.shadowColor = "rgba(253,230,138,.8)"; g.shadowBlur = 40;
  g.fillStyle = "#FDF4C8";
  g.beginPath(); g.arc(1250, 210, 70, 0, 6.283); g.fill();
  g.shadowBlur = 0;
  g.fillStyle = "#0d0720";
  g.beginPath(); g.arc(1282, 188, 64, 0, 6.283); g.fill();
}, true);

/* a game tile for games without pixel art: the emoji on a purple card */
export const glyphTexture = (glyph: string) => make("glyph:" + glyph, 256, 256, (g) => {
  const l = g.createLinearGradient(0, 0, 256, 256);
  l.addColorStop(0, "#2e1065");
  l.addColorStop(1, "#7c3aed");
  g.fillStyle = l;
  g.fillRect(0, 0, 256, 256);
  g.font = "140px 'Segoe UI Emoji', 'Apple Color Emoji', 'Noto Color Emoji', sans-serif";
  g.textAlign = "center"; g.textBaseline = "middle";
  g.fillText(glyph, 128, 140);
}, true);

/* a soft halo for behind a frame: a rounded rectangle, heavily blurred */
export const glowTexture = () => make("glow", 256, 256, (g) => {
  g.filter = "blur(26px)";
  g.fillStyle = "#fff";
  g.beginPath();
  g.roundRect(56, 56, 144, 144, 18);
  g.fill();
});

/* plaster wall with faint vertical panel seams; tinted by the material colour */
export const wallTexture = () => make("wall", 512, 512, (g) => {
  g.fillStyle = "#ffffff";
  g.fillRect(0, 0, 512, 512);
  let seed = 3;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < 9000; i++) {
    g.fillStyle = `rgba(0,0,0,${rnd() * .05})`;
    g.fillRect(rnd() * 512, rnd() * 512, 2, 2);
  }
  g.fillStyle = "rgba(0,0,0,.22)";
  g.fillRect(0, 0, 3, 512);
  g.fillStyle = "rgba(255,255,255,.5)";
  g.fillRect(3, 0, 1, 512);
}, true);

/* light rising from the floor, for the inside of the arched alcoves */
export const riseTexture = () => make("rise", 4, 256, (g) => {
  const l = g.createLinearGradient(0, 256, 0, 0);
  l.addColorStop(0, "#fff");
  l.addColorStop(.6, "#333");
  l.addColorStop(1, "#000");
  g.fillStyle = l;
  g.fillRect(0, 0, 4, 256);
});

/* ---------------------------------------------------------- floors */
const rand = (seed: number) => () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

/* wooden planks: long boards in staggered rows, slight tone changes */
export const plankTexture = (dark: boolean) => make(dark ? "planks-d" : "planks", 512, 512, (g) => {
  const rnd = rand(dark ? 5 : 9);
  const base = dark ? [62, 42, 34] : [122, 86, 60];
  for (let row = 0; row < 8; row++) {
    let x = -rnd() * 200;
    while (x < 512) {
      const len = 160 + rnd() * 180, k = .82 + rnd() * .3;
      g.fillStyle = `rgb(${base.map((c) => Math.round(c * k)).join(",")})`;
      g.fillRect(x, row * 64, len, 64);
      g.fillStyle = "rgba(0,0,0,.35)";
      g.fillRect(x, row * 64, 2, 64);
      x += len;
    }
    g.fillStyle = "rgba(0,0,0,.4)";
    g.fillRect(0, row * 64, 512, 2);
  }
  for (let i = 0; i < 2600; i++) {
    g.fillStyle = `rgba(0,0,0,${rnd() * .08})`;
    g.fillRect(rnd() * 512, rnd() * 512, 6 + rnd() * 30, 1);
  }
}, true);

/* soft carpet in the game room */
export const carpetTexture = () => make("carpet", 256, 256, (g) => {
  const rnd = rand(21);
  g.fillStyle = "#3b2470";
  g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 9000; i++) {
    g.fillStyle = rnd() > .5 ? "rgba(255,255,255,.035)" : "rgba(0,0,0,.06)";
    g.fillRect(rnd() * 256, rnd() * 256, 1.5, 1.5);
  }
}, true);

/* square tiles with thin grout */
export const tileTexture = () => make("tile", 256, 256, (g) => {
  g.fillStyle = "#d9d3e6";
  g.fillRect(0, 0, 256, 256);
  g.fillStyle = "#b8b0cc";
  for (let i = 0; i <= 4; i++) { g.fillRect(i * 64 - 1, 0, 2, 256); g.fillRect(0, i * 64 - 1, 256, 2); }
}, true);

/* black and white kitchen checkerboard */
export const checkerTexture = () => make("checker", 256, 256, (g) => {
  for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) {
    g.fillStyle = (x + y) % 2 ? "#2a2338" : "#e9e4f2";
    g.fillRect(x * 64, y * 64, 64, 64);
  }
}, true);

/* the living room TV: the welcome screen */
export const tvTexture = () => make("tv", 1024, 576, (g) => {
  const l = g.createLinearGradient(0, 0, 1024, 576);
  l.addColorStop(0, "#1e0b45");
  l.addColorStop(1, "#6d28d9");
  g.fillStyle = l;
  g.fillRect(0, 0, 1024, 576);
  g.textAlign = "center";
  g.fillStyle = "#c4b5fd";
  g.font = "600 34px 'JetBrains Mono', monospace";
  g.fillText("HI, I'M", 512, 210);
  g.fillStyle = "#ffffff";
  g.font = "700 92px 'Space Grotesk', sans-serif";
  g.fillText("Jhan Maurice", 512, 310);
  g.fillStyle = "#e9d5ff";
  g.font = "400 36px 'Inter', sans-serif";
  g.fillText("I build apps that talk to each other.", 512, 380);
}, true);

/* a neon sign: text glowing on a dark plate */
export const signTexture = (text: string, color = "#f0abfc") => make("sign:" + text, 1024, 256, (g) => {
  g.fillStyle = "#120a22";
  g.fillRect(0, 0, 1024, 256);
  g.textAlign = "center"; g.textBaseline = "middle";
  g.font = "700 120px 'Space Grotesk', sans-serif";
  g.shadowColor = color; g.shadowBlur = 40;
  g.fillStyle = color;
  g.fillText(text, 512, 132);
  g.shadowBlur = 0;
  g.fillStyle = "#fff";
  g.fillText(text, 512, 132);
}, true);

/* faint plaster grain for the walls */
export const plasterTexture = () => make("plaster", 256, 256, (g) => {
  const rnd = rand(31);
  g.fillStyle = "#ffffff";
  g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 7000; i++) {
    g.fillStyle = `rgba(90,70,120,${rnd() * .05})`;
    g.fillRect(rnd() * 256, rnd() * 256, 1 + rnd() * 2, 1 + rnd() * 2);
  }
}, true);

/* white subway tiles for the kitchen backsplash */
export const subwayTexture = () => make("subway", 256, 256, (g) => {
  g.fillStyle = "#d8d2e3";
  g.fillRect(0, 0, 256, 256);
  for (let row = 0; row < 8; row++) {
    const off = row % 2 ? 32 : 0;
    for (let x = -64; x < 256; x += 64) {
      g.fillStyle = "#f7f4fb";
      g.fillRect(x + off + 2, row * 32 + 2, 60, 28);
    }
  }
}, true);

/* a vertical fabric fold pattern for curtains */
export const fabricTexture = () => make("fabric", 256, 64, (g) => {
  for (let x = 0; x < 256; x++) {
    const v = 200 + Math.round(Math.sin(x / 256 * Math.PI * 12) * 40);
    g.fillStyle = `rgb(${v},${v},${v})`;
    g.fillRect(x, 0, 1, 64);
  }
}, true);

/* the coffee bar's chalkboard menu */
export const menuTexture = () => make("menu", 768, 512, (g) => {
  g.fillStyle = "#1d2420";
  g.fillRect(0, 0, 768, 512);
  g.strokeStyle = "rgba(255,255,255,.25)"; g.lineWidth = 3;
  g.strokeRect(18, 18, 732, 476);
  g.textAlign = "center"; g.fillStyle = "#f5f0e6";
  g.font = "700 64px 'Space Grotesk', sans-serif";
  g.fillText("MAUWCCHIATO", 384, 100);
  g.font = "400 26px 'JetBrains Mono', monospace";
  g.fillStyle = "#c4b5fd";
  g.fillText("— today's menu —", 384, 148);
  const rows = [["Kape", "always"], ["Code", "fresh daily"], ["Kwentuhan", "free"], ["Bug fixes", "on the house"]];
  g.font = "500 34px 'Inter', sans-serif";
  rows.forEach(([a, b], i) => {
    const y = 225 + i * 66;
    g.textAlign = "left"; g.fillStyle = "#f5f0e6"; g.fillText(a, 90, y);
    g.textAlign = "right"; g.fillStyle = "#fde68a"; g.fillText(b, 678, y);
  });
}, true);

/* a retro game poster for the game room */
export const pressStartTexture = () => make("pressstart", 512, 704, (g) => {
  const l = g.createLinearGradient(0, 0, 0, 704);
  l.addColorStop(0, "#160a33"); l.addColorStop(1, "#5b21b6");
  g.fillStyle = l; g.fillRect(0, 0, 512, 704);
  /* a grid floor running to the horizon */
  g.strokeStyle = "rgba(232,121,249,.7)"; g.lineWidth = 2;
  for (let i = 0; i <= 12; i++) { g.beginPath(); g.moveTo(256, 420); g.lineTo(-300 + i * 92, 704); g.stroke(); }
  for (let j = 0; j < 8; j++) { const y = 420 + Math.pow(j / 8, 2) * 284; g.beginPath(); g.moveTo(0, y); g.lineTo(512, y); g.stroke(); }
  const sun = g.createLinearGradient(0, 220, 0, 420);
  sun.addColorStop(0, "#fde68a"); sun.addColorStop(1, "#f472b6");
  g.fillStyle = sun; g.beginPath(); g.arc(256, 420, 150, Math.PI, 0); g.fill();
  g.textAlign = "center"; g.fillStyle = "#fff";
  g.font = "700 64px 'Space Grotesk', sans-serif";
  g.shadowColor = "#e879f9"; g.shadowBlur = 24;
  g.fillText("PRESS", 256, 110); g.fillText("START", 256, 180);
}, true);

/* the arcade marquee: the game's name lit up */
export const marqueeTexture = (text: string, color: string) => make("marquee:" + text, 512, 128, (g) => {
  const l = g.createLinearGradient(0, 0, 512, 0);
  l.addColorStop(0, "#1a0b3a"); l.addColorStop(.5, "#2e1065"); l.addColorStop(1, "#1a0b3a");
  g.fillStyle = l; g.fillRect(0, 0, 512, 128);
  g.textAlign = "center"; g.textBaseline = "middle";
  g.font = "700 54px 'Space Grotesk', sans-serif";
  g.shadowColor = color; g.shadowBlur = 22; g.fillStyle = color;
  g.fillText(text, 256, 68);
  g.shadowBlur = 0; g.fillStyle = "#fff"; g.fillText(text, 256, 68);
}, true);

/* arcade side art: diagonal stripes in the cabinet's colour */
export const sideArtTexture = (color: string) => make("side:" + color, 256, 512, (g) => {
  g.fillStyle = "#140c26"; g.fillRect(0, 0, 256, 512);
  g.save(); g.translate(128, 256); g.rotate(-.5);
  [[-90, 36], [-20, 18], [30, 8]].forEach(([y, h]) => { g.fillStyle = color; g.fillRect(-300, y as number, 600, h as number); });
  g.restore();
  const l = g.createLinearGradient(0, 0, 0, 512);
  l.addColorStop(0, "rgba(20,12,38,0)"); l.addColorStop(1, "rgba(20,12,38,.85)");
  g.fillStyle = l; g.fillRect(0, 0, 256, 512);
}, true);

/* vertical wood boards for the outside cladding */
export const boardTexture = () => make("boards", 256, 256, (g) => {
  const rnd = rand(53);
  for (let x = 0; x < 256; x += 32) {
    const k = .85 + rnd() * .3;
    g.fillStyle = `rgb(${Math.round(132 * k)},${Math.round(88 * k)},${Math.round(58 * k)})`;
    g.fillRect(x, 0, 32, 256);
    g.fillStyle = "rgba(0,0,0,.45)";
    g.fillRect(x, 0, 2, 256);
    for (let i = 0; i < 40; i++) { g.fillStyle = `rgba(0,0,0,${rnd() * .1})`; g.fillRect(x + 3 + rnd() * 26, rnd() * 256, 1, 10 + rnd() * 40); }
  }
}, true);

/* a solar panel: dark blue cells on a silver grid */
export const solarTexture = () => make("solar", 256, 128, (g) => {
  g.fillStyle = "#c9cbd6"; g.fillRect(0, 0, 256, 128);
  for (let y = 0; y < 4; y++) for (let x = 0; x < 8; x++) {
    const l = g.createLinearGradient(0, y * 32, 0, y * 32 + 30);
    l.addColorStop(0, "#1e3a8a"); l.addColorStop(1, "#14234f");
    g.fillStyle = l; g.fillRect(x * 32 + 2, y * 32 + 2, 28, 28);
  }
}, true);
