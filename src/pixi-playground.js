import "./pixi-playground.css";
import { Application, Container, Graphics, Text } from "pixi.js";

const canvas = document.getElementById("aigcmktPixiPlayground");
const buttons = Array.from(document.querySelectorAll("[data-pixi-mode]"));

const state = {
  mode: "mission",
  width: 900,
  height: 560,
  score: 28,
  rank: 8,
  recommendation: 32,
  dragging: null,
  pointer: { x: 0, y: 0 },
  time: 0,
  particles: [],
  cards: [],
};

const copy = {
  mission: "把信源资产拖进 AI 搜索引擎，看推荐率和排名即时变化。",
  battle: "点击飞来的需求词，把它们转化成高排名搜索结果。",
  map: "鼠标靠近平台节点，查看不同 AI 平台的推荐强度和信源覆盖。",
};

const assets = [
  { id: "site", label: "官网", detail: "AI 可引用信源", color: 0x2563eb, value: 18 },
  { id: "case", label: "案例", detail: "客户结果证明", color: 0x16a34a, value: 16 },
  { id: "whitepaper", label: "白皮书", detail: "行业知识资产", color: 0x7c3aed, value: 14 },
  { id: "rag", label: "RAG", detail: "减少 AI 幻觉", color: 0x0891b2, value: 20 },
];

const platforms = [
  { label: "GPT", value: 88, angle: 0 },
  { label: "豆包", value: 84, angle: 1.25 },
  { label: "DeepSeek", value: 81, angle: 2.5 },
  { label: "Kimi", value: 76, angle: 3.75 },
  { label: "Gemini", value: 72, angle: 5.0 },
];

let app;
let root;
let bgLayer;
let gameLayer;
let particleLayer;
let uiLayer;
let resizeObserver;

function style(size, color = 0x0f172a, weight = "700", align = "left") {
  return {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Inter", "Microsoft YaHei", sans-serif',
    fontSize: size,
    fill: color,
    fontWeight: weight,
    align,
  };
}

function roundRect(x, y, w, h, r, fill, alpha = 1, stroke = null) {
  const g = new Graphics();
  g.roundRect(x, y, w, h, r).fill({ color: fill, alpha });
  if (stroke) g.roundRect(x, y, w, h, r).stroke(stroke);
  return g;
}

function label(text, x, y, size, color = 0x0f172a, weight = "700", anchor = null) {
  const t = new Text({ text, style: style(size, color, weight) });
  t.x = x;
  t.y = y;
  if (anchor) t.anchor.set(anchor.x, anchor.y);
  return t;
}

function clear(container) {
  container.removeChildren();
}

function addParticle(x, y, color, count = 18) {
  for (let i = 0; i < count; i += 1) {
    const a = Math.random() * Math.PI * 2;
    const speed = 1.4 + Math.random() * 4.8;
    const p = new Graphics();
    p.circle(0, 0, 2 + Math.random() * 3).fill({ color, alpha: 0.96 });
    p.x = x;
    p.y = y;
    particleLayer.addChild(p);
    state.particles.push({
      node: p,
      vx: Math.cos(a) * speed,
      vy: Math.sin(a) * speed,
      life: 1,
      decay: 0.018 + Math.random() * 0.02,
    });
  }
}

function hitCircle(x, y, cx, cy, r) {
  const dx = x - cx;
  const dy = y - cy;
  return dx * dx + dy * dy <= r * r;
}

function engineCenter() {
  return {
    x: state.width * 0.52,
    y: state.height * 0.52,
    r: Math.min(state.width, state.height) * 0.15,
  };
}

function makeAssetCard(asset, index) {
  const compact = state.width < 680;
  const cardW = compact ? 104 : 134;
  const cardH = compact ? 76 : 88;
  const gap = compact ? 10 : 14;
  const startX = compact ? 18 : 34;
  const startY = compact ? 88 + index * (cardH + gap) : 104 + index * (cardH + gap);
  const c = new Container();
  c.eventMode = "static";
  c.cursor = "grab";
  c.x = startX;
  c.y = startY;
  c.original = { x: startX, y: startY };
  c.asset = asset;

  c.addChild(roundRect(0, 0, cardW, cardH, 18, 0xffffff, 0.96, { width: 2, color: asset.color, alpha: 0.2 }));
  const glow = new Graphics();
  glow.roundRect(4, 4, cardW - 8, cardH - 8, 16).stroke({ width: 2, color: asset.color, alpha: 0.26 });
  c.addChild(glow);
  c.addChild(label(asset.label, 18, 28, compact ? 18 : 22, asset.color, "900"));
  c.addChild(label(asset.detail, 18, compact ? 54 : 62, compact ? 10 : 12, 0x64748b, "800"));

  c.on("pointerdown", (event) => {
    state.dragging = c;
    c.cursor = "grabbing";
    c.alpha = 0.88;
    c.scale.set(1.06);
    const p = event.global;
    c.dragOffset = { x: p.x - c.x, y: p.y - c.y };
  });

  gameLayer.addChild(c);
  return c;
}

function drawBackground() {
  clear(bgLayer);
  const w = state.width;
  const h = state.height;
  bgLayer.addChild(roundRect(0, 0, w, h, 0, 0xf8fbff, 1));
  for (let i = 0; i < 70; i += 1) {
    const dot = new Graphics();
    const x = (i * 83) % w;
    const y = (i * 47) % h;
    dot.circle(x, y, 1.3 + (i % 4) * 0.4).fill({ color: i % 2 ? 0x38bdf8 : 0x22c55e, alpha: 0.16 });
    bgLayer.addChild(dot);
  }
}

function drawHUD() {
  clear(uiLayer);
  canvas.dataset.pixiMode = state.mode;
  canvas.dataset.score = String(Math.round(state.score));
  canvas.dataset.rank = String(Math.max(1, Math.round(state.rank)));
  canvas.dataset.recommendation = String(Math.round(state.recommendation));
  const w = state.width;
  uiLayer.addChild(roundRect(18, 18, w - 36, 54, 18, 0xffffff, 0.88, { width: 1, color: 0xdbeafe, alpha: 1 }));
  uiLayer.addChild(label(copy[state.mode], 38, 51, w < 680 ? 13 : 15, 0x334155, "850", { x: 0, y: 0.5 }));

  const metrics = [
    `推荐率 ${Math.round(state.recommendation)}%`,
    `AI 排名 #${Math.max(1, Math.round(state.rank))}`,
    `信源分 ${Math.round(state.score)}`,
  ];
  let x = w - (w < 680 ? 168 : 310);
  metrics.forEach((m, i) => {
    if (w < 680 && i < 2) return;
    const tw = i === 2 && w < 680 ? 118 : 92;
    uiLayer.addChild(roundRect(x, 28, tw, 34, 13, i === 0 ? 0x2563eb : i === 1 ? 0x16a34a : 0x0f172a, 1));
    uiLayer.addChild(label(m, x + tw / 2, 46, 12, 0xffffff, "900", { x: 0.5, y: 0.5 }));
    x += tw + 8;
  });
}

function drawEngine() {
  const e = engineCenter();
  const pulse = 1 + Math.sin(state.time * 3.2) * 0.035;
  const g = new Graphics();
  g.circle(0, 0, e.r * 1.2 * pulse).fill({ color: 0x2563eb, alpha: 0.08 });
  g.circle(0, 0, e.r * 0.9 * pulse).fill({ color: 0x0ea5e9, alpha: 0.12 });
  g.circle(0, 0, e.r * 0.66).fill({ color: 0xffffff, alpha: 0.95 });
  g.circle(0, 0, e.r * 0.66).stroke({ width: 4, color: 0x2563eb, alpha: 0.72 });
  g.x = e.x;
  g.y = e.y;
  gameLayer.addChild(g);

  gameLayer.addChild(label("AI 搜索引擎", e.x, e.y - 12, state.width < 680 ? 18 : 24, 0x1d4ed8, "950", { x: 0.5, y: 0.5 }));
  gameLayer.addChild(label("投喂信源资产", e.x, e.y + 22, state.width < 680 ? 11 : 13, 0x64748b, "850", { x: 0.5, y: 0.5 }));
}

function drawResultStack() {
  const compact = state.width < 680;
  const x = compact ? state.width - 152 : state.width - 292;
  const y = compact ? 112 : 116;
  const w = compact ? 132 : 246;
  const rows = [
    { title: "加搜科技", color: 0x2563eb, active: state.rank <= 3 },
    { title: "官网信源", color: 0x16a34a, active: state.score > 50 },
    { title: "案例引用", color: 0x7c3aed, active: state.score > 68 },
    { title: "白皮书", color: 0x0891b2, active: state.score > 78 },
  ];
  rows.forEach((row, i) => {
    const yy = y + i * (compact ? 72 : 86);
    const h = compact ? 58 : 68;
    const shift = row.active ? -16 : 0;
    gameLayer.addChild(roundRect(x + shift, yy, w, h, 18, row.active ? 0xffffff : 0xf1f5f9, 0.96, {
      width: 2,
      color: row.active ? row.color : 0xcbd5e1,
      alpha: row.active ? 0.72 : 0.44,
    }));
    gameLayer.addChild(label(`#${Math.max(1, Math.round(state.rank + i))}`, x + 16 + shift, yy + 26, compact ? 12 : 14, row.color, "950"));
    gameLayer.addChild(label(row.title, x + 54 + shift, yy + 27, compact ? 13 : 17, 0x0f172a, "900"));
    if (!compact) gameLayer.addChild(label(row.active ? "已被 AI 捕捉" : "等待信源", x + 54 + shift, yy + 50, 11, 0x64748b, "800"));
  });
}

function drawMission() {
  clear(gameLayer);
  drawEngine();
  assets.forEach(makeAssetCard);
  drawResultStack();
}

function makeFlyingToken(index) {
  const token = new Container();
  const labels = ["SEO优化服务", "GEO优化公司", "AI推荐优化", "品牌渗透率", "RAG知识库"];
  const color = [0x2563eb, 0x16a34a, 0x7c3aed, 0x0891b2, 0xf97316][index % 5];
  const w = state.width < 680 ? 104 : 144;
  token.addChild(roundRect(-w / 2, -20, w, 40, 16, 0xffffff, 0.96, { width: 2, color, alpha: 0.36 }));
  token.addChild(label(labels[index % labels.length], 0, 1, state.width < 680 ? 11 : 13, color, "950", { x: 0.5, y: 0.5 }));
  token.x = state.width + Math.random() * 220;
  token.y = 120 + Math.random() * (state.height - 220);
  token.vx = -1.2 - Math.random() * 1.8;
  token.color = color;
  token.eventMode = "static";
  token.cursor = "pointer";
  token.on("pointerdown", () => {
    state.score += 5;
    state.recommendation = Math.min(98, state.recommendation + 4);
    state.rank = Math.max(1, state.rank - 0.5);
    addParticle(token.x, token.y, color, 22);
    token.dead = true;
  });
  return token;
}

function drawBattle() {
  clear(gameLayer);
  drawEngine();
  drawResultStack();
  state.cards = Array.from({ length: 9 }, (_, i) => makeFlyingToken(i));
  state.cards.forEach((c) => gameLayer.addChild(c));
}

function drawMap() {
  clear(gameLayer);
  const cx = state.width * 0.5;
  const cy = state.height * 0.52;
  const maxR = Math.min(state.width, state.height) * 0.34;
  for (let r = 0.33; r <= 1; r += 0.33) {
    const ring = new Graphics();
    ring.circle(cx, cy, maxR * r).stroke({ width: 2, color: 0x93c5fd, alpha: 0.38 });
    gameLayer.addChild(ring);
  }
  gameLayer.addChild(roundRect(cx - 94, cy - 40, 188, 80, 28, 0x2563eb, 1));
  gameLayer.addChild(label("AIGCMKT", cx, cy - 7, 23, 0xffffff, "950", { x: 0.5, y: 0.5 }));
  gameLayer.addChild(label("品牌渗透率雷达", cx, cy + 22, 12, 0xdbeafe, "850", { x: 0.5, y: 0.5 }));

  platforms.forEach((p, index) => {
    const angle = p.angle + state.time * 0.25;
    const r = maxR * (0.64 + p.value / 280);
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    const hover = hitCircle(state.pointer.x, state.pointer.y, x, y, 58);
    const color = hover ? 0x16a34a : 0x0ea5e9;
    const line = new Graphics();
    line.moveTo(cx, cy).lineTo(x, y).stroke({ width: hover ? 5 : 3, color, alpha: hover ? 0.72 : 0.28 });
    gameLayer.addChild(line);
    gameLayer.addChild(roundRect(x - 54, y - 32, 108, 64, 20, 0xffffff, 0.96, { width: hover ? 3 : 2, color, alpha: hover ? 0.86 : 0.34 }));
    gameLayer.addChild(label(p.label, x, y - 4, 17, color, "950", { x: 0.5, y: 0.5 }));
    gameLayer.addChild(label(`${p.value}%`, x, y + 18, 12, 0x64748b, "900", { x: 0.5, y: 0.5 }));
    if (hover) addParticle(x, y, color, 1);
    if (index < platforms.length - 1) {
      const next = platforms[index + 1];
      void next;
    }
  });
}

function redrawMode() {
  if (state.mode === "battle") drawBattle();
  else if (state.mode === "map") drawMap();
  else drawMission();
  drawHUD();
}

function setMode(mode) {
  state.mode = mode;
  state.score = mode === "mission" ? 28 : mode === "battle" ? 42 : 70;
  state.rank = mode === "mission" ? 8 : mode === "battle" ? 6 : 3;
  state.recommendation = mode === "mission" ? 32 : mode === "battle" ? 48 : 82;
  state.dragging = null;
  state.cards = [];
  buttons.forEach((button) => {
    const active = button.dataset.pixiMode === mode;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", active ? "true" : "false");
  });
  redrawMode();
}

function updateParticles() {
  for (let i = state.particles.length - 1; i >= 0; i -= 1) {
    const p = state.particles[i];
    p.node.x += p.vx;
    p.node.y += p.vy;
    p.vy += 0.04;
    p.life -= p.decay;
    p.node.alpha = Math.max(0, p.life);
    p.node.scale.set(0.5 + p.life * 0.8);
    if (p.life <= 0) {
      p.node.destroy();
      state.particles.splice(i, 1);
    }
  }
}

function updateBattle() {
  if (state.mode !== "battle") return;
  state.cards.forEach((token) => {
    if (token.dead) {
      token.x = state.width + 160 + Math.random() * 180;
      token.y = 118 + Math.random() * (state.height - 220);
      token.dead = false;
    }
    token.x += token.vx;
    token.rotation = Math.sin(state.time * 2 + token.x * 0.01) * 0.04;
    if (token.x < -120) {
      token.x = state.width + Math.random() * 220;
      token.y = 118 + Math.random() * (state.height - 220);
    }
  });
}

function tick() {
  state.time += app.ticker.deltaMS / 1000;
  if (state.mode === "map") {
    drawMap();
    drawHUD();
  } else if (state.mode === "mission") {
    const e = engineCenter();
    const enginePulse = gameLayer.children.find((child) => child.__enginePulse);
    void enginePulse;
    if (!state.dragging && Math.floor(state.time * 10) % 20 === 0) {
      // Keep the canvas feeling alive without changing the user's progress.
      if (Math.random() < 0.04) addParticle(e.x, e.y, 0x38bdf8, 2);
    }
  }
  updateBattle();
  updateParticles();
}

function resize() {
  const rect = canvas.parentElement.getBoundingClientRect();
  state.width = Math.max(320, Math.floor(rect.width));
  state.height = Math.max(500, Math.floor(rect.height));
  app.renderer.resize(state.width, state.height);
  drawBackground();
  redrawMode();
}

function wireCanvas() {
  app.stage.eventMode = "static";
  app.stage.hitArea = app.screen;
  app.stage.on("pointermove", (event) => {
    state.pointer.x = event.global.x;
    state.pointer.y = event.global.y;
    if (state.dragging) {
      const c = state.dragging;
      c.x = event.global.x - c.dragOffset.x;
      c.y = event.global.y - c.dragOffset.y;
      const e = engineCenter();
      const inside = hitCircle(c.x + c.width / 2, c.y + c.height / 2, e.x, e.y, e.r * 1.15);
      c.alpha = inside ? 1 : 0.88;
      c.scale.set(inside ? 1.12 : 1.06);
    }
  });

  app.stage.on("pointerup", () => {
    if (!state.dragging) return;
    const c = state.dragging;
    const e = engineCenter();
    const inside = hitCircle(c.x + c.width / 2, c.y + c.height / 2, e.x, e.y, e.r * 1.15);
    if (inside) {
      state.score = Math.min(100, state.score + c.asset.value);
      state.recommendation = Math.min(98, state.recommendation + c.asset.value * 0.72);
      state.rank = Math.max(1, state.rank - c.asset.value / 12);
      addParticle(e.x, e.y, c.asset.color, 32);
      c.x = c.original.x;
      c.y = c.original.y;
    } else {
      c.x += (c.original.x - c.x) * 1;
      c.y += (c.original.y - c.y) * 1;
    }
    c.cursor = "grab";
    c.alpha = 1;
    c.scale.set(1);
    state.dragging = null;
    redrawMode();
  });

  app.stage.on("pointerupoutside", () => {
    if (!state.dragging) return;
    const c = state.dragging;
    c.x = c.original.x;
    c.y = c.original.y;
    c.alpha = 1;
    c.scale.set(1);
    state.dragging = null;
  });
}

async function boot() {
  if (!canvas) return;
  app = new Application();
  await app.init({
    canvas,
    backgroundAlpha: 0,
    antialias: true,
    autoDensity: true,
    resolution: Math.min(window.devicePixelRatio || 1, 2),
    eventMode: "static",
  });

  root = app.stage;
  bgLayer = new Container();
  gameLayer = new Container();
  particleLayer = new Container();
  uiLayer = new Container();
  root.addChild(bgLayer, gameLayer, particleLayer, uiLayer);

  wireCanvas();
  buttons.forEach((button) => {
    button.addEventListener("click", () => setMode(button.dataset.pixiMode));
  });
  resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas.parentElement);
  resize();
  setMode("mission");
  app.ticker.add(tick);
}

boot();
