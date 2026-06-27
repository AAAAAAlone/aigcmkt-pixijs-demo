// 导航栏滚动状态处理
window.__aigcmktTopNavPresent = true;

function getPageScrollTop() {
  return Math.max(window.pageYOffset || 0, document.documentElement.scrollTop || 0, document.body.scrollTop || 0);
}

function getPageScrollHeight() {
  return Math.max(document.documentElement.scrollHeight, document.body.scrollHeight) - window.innerHeight;
}

function syncNavbarByScroll() {
  const navbar = document.getElementById('main-navbar');
  if (!navbar) return;

  const scrollTop = getPageScrollTop();
  if (scrollTop > 50) {
    navbar.classList.add('scrolled');
    navbar.classList.toggle('compact', scrollTop > window.innerHeight);
  } else {
    navbar.classList.remove('scrolled');
    navbar.classList.remove('compact');
  }
}

let navbarSyncFrame = 0;
function scheduleNavbarSync() {
  if (navbarSyncFrame) return;
  navbarSyncFrame = window.requestAnimationFrame(function () {
    navbarSyncFrame = 0;
    syncNavbarByScroll();
  });
}

window.addEventListener('scroll', scheduleNavbarSync, { passive: true });

document.addEventListener('click', function () {
  requestAnimationFrame(syncNavbarByScroll);
});

// 汉堡菜单交互
const mobileNavContainer = document.querySelector('.yb-banner-nav-container');
if (mobileNavContainer) {
  mobileNavContainer.addEventListener('click', function (e) {
    if (window.innerWidth > 767) return;

    if (e.target === this) {
      this.classList.toggle('menu-active');
      const navLinks = document.getElementById('main-nav-links');
      if (navLinks) navLinks.classList.toggle('mobile-active');
      e.stopPropagation();
    }
  });
}

// 一级菜单点击展开二级菜单
document.addEventListener('click', function (e) {
  const navContainer = document.querySelector('.yb-banner-nav-container');
  const navLinks = document.getElementById('main-nav-links');
  if (!navContainer || !navLinks) return;

  // 点击外部区域关闭菜单
  if (navContainer.classList.contains('menu-active') &&
    !navContainer.contains(e.target) &&
    !navLinks.contains(e.target)) {
    navContainer.classList.remove('menu-active');
    navLinks.classList.remove('mobile-active');
  }

  // 一级菜单点击处理
  if (e.target.closest('.yb-has-dropdown > a') && window.innerWidth <= 767) {
    const dropdownItem = e.target.closest('.yb-has-dropdown');
    dropdownItem.classList.toggle('mobile-open');

    // 阻止默认行为
    e.preventDefault();
  }
});

document.addEventListener('DOMContentLoaded', function () {
  const navbar = document.getElementById('main-navbar');
  const dropdownToggles = document.querySelectorAll('.yb-dropdown-toggle');
  const dropdownContainers = document.querySelectorAll('.yb-dropdown-container');
  const scrollIndicator = document.getElementById('scroll-indicator');
  const root = document.documentElement;

  if (!navbar) return;

  // 尝试获取 logo 元素（优先 #site-logo，其次 .logo）
  const logoEl = document.getElementById('site-logo') || document.querySelector('.logo') || null;

  let lastScrollTop = 0;
  let isScrollingDown = false;
  let isDropdownOpen = false;
  let openContainer = null;
  let scrollTimeout, closeTimeout;

  // 常量配置
  const FIRST_SCREEN_TRIGGER_PX = 50;
  const CLOSE_DELAY_MS = 90;
  const CLEANUP_DELAY_MS = 180;
  const HOVER_LOGO_DEBOUNCE_MS = 40;

  // 直接指定你要显示的 scrolled 深色 logo（使用你提供的 URL）
  const SCROLLED_LOGO_URL = "https://www.jiasou.cn/static/media/logo.55869726aaee5293bed8.png";

  // 记录 logo 的原始 inline/background 值，以便恢复
  let logoOriginalBackground = null;
  if (logoEl) {
    // 读取内联 style.backgroundImage 优先，其次读取计算样式
    logoOriginalBackground = logoEl.style.backgroundImage || getComputedStyle(logoEl).backgroundImage || '';
  }

  // 辅助：把 logo 设为 scrolled 深色（直接写 inline style）
  function forceSetLogoScrolled() {
    if (!logoEl) return;
    // 直接设置 inline background-image，确保覆盖 CSS
    logoEl.style.backgroundImage = `url('${SCROLLED_LOGO_URL}')`;
  }
  // 恢复 logo 到原始状态（如果原本没有 inline，则清除 inline）
  function restoreLogoOriginal() {
    if (!logoEl) return;
    if (logoOriginalBackground) {
      // 如果原始有值，恢复之
      logoEl.style.backgroundImage = logoOriginalBackground;
    } else {
      // 否则移除 inline，以便回到 CSS 控制
      logoEl.style.removeProperty('background-image');
    }
  }

  // 动态设置 navbar 高度变量
  function updateNavVars() {
    root.style.setProperty('--navbar-height', navbar.offsetHeight + 'px');
    root.style.setProperty('--navbar-compact-height', '60px');
  }
  updateNavVars();
  window.addEventListener('resize', updateNavVars);

  // 计算并写入每个下拉的打开高度
  function initDropdownHeights() {
    dropdownContainers.forEach(c => {
      const h = parseInt(c.dataset.height || root.style.getPropertyValue('--dropdown-default-open-height') || 520, 10);
      c.dataset.openHeight = h;
      const navH = getComputedStyle(document.documentElement).getPropertyValue('--navbar-height') || (navbar.offsetHeight + 'px');
      c.style.height = navH;
    });
  }
  initDropdownHeights();
  window.addEventListener('resize', initDropdownHeights);

  function isAnyDropdownHovered() {
    const nodes = document.querySelectorAll('.yb-has-dropdown, .yb-dropdown-container');
    return Array.from(nodes).some(n => n.matches(':hover'));
  }

  // 滚动处理（50px => scrolled，超过第一屏才 compact）
  function handleNavScroll() {
    const scrollTop = getPageScrollTop();
    const scrollHeight = getPageScrollHeight();
    const scrollPercentage = (scrollTop / (scrollHeight || 1)) * 100;

    if (scrollIndicator) {
      if (scrollPercentage < 25) scrollIndicator.textContent = "滚动位置: 顶部";
      else if (scrollPercentage < 50) scrollIndicator.textContent = "滚动位置: 第一屏";
      else if (scrollPercentage < 75) scrollIndicator.textContent = "滚动位置: 第二屏";
      else scrollIndicator.textContent = "滚动位置: 底部";
    }

    isScrollingDown = scrollTop > lastScrollTop;
    lastScrollTop = scrollTop;
    clearTimeout(scrollTimeout);

    if (!isDropdownOpen) {
      if (scrollTop > window.innerHeight) {
        navbar.classList.add('scrolled');
        navbar.classList.toggle('compact', isScrollingDown);
        // 真实 scrolled 生效时直接强制深色 logo
        forceSetLogoScrolled();
        navbar.classList.remove('scrolled-like-logo');
      } else if (scrollTop > FIRST_SCREEN_TRIGGER_PX) {
        navbar.classList.add('scrolled');
        navbar.classList.remove('compact');
        // 50px 以上也显示深色 logo（但不 compact）
        forceSetLogoScrolled();
        navbar.classList.remove('scrolled-like-logo');
      } else {
        navbar.classList.remove('scrolled');
        navbar.classList.remove('compact');
        navbar.classList.remove('nav-hover');
        navbar.classList.remove('scrolled-like-logo');
        // 恢复 logo 原始样式
        restoreLogoOriginal();
      }
    } else {
      navbar.classList.add('nav-hover');
      navbar.classList.remove('compact');
      navbar.classList.remove('scrolled-like-logo');
      // 下拉打开时我们通常不强制 scrolled logo，恢复为原始（或由下拉的 CSS 决定）
      restoreLogoOriginal();
    }

    scrollTimeout = setTimeout(() => { }, 120);
  }

  let navScrollFrame = 0;
  function scheduleNavScroll() {
    if (navScrollFrame) return;
    navScrollFrame = window.requestAnimationFrame(function () {
      navScrollFrame = 0;
      handleNavScroll();
    });
  }

  window.addEventListener('scroll', scheduleNavScroll, { passive: true });
  document.body.addEventListener('scroll', scheduleNavScroll, { passive: true });
  handleNavScroll();
  syncNavbarByScroll();

  // ---------- 直接操控 logo 的 hover 检测 ----------
  let hoverLogoTimeout = null;

  function applyHoverLogoIfNeeded() {
    if (!navbar) return;
    if (!isDropdownOpen && !navbar.classList.contains('scrolled')) {
      // 只改变 logo（不把 navbar 变成真实 scrolled）
      forceSetLogoScrolled();
      navbar.classList.add('scrolled-like-logo'); // 兼容原来逻辑（可选）
    }
  }
  function removeHoverLogo() {
    clearTimeout(hoverLogoTimeout);
    if (!navbar) return;
    navbar.classList.remove('scrolled-like-logo');
    // 恢复 logo 原始样式（但如果 navbar 确实处于 scrolled 状态则保持 scrolled logo）
    if (navbar.classList.contains('scrolled')) {
      forceSetLogoScrolled();
    } else {
      restoreLogoOriginal();
    }
  }

  // pointerenter / pointerleave
  navbar.addEventListener('pointerenter', () => {
    navbar.classList.add('nav-hover');
    clearTimeout(hoverLogoTimeout);
    hoverLogoTimeout = setTimeout(applyHoverLogoIfNeeded, HOVER_LOGO_DEBOUNCE_MS);
  });
  navbar.addEventListener('pointerleave', () => {
    removeHoverLogo();
    if (!isDropdownOpen) {
      if (getPageScrollTop() <= window.innerHeight) {
        navbar.classList.remove('nav-hover');
      } else {
        navbar.classList.toggle('compact', isScrollingDown);
      }
    }
  });

  // focus 支持
  navbar.addEventListener('focusin', () => {
    navbar.classList.add('nav-hover');
    clearTimeout(hoverLogoTimeout);
    hoverLogoTimeout = setTimeout(applyHoverLogoIfNeeded, HOVER_LOGO_DEBOUNCE_MS);
  });
  navbar.addEventListener('focusout', () => {
    removeHoverLogo();
    navbar.classList.remove('nav-hover');
  });

  // 当下拉打开时，确保临时 logo 被移除
  function ensureRemoveHoverLogoOnDropdownOpen() {
    removeHoverLogo();
  }

  // ---------- 下拉逻辑（open/close/switch） ----------
  function openDropdown(container) {
    if (openContainer === container) return;

    if (openContainer && openContainer !== container) {
      const from = openContainer;
      from.classList.remove('open', 'half-collapse');
      from.setAttribute('aria-hidden', 'true');
      const fromToggle = from.previousElementSibling;
      if (fromToggle) fromToggle.setAttribute('aria-expanded', 'false');

      const to = container;
      const toH = parseInt(to.dataset.openHeight, 10);
      to.classList.add('open');
      to.setAttribute('aria-hidden', 'false');
      to.style.height = toH + 'px';
      const toToggle = to.previousElementSibling;
      if (toToggle) toToggle.setAttribute('aria-expanded', 'true');

      openContainer = to;
      isDropdownOpen = true;
      navbar.classList.add('nav-hover');
      navbar.classList.remove('compact');
      ensureRemoveHoverLogoOnDropdownOpen();
      return;
    }

    // 无其他打开，直接展开
    const h = parseInt(container.dataset.openHeight || 520, 10);
    container.classList.add('open');
    container.setAttribute('aria-hidden', 'false');
    container.style.height = h + 'px';
    const toggle = container.previousElementSibling;
    if (toggle) toggle.setAttribute('aria-expanded', 'true');
    openContainer = container;
    isDropdownOpen = true;
    navbar.classList.add('nav-hover');
    navbar.classList.remove('compact');
    ensureRemoveHoverLogoOnDropdownOpen();
  }

  function closeDropdown(container) {
    container.classList.remove('open', 'half-collapse');
    container.setAttribute('aria-hidden', 'true');
    const toggle = container.previousElementSibling;
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
    const navH = getComputedStyle(document.documentElement).getPropertyValue('--navbar-height') || (navbar.offsetHeight + 'px');
    container.style.height = navH;

    setTimeout(() => {
      if (openContainer === container) openContainer = null;

      if (!isAnyDropdownHovered()) {
        isDropdownOpen = false;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > window.innerHeight) {
          navbar.classList.add('scrolled');
          navbar.classList.toggle('compact', scrollTop > lastScrollTop);
          // 如果处于真实 scrolled，则保持深色 logo
          forceSetLogoScrolled();
          navbar.classList.remove('scrolled-like-logo');
        } else if (scrollTop > FIRST_SCREEN_TRIGGER_PX) {
          navbar.classList.add('scrolled');
          navbar.classList.remove('compact');
          forceSetLogoScrolled();
          navbar.classList.remove('scrolled-like-logo');
        } else {
          navbar.classList.remove('scrolled');
          navbar.classList.remove('compact');
          navbar.classList.remove('nav-hover');
          navbar.classList.remove('scrolled-like-logo');
          // 恢复 logo
          restoreLogoOriginal();
        }
      } else {
        isDropdownOpen = true;
      }
    }, CLEANUP_DELAY_MS);
  }

  function closeAllDropdowns() {
    dropdownContainers.forEach(c => {
      c.classList.remove('open', 'half-collapse');
      c.setAttribute('aria-hidden', 'true');
      const navH = getComputedStyle(document.documentElement).getPropertyValue('--navbar-height') || (navbar.offsetHeight + 'px');
      c.style.height = navH;
    });
    dropdownToggles.forEach(t => t.setAttribute('aria-expanded', 'false'));
    openContainer = null;
    isDropdownOpen = false;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > window.innerHeight) {
      navbar.classList.add('scrolled');
      navbar.classList.toggle('compact', scrollTop > lastScrollTop);
      forceSetLogoScrolled();
      navbar.classList.remove('scrolled-like-logo');
    } else if (scrollTop > FIRST_SCREEN_TRIGGER_PX) {
      navbar.classList.add('scrolled');
      navbar.classList.remove('compact');
      forceSetLogoScrolled();
      navbar.classList.remove('scrolled-like-logo');
    } else {
      navbar.classList.remove('scrolled');
      navbar.classList.remove('compact');
      navbar.classList.remove('nav-hover');
      navbar.classList.remove('scrolled-like-logo');
      restoreLogoOriginal();
    }
  }

  // 绑定桌面下拉交互
  dropdownToggles.forEach(toggle => {
    const container = toggle.nextElementSibling;

    toggle.addEventListener('mouseenter', function () {
      clearTimeout(closeTimeout);
      openDropdown(container);
    });

    toggle.addEventListener('mouseleave', function () {
      closeTimeout = setTimeout(function () {
        if (!container.matches(':hover') && !toggle.matches(':hover')) closeDropdown(container);
      }, CLOSE_DELAY_MS);
    });

    if (toggle.parentElement) {
      toggle.parentElement.addEventListener('mouseleave', function () {
        closeTimeout = setTimeout(function () {
          if (!container.matches(':hover') && !toggle.matches(':hover')) closeDropdown(container);
        }, CLOSE_DELAY_MS);
      });
    }

    container.addEventListener('mouseenter', function () { clearTimeout(closeTimeout); });
    container.addEventListener('mouseleave', function () {
      closeTimeout = setTimeout(function () {
        if (!toggle.matches(':hover') && !container.matches(':hover')) closeDropdown(container);
      }, CLOSE_DELAY_MS);
    });

    toggle.addEventListener('click', function (e) { e.preventDefault(); });
  });

  // 点击页面其他区域关闭
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.yb-has-dropdown')) closeAllDropdowns();
  });

  // 初始化 aria 与高度
  dropdownToggles.forEach(t => t.setAttribute('aria-expanded', 'false'));
  dropdownContainers.forEach(c => {
    c.setAttribute('aria-hidden', 'true');
    const navH = getComputedStyle(document.documentElement).getPropertyValue('--navbar-height') || (navbar.offsetHeight + 'px');
    c.style.height = navH;
  });

  // 小功能：hover 时高亮 active 文案（演示）
  document.querySelectorAll('.yb-banner-nav-links a').forEach(a => {
    a.addEventListener('mouseenter', () => {
      document.querySelectorAll('.yb-banner-nav-links a').forEach(x => x.classList.remove('active'));
      a.classList.add('active');
    });
    a.addEventListener('mouseleave', () => a.classList.remove('active'));
  });

  // 页面加载完成后，如果当前已经在 scrolled 区间（例如刷新时滚动了），确保 logo 与类一致
  (function syncInitialState() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > FIRST_SCREEN_TRIGGER_PX) {
      navbar.classList.add('scrolled');
      if (scrollTop > window.innerHeight && (scrollTop > lastScrollTop)) {
        navbar.classList.add('compact');
      }
      forceSetLogoScrolled();
    } else {
      restoreLogoOriginal();
    }
  })();

  window.__aigcmktTopNavInitialized = true;
});


// 关灯弹窗效果 - 联系我们按钮（移动端：极简全屏展示；桌面端：保留原逻辑）
let savedScrollY = 0;
(function () {
  const triggers = document.querySelectorAll('.trigger-slide');
  const DEFAULT_QR_URL = '/global_geo/homepage/assets/wechat-qr-clean.png';
  const DEFAULT_SUCCESS_URL = './success.html';
  let overlay = document.getElementById('slideOverlay');
  let panel = document.getElementById('slidePanel');
  let frame = document.getElementById('slideFrame');
  let closeBtn = document.getElementById('slideClose');
  let imgEl = document.getElementById('slideImage');
  let activeSuccessUrl = DEFAULT_SUCCESS_URL;

  if (!triggers.length) {
    return;
  }

  if (window.__aigcmktSlideModalInitialized) return;
  window.__aigcmktSlideModalInitialized = true;

  function ensureBaseModalElements() {
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'slideOverlay';
      overlay.className = 'slide-overlay';
      overlay.setAttribute('aria-hidden', 'true');
      document.body.appendChild(overlay);
    }

    if (!panel) {
      panel = document.createElement('div');
      panel.id = 'slidePanel';
      panel.className = 'slide-panel';
      panel.setAttribute('role', 'dialog');
      panel.setAttribute('aria-modal', 'true');
      panel.setAttribute('aria-hidden', 'true');
      document.body.appendChild(panel);
    }

    if (!frame) {
      frame = document.createElement('div');
      frame.id = 'slideFrame';
      frame.className = 'slide-frame';
      panel.appendChild(frame);
    }

    if (!imgEl) {
      imgEl = document.createElement('img');
      imgEl.id = 'slideImage';
      imgEl.src = DEFAULT_QR_URL;
      imgEl.alt = '加搜科技顾问微信二维码';
      frame.appendChild(imgEl);
    }

    if (!closeBtn) {
      closeBtn = document.createElement('button');
      closeBtn.id = 'slideClose';
      closeBtn.className = 'slide-close';
      closeBtn.type = 'button';
      closeBtn.setAttribute('aria-label', '关闭');
      closeBtn.textContent = '✕';
      document.body.appendChild(closeBtn);
    }
  }

  ensureBaseModalElements();

  if (!overlay || !panel || !closeBtn || !imgEl) {
    console.warn('[slide] missing required elements: #slideOverlay/#slidePanel/#slideClose/#slideImage');
    return;
  }

  imgEl.src = DEFAULT_QR_URL;
  imgEl.alt = '加搜营销顾问微信二维码';

  function ensureConversionStylesInjected() {
    if (document.getElementById('slide-conversion-style')) return;
    const css = `
      #slidePanel {
        position: fixed !important;
        top: 50% !important;
        right: 28px !important;
        left: auto !important;
        width: min(420px, calc(100vw - 48px)) !important;
        height: auto !important;
        max-height: calc(100vh - 48px) !important;
        padding: 0 !important;
        background: transparent !important;
        display: flex !important;
        align-items: stretch !important;
        justify-content: center !important;
        transform: translateY(-50%) translateX(calc(100% + 48px)) !important;
        opacity: 0 !important;
        pointer-events: none !important;
        transition: transform 420ms cubic-bezier(.16, .9, .24, 1), opacity 240ms ease !important;
        z-index: 99999 !important;
        overflow: visible !important;
      }

      #slidePanel.open {
        transform: translateY(-50%) translateX(0) !important;
        opacity: 1 !important;
        pointer-events: auto !important;
      }

      #slideConsultCard {
        position: relative;
        width: 100%;
        min-height: min(690px, calc(100vh - 48px));
        max-height: calc(100vh - 48px);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        border: 1px solid rgba(199, 211, 229, 0.82);
        border-radius: 22px;
        background:
          linear-gradient(180deg, rgba(255,255,255,0.98), rgba(249,251,255,0.98)),
          radial-gradient(circle at 16% 0%, rgba(11,91,187,0.12), transparent 38%);
        box-shadow: 0 28px 70px rgba(13, 25, 43, 0.26), 0 10px 24px rgba(13, 25, 43, 0.12);
      }

      .slide-consult-header {
        padding: 32px 64px 24px 28px;
        border-bottom: 1px solid rgba(217, 226, 239, 0.86);
      }

      .slide-consult-eyebrow {
        margin: 0 0 10px;
        color: #0b5bbb;
        font: 800 12px/1 -apple-system, BlinkMacSystemFont, "Inter", "Noto Sans SC", system-ui, sans-serif;
        letter-spacing: .08em;
        text-transform: uppercase;
      }

      .slide-consult-title {
        margin: 0;
        color: #152033;
        font: 800 24px/1.22 -apple-system, BlinkMacSystemFont, "Inter", "Noto Sans SC", system-ui, sans-serif;
        letter-spacing: 0;
      }

      .slide-consult-copy {
        margin: 10px 0 0;
        color: #5f6b7a;
        font: 400 15px/1.7 -apple-system, BlinkMacSystemFont, "Inter", "Noto Sans SC", system-ui, sans-serif;
        letter-spacing: 0;
      }

      .slide-qr-stage {
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 1 1 auto;
        min-height: 0;
        padding: 36px 28px 28px;
        background: linear-gradient(180deg, rgba(247,250,255,0.86), rgba(255,255,255,0.96));
      }

      #slidePanel .slide-frame {
        width: min(312px, 100%) !important;
        height: auto !important;
        aspect-ratio: 1 / 1 !important;
        flex: 0 0 auto !important;
        padding: 14px !important;
        border-radius: 20px !important;
        background: #fff !important;
        box-shadow: 0 14px 36px rgba(20, 36, 58, 0.12), inset 0 0 0 1px rgba(222, 230, 241, 0.92) !important;
        overflow: hidden !important;
        box-sizing: border-box !important;
        transform: none !important;
      }

      #slidePanel.open .slide-frame {
        transform: none !important;
      }

      #slidePanel .slide-frame img {
        display: block !important;
        width: 100% !important;
        height: 100% !important;
        max-width: none !important;
        max-height: none !important;
        object-fit: contain !important;
        object-position: center center !important;
        border-radius: 12px !important;
        box-shadow: none !important;
        transform: none !important;
      }

      .slide-consult-actions {
        padding: 18px 28px 42px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0;
      }

      #slideConfirmAdded {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: auto;
        min-width: 152px;
        height: 42px;
        padding: 0 26px;
        border: 0;
        border-radius: 999px;
        background: #0b5bbb;
        color: #fff;
        font: 700 15px/1 -apple-system, BlinkMacSystemFont, "Inter", "Noto Sans SC", system-ui, sans-serif;
        cursor: pointer;
        box-shadow: 0 10px 22px rgba(11, 91, 187, 0.24);
        transition: transform 160ms ease, background 160ms ease, box-shadow 160ms ease;
      }

      #slideConfirmAdded:hover {
        background: #094a9a;
        box-shadow: 0 12px 26px rgba(11, 91, 187, 0.3);
      }

      #slideConfirmAdded:active {
        transform: translateY(1px);
      }

      #slideConfirmAdded:focus {
        outline: none;
      }

      #slideConfirmAdded:focus-visible {
        outline: 3px solid rgba(11, 91, 187, 0.24);
        outline-offset: 3px;
      }

      #slideClose {
        position: absolute !important;
        top: 18px !important;
        right: 18px !important;
        width: 36px !important;
        height: 36px !important;
        padding: 0 !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        border: 1px solid rgba(211, 221, 235, 0.92) !important;
        border-radius: 10px !important;
        background: rgba(255,255,255,0.86) !important;
        color: #4c596a !important;
        box-shadow: 0 8px 20px rgba(15, 28, 45, 0.12) !important;
        opacity: 1 !important;
        pointer-events: auto !important;
        z-index: 2 !important;
      }

      #slideClose:focus {
        outline: none !important;
      }

      #slideClose:focus-visible {
        outline: 3px solid rgba(11, 91, 187, 0.22) !important;
        outline-offset: 2px !important;
      }

      @media (max-width: 767px) {
        #slidePanel {
          inset: 0 !important;
          width: 100vw !important;
          max-width: none !important;
          height: 100svh !important;
          max-height: none !important;
          padding: 16px !important;
          align-items: center !important;
          justify-content: center !important;
          transform: translateY(24px) !important;
        }

        #slidePanel.mobile-simple {
          transform: translateY(0) !important;
          opacity: 1 !important;
          pointer-events: auto !important;
        }

        #slideConsultCard {
          min-height: auto;
          max-height: calc(100svh - 32px);
          border-radius: 20px;
        }

        .slide-consult-header {
          padding: 24px 62px 16px 22px;
        }

        .slide-consult-title {
          font-size: 22px;
        }

        .slide-consult-copy {
          font-size: 14px;
        }

        .slide-qr-stage {
          padding: 24px 22px 18px;
        }

        #slidePanel .slide-frame {
          width: min(254px, 100%) !important;
          padding: 12px !important;
        }

        .slide-consult-actions {
          padding: 12px 22px 26px;
        }

        #slideConfirmAdded {
          min-width: 148px !important;
          height: 42px !important;
        }
      }
    `.trim();
    const style = document.createElement('style');
    style.id = 'slide-conversion-style';
    style.textContent = css;
    document.head.appendChild(style);
  }

  function createSlideEl(tag, className, text) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text) el.textContent = text;
    return el;
  }

  function ensureConversionLayout() {
    let button = document.getElementById('slideConfirmAdded');
    if (!button) {
      button = document.createElement('button');
      button.id = 'slideConfirmAdded';
      button.type = 'button';
      button.textContent = '我已添加';
      button.setAttribute('aria-label', '我已添加微信');
    }

    let card = document.getElementById('slideConsultCard');
    if (!card) {
      card = createSlideEl('div');
      card.id = 'slideConsultCard';

      const header = createSlideEl('div', 'slide-consult-header');
      const eyebrow = createSlideEl('p', 'slide-consult-eyebrow', 'JIASOU GEO');
      const title = createSlideEl('h2', 'slide-consult-title', '添加加搜营销顾问');
      const copy = createSlideEl('p', 'slide-consult-copy', '添加微信，与顾问交流 GEO 如何赋能企业增长');
      const qrStage = createSlideEl('div', 'slide-qr-stage');
      const actions = createSlideEl('div', 'slide-consult-actions');

      panel.appendChild(card);
      card.appendChild(header);
      header.appendChild(eyebrow);
      header.appendChild(title);
      header.appendChild(copy);
      header.appendChild(closeBtn);
      card.appendChild(qrStage);
      if (frame) qrStage.appendChild(frame);
      card.appendChild(actions);
      actions.appendChild(button);
    }

    return button;
  }

  ensureConversionStylesInjected();
  const confirmBtn = ensureConversionLayout();

  // -------- 工具函数 --------
  function isMobile() {
    return window.matchMedia('(max-width: 767px)').matches;
  }

  function getSuccessUrl(trigger) {
    if (trigger && trigger.dataset && trigger.dataset.successUrl) {
      return trigger.dataset.successUrl;
    }
    return DEFAULT_SUCCESS_URL;
  }

  function trackConfirmAdded() {
    try {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'wechat_added_confirm',
        conversion_path: window.location.pathname,
        destination_url: activeSuccessUrl
      });
    } catch (e) { }

    if (typeof window.gtag === 'function') {
      try {
        window.gtag('event', 'wechat_added_confirm', {
          event_category: 'lead',
          event_label: window.location.pathname,
          transport_type: 'beacon'
        });
      } catch (e) { }
    }
  }

  // 桌面端锁滚方案（保留你的写法）
  let scrollY = 0;
  function lockScroll() {
    scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.overflowX = 'hidden';
  }
  function unlockScroll() {
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.overflowX = '';
    window.scrollTo(0, scrollY);
  }

  // 移动端：极简全屏展示所需的样式（JS 注入一次，避免必须改 CSS）
  function ensureMobileStylesInjected() {
    if (document.getElementById('mobile-simple-slide-style')) return;
    const css = `
      @media (max-width: 767px) {
        #slideOverlay {
          position: fixed !important;
          inset: 0 !important;
          background: rgba(0,0,0,0.72) !important;
          opacity: 0 !important;
          pointer-events: none !important;
          transition: opacity 200ms ease !important;
        }
        #slideOverlay.open { opacity: 1 !important; pointer-events: auto !important; }

        #slidePanel {
          position: fixed !important;
          inset: 0 !important;
          width: 100vw !important;
          height: 100svh !important;
          padding: 16px !important;
          background: transparent !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          transform: translateY(24px) !important;
          opacity: 0 !important;
          pointer-events: none !important;
          overflow: visible !important;
        }

        #slidePanel.mobile-simple { animation: mobileSlideIn 200ms ease-out both !important; pointer-events: auto !important; }
        @keyframes mobileSlideIn {
          from { transform: translateY(24px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }

        #slideClose {
          position: absolute !important;
          top: 18px !important;
          right: 18px !important;
          z-index: 2 !important;
        }
      }
    `.trim();
    const style = document.createElement('style');
    style.id = 'mobile-simple-slide-style';
    style.textContent = css;
    document.head.appendChild(style);
  }

  // -------- 指针事件：保持“按下-松开”逻辑 --------
  let activeTrigger = null;
  let pointerDown = false;
  let lastPointerOpenAt = 0;

  function openFromTrigger(trigger) {
    const url = trigger && trigger.dataset && trigger.dataset.img ? trigger.dataset.img : imgEl.src;
    if (url && url !== imgEl.src) imgEl.src = url;
    activeSuccessUrl = getSuccessUrl(trigger);
    lastPointerOpenAt = Date.now();
    openPanel();
  }

  function onPointerDown(e) {
    activeTrigger = e.currentTarget;
    pointerDown = true;
    activeTrigger.classList.add('pressed');
  }
  function onPointerUp(e) {
    if (!pointerDown) return;
    pointerDown = false;
    if (activeTrigger === e.currentTarget) {
      openFromTrigger(activeTrigger);
    }
    if (activeTrigger) activeTrigger.classList.remove('pressed');
    activeTrigger = null;
  }

  triggers.forEach(btn => {
    btn.addEventListener('mousedown', onPointerDown);
    btn.addEventListener('mouseup', onPointerUp);
    btn.addEventListener('mouseleave', function () {
      pointerDown = false;
      if (activeTrigger) activeTrigger.classList.remove('pressed');
      activeTrigger = null;
    });
    // Touch
    btn.addEventListener('touchstart', function (ev) {
      ev.preventDefault();
      onPointerDown({ currentTarget: btn });
    }, { passive: false });
    btn.addEventListener('touchend', function (ev) {
      ev.preventDefault();
      onPointerUp({ currentTarget: btn });
    });
    btn.addEventListener('click', function (ev) {
      ev.preventDefault();
      if (Date.now() - lastPointerOpenAt < 320) return;
      openFromTrigger(btn);
    });
  });

  // -------- 打开 / 关闭 --------
  function openPanel() {
    const useMobile = isMobile();
    savedScrollY = window.scrollY || window.pageYOffset || 0;
    if (useMobile) ensureMobileStylesInjected();

    // 锁滚（移动端用 overflow hidden 更稳；桌面端用原方案）
    if (useMobile) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    } else {
      lockScroll();
    }

    // Overlay 打开
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');

    if (useMobile) {
      // 移动端：不使用旧 .open 动画，避免 transform 参与布局
      panel.classList.remove('open');
      panel.classList.add('mobile-simple');
      panel.setAttribute('aria-hidden', 'false');

      // 确保图片完整显示（再次兜底，防止其他 CSS 干扰）
      imgEl.style.width = '100%';
      imgEl.style.height = '100%';
      imgEl.style.maxWidth = '';
      imgEl.style.maxHeight = '';
      imgEl.style.objectFit = 'contain';
      imgEl.style.objectPosition = 'center center';

    } else {
      // 桌面端：沿用旧逻辑（open 类带来的滑入）
      panel.classList.add('open');
      panel.setAttribute('aria-hidden', 'false');
      closeBtn.classList.add('open');
    }

  }

  function closePanel() {
    const useMobile = isMobile();

    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');

    if (useMobile) {
      panel.classList.remove('mobile-simple');
      panel.setAttribute('aria-hidden', 'true');

      // 解锁滚动
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      // 立刻恢复到打开前的位置（关键）
      window.scrollTo(0, savedScrollY);
      // 清除我们可能加过的内联兜底样式（不影响下次打开）
      ['width', 'height', 'maxWidth', 'maxHeight', 'objectFit', 'objectPosition', 'transform']
        .forEach(k => (imgEl.style[k] = ''));

    } else {
      panel.classList.remove('open');
      panel.setAttribute('aria-hidden', 'true');
      closeBtn.classList.remove('open');

      // 与桌面端 CSS 过渡同步（你的原注释是 ~420ms）
      setTimeout(() => { unlockScroll(); }, 460);
    }
  }

  overlay.addEventListener('click', closePanel);
  closeBtn.addEventListener('click', closePanel);
  confirmBtn.addEventListener('click', function () {
    trackConfirmAdded();
    window.location.href = activeSuccessUrl || DEFAULT_SUCCESS_URL;
  });

  // 键盘关闭（Esc）
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && panel.getAttribute('aria-hidden') === 'false') {
      closePanel();
    }
  });

  // 视口变化（横竖屏切换/地址栏显隐）时，若面板打开则保持 overflow 锁定
  window.addEventListener('resize', () => {
    if (panel.getAttribute('aria-hidden') === 'false') {
      if (isMobile()) {
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
      }
    }
  });
})();
