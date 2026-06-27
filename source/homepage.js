"use strict";

;(function () {
  const home = window.AIGCMKT_HOME || {};

    ;(function () {
      const NAMES = [
        "Deepseek",
        "豆包",
        "Kimi",
        "GPT5",
        "Gemini",
        "Perplexity",
        "Claude",
        "腾讯元宝",
        "通义千问"
      ];
      const FINAL_WORD = "所有 AI";
      const RUN_INTERVAL_MS = 17000;
      const FRAME_MS = 30;
      const BASE_DURATION_FAST = 420;
      const BASE_DURATION_SLOW = 1100;
      const BETWEEN_NAME_GAP = 120;
      const el = document.getElementById("ai-platform");

      if (!el) return;

      let runToken = null;
      let intervalId = null;
      const latinUpper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
      const latinLower = "abcdefghijklmnopqrstuvwxyz".split("");
      const digits = "0123456789".split("");
      const chinesePool = "加搜科技算法数据流量渗透优化洞察策略推荐行业竞品渗透".split("");

      function clamp(v, a, b) {
        return Math.max(a, Math.min(b, v));
      }

      function shuffleArray(arr) {
        const out = arr.slice();
        for (let i = out.length - 1; i > 0; i -= 1) {
          const j = Math.floor(Math.random() * (i + 1));
          [out[i], out[j]] = [out[j], out[i]];
        }
        return out;
      }

      function charType(ch) {
        if (!ch) return "other";
        if (/[\u4e00-\u9fff]/.test(ch)) return "chinese";
        if (/[A-Z]/.test(ch)) return "upper";
        if (/[a-z]/.test(ch)) return "lower";
        if (/[0-9]/.test(ch)) return "digit";
        return "other";
      }

      function generateSequenceForPair(a, b) {
        const ta = charType(a);
        const tb = charType(b);
        if ((ta === "lower" && tb === "lower") || (ta === "upper" && tb === "upper")) {
          const alphabet = ta === "lower" ? latinLower : latinUpper;
          const startIdx = alphabet.indexOf(a) !== -1 ? alphabet.indexOf(a) : 0;
          const endIdx = alphabet.indexOf(b) !== -1 ? alphabet.indexOf(b) : 0;
          const seq = [];
          let i = startIdx;
          seq.push(alphabet[i]);
          while (i !== endIdx) {
            i = (i + 1) % alphabet.length;
            seq.push(alphabet[i]);
            if (seq.length > alphabet.length + 4) break;
          }
          return seq;
        }
        if (ta === "digit" && tb === "digit") {
          const start = parseInt(a, 10) || 0;
          const end = parseInt(b, 10) || 0;
          const seq = [];
          let i = start;
          seq.push(String(i));
          while (i !== end) {
            i = (i + 1) % 10;
            seq.push(String(i));
            if (seq.length > 12) break;
          }
          return seq;
        }
        const pool = ta === "chinese" || tb === "chinese"
          ? chinesePool
          : latinLower.concat(latinUpper, digits);
        const count = 4 + Math.floor(Math.random() * 4);
        const seq = [];
        for (let k = 0; k < count; k += 1) {
          seq.push(pool[Math.floor(Math.random() * pool.length)]);
        }
        seq.push(b);
        return seq;
      }

      function ensureSpans(targetText) {
        const chars = Array.from(targetText);
        el.innerHTML = "";
        for (let i = 0; i < chars.length; i += 1) {
          const sp = document.createElement("span");
          sp.className = "char final";
          sp.textContent = chars[i];
          if (/\s/.test(chars[i])) sp.style.minWidth = "0.35em";
          el.appendChild(sp);
        }
      }

      function currentCharsArray(len) {
        const spans = Array.from(el.querySelectorAll(".char"));
        const arr = spans.map((s) => s.textContent);
        while (arr.length < len) arr.push(" ");
        if (arr.length > len) arr.length = len;
        return arr;
      }

      function animateTo(target, duration, token) {
        return new Promise((resolve) => {
          const targets = Array.from(target);
          const current = currentCharsArray(targets.length);
          const sequences = targets.map((targetChar, i) => generateSequenceForPair(current[i] || " ", targetChar));
          el.innerHTML = "";
          const spanNodes = targets.map((_t, idx) => {
            const s = document.createElement("span");
            s.className = "char spin";
            s.textContent = current[idx] || " ";
            if (/\s/.test(targets[idx])) s.style.minWidth = "0.35em";
            el.appendChild(s);
            return s;
          });

          const start = performance.now();
          function easeOut(p) {
            return 1 - Math.pow(1 - p, 3);
          }

          function frame() {
            if (token !== runToken) {
              spanNodes.forEach((sn) => {
                sn.classList.remove("spin");
                sn.classList.add("final");
              });
              resolve("cancelled");
              return;
            }

            const p = clamp((performance.now() - start) / duration, 0, 1);
            const eased = easeOut(p);
            for (let i = 0; i < spanNodes.length; i += 1) {
              const seq = sequences[i];
              const idx = Math.min(seq.length - 1, Math.floor(eased * seq.length));
              spanNodes[i].textContent = seq[idx];
              if (p < 0.85 || idx !== seq.length - 1) {
                spanNodes[i].classList.add("spin");
                spanNodes[i].classList.remove("final");
              } else {
                spanNodes[i].classList.remove("spin");
                spanNodes[i].classList.add("final");
              }
            }

            if (p < 1) {
              requestAnimationFrame(frame);
              return;
            }

            for (let i = 0; i < spanNodes.length; i += 1) {
              spanNodes[i].textContent = targets[i];
              spanNodes[i].classList.remove("spin");
              spanNodes[i].classList.add("final");
            }
            resolve("done");
          }

          requestAnimationFrame(frame);
        });
      }

      async function runSequence() {
        runToken = Symbol(`run-${Date.now()}`);
        const token = runToken;
        if (!el.textContent || el.textContent.trim() === "") {
          ensureSpans(FINAL_WORD);
        }

        const shuffled = shuffleArray(NAMES);
        for (let i = 0; i < shuffled.length; i += 1) {
          if (token !== runToken) return;
          await animateTo(shuffled[i], BASE_DURATION_FAST, token).catch(() => {});
          if (token !== runToken) return;
          await new Promise((r) => setTimeout(r, BETWEEN_NAME_GAP));
        }

        if (token !== runToken) return;
        await animateTo(FINAL_WORD, BASE_DURATION_SLOW, token).catch(() => {});
        if (token !== runToken) return;
        el.classList.add("glow");
        setTimeout(() => {
          if (runToken === token) el.classList.remove("glow");
        }, 700);
      }

      window.addEventListener("load", () => {
        ensureSpans(FINAL_WORD);
        runSequence();
        intervalId = setInterval(runSequence, RUN_INTERVAL_MS);
      });

      window.addEventListener("beforeunload", () => {
        if (intervalId) clearInterval(intervalId);
        runToken = null;
      });
    })();

    const aiPlatforms = home.aiPlatforms || [];

    const caseHighlights = home.caseHighlights || [];

    const logoAssets = home.logoAssets || [];

    function shuffleArrayLocal(arr) {
      const out = arr.slice();
      for (let i = out.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [out[i], out[j]] = [out[j], out[i]];
      }
      return out;
    }

    function uniqueItems(arr) {
      return Array.from(new Set(arr.filter(Boolean)));
    }

    function cleanRainText(text) {
      return String(text || "").replace(/。$/, "").replace(/\s+/g, " ").trim();
    }

    function hasMetricSignal(text) {
      return /[0-9%+]|Top|TOP|万|亿|年|个月|国家|平台|客户库/.test(String(text || ""));
    }

    function metricToken(data, index) {
      const pool = ["200+ 客户库", "8 年搜索经验", "10+ 细分领域", "2026 客户矩阵", "80% NPS"];
      return hasMetricSignal(data.metric) ? data.metric : pool[index % pool.length];
    }

    function makeRainItem(text, className, label) {
      const item = document.createElement("span");
      item.className = className;
      item.textContent = text;
      item.title = text;
      item.dataset.label = label;
      const mostlyRight = Math.random() < 0.8;
      const depth = Math.random();
      const left = mostlyRight ? 30 + Math.random() * 67 : 2 + Math.random() * 88;
      const top = -34 + Math.random() * 132;
      const duration = depth > 0.72 ? 18 + Math.random() * 18 : 30 + Math.random() * 34;
      const offset = Math.round((Math.random() - 0.5) * (depth > 0.72 ? 130 : 72));
      const drift = Math.round((Math.random() - 0.5) * (depth > 0.72 ? 132 : 88));
      const scale = depth > 0.72 ? 1.02 + Math.random() * 0.16 : 0.76 + Math.random() * 0.26;
      const alpha = depth > 0.72 ? 0.62 + Math.random() * 0.26 : 0.3 + Math.random() * 0.34;
      item.style.setProperty("--left", `${left}%`);
      item.style.setProperty("--top", `${top}vh`);
      item.style.setProperty("--offset", `${offset}px`);
      item.style.setProperty("--drift", `${drift}px`);
      item.style.setProperty("--tilt", `${-7 + Math.random() * 4.8}deg`);
      item.style.setProperty("--duration", `${duration}s`);
      item.style.setProperty("--delay", `${-Math.random() * duration}s`);
      item.style.setProperty("--size", `${9.6 + Math.random() * 3.9}px`);
      item.style.setProperty("--alpha", `${alpha}`);
      item.style.setProperty("--scale", `${scale}`);
      return item;
    }

    function buildRain() {
      const root = document.getElementById("digitalRain");
      if (!root) return;
      const width = window.innerWidth || 1440;
      const totalTarget = width < 760 ? 34 : 88;
      root.innerHTML = "";
      const caseRainLines = uniqueItems(caseHighlights.flatMap((data, index) => {
        const metric = metricToken(data, index);
        const base = [
          `${data.client} · ${metric}`,
          `${data.client} · ${metric} · ${data.scene}`,
          `${data.group} · ${metric} · ${data.client}`,
          `${data.client} · ${metric} · ${cleanRainText(data.text)}`
        ];
        const signals = (data.signals || []).map((signal) => {
          const clean = cleanRainText(signal);
          return hasMetricSignal(clean) ? `${data.client} · ${clean}` : `${data.client} · ${metric} · ${clean}`;
        });
        return base.concat(signals);
      }));
      const numberSignals = [
        "GEO INDEX 4000+", "AI REC 60%", "RANK STABLE", "SEO +8700%", "TRAFFIC +800%",
        "CITATION 37%+", "QUERY 30,000+", "INDEX +19900%", "SOURCE TRUST +", "RANK SIGNAL 01",
        "AIO SOURCE +", "BRAND RECALL +", "AI COVERAGE 6X", "TOP SCENE HIT", "QUERY GRAPH +",
        "SEMANTIC LINK +", "CRAWL BOOST 95%", "5MIN INDEX", "10MIN RANK", "CONTENT DENSITY +"
      ];
      const caseCount = Math.min(Math.round(totalTarget * 0.58), caseRainLines.length);
      const platformCount = Math.min(Math.round(totalTarget * 0.22), aiPlatforms.length);
      const metricCount = Math.round(totalTarget * 0.24);
      const entries = [
        ...shuffleArrayLocal(caseRainLines).slice(0, caseCount).map((text) => ({ text, className: "rain-item case", label: "案例" })),
        ...shuffleArrayLocal(aiPlatforms).slice(0, platformCount).map((text) => ({ text, className: "rain-item platform", label: "AI" })),
        ...shuffleArrayLocal(numberSignals.concat(numberSignals, numberSignals)).slice(0, metricCount).map((text) => ({ text, className: "rain-item metric", label: "01" }))
      ];
      const fragment = document.createDocumentFragment();
      shuffleArrayLocal(entries).forEach((entry) => {
        fragment.appendChild(makeRainItem(entry.text, entry.className, entry.label));
      });
      root.appendChild(fragment);
    }

    function createLogoItem(logo) {
      const mode = logo.mode || (logo.kind === "wide" ? "wordmark" : "mark-label");
      const showLabel = logo.label !== false && mode !== "wordmark" && mode !== "image-only";
      const item = document.createElement("span");
      const sizeClass = logo.size ? `logo-size-${logo.size}` : "";
      item.className = `logo-item logo-${mode} ${sizeClass} ${logo.shape === "square" ? "logo-square" : ""} ${showLabel ? "" : "logo-no-label"}`.trim();
      item.setAttribute("aria-label", logo.name);

      if (mode !== "text-only") {
        const mark = document.createElement("span");
        mark.className = "logo-mark";
        if (logo.src) {
          const img = document.createElement("img");
          img.src = logo.src;
          img.alt = logo.name;
          img.loading = "eager";
          img.decoding = "async";
          img.onerror = () => {
            mark.innerHTML = "";
            const fallback = document.createElement("span");
            fallback.className = "logo-fallback";
            fallback.setAttribute("aria-hidden", "true");
            fallback.textContent = logo.initial || logo.name.slice(0, 1);
            mark.appendChild(fallback);
          };
          mark.appendChild(img);
        } else {
          const fallback = document.createElement("span");
          fallback.className = "logo-fallback";
          fallback.setAttribute("aria-hidden", "true");
          fallback.textContent = logo.initial || logo.name.slice(0, 1);
          mark.appendChild(fallback);
        }
        item.appendChild(mark);
      }

      if (showLabel || mode === "text-only") {
        const label = document.createElement("span");
        label.className = "logo-name";
        label.textContent = logo.name;
        item.appendChild(label);
      }

      return item;
    }

    function appendLogoGroup(root, index) {
      const group = document.createElement("span");
      group.className = "logo-group";
      group.setAttribute("aria-hidden", index === 0 ? "false" : "true");
      logoAssets.forEach((logo) => {
        group.appendChild(createLogoItem(logo));
      });
      root.appendChild(group);
      return group;
    }

    function getLogoLoopDistance(root) {
      const group = root?.querySelector(".logo-group");
      if (!root || !group) return 0;
      const styles = window.getComputedStyle(root);
      const gap = parseFloat(styles.columnGap || styles.gap || "0") || 0;
      return group.getBoundingClientRect().width + gap;
    }

    function setLogoLoopDistance() {
      const root = document.getElementById("logoTrack");
      if (!root) return;
      const distance = getLogoLoopDistance(root);
      if (!distance) return;
      root.style.setProperty("--logo-distance", `${distance}px`);
      root.style.setProperty("--logo-distance-negative", `${-distance}px`);
      root.style.animationDuration = `${Math.max(36, distance / 74)}s`;
    }

    function buildLogoWall() {
      const root = document.getElementById("logoTrack");
      if (!root) return;
      root.innerHTML = "";
      appendLogoGroup(root, 0);
      requestAnimationFrame(() => {
        const viewportWidth = root.closest(".logo-strip")?.getBoundingClientRect().width || window.innerWidth || 1440;
        const loopDistance = getLogoLoopDistance(root);
        const targetWidth = viewportWidth + loopDistance * 2;
        let copyCount = 1;
        while (root.scrollWidth < targetWidth && copyCount < 8) {
          appendLogoGroup(root, copyCount);
          copyCount += 1;
        }
        if (copyCount < 3) {
          appendLogoGroup(root, copyCount);
          copyCount += 1;
          appendLogoGroup(root, copyCount);
          copyCount += 1;
        }
        root.dataset.copyCount = String(copyCount);
        setLogoLoopDistance();
      });
    }

    function wirePreviewNav() {
      if (window.__aigcmktTopNavPresent || window.__aigcmktTopNavInitialized) return;

      const navbar = document.getElementById("main-navbar");
      const navContainer = document.getElementById("nav-container");
      const navLinks = document.getElementById("main-nav-links");
      if (!navbar || !navContainer || !navLinks) return;

      const dropdownItems = Array.from(navLinks.querySelectorAll(".yb-has-dropdown"));
      let closeTimer = null;

      function closeDesktopMenus() {
        dropdownItems.forEach((item) => {
          item.classList.remove("is-open");
          const panel = item.querySelector(".yb-dropdown-container");
          if (panel) {
            panel.classList.remove("open");
            panel.setAttribute("aria-hidden", "true");
          }
        });
        navbar.classList.remove("nav-hover");
      }

      function openDesktopMenu(item) {
        if (window.innerWidth <= 680) return;
        window.clearTimeout(closeTimer);
        dropdownItems.forEach((other) => {
          const panel = other.querySelector(".yb-dropdown-container");
          const open = other === item;
          other.classList.toggle("is-open", open);
          if (panel) {
            panel.classList.toggle("open", open);
            panel.setAttribute("aria-hidden", open ? "false" : "true");
            panel.style.setProperty("--panel-height", `${Number(panel.dataset.height || 480)}px`);
          }
        });
        navbar.classList.add("nav-hover");
      }

      dropdownItems.forEach((item) => {
        const toggle = item.querySelector(".yb-dropdown-toggle");
        item.addEventListener("mouseenter", () => openDesktopMenu(item));
        toggle?.addEventListener("click", (event) => {
          event.preventDefault();
          if (window.innerWidth <= 680) {
            item.classList.toggle("mobile-open");
            return;
          }
          openDesktopMenu(item);
        });
      });

      navbar.addEventListener("mouseleave", () => {
        closeTimer = window.setTimeout(closeDesktopMenus, 140);
      });

      navbar.addEventListener("mouseenter", () => {
        window.clearTimeout(closeTimer);
      });

      navContainer.addEventListener("click", (event) => {
        if (window.innerWidth > 680) return;
        if (event.target.closest(".yb-banner-nav-links")) return;
        navContainer.classList.toggle("menu-active");
        navLinks.classList.toggle("mobile-active");
        navbar.classList.toggle("nav-hover", navLinks.classList.contains("mobile-active"));
      });

      document.querySelectorAll(".trigger-slide").forEach((el) => {
        el.addEventListener("click", (event) => event.preventDefault());
      });

      window.addEventListener("resize", () => {
        if (window.innerWidth > 680) {
          navContainer.classList.remove("menu-active");
          navLinks.classList.remove("mobile-active");
          dropdownItems.forEach((item) => item.classList.remove("mobile-open"));
        }
      });
    }

    function wireMouseDot() {
      if (window.innerWidth < 760) return;
      if (window.matchMedia && window.matchMedia("(hover: none), (pointer: coarse)").matches) return;
      const mouseDot = document.createElement("div");
      mouseDot.className = "mouse-dot";
      document.body.appendChild(mouseDot);
      let mouseDotFrame = 0;
      let mouseX = 0;
      let mouseY = 0;

      document.addEventListener("mousemove", (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
        if (mouseDotFrame) return;
        mouseDotFrame = window.requestAnimationFrame(() => {
          mouseDotFrame = 0;
          mouseDot.style.left = `${mouseX}px`;
          mouseDot.style.top = `${mouseY}px`;
        });
      }, { passive: true });

      const hotSelector = ".rain-item, .logo-item, .yb-banner-card, .yb-banner-nav-links a, .yb-banner-sales-btn, .cta";
      document.addEventListener("pointerover", (event) => {
        if (event.target.closest(hotSelector)) mouseDot.classList.add("is-hot");
      }, { passive: true });
      document.addEventListener("pointerout", (event) => {
        if (!event.relatedTarget || !event.relatedTarget.closest?.(hotSelector)) {
          mouseDot.classList.remove("is-hot");
        }
      }, { passive: true });
    }

    function wireRainTooltip() {
      const root = document.getElementById("digitalRain");
      if (!root) return;
      const tooltip = document.createElement("div");
      tooltip.className = "rain-tooltip";
      document.body.appendChild(tooltip);
      const moveTooltip = (event) => {
        const margin = 16;
        const width = Math.min(760, window.innerWidth - margin * 2);
        const x = Math.min(event.clientX + 18, window.innerWidth - width - margin);
        const y = Math.min(event.clientY + 18, window.innerHeight - 92);
        tooltip.style.maxWidth = `${width}px`;
        tooltip.style.transform = `translate3d(${Math.max(margin, x)}px, ${Math.max(margin, y)}px, 0)`;
      };
      root.addEventListener("pointerover", (event) => {
        const item = event.target.closest(".rain-item");
        if (!item || !root.contains(item)) return;
        tooltip.textContent = item.title || item.textContent;
        tooltip.classList.add("show");
        moveTooltip(event);
      });
      root.addEventListener("pointermove", (event) => {
        if (!tooltip.classList.contains("show")) return;
        moveTooltip(event);
      });
      root.addEventListener("pointerout", (event) => {
        const item = event.target.closest(".rain-item");
        if (!item) return;
        const next = event.relatedTarget;
        if (next && item.contains(next)) return;
        tooltip.classList.remove("show");
      });
    }

    function scheduleRainBuild() {
      const run = () => buildRain();
      window.setTimeout(() => {
        if ("requestIdleCallback" in window) {
          window.requestIdleCallback(run, { timeout: 650 });
        } else {
          run();
        }
      }, 280);
    }

    buildLogoWall();
    wireMouseDot();
    wireRainTooltip();
    scheduleRainBuild();
    window.addEventListener("resize", () => {
      window.clearTimeout(window.__rainTimer);
      window.__rainTimer = window.setTimeout(() => {
        if (document.getElementById("digitalRain")?.children.length) buildRain();
        buildLogoWall();
      }, 240);
    });

})();

;(function () {
document.addEventListener('DOMContentLoaded', function () {

  const textElements = document.querySelectorAll('.case-image-text');

  textElements.forEach(textElement => {

    const link = textElement.nextElementSibling;

    textElement.addEventListener('click', function () {

      if (link && link.tagName === 'A' && link.href) {
        window.location.href = link.href;
      }
    });

    textElement.style.cursor = 'pointer';

    textElement.setAttribute('tabindex', '0');
    textElement.setAttribute('role', 'button');
    textElement.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (link && link.tagName === 'A' && link.href) {
          window.location.href = link.href;
        }
      }
    });
  });
});

document.addEventListener('DOMContentLoaded', function () {
  const tabs = document.querySelectorAll('.tab')
  const indicator = document.querySelector('.indicator')
  const cardsContainer = document.querySelector('.cards-container')
  const cardsWrapper = document.querySelector('.cards-wrapper')

  if (!tabs.length || !indicator || !cardsContainer || !cardsWrapper) {
    return
  }

  updateIndicator(0)

  cardsContainer.addEventListener(
    'scroll',
    function () {

    },
    { passive: true }
  )

  tabs.forEach((tab) => {
    tab.addEventListener('click', function () {
      const index = parseInt(this.dataset.index)

      tabs.forEach((t) => t.classList.remove('active'))
      this.classList.add('active')

      updateIndicator(index)

      scrollToCard(index)
    })
  })

  function updateIndicator(index) {
    const tab = tabs[index]
    const tabRect = tab.getBoundingClientRect()
    const containerRect = tab.parentElement.getBoundingClientRect()

    const left = tabRect.left - containerRect.left
    const width = tabRect.width

    indicator.style.width = `${width}px`
    indicator.style.left = `${left}px`
  }

  function scrollToCard(index) {

    const scrollPosition = index * (500 + 24)

    cardsContainer.style.transform = `translateX(-${scrollPosition}px)`
  }

  document.querySelectorAll('.fade-in').forEach((el, i) => {
    el.style.animationDelay = `${i * 0.1 + 0.2}s`
  })

  scrollToCard(0)
})

const advantagesData = {
  tideflow: [
    '<span class="em">目标关键词向量空间匹配</span>，提升内容与查询的相关度与命中率。',
    '对影响各 AI 应用排名的数据进行<span class="em">系统性整理与分析</span>，生成可视化报告。',
    '通过社媒与大搜数据收集，洞察<span class="em">行业搜索行为</span>与竞争趋势。',
    '基于 RAG 与自研算法，确保高准确率与低幻觉率（<span class="em">&gt;95%</span>）。',
  ],
  scan: [
    '行业 / 品类主要<span class="em">竞品产品品牌</span>洞察分析。',
    '品类主要<span class="em">搜索关键词</span>和场景洞察分析',
    '搜索结果<span class="em">收录、引用文章和对应来源</span>扫描分析',
    '各品牌<span class="em">渗透率、综合排名</span>整体分析',
  ],
  data: [
    '全球多地区Web、应用、API<span class="em">三端综合数据</span>，更符合用户搜索结果',
    '秒级响应与<span class="em">数据监控能力</span>，完整监控品牌增长曲线',
    '本品和竞品高信任<span class="em">内容来源渠道统计</span>数量与分析',
    '<span class="em">搜索意图</span>智能拆解，全面展开<span class="em">高价值排名结果</span>',
  ],
}

let currentAdvTexts = [...advantagesData.tideflow]
let currentKey = 'tideflow'


  ; (function () {
    const canvas = document.getElementById('bgCanvas')
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    let W,
      H,
      DPR = window.devicePixelRatio || 1
    function resize() {
      DPR = window.devicePixelRatio || 1
      W = canvas.width = Math.floor(window.innerWidth * DPR)
      H = canvas.height = Math.floor(window.innerHeight * DPR)
      canvas.style.width = window.innerWidth + 'px'
      canvas.style.height = window.innerHeight + 'px'
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
    }
    window.addEventListener('resize', resize)
    resize()

    const symbols = [
      '=',
      '.',
      ';',
      ':',
      ',',
      '^',
      '-',
      '~',
      '+',
      '*',
      '"',
      "'",
    ]
    const N = Math.max(
      30,
      Math.floor((window.innerWidth + window.innerHeight) / 90)
    )
    const arr = Array.from({ length: N }).map(() => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.12,
      vy: (Math.random() - 0.5) * 0.12,
      a: 0.04 + Math.random() * 0.12,
      s: 8 + Math.random() * 18,
      c: symbols[Math.floor(Math.random() * symbols.length)],
      t: Math.random() * 100,
    }))

    let last = performance.now()
    function tick(now) {
      const dt = (now - last) / 1000
      last = now
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
      for (const p of arr) {
        p.t += dt
        p.x += p.vx * (1 + Math.sin(p.t * 0.5))
        p.y += p.vy * (1 + Math.cos(p.t * 0.5))
        if (p.x < -20) p.x = window.innerWidth + 20
        if (p.x > window.innerWidth + 20) p.x = -20
        if (p.y < -20) p.y = window.innerHeight + 20
        if (p.y > window.innerHeight + 20) p.y = -20
        ctx.save()
        ctx.globalAlpha = p.a * (0.6 + 0.4 * Math.sin(p.t * 0.6))
        ctx.translate(p.x, p.y)
        ctx.rotate(Math.sin(p.t * 0.3) * 0.5)
        ctx.font = `${p.s}px serif`
        ctx.fillStyle = 'rgba(6,18,20,0.06)'
        ctx.fillText(p.c, -p.s * 0.3, p.s * 0.2)
        ctx.restore()
      }
      requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  })()


  ; (function () {
    const slotsWrap = document.getElementById('slots')
    const advantagesContainer = document.getElementById(
      'advantagesContainer'
    )
    if (!slotsWrap || !advantagesContainer) return

    const slots = Array.from(slotsWrap.querySelectorAll('.slot'))
    const slider = document.getElementById('slider')
    const sliderInner = document.getElementById('sliderInner')
    const sliderIcon = document.getElementById('sliderIcon')
    const sliderTitle = document.getElementById('sliderTitle')
    const sliderDesc = document.getElementById('sliderDesc')
    const dynamicTitle = document.getElementById('dynamicTitle')
    const advItems = Array.from(
      advantagesContainer.querySelectorAll('.adv-item')
    )
    const advTextContainers = Array.from(
      advantagesContainer.querySelectorAll('.adv-text-container')
    )
    if (
      !slots.length ||
      !slider ||
      !sliderInner ||
      !sliderIcon ||
      !sliderTitle ||
      !sliderDesc ||
      !dynamicTitle ||
      !advItems.length ||
      !advTextContainers.length
    ) {
      return
    }

    const advFlipTimers = new WeakMap()
    let advantageMotionReady = false

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    function prepareAdvantageText(text) {
      if (text.dataset.flipReady === 'true') return

      let charIndex = 0

      function wrapNode(node) {
        if (node.nodeType === Node.TEXT_NODE) {
          const fragment = document.createDocumentFragment()
          Array.from(node.textContent).forEach((char) => {
            if (/\s/.test(char)) {
              fragment.appendChild(document.createTextNode(char))
              return
            }

            const span = document.createElement('span')
            span.className = 'adv-flip-char'
            span.style.setProperty('--adv-char-delay', `${charIndex * 8}ms`)
            span.textContent = char
            charIndex += 1
            fragment.appendChild(span)
          })
          node.replaceWith(fragment)
          return
        }

        if (
          node.nodeType === Node.ELEMENT_NODE &&
          !node.classList.contains('adv-flip-char')
        ) {
          Array.from(node.childNodes).forEach(wrapNode)
        }
      }

      Array.from(text.childNodes).forEach(wrapNode)
      text.dataset.flipReady = 'true'
    }

    function computeLayout() {
      const wrapRect = slotsWrap.getBoundingClientRect()
      const slRects = slots.map((s) => s.getBoundingClientRect())
      const lefts = slRects.map((r) => r.left - wrapRect.left)
      const widths = slRects.map((r) => r.width)
      return { wrapRect, lefts, widths }
    }

    function updateSliderWidth(i) {
      const { widths } = computeLayout()
      if (!widths[i]) return
      slider.style.width = widths[i] + 'px'
      slider.style.height = slotsWrap.getBoundingClientRect().height + 'px'
    }

    let wobbleTimer = null
    function syncSlotSelection(i) {
      slots.forEach((sl, idx) =>
        sl.setAttribute('aria-selected', idx === i ? 'true' : 'false')
      )
    }

    function moveSliderToIndex(i, opts = { wobble: true }) {
      const { lefts, widths } = computeLayout()
      if (!lefts[i] && lefts[i] !== 0) return
      const targetX = lefts[i]

      slider.style.setProperty('--tx', targetX + 'px')

      slider.style.width = widths[i] + 'px'

      slider.style.transform = `translateX(${targetX}px)`

      const s = slots[i]
      const title =
        s.dataset.title || s.querySelector('.title')?.textContent || ''
      const desc =
        s.dataset.desc || s.querySelector('.desc')?.textContent || ''

      const iconNode = s.querySelector('.icon')?.innerHTML || ''
      sliderIcon.innerHTML = iconNode
      sliderTitle.textContent = title
      sliderDesc.textContent = desc

      syncSlotSelection(i)

      slider.classList.remove('wobble')
      if (prefersReduced) return
      if (opts.wobble) {

        if (wobbleTimer) clearTimeout(wobbleTimer)
        wobbleTimer = setTimeout(() => {
          slider.classList.add('wobble')

          setTimeout(() => slider.classList.remove('wobble'), 500)
        }, 420) // match transform transition duration
      }
    }

    function initSlider() {

      updateSliderWidth(currentIndex)

      const rect = slotsWrap.getBoundingClientRect()
      slider.style.top = '0'
      slider.style.left = '0'
      moveSliderToIndex(currentIndex, { wobble: false })
    }

    window.addEventListener('load', initSlider)
    window.addEventListener('resize', () => {
      updateSliderWidth(currentIndex)
      moveSliderToIndex(currentIndex, { wobble: false })
    })

    function revealAdvantageCards() {
      if (prefersReduced || !advantageMotionReady) return

      advItems.forEach((item, index) => {
        const textContainer = item.querySelector('.adv-text-container')
        const text = item.querySelector('.adv-text')
        if (!textContainer || !text) return

        const existingTimer = advFlipTimers.get(textContainer)
        if (existingTimer) clearTimeout(existingTimer)

        const flipDelay = index * 95
        try {
          prepareAdvantageText(text)
        } catch (error) {
          text.dataset.flipReady = 'fallback'
          textContainer.classList.remove('is-flipping')
          return
        }
        text.style.setProperty('--adv-flip-delay', `${flipDelay}ms`)
        textContainer.classList.remove('is-flipping')
        void textContainer.offsetWidth
        textContainer.classList.add('is-flipping')

        const timer = setTimeout(() => {
          textContainer.classList.remove('is-flipping')
          text.style.removeProperty('--adv-flip-delay')
          text.style.visibility = 'visible'
          text.style.opacity = '1'
        }, 1150 + flipDelay)

        advFlipTimers.set(textContainer, timer)
      })
    }

    function updateAdvantagesStatic(key) {
      const advantages =
        advantagesData[key] || advantagesData['tideflow']

      advItems.forEach((item, index) => {
        if (!advantages[index]) return

        const textContainer = item.querySelector(
          '.adv-text-container'
        )
        const textInner = item.querySelector('.adv-text-inner')

        textInner.innerHTML = `<div class="adv-text">${advantages[index]}</div>`
        textInner.style.transform = 'none'
        textContainer.style.width = ''
        textContainer.classList.remove('rolling')
        currentAdvTexts[index] = advantages[index]
      })

      revealAdvantageCards()
    }

    function animateAdvantages(key, delay = 200) {
      const isCompactGrid =
        window.getComputedStyle(advantagesContainer).display === 'grid'

      if (prefersReduced || isCompactGrid) {
        setTimeout(() => updateAdvantagesStatic(key), delay)
        return
      }

      setTimeout(() => {
        const advantages =
          advantagesData[key] || advantagesData['tideflow']

        advantages.forEach((html, index) => {
          setTimeout(() => {
            if (advItems[index]) {
              const textContainer = advItems[index].querySelector(
                '.adv-text-container'
              )
              const textInner =
                advItems[index].querySelector('.adv-text-inner')

              const currentHtml =
                currentAdvTexts[index] || textInner.innerHTML

              if (currentHtml === html) {
                return
              }

              const newHtml = `<div class="adv-text">${html}</div>`
              textInner.innerHTML =
                `<div class="adv-text">${currentHtml}</div>` + newHtml

              const newWidth = textInner.scrollWidth
              textContainer.style.width = `${textInner.scrollWidth}px`

              textInner.offsetHeight

              textContainer.classList.add('rolling')

              textInner.style.transform = `translateY(-${textInner.children[0].offsetHeight}px)`

              setTimeout(() => {
                textInner.innerHTML = newHtml
                textInner.style.transform = 'translateY(0)'
                textContainer.style.width = `${textInner.scrollWidth}px`
                textContainer.classList.remove('rolling')

                currentAdvTexts[index] = html
              }, 1200)
            }
          }, index * 200) // 每行延迟200ms，实现依次滚动效果
        })
      }, delay)
    }

    let currentIndex = 0

    function getDynamicTitleForSlot(slot) {
      const mobileTitle =
        window.matchMedia('(max-width: 620px)').matches &&
        slot.dataset.mobileTitle
      return mobileTitle || slot.dataset.title
    }

    function selectIndex(i, opts = { focus: false }) {
      if (i < 0 || i >= slots.length) return

      const key = slots[i].dataset.key
      const targetTitle = getDynamicTitleForSlot(slots[i])

      if (key === currentKey) {
        syncSlotSelection(i)
        if (
          window.matchMedia('(max-width: 620px)').matches &&
          dynamicTitle.textContent.trim() !== targetTitle
        ) {
          animateDynamicWord(targetTitle)
        }
        if (opts.focus) slots[i].focus()
        return
      }

      currentIndex = i

      syncSlotSelection(i)
      moveSliderToIndex(i, { wobble: true })

      animateDynamicWord(targetTitle)

      animateAdvantages(key)

      currentKey = key

      if (opts.focus) slots[i].focus()
    }

    slots.forEach((s, idx) => {
      s.addEventListener('mouseenter', () =>
        selectIndex(idx, { focus: false })
      )
      s.addEventListener('click', () =>
        selectIndex(idx, { focus: false })
      )
      s.addEventListener('focus', () =>
        selectIndex(idx, { focus: false })
      )
      s.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
          selectIndex(Math.min(slots.length - 1, idx + 1), {
            focus: true,
          })
          e.preventDefault()
        }
        if (e.key === 'ArrowLeft') {
          selectIndex(Math.max(0, idx - 1), { focus: true })
          e.preventDefault()
        }
      })
    })

    syncSlotSelection(currentIndex)

    setTimeout(() => selectIndex(0, { focus: false }), 80)

    function enableAdvantageMotion() {
      if (advantageMotionReady || prefersReduced) return
      advantageMotionReady = true
      advantagesContainer.classList.add('adv-ready')
      window.requestAnimationFrame(() => revealAdvantageCards())
    }

    function scheduleAdvantageMotion() {
      const section = document.getElementById('jiasou-advantages') || advantagesContainer
      if (!section) return
      if (!('IntersectionObserver' in window)) {
        window.setTimeout(enableAdvantageMotion, 720)
        return
      }

      const observer = new IntersectionObserver((entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        observer.disconnect()
        window.setTimeout(enableAdvantageMotion, 120)
      }, {
        rootMargin: '140px 0px -10% 0px',
        threshold: 0.12,
      })

      observer.observe(section)
    }

    scheduleAdvantageMotion()


    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
    const numbers = '0123456789'.split('')
    const chinesePool =
      '加搜科技算法数据流量渗透优化洞察策略市场增长分析推荐引擎'.split('')
    let dynamicWordRunId = 0

    function candidatesForChar(ch) {
      if (/[\u4e00-\u9fff]/.test(ch)) return chinesePool
      if (/[A-Za-z]/.test(ch)) return letters
      if (/[0-9]/.test(ch)) return numbers
      return letters.concat(numbers)
    }

    function animateDynamicWord(target) {
      dynamicWordRunId += 1
      const runId = dynamicWordRunId

      if (prefersReduced) {
        dynamicTitle.textContent = target
        return
      }

      const chars = Array.from(target)

      dynamicTitle.innerHTML = ''
      dynamicTitle.style.fontWeight = '900'
      const spans = chars.map(() => {
        const sp = document.createElement('span')
        sp.style.display = 'inline-block'
        sp.style.minWidth = '0.85ch'
        sp.style.fontWeight = '900'
        sp.style.lineHeight = 'inherit'
        sp.style.whiteSpace = 'nowrap'
        sp.style.willChange = 'transform'
        dynamicTitle.appendChild(sp)
        return sp
      })

      const maxDuration = 700 // ms
      const minDuration = 260
      const baseDelay = 60 // stagger start slightly per char
      spans.forEach((sp, idx) => {
        const targetChar = chars[idx]
        if (/\s/.test(targetChar)) {
          sp.textContent = ' '
          sp.style.minWidth = '0.35em'
          return
        }

        const pool = candidatesForChar(targetChar)
        const duration =
          minDuration + Math.random() * (maxDuration - minDuration)
        const fps = 30
        const intervalMs = 1000 / fps
        const totalFrames = Math.round(duration / intervalMs)
        let frame = 0
        const jitter = Math.random() * 50 // offset for variety

        const iv = setInterval(() => {
          frame++

          const rnd = pool[Math.floor(Math.random() * pool.length)]
          sp.textContent = rnd
          sp.style.transform = `translateY(${Math.sin(frame / 3 + idx) * 6
            }px)`
          if (frame >= totalFrames - 2) {

            sp.textContent = targetChar
            sp.style.transform = 'translateY(0)'
          }
          if (frame >= totalFrames) {
            clearInterval(iv)
          }
        }, intervalMs + Math.random() * 8)

        sp.textContent = pool[Math.floor(Math.random() * pool.length)]
      })

      dynamicTitle.animate(
        [{ transform: 'scale(1.02)' }, { transform: 'scale(1)' }],
        { duration: 420, easing: 'cubic-bezier(.2,.85,.32,1)' }
      )

      setTimeout(() => {
        if (runId === dynamicWordRunId) {
          dynamicTitle.textContent = target
        }
      }, maxDuration + 90)
    }
  })()

function analyzeHeroAnimations() {

  const heroElement =
    document.querySelector('.hero-content') ||
    document.querySelector('.hero-title') ||
    document.querySelector('#banner-text')

  if (!heroElement) {

    return null
  }

  const hasAnimateClass =
    heroElement.classList.contains('animate') ||
    heroElement.classList.contains('animated') ||
    heroElement.classList.contains('active')

  const dataAnimation =
    heroElement.dataset.animation || heroElement.dataset.animate

  return {
    element: heroElement,
    hasAnimation: hasAnimateClass || dataAnimation,
    currentClasses: Array.from(heroElement.classList),
    dataset: heroElement.dataset,
  }
}

function initScrollTriggeredHeroAnimation() {
  const advantagesSection = document.getElementById('jiasou-advantages')

  if (!advantagesSection) {

    return
  }

  const heroAnalysis = analyzeHeroAnimations()

  if (!heroAnalysis || !heroAnalysis.hasAnimation) {

    const defaultAnimateClass = 'animate-hero-scroll'
    heroAnalysis.element.classList.add(defaultAnimateClass)
  }

  let animationTriggered = false

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !animationTriggered) {

          triggerHeroAnimation(heroAnalysis)
          animationTriggered = true

          observer.disconnect()
        }
      })
    },
    {
      threshold: 0.3, // 当元素30%进入视口时触发
      rootMargin: '0px 0px -100px 0px', // 提前100px触发
    }
  )

  observer.observe(advantagesSection)


}

function triggerHeroAnimation(heroAnalysis) {
  const heroElement = heroAnalysis.element

  heroElement.classList.remove('animate', 'animated', 'active')

  void heroElement.offsetWidth

  setTimeout(() => {
    heroElement.classList.add('animate')

    if (heroAnalysis.dataset.animation) {
      heroElement.classList.add(heroAnalysis.dataset.animation)
    }
    if (heroAnalysis.dataset.animate) {
      heroElement.classList.add(heroAnalysis.dataset.animate)
    }


  }, 100)
}

document.addEventListener('DOMContentLoaded', function () {

  setTimeout(initScrollTriggeredHeroAnimation, 500)
})

window.initHeroScrollAnimation = initScrollTriggeredHeroAnimation

document.addEventListener('DOMContentLoaded', function () {
  function bindPairInteraction(blockSelector, imageSelector) {
    const blocks = Array.from(document.querySelectorAll(blockSelector))
    const images = Array.from(document.querySelectorAll(imageSelector))
    if (!blocks.length) return

    function activate(index) {
      blocks.forEach((block, i) => {
        block.classList.toggle('active', i === index)
        block.setAttribute('aria-selected', i === index ? 'true' : 'false')
      })
      images.forEach((image, i) => image.classList.toggle('active', i === index))
    }

    blocks.forEach((block, index) => {
      block.setAttribute('tabindex', '0')
      block.setAttribute('role', 'button')
      block.addEventListener('mouseenter', () => activate(index))
      block.addEventListener('focus', () => activate(index))
      block.addEventListener('click', () => activate(index))
      block.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          activate(index)
        }
      })
    })

    activate(0)
  }

  bindPairInteraction('.industry-content-block', '.industry-image-card')
  bindPairInteraction('.geo-content-card', '.geo-image-card')
})

document.addEventListener('DOMContentLoaded', function () {

  const brandItems = document.querySelectorAll('.case-brand-item')
  const imageWrapper = document.querySelector('.case-image-wrapper')
  const statsWrapper = document.querySelector('.case-stats-wrapper')
  const pauseBtn = document.getElementById('case-pauseBtn')
  const playBtn = document.getElementById('case-playBtn')

  let currentIndex = 0
  let autoPlay = true
  let slideInterval

  function switchCase(index) {

    brandItems.forEach((item, i) => {
      item.classList.toggle('active', i === index)
    })

    imageWrapper.style.transform = `translateX(-${index * 100}%)`

    setTimeout(() => {
      statsWrapper.style.transform = `translateX(-${index * 100}%)`
    }, 200)

    currentIndex = index
  }

  brandItems.forEach((item) => {
    item.addEventListener('mouseenter', function () {
      const index = parseInt(this.getAttribute('data-index'))
      switchCase(index)
    })
  })

  function autoSwitch() {
    if (!autoPlay) return

    currentIndex = (currentIndex + 1) % 4
    switchCase(currentIndex)
  }

  slideInterval = setInterval(autoSwitch, 5000)

  if (pauseBtn && playBtn) {
    pauseBtn.addEventListener('click', function () {
      autoPlay = false
      clearInterval(slideInterval)
      pauseBtn.style.opacity = 0.5
      playBtn.style.opacity = 1
    })

    playBtn.addEventListener('click', function () {
      autoPlay = true
      slideInterval = setInterval(autoSwitch, 5000)
      pauseBtn.style.opacity = 1
      playBtn.style.opacity = 0.5
    })

    playBtn.style.opacity = 0.5
  }
})

document.addEventListener('DOMContentLoaded', function () {

  const cards = document.querySelectorAll('.advantage-card')

  cards.forEach((card) => {
    card.addEventListener('mouseenter', function () {
      this.style.transform = 'translateY(-5px)'
    })

    card.addEventListener('mouseleave', function () {
      this.style.transform = 'translateY(0)'
    })
  })
})

})();

;(function () {
(function () {
  const board = document.querySelector('[data-v2-trend]');
  if (!board) return;

  const tabs = Array.from(board.querySelectorAll('[data-trend-target]'));
  const panels = Array.from(board.querySelectorAll('[data-trend-panel]'));

  function activate(target) {
    tabs.forEach((tab) => {
      const isActive = tab.dataset.trendTarget === target;
      tab.classList.toggle('active', isActive);
      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    panels.forEach((panel) => {
      panel.classList.toggle('active', panel.dataset.trendPanel === target);
    });
  }

  tabs.forEach((tab) => {
    const target = tab.dataset.trendTarget;
    let hoverTimer = null;

    function clearHoverTimer() {
      if (!hoverTimer) return;
      clearTimeout(hoverTimer);
      hoverTimer = null;
    }

    tab.addEventListener('click', () => activate(target));
    tab.addEventListener('pointerup', (event) => {
      if (event.pointerType !== 'mouse') activate(target);
    });
    tab.addEventListener('mouseenter', () => {
      clearHoverTimer();
      hoverTimer = setTimeout(() => activate(target), 90);
    });
    tab.addEventListener('mouseleave', clearHoverTimer);
    tab.addEventListener('focus', () => {
      clearHoverTimer();
      activate(target);
    });
  });
})();

(function () {
  const board = document.querySelector('[data-vendor-board]');
  if (!board) return;

  const tabs = Array.from(board.querySelectorAll('[data-vendor-target]'));
  const panels = Array.from(board.querySelectorAll('[data-vendor-panel]'));
  const mobileProofButton = document.querySelector('[data-vendor-mobile-proof]');

  function syncMobileProof(target) {
    if (!mobileProofButton) return;

    const canOpen = target === 'top';
    mobileProofButton.disabled = !canOpen;
    mobileProofButton.setAttribute('aria-disabled', canOpen ? 'false' : 'true');
    mobileProofButton.classList.toggle('is-disabled', !canOpen);
  }

  function activate(target) {
    tabs.forEach((tab) => {
      const isActive = tab.dataset.vendorTarget === target;
      tab.classList.toggle('active', isActive);
      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    panels.forEach((panel) => {
      panel.classList.toggle('active', panel.dataset.vendorPanel === target);
    });

    syncMobileProof(target);
    board.dispatchEvent(new CustomEvent('vendorchange', { detail: { target } }));
  }

  tabs.forEach((tab) => {
    const target = tab.dataset.vendorTarget;
    let hoverTimer = null;

    function clearHoverTimer() {
      if (!hoverTimer) return;
      clearTimeout(hoverTimer);
      hoverTimer = null;
    }

    tab.addEventListener('click', () => activate(target));
    tab.addEventListener('pointerup', (event) => {
      if (event.pointerType !== 'mouse') activate(target);
    });
    tab.addEventListener('mouseenter', () => {
      clearHoverTimer();
      hoverTimer = setTimeout(() => activate(target), 90);
    });
    tab.addEventListener('mouseleave', clearHoverTimer);
    tab.addEventListener('focus', () => {
      clearHoverTimer();
      activate(target);
    });
  });

  syncMobileProof('top');
})();

(function () {
  const board = document.querySelector('[data-vendor-board]');
  const card = document.querySelector('[data-vendor-radar]');
  if (!board || !card) return;

  const glyphs = 'AI搜索GEO信源知识库数据0123456789';
  const timers = new WeakMap();
  let polygonFrame = null;

  const tierData = {
    top: {
      points: '180.0,61.0 278.8,123.0 280.9,238.3 180.0,291.6 76.9,239.5 83.4,124.2',
      tips: {
        visibility: ['AI 可见', '核心问题进入 AI 推荐', '核心问题中直接出现官网与品牌推荐，GPT、Gemini、Claude 等平台能稳定识别品牌优势。'],
        source: ['官网信源', '官网成为可引用资产', '官网承接产品、场景、案例和白皮书，AI 可以直接引用企业自有内容。'],
        knowledge: ['知识库', '海量 Query 有知识承接', '面向海量意图 Query 建知识库，产品参数、卖点、案例和场景可以一一对应，几乎无幻觉和参数偏移。'],
        platform: ['全平台', '覆盖高价值平台与小语种', '覆盖 GPT、Gemini、Claude、Perplexity 等平台，支持全球多语言和小语种场景。'],
        evidence: ['证据链', '官网与媒体全面联动', '官网、权威媒体和多媒体矩阵联动，可复核每一次推荐来源。'],
        monitoring: ['数据监控', '持续监控并动态调优', '持续监控排名、引用来源、意图覆盖和转化路径，能按平台快速调优。']
      }
    },
    good: {
      points: '180.0,85.8 242.3,144.0 263.8,228.4 180.0,232.1 107.0,222.2 104.8,136.6',
      tips: {
        visibility: ['AI 可见', '部分场景进入 AI 提及', '部分品牌词和行业词可被提及，更多依赖媒体结果与榜单背书。'],
        source: ['官网信源', '官网沉淀有限', '官网有基础内容沉淀，AI 更常引用权威媒体或第三方文章。'],
        knowledge: ['知识库', '核心引用基本稳定', '能保证品牌、产品卖点和关键参数正确引用，长尾 Query 偶尔有幻觉。'],
        platform: ['全平台', '覆盖范围需要验证', '能覆盖部分主流平台和重点语言，长尾语种、区域场景覆盖有限。'],
        evidence: ['证据链', '权威媒体为主', '以权威媒体为主，能建立背书，官网自然引用能力有限。'],
        monitoring: ['数据监控', '阶段报告可交付', '能做阶段报告，监控维度和问题分层不够细。']
      }
    },
    base: {
      points: '180.0,123.0 210.1,162.6 212.2,198.6 180.0,202.3 143.5,201.1 115.6,142.8',
      tips: {
        visibility: ['AI 可见', '基础排名波动明显', '短期或低竞争词可能可见，平台更新后波动明显。'],
        source: ['官网信源', '官网难以成为信源', '官网内容建设薄弱，AI 难以判断品牌可信度和产品边界。'],
        knowledge: ['知识库', '缺少知识库会引发幻觉', '缺少知识库能力，经常遇到 AI 幻觉内容、参数不准确、引用错误等内容问题。'],
        platform: ['全平台', '高价值平台覆盖薄弱', '高价值平台和高净值客户常用的 GPT、Gemini、Claude 很难提到品牌，甚至判断品牌证据链不足。'],
        evidence: ['证据链', '自媒体铺量为主', '以自媒体铺量为主，短期可见，可信度和可复核性偏弱。'],
        monitoring: ['数据监控', '有基础数据汇总', '可做基础截图和简单数据汇总，缺少统一口径和持续优化闭环。']
      }
    }
  };

  function reveal(element, finalText, duration) {
    if (!element || !finalText) return;

    const previousTimer = timers.get(element);
    if (previousTimer) clearInterval(previousTimer);

    const textLength = finalText.length;
    const startedAt = performance.now();
    const interval = setInterval(() => {
      const progress = Math.min(1, (performance.now() - startedAt) / duration);
      const locked = Math.floor(textLength * progress);
      let nextText = finalText.slice(0, locked);

      for (let index = locked; index < textLength; index += 1) {
        nextText += glyphs[Math.floor(Math.random() * glyphs.length)];
      }

      element.textContent = nextText;

      if (progress >= 1) {
        clearInterval(interval);
        timers.delete(element);
        element.textContent = finalText;
      }
    }, 26);

    timers.set(element, interval);
  }

  function parsePoints(points) {
    return points.trim().split(/\s+/).map((pair) => pair.split(',').map(Number));
  }

  function formatPoints(points) {
    return points.map((point) => `${point[0].toFixed(1)},${point[1].toFixed(1)}`).join(' ');
  }

  function animatePolygon(targetPoints) {
    const polygon = card.querySelector('.v2-radar-fill');
    if (!polygon) return;

    if (polygonFrame) cancelAnimationFrame(polygonFrame);

    const from = parsePoints(polygon.getAttribute('points'));
    const to = parsePoints(targetPoints);
    const startedAt = performance.now();
    const duration = 560;

    card.classList.add('is-switching');

    function tick(now) {
      const raw = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - Math.pow(1 - raw, 3);
      const current = from.map((point, index) => [
        point[0] + (to[index][0] - point[0]) * eased,
        point[1] + (to[index][1] - point[1]) * eased
      ]);

      polygon.setAttribute('points', formatPoints(current));

      if (raw < 1) {
        polygonFrame = requestAnimationFrame(tick);
        return;
      }

      polygon.setAttribute('points', targetPoints);
      polygonFrame = null;
      window.setTimeout(() => card.classList.remove('is-switching'), 120);
    }

    polygonFrame = requestAnimationFrame(tick);
  }

  function currentTier() {
    return card.dataset.vendorTier || 'top';
  }

  function activeKey() {
    const activeButton = card.querySelector('.v2-radar-hotspot.is-active');
    return activeButton ? activeButton.dataset.radarKey : 'visibility';
  }

  function activateTip(button, instant) {
    const buttons = Array.from(card.querySelectorAll('.v2-radar-hotspot'));
    const kicker = card.querySelector('.v2-radar-tip [data-radar-kicker]');
    const title = card.querySelector('.v2-radar-tip [data-radar-title]');
    const copy = card.querySelector('.v2-radar-tip [data-radar-copy]');
    const key = button.dataset.radarKey || 'visibility';
    const data = tierData[currentTier()] || tierData.top;
    const tip = data.tips[key] || data.tips.visibility;

    card.dataset.radarActive = key;

    buttons.forEach((item) => {
      item.classList.toggle('is-active', item === button);
    });

    if (instant) {
      if (kicker) kicker.textContent = tip[0];
      if (title) title.textContent = tip[1];
      if (copy) copy.textContent = tip[2];
      return;
    }

    reveal(kicker, tip[0], 180);
    reveal(title, tip[1], 240);
    reveal(copy, tip[2], 360);
  }

  function setTier(target, instant) {
    const data = tierData[target] || tierData.top;
    const polygon = card.querySelector('.v2-radar-fill');
    const activeButton = card.querySelector(`[data-radar-key="${activeKey()}"]`) || card.querySelector('.v2-radar-hotspot');

    card.dataset.vendorTier = target;
    card.classList.remove('is-top', 'is-good', 'is-base');
    card.classList.add(`is-${target}`);

    if (polygon) {
      polygon.classList.remove('top', 'good', 'base');
      polygon.classList.add(target);
      if (instant) {
        polygon.setAttribute('points', data.points);
      } else {
        animatePolygon(data.points);
      }
    }

    activateTip(activeButton, instant);
  }

  const buttons = Array.from(card.querySelectorAll('.v2-radar-hotspot'));
  const activeButton = buttons.find((button) => button.classList.contains('is-active')) || buttons[0];
  const checkCards = Array.from(board.querySelectorAll('[data-radar-link]'));
  if (activeButton) activateTip(activeButton, true);
  setTier('top', true);

  buttons.forEach((button) => {
    button.addEventListener('mouseenter', () => activateTip(button, false));
    button.addEventListener('focus', () => activateTip(button, false));
    button.addEventListener('click', () => activateTip(button, false));
  });

  checkCards.forEach((item) => {
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');

    function activateLinkedRadar() {
      const key = item.dataset.radarLink;
      const button = card.querySelector(`[data-radar-key="${key}"]`);
      if (!button) return;

      checkCards.forEach((cardItem) => cardItem.classList.toggle('is-linked-active', cardItem === item));
      window.setTimeout(() => item.classList.remove('is-linked-active'), 520);
      activateTip(button, false);
    }

    item.addEventListener('click', activateLinkedRadar);
    item.addEventListener('mouseenter', activateLinkedRadar);
    item.addEventListener('focus', activateLinkedRadar);
    item.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      activateLinkedRadar();
    });
  });

  function angleDistance(a, b) {
    return Math.abs(((a - b + 540) % 360) - 180);
  }

  const radarSectors = [
    ['visibility', -90],
    ['source', -30],
    ['knowledge', 30],
    ['platform', 90],
    ['evidence', 150],
    ['monitoring', -150]
  ];

  card.addEventListener('pointermove', (event) => {
    if (event.target.closest('.v2-radar-tip')) return;

    const radar = card.querySelector('.v2-vendor-radar');
    if (!radar) return;

    const rect = radar.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = event.clientX - centerX;
    const deltaY = event.clientY - centerY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const radius = rect.width * 0.62;

    if (distance > radius || distance < rect.width * 0.12) return;

    const angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
    const nearest = radarSectors.reduce((best, sector) => {
      const score = angleDistance(angle, sector[1]);
      return score < best.score ? { key: sector[0], score } : best;
    }, { key: 'visibility', score: Infinity });
    const button = card.querySelector(`[data-radar-key="${nearest.key}"]`);

    if (button && !button.classList.contains('is-active')) {
      activateTip(button, false);
    }
  });

  board.addEventListener('vendorchange', (event) => {
    setTier(event.detail.target, false);
  });
})();

(function () {
  const zoomButtons = Array.from(document.querySelectorAll('[data-proof-image]'));
  if (!zoomButtons.length) return;

  const modal = document.createElement('div');
  modal.className = 'v2-proof-modal';
  modal.hidden = true;
  modal.innerHTML = [
    '<div class="v2-proof-modal-inner" role="dialog" aria-modal="true" aria-label="效果示意图大图">',
    '<button type="button" aria-label="关闭效果示意图">&times;</button>',
    '<img src="/global_geo/homepage/assets/images/vendor-ai-search-proof.png" alt="AI 搜索效果示意图大图" />',
    '<div class="v2-proof-modal-copy">',
    '<span>效果示意图</span>',
    '<h3 data-proof-modal-title>查看简要示例</h3>',
    '<p data-proof-modal-copy></p>',
    '</div>',
    '</div>'
  ].join('');
  document.body.appendChild(modal);

  const image = modal.querySelector('img');
  const closeButton = modal.querySelector('button');
  const modalTitle = modal.querySelector('[data-proof-modal-title]');
  const modalCopy = modal.querySelector('[data-proof-modal-copy]');

  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = '';
  }

  zoomButtons.forEach((button) => {
    button.addEventListener('click', () => {
      if (button.disabled || button.getAttribute('aria-disabled') === 'true') return;

      image.src = button.dataset.proofImage;
      modalTitle.textContent = button.dataset.proofTitle || '查看简要示例';
      modalCopy.textContent = button.dataset.proofCopy || '';
      modal.hidden = false;
      document.body.style.overflow = 'hidden';
      closeButton.focus();
    });
  });

  closeButton.addEventListener('click', closeModal);
  modal.addEventListener('click', (event) => {
    if (event.target === modal) closeModal();
  });
  document.addEventListener('keydown', (event) => {
    if (!modal.hidden && event.key === 'Escape') closeModal();
  });
})();

(function () {
  const board = document.querySelector('[data-fit-board]');
  if (!board) return;

  const tabs = Array.from(board.querySelectorAll('[data-fit-target]'));
  const panels = Array.from(board.querySelectorAll('[data-fit-panel]'));

  function activate(target) {
    tabs.forEach((tab) => {
      const isActive = tab.dataset.fitTarget === target;
      tab.classList.toggle('active', isActive);
      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    panels.forEach((panel) => {
      panel.classList.toggle('active', panel.dataset.fitPanel === target);
    });
  }

  tabs.forEach((tab) => {
    const target = tab.dataset.fitTarget;
    let hoverTimer = null;

    function clearHoverTimer() {
      if (!hoverTimer) return;
      clearTimeout(hoverTimer);
      hoverTimer = null;
    }

    tab.addEventListener('click', () => activate(target));
    tab.addEventListener('pointerup', (event) => {
      if (event.pointerType !== 'mouse') activate(target);
    });
    tab.addEventListener('mouseenter', () => {
      clearHoverTimer();
      hoverTimer = setTimeout(() => activate(target), 90);
    });
    tab.addEventListener('mouseleave', clearHoverTimer);
    tab.addEventListener('focus', () => {
      clearHoverTimer();
      activate(target);
    });
  });
})();

})();

;(function () {
  const home = window.AIGCMKT_HOME || {};
  if (!document.querySelector('[data-stripe-study-module]')) return;

    const items = home.latestItems || [];

    const track = document.querySelector("[data-track]");
    const details = document.querySelector("[data-details]");
    const status = document.querySelector("[data-status]");
    const windowPaddingBefore = 12;
    const windowPaddingAfter = 24;
    const readingModal = document.querySelector("[data-reading-modal]");
    let virtualActive = 0;
    let virtualPreview = null;
    let windowStart = virtualActive - windowPaddingBefore;
    let windowEnd = virtualActive + windowPaddingAfter;
    let active = 0;
    let startX = 0;
    let dragging = false;
    let dragMoved = false;
    let layoutFrame = 0;
    let currentBookMode = "today";
    const caseCaptionBrands = home.caseCaptionBrands || [];

    function paneCaptionTitle(item, visual) {
      if (visual === "cover") return item.coverTitle || item.title;
      const label = item.shortTitle || item.title;
      const match = caseCaptionBrands.find(([keyword]) => item.title.includes(keyword));
      return match ? `${match[1]}：${label}` : label;
    }

    function renderPanes() {
      const panes = [];
      for (let position = windowStart; position <= windowEnd; position += 1) {
        const index = realIndex(position);
        const item = items[index];
        const visual = item.visual || "image";
        const captionTitle = paneCaptionTitle(item, visual);
        const media = visual === "cover"
          ? `<span class="pane-card-art" aria-hidden="true" style="--cover-bg:${item.cover || "linear-gradient(135deg, #2146ff, #1d2f91)"}"></span><span class="pane-caption"><span>${item.eyebrow}</span><strong>${item.coverTitle || item.title}</strong></span>`
          : `${item.fit === "contain" ? `<img class="pane-bg" src="${item.image}" alt="${item.shortTitle || item.title}" loading="lazy" decoding="async" style="object-position:${item.position || "center"}">` : ""}<img class="pane-media" src="${item.image}" alt="${item.shortTitle || item.title}" loading="${Math.abs(position - virtualActive) <= 3 ? "eager" : "lazy"}" decoding="async" style="object-position:${item.position || "center"}"><span class="pane-caption"><span>${item.eyebrow}</span><strong>${captionTitle}</strong></span>`;
        panes.push(`
          <button class="pane" type="button" data-index="${index}" data-position="${position}" data-tone="${item.tone || "mixed"}" data-visual="${visual}" data-fit="${item.fit || "cover"}" aria-label="查看：${item.title}">
            ${media}
          </button>
        `);
      }
      track.innerHTML = panes.join("");
    }

    function render() {
      renderPanes();
      details.innerHTML = items.map((item, index) => {
        const hasLink = Boolean(item.href);
        const titleText = hasLink
          ? `<a href="${item.href}" title="${item.title}">${item.title}</a>`
          : `<span>${item.title}</span>`;
        return `
        <article class="detail" data-index="${index}">
          <div class="copy">
            <h3 class="copy-heading copy-title">${titleText}</h3>
            <span class="copy-body"> ${item.body}</span>
            <span class="copy-metric">${item.metric}</span>
          </div>
          <button class="cta ${hasLink ? "" : "is-disabled"}" type="button" data-item-link="${item.href || ""}" ${hasLink ? "" : "disabled aria-disabled=\"true\""} aria-label="${item.cta}：${item.title}">${item.cta} ›</button>
        </article>
      `;
      }).join("");

      track.addEventListener("click", event => {
        const pane = event.target.closest(".pane");
        if (!pane) return;
        if (dragMoved) {
          dragMoved = false;
          return;
        }
        setActivePosition(Number(pane.dataset.position));
      });

      track.addEventListener("pointerover", event => {
        if (event.pointerType === "touch") return;
        const pane = event.target.closest(".pane");
        if (!pane) return;
        setPreviewPosition(Number(pane.dataset.position));
      });

      track.addEventListener("pointermove", event => {
        if (event.pointerType === "touch") return;
        const pane = event.target.closest(".pane.active");
        if (!pane) return;
        const rect = pane.getBoundingClientRect();
        const ratio = (event.clientX - rect.left) / rect.width;
        const pan = (0.5 - ratio) * 24;
        pane.style.setProperty("--pan-x", `${pan.toFixed(1)}px`);
      });

      track.addEventListener("pointerleave", () => {
        clearPreview();
        resetActivePan();
      });
      window.addEventListener("resize", () => layout(true));
      layout(true);
    }

    function realIndex(position) {
      return ((position % items.length) + items.length) % items.length;
    }

    function paneWidth(position) {
      const focus = virtualPreview ?? virtualActive;
      const dist = position - focus;
      if (virtualPreview !== null && virtualPreview !== virtualActive) {
        if (position === virtualActive) return 620;
        if (position === virtualPreview) return 280;
        if (dist === 1) return 96;
        return 52;
      }
      if (dist === 0) return 780;
      if (dist === 1) return 220;
      if (dist === 2) return 120;
      return 56;
    }

    function paneGap() {
      const styles = getComputedStyle(track);
      return parseFloat(styles.columnGap || styles.gap) || 16;
    }

    function targetOffset() {
      const gap = paneGap();
      let offset = 0;
      for (let position = windowStart; position < virtualActive; position += 1) {
        offset += paneWidth(position) + gap;
      }
      return offset;
    }

    function shouldRefreshWindow(position) {
      return position < windowStart + 6 || position > windowEnd - 8;
    }

    function refreshWindow(position) {
      windowStart = position - windowPaddingBefore;
      windowEnd = position + windowPaddingAfter;
      renderPanes();
    }

    function layout(instant = false) {
      cancelAnimationFrame(layoutFrame);
      const panes = [...track.querySelectorAll(".pane")];
      const detailEls = [...details.querySelectorAll(".detail")];
      active = realIndex(virtualActive);

      panes.forEach(pane => {
        const index = Number(pane.dataset.index);
        const position = Number(pane.dataset.position);
        const isMainActive = position === virtualActive;
        const isMainPreview = position === virtualPreview && position !== virtualActive;

        pane.classList.toggle("active", isMainActive);
        pane.classList.toggle("preview", isMainPreview);
        pane.style.width = `${paneWidth(position)}px`;
        pane.setAttribute("aria-current", isMainActive ? "true" : "false");
        pane.setAttribute("tabindex", isMainActive || Math.abs(position - virtualActive) <= 2 ? "0" : "-1");
        if (instant) {
          pane.style.transitionDuration = "0ms";
          requestAnimationFrame(() => {
            pane.style.transitionDuration = "";
          });
        }
      });

      detailEls.forEach((detail, index) => {
        detail.classList.toggle("active", index === active);
      });

      const applyTrackOffset = () => {
        if (instant) track.style.transitionDuration = "0ms";
        track.style.transform = `translate3d(${-targetOffset()}px, 0, 0)`;
        if (instant) {
          requestAnimationFrame(() => {
            track.style.transitionDuration = "";
          });
        }
      };

      if (instant) {
        applyTrackOffset();
      } else {
        layoutFrame = requestAnimationFrame(applyTrackOffset);
      }

      status.textContent = `第 ${active + 1} 项，共 ${items.length} 项：${items[active].title}`;
    }

    function setActivePosition(nextPosition, instant = false) {
      resetActivePan();
      virtualActive = nextPosition;
      if (virtualActive < windowStart || virtualActive > windowEnd) {
        refreshWindow(virtualActive);
        instant = true;
      }
      virtualPreview = null;
      layout(instant);
      if (!instant && shouldRefreshWindow(virtualActive)) {
        window.setTimeout(() => {
          refreshWindow(virtualActive);
          layout(true);
        }, 820);
      }
    }

    function setPreviewPosition(position) {
      if (position === virtualActive || virtualPreview === position) return;
      resetActivePan();
      virtualPreview = position;
      layout();
    }

    function clearPreview() {
      if (virtualPreview === null) return;
      virtualPreview = null;
      layout();
    }

    function resetActivePan() {
      const pane = track.querySelector(".pane.active");
      if (pane) pane.style.setProperty("--pan-x", "0px");
    }

    document.querySelectorAll("[data-dir]").forEach(button => {
      button.addEventListener("click", () => {
        setActivePosition(virtualActive + Number(button.dataset.dir));
      });
    });

    function openUrl(url) {
      if (!url) return;
      window.open(url, "_blank", "noopener");
    }

    document.querySelectorAll("[data-open-url]").forEach(button => {
      button.addEventListener("click", () => openUrl(button.dataset.openUrl));
    });

    details.addEventListener("click", event => {
      const button = event.target.closest("[data-item-link]");
      if (!button || button.disabled) return;
      openUrl(button.dataset.itemLink);
    });

    document.addEventListener("keydown", event => {
      if (event.key === "ArrowRight") setActivePosition(virtualActive + 1);
      if (event.key === "ArrowLeft") setActivePosition(virtualActive - 1);
    });

    track.addEventListener("pointerdown", event => {
      dragging = true;
      dragMoved = false;
      startX = event.clientX;
      track.classList.add("dragging");
    });

    track.addEventListener("pointerup", event => {
      if (!dragging) return;
      const delta = event.clientX - startX;
      track.classList.remove("dragging");
      dragging = false;
      dragMoved = Math.abs(delta) > 10;
      if (Math.abs(delta) > 48) setActivePosition(virtualActive + (delta < 0 ? 1 : -1));
    });

    track.addEventListener("pointercancel", () => {
      dragging = false;
      track.classList.remove("dragging");
    });

    const themeCopy = home.themeCopy || {};

    const bookLibrary = home.bookLibrary || [];

    const coverPalettes = home.coverPalettes || [];

    const storagePrefix = "aigcmkt-daily-book";

    function dateKey(offset = 0) {
      const date = new Date();
      date.setDate(date.getDate() + offset);
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${date.getFullYear()}-${month}-${day}`;
    }

    function hashString(input) {
      let hash = 2166136261;
      for (let i = 0; i < input.length; i += 1) {
        hash ^= input.charCodeAt(i);
        hash = Math.imul(hash, 16777619);
      }
      return Math.abs(hash >>> 0);
    }

    function formatDisplayDate(dateString = dateKey()) {
      const [year, month, day] = dateString.split("-").map(Number);
      if (!year || !month || !day) return dateKey();
      return `${year} 年 ${month} 月 ${day} 日`;
    }

    function formatBookTitle(title) {
      return title.replace(/\s+\(/, "<br>(");
    }

    function readLocalRecord(key) {
      try {
        return JSON.parse(localStorage.getItem(key));
      } catch (error) {
        return null;
      }
    }

    function writeLocalRecord(key, record) {
      try {
        localStorage.setItem(key, JSON.stringify(record));
      } catch (error) {
        return false;
      }
      return true;
    }

    function todayRecordKey() {
      return `${storagePrefix}:today:${dateKey()}`;
    }

    function previewRecordKey() {
      return `${storagePrefix}:tomorrow-preview:${dateKey()}`;
    }

    function getTodayRecord() {
      const key = todayRecordKey();
      const existing = readLocalRecord(key);
      if (existing && Number.isInteger(existing.selectedIndex)) return existing;

      const record = {
        date: dateKey(),
        selectedIndex: Math.floor(Math.random() * bookLibrary.length),
        openedAt: new Date().toISOString()
      };
      writeLocalRecord(key, record);
      return record;
    }

    function getTomorrowPreviewRecord() {
      const key = previewRecordKey();
      const existing = readLocalRecord(key);
      if (existing && Number.isInteger(existing.selectedIndex)) return existing;

      const record = {
        date: dateKey(1),
        selectedIndex: hashString(`${dateKey()}:${dateKey(1)}:preview`) % bookLibrary.length,
        previewedAt: new Date().toISOString()
      };
      writeLocalRecord(key, record);
      return record;
    }

    function updatePreviewButton(mode = currentBookMode) {
      const button = document.querySelector("[data-next-book]");
      const label = document.querySelector("[data-next-label]");
      const todayButton = document.querySelector("[data-today-book]");
      const used = Boolean(readLocalRecord(previewRecordKey()));
      const showingTomorrow = mode === "tomorrow";
      button.classList.toggle("is-disabled", used && showingTomorrow);
      button.setAttribute("aria-disabled", used && showingTomorrow ? "true" : "false");
      button.disabled = used && showingTomorrow;
      label.textContent = used ? (showingTomorrow ? "明日概览已记录" : "查看明日概览") : "明日概览";
      todayButton.hidden = !showingTomorrow;
      todayButton.classList.toggle("is-hidden", !showingTomorrow);
    }

    function renderDailyBook(record = getTodayRecord(), mode = "today") {
      currentBookMode = mode;
      const selectedIndex = record.selectedIndex % bookLibrary.length;
      const book = bookLibrary[selectedIndex];
      const copy = themeCopy[book.theme];
      const query = encodeURIComponent(`${book.title} ${book.author}`);
      const metaLabel = mode === "tomorrow" ? "明日概览" : "今日推荐";

      document.querySelector("[data-book-card]").style.setProperty("--cover-bg", coverPalettes[selectedIndex % coverPalettes.length]);
      document.querySelector("[data-book-theme]").textContent = copy.label;
      document.querySelector("[data-book-cover-title]").textContent = book.title.replace(/（.*?）|\(.*?\)/g, "").trim();
      document.querySelector("[data-book-cover-author]").textContent = book.author;
      document.querySelector("[data-book-meta]").textContent = `${metaLabel} | ${formatDisplayDate(record.date)}`;
      document.querySelector("[data-book-title]").innerHTML = formatBookTitle(book.title);
      document.querySelector("[data-book-author]").textContent = book.author;
      document.querySelector("[data-book-desc]").textContent = copy.desc;
      document.querySelector("[data-book-question]").textContent = copy.question;
      document.querySelector("[data-book-search]").dataset.searchUrl = `https://www.google.com/search?q=${query}`;
      updatePreviewButton();
    }

    document.querySelector("[data-next-book]").addEventListener("click", event => {
      const existingPreview = readLocalRecord(previewRecordKey());
      renderDailyBook(existingPreview || getTomorrowPreviewRecord(), "tomorrow");
    });

    document.querySelector("[data-today-book]").addEventListener("click", event => {
      renderDailyBook(getTodayRecord(), "today");
    });

    document.querySelector("[data-book-search]").addEventListener("click", event => {
      openUrl(event.currentTarget.dataset.searchUrl);
    });

    function openReadingModal() {
      readingModal.classList.add("is-open");
      readingModal.setAttribute("aria-hidden", "false");
      document.querySelector("[data-reading-close]").focus();
    }

    function closeReadingModal() {
      readingModal.classList.remove("is-open");
      readingModal.setAttribute("aria-hidden", "true");
      document.querySelector("[data-reading-group]").focus();
    }

    document.querySelector("[data-reading-group]").addEventListener("click", openReadingModal);
    document.querySelector("[data-reading-close]").addEventListener("click", closeReadingModal);
    readingModal.addEventListener("click", event => {
      if (event.target === readingModal) closeReadingModal();
    });
    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && readingModal.classList.contains("is-open")) {
        closeReadingModal();
      }
    });

    render();
    renderDailyBook();


})();
