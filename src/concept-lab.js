import "./concept-lab.css";
import * as THREE from "three";

const canvas = document.getElementById("aigcmktConceptCanvas");
const note = document.getElementById("conceptLabNote");
const modeButtons = Array.from(document.querySelectorAll("[data-concept-mode]"));

const modeNotes = {
  phone: "一部可旋转的 3D 手机，屏幕贴搜索结果截图，高亮“加搜科技 AIGCMKT”靠前位置。",
  journey: "搜索词进入 AI 搜索界面，结果列表自动滚动，停在品牌推荐结果上，用来展示“被 AI 推荐”的过程。",
  compare: "同一台手机里做 Before / After 对比：优化前没有官网信源，优化后出现官网、案例、白皮书引用。",
  radar: "把 GPT、豆包、DeepSeek、Kimi、Gemini 做成 3D 推荐雷达，表达多平台推荐率和品牌渗透率。",
};

const state = {
  mode: "phone",
  time: 0,
  zoom: 7.2,
  targetZoom: 7.2,
  rotationX: -0.08,
  rotationY: -0.36,
  drag: false,
  lastX: 0,
  lastY: 0,
};

let renderer;
let scene;
let camera;
let phoneGroup;
let screenTexture;
let screenCanvas;
let screenCtx;
let screenMaterial;
let particles;
let resizeObserver;

function roundedRect(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function fillRound(ctx, x, y, w, h, r, fill, stroke = null) {
  roundedRect(ctx, x, y, w, h, r);
  ctx.fillStyle = fill;
  ctx.fill();
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

function text(ctx, value, x, y, size, color, weight = 700, maxWidth = null) {
  ctx.fillStyle = color;
  ctx.font = `${weight} ${size}px -apple-system, BlinkMacSystemFont, "Microsoft YaHei", sans-serif`;
  if (!maxWidth) {
    ctx.fillText(value, x, y);
    return;
  }
  const chars = Array.from(value);
  let line = "";
  let yy = y;
  const lineHeight = Math.round(size * 1.52);
  chars.forEach((ch) => {
    const next = line + ch;
    if (ctx.measureText(next).width > maxWidth && line) {
      ctx.fillText(line, x, yy);
      line = ch;
      yy += lineHeight;
    } else {
      line = next;
    }
  });
  if (line) ctx.fillText(line, x, yy);
}

function drawSearchHeader(ctx, query = "SEO优化服务") {
  fillRound(ctx, 0, 0, 720, 1280, 0, "#f6f8fc");
  fillRound(ctx, 34, 58, 652, 92, 34, "#ffffff", "#e2e8f0");
  text(ctx, "豆包", 58, 116, 34, "#111827", 900);
  text(ctx, query, 174, 116, 30, "#334155", 850);
  fillRound(ctx, 590, 72, 70, 62, 22, "#2563eb");
  text(ctx, "搜索", 604, 112, 22, "#ffffff", 900);
}

function drawResult(ctx, index, y, title, body, source, highlight = false) {
  const x = 42;
  const w = 636;
  const h = highlight ? 188 : 164;
  fillRound(ctx, x, y, w, h, 28, highlight ? "#eff6ff" : "#ffffff", highlight ? "#60a5fa" : "#e5e7eb");
  text(ctx, index, x + 24, y + 48, 22, highlight ? "#2563eb" : "#64748b", 900);
  text(ctx, title, x + 72, y + 50, 30, "#111827", 900, w - 112);
  text(ctx, body, x + 72, y + 94, 22, "#475569", 700, w - 110);
  fillRound(ctx, x + 72, y + h - 48, 150, 32, 16, highlight ? "#2563eb" : "#e0f2fe");
  text(ctx, source, x + 90, y + h - 25, 18, highlight ? "#ffffff" : "#0369a1", 900);
  if (highlight) {
    ctx.save();
    ctx.shadowColor = "rgba(37, 99, 235, 0.55)";
    ctx.shadowBlur = 26;
    ctx.strokeStyle = "#2563eb";
    ctx.lineWidth = 5;
    roundedRect(ctx, x - 4, y - 4, w + 8, h + 8, 32);
    ctx.stroke();
    ctx.restore();
  }
  return h;
}

function drawPhoneMode(ctx, time) {
  drawSearchHeader(ctx);
  const pulse = (Math.sin(time * 3) + 1) / 2;
  drawResult(ctx, "01", 198, "加搜科技 AIGCMKT | GEO优化服务商", "把官网、案例和白皮书做成 AI 可引用信源，提升企业在搜索引擎与 AI 推荐路径里的可见性。", "官网信源", true);
  drawResult(ctx, "02", 414, "专业的 AI 搜索与 GEO 排名优化公司", "帮助企业在 GPT、Gemini、DeepSeek、豆包等平台提升推荐率。", "AI 推荐");
  drawResult(ctx, "03", 600, "金山 WPS 软件行业案例", "1 年斩获 10 万关键词，流量翻 170 倍，月流量超 100 万UV。", "案例");
  drawResult(ctx, "04", 786, "RAG 知识库 · 精准内容", "降低 AI 幻觉，产品与卖点匹配准确率 > 95%。", "知识库");
  fillRound(ctx, 86 + pulse * 18, 1038, 548 - pulse * 36, 66, 24, "rgba(37, 99, 235, 0.12)", "#93c5fd");
  text(ctx, "拖动手机查看搜索结果证据", 178, 1080, 26, "#1d4ed8", 900);
}

function drawJourneyMode(ctx, time) {
  const offset = Math.min(1, (Math.sin(time * 0.9) + 1) / 2) * 290;
  drawSearchHeader(ctx, "GEO优化服务商");
  fillRound(ctx, 44, 178, 632, 80, 28, "#0f172a");
  text(ctx, "AI 正在从官网、案例和白皮书中寻找可引用信源", 76, 228, 25, "#e0f2fe", 900, 560);

  ctx.save();
  ctx.translate(0, -offset);
  drawResult(ctx, "检索", 310, "官网内容", "加搜科技 AIGCMKT 提供 GEO、SEO、AI 搜索和社媒搜索优化服务。", "步骤 1");
  drawResult(ctx, "识别", 500, "权威信源", "企业官网、客户案例、行业白皮书被组织成 AI 可引用信源。", "步骤 2");
  drawResult(ctx, "推荐", 690, "让你的产品，被所有 AI 推荐", "AI 的个性化推荐理由比任何 KOL 和媒体都更能赢得客户信任。", "步骤 3", offset > 180);
  drawResult(ctx, "转化", 900, "检查你的品牌渗透率", "让访问者直接看到搜索路径和结果证据。", "步骤 4");
  ctx.restore();

  fillRound(ctx, 52, 1088, 616, 72, 24, "#ffffff", "#bfdbfe");
  text(ctx, "搜索路径动画适合解释“为什么 AI 会推荐你”", 84, 1133, 25, "#1e40af", 900, 560);
}

function drawCompareMode(ctx, time) {
  drawSearchHeader(ctx, "SEO优化服务");
  const split = 360 + Math.sin(time * 1.2) * 74;
  fillRound(ctx, 36, 190, 308, 778, 30, "#fff7ed", "#fed7aa");
  fillRound(ctx, 376, 190, 308, 778, 30, "#eff6ff", "#93c5fd");
  text(ctx, "Before", 78, 250, 34, "#9a3412", 900);
  text(ctx, "After", 418, 250, 34, "#1d4ed8", 900);
  text(ctx, "没有官网引用", 78, 334, 28, "#7c2d12", 900, 230);
  text(ctx, "品牌结果靠后", 78, 418, 24, "#9a3412", 800, 230);
  text(ctx, "信息分散", 78, 500, 24, "#9a3412", 800, 230);
  text(ctx, "官网信源", 418, 334, 28, "#1e40af", 900, 230);
  text(ctx, "AI 推荐靠前", 418, 418, 24, "#1d4ed8", 800, 230);
  text(ctx, "案例和白皮书支撑", 418, 500, 24, "#1d4ed8", 800, 230);
  fillRound(ctx, split - 8, 174, 16, 824, 8, "#2563eb");
  fillRound(ctx, split - 54, 564, 108, 48, 24, "#2563eb");
  text(ctx, "拖动", split - 28, 596, 20, "#ffffff", 900);
  drawResult(ctx, "01", 738, "加搜科技 AIGCMKT", "优化后，AI 答案可以引用官网作为信源。", "After", true);
}

function drawRadarMode(ctx, time) {
  drawSearchHeader(ctx, "AI推荐优化");
  const cx = 360;
  const cy = 620;
  const platforms = [
    ["GPT", 0.92],
    ["豆包", 0.88],
    ["DeepSeek", 0.84],
    ["Kimi", 0.78],
    ["Gemini", 0.73],
  ];
  ctx.save();
  ctx.translate(cx, cy);
  for (let r = 90; r <= 250; r += 80) {
    ctx.strokeStyle = "rgba(37, 99, 235, 0.2)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.stroke();
  }
  platforms.forEach(([name, value], index) => {
    const angle = time * 0.45 + (index / platforms.length) * Math.PI * 2;
    const r = 110 + value * 160;
    const x = Math.cos(angle) * r;
    const y = Math.sin(angle) * r;
    ctx.strokeStyle = "rgba(37, 99, 235, 0.34)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(x, y);
    ctx.stroke();
    fillRound(ctx, x - 54, y - 24, 108, 48, 20, "#ffffff", "#bfdbfe");
    text(ctx, name, x - 34, y + 8, 22, "#1d4ed8", 900);
  });
  fillRound(ctx, -96, -40, 192, 80, 28, "#2563eb");
  text(ctx, "品牌渗透率", -68, -8, 24, "#ffffff", 900);
  text(ctx, "88%", -30, 26, 28, "#ffffff", 950);
  ctx.restore();
  fillRound(ctx, 56, 1050, 608, 76, 24, "#ffffff", "#bfdbfe");
  text(ctx, "雷达适合表达多平台 GEO 覆盖，而不是单张截图", 88, 1097, 24, "#1e40af", 900, 548);
}

function drawScreenTexture() {
  const ctx = screenCtx;
  state.time += 0.016;
  ctx.clearRect(0, 0, screenCanvas.width, screenCanvas.height);
  if (state.mode === "journey") drawJourneyMode(ctx, state.time);
  else if (state.mode === "compare") drawCompareMode(ctx, state.time);
  else if (state.mode === "radar") drawRadarMode(ctx, state.time);
  else drawPhoneMode(ctx, state.time);
  screenTexture.needsUpdate = true;
}

function createPhone() {
  phoneGroup = new THREE.Group();
  scene.add(phoneGroup);

  const body = new THREE.Mesh(
    new THREE.BoxGeometry(2.75, 5.65, 0.28, 1, 1, 1),
    new THREE.MeshStandardMaterial({
      color: 0x111827,
      metalness: 0.64,
      roughness: 0.32,
    }),
  );
  phoneGroup.add(body);

  const bevel = new THREE.Mesh(
    new THREE.BoxGeometry(2.96, 5.86, 0.18, 1, 1, 1),
    new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.84,
      roughness: 0.18,
    }),
  );
  bevel.position.z = -0.05;
  phoneGroup.add(bevel);

  screenCanvas = document.createElement("canvas");
  screenCanvas.width = 720;
  screenCanvas.height = 1280;
  screenCtx = screenCanvas.getContext("2d");
  screenTexture = new THREE.CanvasTexture(screenCanvas);
  screenTexture.colorSpace = THREE.SRGBColorSpace;
  screenTexture.anisotropy = 8;
  screenMaterial = new THREE.MeshBasicMaterial({ map: screenTexture });

  const screen = new THREE.Mesh(new THREE.PlaneGeometry(2.46, 4.98), screenMaterial);
  screen.position.z = 0.155;
  phoneGroup.add(screen);

  const glass = new THREE.Mesh(
    new THREE.PlaneGeometry(2.46, 4.98),
    new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0,
      roughness: 0.02,
      transmission: 0.08,
      transparent: true,
      opacity: 0.14,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
    }),
  );
  glass.position.z = 0.17;
  phoneGroup.add(glass);

  const island = new THREE.Mesh(
    new THREE.BoxGeometry(0.82, 0.18, 0.035),
    new THREE.MeshStandardMaterial({ color: 0x030712, roughness: 0.5 }),
  );
  island.position.set(0, 2.36, 0.19);
  phoneGroup.add(island);
}

function createParticles() {
  const count = 120;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    positions[i * 3] = (Math.random() - 0.5) * 8;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 7;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 4 - 1.5;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  particles = new THREE.Points(
    geometry,
    new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.035,
      transparent: true,
      opacity: 0.56,
    }),
  );
  scene.add(particles);
}

function resize() {
  const rect = canvas.parentElement.getBoundingClientRect();
  const width = Math.max(320, Math.floor(rect.width));
  const height = Math.max(420, Math.floor(rect.height));
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

function setMode(mode) {
  state.mode = mode;
  state.time = 0;
  note.textContent = modeNotes[mode];
  modeButtons.forEach((button) => {
    const active = button.dataset.conceptMode === mode;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", active ? "true" : "false");
  });
}

function wireControls() {
  modeButtons.forEach((button) => {
    button.addEventListener("click", () => setMode(button.dataset.conceptMode));
  });

  canvas.addEventListener("pointerdown", (event) => {
    state.drag = true;
    state.lastX = event.clientX;
    state.lastY = event.clientY;
    canvas.setPointerCapture(event.pointerId);
  });

  canvas.addEventListener("pointermove", (event) => {
    if (!state.drag) return;
    const dx = event.clientX - state.lastX;
    const dy = event.clientY - state.lastY;
    state.lastX = event.clientX;
    state.lastY = event.clientY;
    state.rotationY += dx * 0.008;
    state.rotationX += dy * 0.006;
    state.rotationX = Math.max(-0.65, Math.min(0.55, state.rotationX));
  });

  const stop = (event) => {
    if (!state.drag) return;
    state.drag = false;
    if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
  };
  canvas.addEventListener("pointerup", stop);
  canvas.addEventListener("pointercancel", stop);

  canvas.addEventListener(
    "wheel",
    (event) => {
      event.preventDefault();
      state.targetZoom = Math.max(5.4, Math.min(9.2, state.targetZoom + event.deltaY * 0.004));
    },
    { passive: false },
  );
}

function animate() {
  drawScreenTexture();
  state.zoom += (state.targetZoom - state.zoom) * 0.08;
  camera.position.z = state.zoom;

  phoneGroup.rotation.x += (state.rotationX - phoneGroup.rotation.x) * 0.08;
  phoneGroup.rotation.y += (state.rotationY - phoneGroup.rotation.y) * 0.08;
  phoneGroup.rotation.z = Math.sin(state.time * 0.8) * 0.018;

  particles.rotation.y += 0.0018;
  particles.rotation.x = Math.sin(state.time * 0.3) * 0.12;
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

function boot() {
  if (!canvas) return;
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 0, state.zoom);

  scene.add(new THREE.AmbientLight(0xffffff, 1.8));
  const key = new THREE.DirectionalLight(0x8fd8ff, 3.2);
  key.position.set(3.5, 4, 5);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x2563eb, 2.1);
  rim.position.set(-4, -1.5, 3);
  scene.add(rim);

  createPhone();
  createParticles();
  wireControls();
  resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas.parentElement);
  resize();
  setMode("phone");
  animate();
}

boot();
