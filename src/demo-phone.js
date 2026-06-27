import "./demo-phone.css";
import { Application, Container, Graphics, Text } from "pixi.js";

const siteCopy = {
  keyword: "SEO优化服务",
  metaTitle: "GEO优化服务商 | 加搜科技 - 专业的AI搜索与GEO排名优化公司",
  metaDescription:
    "加搜科技 AIGCMKT 提供 GEO、SEO、AI 搜索和社媒搜索优化服务，帮助企业官网、案例和白皮书成为 AI 可引用信源，提升品牌在 GPT、Gemini、DeepSeek、豆包等平台的推荐率。",
  ogDescription: "把官网、案例和白皮书做成 AI 可引用信源，提升企业在搜索引擎与 AI 推荐路径里的可见性。",
  heroAward: "荣获第九届 DMAA 国际数字营销大奖",
  heroTitle: "让你的产品，被 所有 AI 推荐",
  heroLead: "AI 的个性化推荐理由比任何 KOL 和媒体都更能赢得客户信任",
  cta: "检查你的品牌渗透率",
  navGeo: "全球 AI GEO 覆盖全球 AI 应用，与 Web、应用、API 全渠道",
  rag: "RAG 知识库 · 精准内容 降低 AI 幻觉，产品与卖点匹配准确率 > 95%",
  overseas: "谷歌 / 必应 SEO 海外 SEO 真的很好做，请你 site 看看我们这个站",
  wps: "金山 WPS 1 年斩获 10 万关键词，流量翻 170 倍，月流量超 100 万UV",
  jusen: "炬森 2 个月横扫同行，GEO渗透率从 10 名外登顶第一，AI 背书显著提升 B 端招商效率",
  bottom: "即刻让 AI 开始信任你的产品和品牌",
};

const resultCards = [
  {
    label: "官网首页",
    title: siteCopy.metaTitle,
    body: siteCopy.metaDescription,
    tag: "AIGCMKT",
  },
  {
    label: "AI 推荐理由",
    title: siteCopy.heroTitle,
    body: siteCopy.heroLead,
    tag: siteCopy.cta,
  },
  {
    label: "信源能力",
    title: "官网、案例和白皮书",
    body: siteCopy.ogDescription,
    tag: "AI 可引用信源",
  },
  {
    label: "GEO 优化",
    title: "全球 AI GEO",
    body: siteCopy.navGeo,
    tag: "Web / 应用 / API",
  },
  {
    label: "准确性",
    title: "RAG 知识库 · 精准内容",
    body: siteCopy.rag,
    tag: "准确率 > 95%",
  },
  {
    label: "案例",
    title: "金山 WPS",
    body: siteCopy.wps,
    tag: "10 万关键词",
  },
  {
    label: "案例",
    title: "炬森五金",
    body: siteCopy.jusen,
    tag: "GEO渗透率",
  },
  {
    label: "CTA",
    title: siteCopy.bottom,
    body: "加搜团队帮你梳理行业和企业知识库，让你的官网、品牌和产品在搜索引擎与 AI 推荐路径里获取高权重和高推荐率。",
    tag: "预约 GEO 诊断",
  },
];

const els = {
  rig: document.getElementById("aigcmktDemoRig"),
  phone: document.getElementById("aigcmktDemoPhone"),
  screen: document.getElementById("aigcmktPixiPhoneScreen"),
  input: document.getElementById("aigcmktDemoKeyword"),
  search: document.getElementById("aigcmktDemoSearch"),
};

const colors = {
  ink: 0x111827,
  muted: 0x64748b,
  faint: 0x94a3b8,
  line: 0xe5e7eb,
  blue: 0x2563eb,
  cyan: 0x06b6d4,
  green: 0x16a34a,
  card: 0xffffff,
  bg: 0xf7f8fc,
};

const state = {
  width: 300,
  height: 580,
  scrollY: 0,
  maxScroll: 0,
  phase: "ready",
  progress: 0,
  keyword: siteCopy.keyword,
  reduceMotion: window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches || false,
};

let app;
let root;
let loadingTimer = 0;

function textStyle(size, fill = colors.ink, weight = "600", lineHeight = null) {
  return {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Inter", "Microsoft YaHei", sans-serif',
    fontSize: size,
    fill,
    fontWeight: weight,
    lineHeight: lineHeight || Math.round(size * 1.45),
  };
}

function addText(parent, text, x, y, style, options = {}) {
  const node = new Text({
    text,
    style: {
      ...style,
      wordWrap: Boolean(options.wrapWidth),
      wordWrapWidth: options.wrapWidth,
      breakWords: true,
    },
  });
  node.x = x;
  node.y = y;
  if (options.alpha != null) node.alpha = options.alpha;
  parent.addChild(node);
  return node;
}

function addRoundRect(parent, x, y, width, height, radius, color, alpha = 1, stroke = null) {
  const g = new Graphics();
  g.roundRect(x, y, width, height, radius).fill({ color, alpha });
  if (stroke) {
    g.roundRect(x, y, width, height, radius).stroke(stroke);
  }
  parent.addChild(g);
  return g;
}

function addPill(parent, text, x, y, fill, textColor = 0xffffff) {
  const label = new Text({ text, style: textStyle(10, textColor, "800") });
  const width = Math.max(54, label.width + 18);
  addRoundRect(parent, x, y, width, 22, 11, fill, 1);
  label.x = x + (width - label.width) / 2;
  label.y = y + 5;
  parent.addChild(label);
  return width;
}

function drawHeader(parent) {
  addRoundRect(parent, 0, 0, state.width, 74, 0, 0xffffff, 1);
  addText(parent, "豆包", 20, 34, textStyle(18, colors.ink, "900"));
  addText(parent, "AI 搜索", 72, 38, textStyle(11, colors.muted, "700"));

  const dot = new Graphics();
  dot.circle(state.width - 32, 44, 4).fill({ color: colors.green, alpha: 1 });
  parent.addChild(dot);
  addText(parent, "已连接官网信源", state.width - 126, 36, textStyle(10, colors.muted, "700"));
}

function drawSearchArea(parent) {
  addRoundRect(parent, 16, 82, state.width - 32, 58, 18, 0xffffff, 1, {
    width: 1,
    color: 0xdbeafe,
    alpha: 1,
  });
  addText(parent, "输入关键词", 28, 98, textStyle(10, colors.faint, "800"));
  addText(parent, state.keyword || siteCopy.keyword, 28, 115, textStyle(14, colors.ink, "900"));
  addRoundRect(parent, state.width - 78, 94, 44, 34, 12, colors.blue, 1);
  addText(parent, "确定", state.width - 69, 103, textStyle(12, 0xffffff, "900"));
}

function drawReady(parent) {
  addRoundRect(parent, 18, 164, state.width - 36, 190, 22, 0xffffff, 1, {
    width: 1,
    color: 0xe2e8f0,
    alpha: 1,
  });
  addText(parent, siteCopy.heroAward, 34, 184, textStyle(12, colors.blue, "900"), { wrapWidth: state.width - 68 });
  addText(parent, siteCopy.heroTitle, 34, 212, textStyle(26, colors.ink, "950", 34), { wrapWidth: state.width - 68 });
  addText(parent, siteCopy.heroLead, 34, 287, textStyle(13, colors.muted, "700", 20), { wrapWidth: state.width - 68 });
  addPill(parent, siteCopy.cta, 34, 316, colors.blue);

  addText(parent, "点击确定，查看这条关键词在 AI 搜索里的完整展示路径。", 30, 384, textStyle(12, colors.muted, "700", 20), {
    wrapWidth: state.width - 60,
  });
}

function drawLoading(parent) {
  addRoundRect(parent, 18, 164, state.width - 36, 220, 22, 0xffffff, 1, {
    width: 1,
    color: 0xdbeafe,
    alpha: 1,
  });
  addText(parent, "正在读取官网、案例和白皮书", 34, 188, textStyle(16, colors.ink, "900"));
  addText(parent, siteCopy.ogDescription, 34, 220, textStyle(12, colors.muted, "700", 20), { wrapWidth: state.width - 68 });

  const barX = 34;
  const barY = 296;
  const barW = state.width - 68;
  addRoundRect(parent, barX, barY, barW, 10, 5, 0xe2e8f0, 1);
  addRoundRect(parent, barX, barY, Math.max(18, barW * state.progress), 10, 5, colors.blue, 1);

  const steps = ["官网信源", "AI 推荐", "品牌渗透率"];
  let x = 34;
  steps.forEach((step, index) => {
    const active = state.progress > index / steps.length;
    const w = addPill(parent, step, x, 326, active ? colors.blue : 0xe2e8f0, active ? 0xffffff : colors.muted);
    x += w + 8;
  });
}

function drawResultCard(parent, card, index, y) {
  const cardX = 16;
  const cardW = state.width - 32;
  const cardH = 142;
  addRoundRect(parent, cardX, y, cardW, cardH, 20, colors.card, 1, {
    width: 1,
    color: 0xe2e8f0,
    alpha: 1,
  });

  addPill(parent, card.label, cardX + 14, y + 14, index === 0 ? colors.blue : 0xe0f2fe, index === 0 ? 0xffffff : 0x0369a1);
  addText(parent, card.title, cardX + 14, y + 46, textStyle(15, colors.ink, "900", 20), { wrapWidth: cardW - 28 });
  addText(parent, card.body, cardX + 14, y + 76, textStyle(11, colors.muted, "700", 17), { wrapWidth: cardW - 28 });

  addText(parent, card.tag, cardX + 14, y + cardH - 26, textStyle(10, colors.blue, "900"), { wrapWidth: cardW - 28 });
}

function drawResults(parent) {
  const content = new Container();
  content.y = -state.scrollY;
  parent.addChild(content);

  addText(content, `搜索：${state.keyword || siteCopy.keyword}`, 18, 156, textStyle(14, colors.ink, "900"));
  addText(content, "已从官网文案中提取可被 AI 引用的结果", 18, 180, textStyle(11, colors.muted, "700"));

  let y = 210;
  resultCards.forEach((card, index) => {
    drawResultCard(content, card, index, y);
    y += 154;
  });

  addRoundRect(content, 18, y + 6, state.width - 36, 78, 20, 0xeff6ff, 1);
  addText(content, siteCopy.bottom, 34, y + 24, textStyle(15, colors.blue, "900"), { wrapWidth: state.width - 68 });
  addText(content, "预约 GEO 诊断", 34, y + 52, textStyle(11, colors.muted, "800"));

  state.maxScroll = Math.max(0, y + 104 - state.height + 18);
  state.scrollY = Math.min(state.scrollY, state.maxScroll);

  if (state.maxScroll > 0) {
    const trackH = state.height - 170;
    const thumbH = Math.max(44, trackH * (state.height / (state.height + state.maxScroll)));
    const thumbY = 156 + (trackH - thumbH) * (state.scrollY / state.maxScroll);
    addRoundRect(parent, state.width - 9, 156, 4, trackH, 2, 0xdbeafe, 1);
    addRoundRect(parent, state.width - 9, thumbY, 4, thumbH, 2, colors.blue, 0.8);
  }
}

function drawChrome(parent) {
  const topGlow = new Graphics();
  topGlow.rect(0, 0, state.width, 180).fill({ color: 0xe0f2fe, alpha: 0.38 });
  parent.addChildAt(topGlow, 0);

  for (let i = 0; i < 14; i += 1) {
    const dot = new Graphics();
    const x = (i * 47 + loadingTimer * (i + 1) * 0.2) % state.width;
    const y = 36 + ((i * 31) % 450);
    dot.circle(x, y, 1.2 + (i % 3), 0).fill({ color: i % 2 ? colors.blue : colors.cyan, alpha: 0.08 + (i % 3) * 0.04 });
    parent.addChild(dot);
  }
}

function renderPhone() {
  if (!root) return;
  root.removeChildren();
  state.width = app.renderer.width / app.renderer.resolution;
  state.height = app.renderer.height / app.renderer.resolution;

  addRoundRect(root, 0, 0, state.width, state.height, 0, colors.bg, 1);
  drawChrome(root);
  drawHeader(root);
  drawSearchArea(root);

  if (state.phase === "loading") {
    drawLoading(root);
  } else if (state.phase === "results") {
    drawResults(root);
  } else {
    state.maxScroll = 0;
    state.scrollY = 0;
    drawReady(root);
  }

  window.__aigcmktDemoState = {
    phase: state.phase,
    progress: Number(state.progress.toFixed(3)),
    keyword: state.keyword,
    scrollY: Math.round(state.scrollY),
    maxScroll: Math.round(state.maxScroll),
    resultCount: resultCards.length,
  };
  els.screen.dataset.phase = state.phase;
  els.screen.dataset.keyword = state.keyword;
  els.screen.dataset.scrollY = String(Math.round(state.scrollY));
  els.screen.dataset.maxScroll = String(Math.round(state.maxScroll));
  els.screen.dataset.resultCount = String(resultCards.length);
}

function runSearch() {
  state.keyword = els.input.value.trim() || siteCopy.keyword;
  state.phase = "loading";
  state.progress = 0;
  state.scrollY = 0;
  renderPhone();

  window.clearInterval(loadingTimer);
  if (state.reduceMotion) {
    state.phase = "results";
    state.progress = 1;
    renderPhone();
    return;
  }

  loadingTimer = window.setInterval(() => {
    state.progress = Math.min(1, state.progress + 0.055);
    if (state.progress >= 1) {
      window.clearInterval(loadingTimer);
      state.phase = "results";
    }
    renderPhone();
  }, 42);
}

function wireScreenScroll() {
  els.screen.addEventListener(
    "wheel",
    (event) => {
      if (state.phase !== "results") return;
      event.preventDefault();
      state.scrollY = Math.max(0, Math.min(state.maxScroll, state.scrollY + event.deltaY));
      renderPhone();
    },
    { passive: false },
  );

  let dragging = false;
  let lastY = 0;

  els.screen.addEventListener("pointerdown", (event) => {
    if (event.target !== app.canvas || state.phase !== "results") return;
    dragging = true;
    lastY = event.clientY;
    els.screen.setPointerCapture(event.pointerId);
  });

  els.screen.addEventListener("pointermove", (event) => {
    if (!dragging) return;
    event.preventDefault();
    const delta = lastY - event.clientY;
    lastY = event.clientY;
    state.scrollY = Math.max(0, Math.min(state.maxScroll, state.scrollY + delta));
    renderPhone();
  });

  const stop = (event) => {
    if (!dragging) return;
    dragging = false;
    if (els.screen.hasPointerCapture(event.pointerId)) els.screen.releasePointerCapture(event.pointerId);
  };
  els.screen.addEventListener("pointerup", stop);
  els.screen.addEventListener("pointercancel", stop);
}

function wirePhoneMotion() {
  let dragging = false;
  let startX = 0;
  let startY = 0;
  let baseX = 0;
  let baseY = -18;
  let rotX = 0;
  let rotY = -18;

  const apply = () => {
    els.phone.style.setProperty("--rx", `${rotX.toFixed(2)}deg`);
    els.phone.style.setProperty("--ry", `${rotY.toFixed(2)}deg`);
    els.phone.style.setProperty("--rz", `${(rotY * -0.06).toFixed(2)}deg`);
  };

  els.rig.addEventListener("pointermove", (event) => {
    if (dragging) return;
    const rect = els.rig.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    rotY = -18 + px * 10;
    rotX = -py * 7;
    apply();
  });

  els.phone.addEventListener("pointerdown", (event) => {
    if (event.target.closest(".aigcmkt-phone-controls") || event.target.closest(".aigcmkt-phone-screen")) return;
    dragging = true;
    startX = event.clientX;
    startY = event.clientY;
    baseX = rotX;
    baseY = rotY;
    els.phone.classList.add("is-dragging");
    els.phone.setPointerCapture(event.pointerId);
  });

  els.phone.addEventListener("pointermove", (event) => {
    if (!dragging) return;
    event.preventDefault();
    rotY = Math.max(-38, Math.min(18, baseY + (event.clientX - startX) * 0.14));
    rotX = Math.max(-18, Math.min(18, baseX - (event.clientY - startY) * 0.12));
    apply();
  });

  const stop = (event) => {
    if (!dragging) return;
    dragging = false;
    els.phone.classList.remove("is-dragging");
    if (els.phone.hasPointerCapture(event.pointerId)) els.phone.releasePointerCapture(event.pointerId);
  };
  els.phone.addEventListener("pointerup", stop);
  els.phone.addEventListener("pointercancel", stop);
  els.rig.addEventListener("pointerleave", () => {
    if (dragging) return;
    rotX = 0;
    rotY = -18;
    apply();
  });
}

function wireSearch() {
  els.search.addEventListener("click", runSearch);
  els.input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") runSearch();
  });
}

async function boot() {
  if (!els.screen || !els.phone || !els.rig || !els.input || !els.search) return;

  app = new Application();
  await app.init({
    width: els.screen.clientWidth || 300,
    height: els.screen.clientHeight || 580,
    backgroundAlpha: 0,
    antialias: true,
    autoDensity: true,
    resolution: Math.min(window.devicePixelRatio || 1, 2),
  });

  root = new Container();
  app.stage.addChild(root);
  els.screen.appendChild(app.canvas);

  const resize = () => {
    const rect = els.screen.getBoundingClientRect();
    app.renderer.resize(Math.max(220, rect.width), Math.max(380, rect.height));
    renderPhone();
  };
  new ResizeObserver(resize).observe(els.screen);
  resize();

  wireSearch();
  wirePhoneMotion();
  wireScreenScroll();
  renderPhone();
}

boot();
