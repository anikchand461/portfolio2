/**
 * ============================================================
 *  ANIK.DEV — SITE SEARCH WIDGET
 * ============================================================
 *  A self-contained, framework-free search system that indexes
 *  everything on the page (about, skills, experience, projects,
 *  blogs, contact) and lets the visitor jump straight to any
 *  result with a one-time "flicker" highlight.
 *
 *  Drop this file anywhere and include it with:
 *    <script src="search-widget.js" defer></script>
 *
 *  It injects its own styles + markup, so no other file needs
 *  to be touched.
 * ============================================================
 */

(function () {
  "use strict";

  /* ------------------------------------------------------------------ */
  /*  1. STYLES                                                          */
  /* ------------------------------------------------------------------ */
  const style = document.createElement("style");
  style.textContent = `
    #search-trigger-btn {
      transition: all 0.2s ease;
    }
    #search-trigger-btn:active { transform: scale(0.92); }

    #site-search-overlay {
      position: fixed;
      inset: 0;
      z-index: 9999;
      background: rgba(0, 0, 0, 0.75);
      backdrop-filter: blur(4px);
      display: none;
      align-items: flex-start;
      justify-content: center;
      padding: 5vh 1rem 2rem;
      overflow-y: auto;
    }
    #site-search-overlay.open { display: flex; }

    #site-search-panel {
      width: 100%;
      max-width: 640px;
      background: #FFFDF5;
      border: 4px solid #000;
      box-shadow: 8px 8px 0px 0px #000;
      animation: search-pop-in 0.18s ease-out;
      max-height: 85vh;
      display: flex;
      flex-direction: column;
    }
    @keyframes search-pop-in {
      from { opacity: 0; transform: translateY(-12px) scale(0.98); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }

    #site-search-input-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem 1.1rem;
      border-bottom: 3px solid #000;
      background: #121212;
      flex-shrink: 0;
    }
    #site-search-input {
      flex: 1;
      background: transparent;
      border: none;
      outline: none;
      color: #FFFDF5;
      font-family: "JetBrains Mono", monospace;
      font-size: 1.05rem;
      font-weight: 700;
    }
    #site-search-input::placeholder { color: #888; }
    #site-search-close {
      background: #FF2A2A;
      border: 2px solid #000;
      color: #000;
      font-weight: 900;
      width: 28px;
      height: 28px;
      line-height: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      flex-shrink: 0;
    }
    #site-search-close:hover { background: #fff; }

    #site-search-results {
      overflow-y: auto;
      padding: 0.5rem;
    }
    #site-search-results::-webkit-scrollbar { width: 8px; }
    #site-search-results::-webkit-scrollbar-thumb { background: #000; }
    #site-search-results::-webkit-scrollbar-track { background: #eee; }

    .search-section-label {
      font-family: "JetBrains Mono", monospace;
      font-size: 0.7rem;
      font-weight: 800;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: #FF70A6;
      background: #121212;
      display: inline-block;
      padding: 2px 8px;
      margin: 0.85rem 0 0.4rem 0.4rem;
    }

    .search-result-item {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      width: 100%;
      text-align: left;
      background: #fff;
      border: 2px solid #000;
      padding: 0.65rem 0.8rem;
      margin-bottom: 0.5rem;
      cursor: pointer;
      font-family: "JetBrains Mono", monospace;
      transition: background 0.12s ease, transform 0.1s ease;
    }
    .search-result-item:hover,
    .search-result-item.kb-active {
      background: #FBFF48;
      transform: translate(-2px, -2px);
      box-shadow: 3px 3px 0px 0px #000;
    }
    .search-result-icon {
      flex-shrink: 0;
      width: 30px;
      height: 30px;
      background: #121212;
      color: #33FF57;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid #000;
      font-size: 0.95rem;
    }
    .search-result-title {
      font-weight: 800;
      font-size: 0.92rem;
      color: #121212;
      text-transform: uppercase;
      margin-bottom: 2px;
    }
    .search-result-snippet {
      font-size: 0.78rem;
      color: #555;
      line-height: 1.3;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .search-result-snippet mark,
    .search-result-title mark {
      background: #FBFF48;
      color: #121212;
      padding: 0 1px;
    }

    #site-search-empty,
    #site-search-hint {
      font-family: "JetBrains Mono", monospace;
      text-align: center;
      color: #888;
      padding: 2.5rem 1rem;
      font-size: 0.85rem;
      font-weight: 700;
    }

    #site-search-footer {
      border-top: 3px solid #000;
      background: #121212;
      color: #888;
      font-family: "JetBrains Mono", monospace;
      font-size: 0.65rem;
      padding: 0.5rem 1rem;
      display: flex;
      justify-content: space-between;
      flex-shrink: 0;
      letter-spacing: 0.05em;
    }
    #site-search-footer kbd {
      background: #333;
      color: #fff;
      border: 1px solid #555;
      border-radius: 2px;
      padding: 1px 5px;
      font-size: 0.65rem;
      margin: 0 2px;
    }

    /* ---- One-time flicker highlight on jump target ---- */
    @keyframes search-flicker {
      0%   { box-shadow: 0 0 0 4px rgba(251,255,72,0); }
      10%  { box-shadow: 0 0 0 4px rgba(251,255,72,1); }
      20%  { box-shadow: 0 0 0 4px rgba(251,255,72,0); }
      30%  { box-shadow: 0 0 0 4px rgba(251,255,72,1); }
      40%  { box-shadow: 0 0 0 4px rgba(251,255,72,0); }
      55%  { box-shadow: 0 0 0 4px rgba(251,255,72,1); }
      100% { box-shadow: 0 0 0 4px rgba(251,255,72,0); }
    }
    .search-flicker-target {
      animation: search-flicker 1.1s ease-in-out;
      position: relative;
      z-index: 5;
    }
  `;
  document.head.appendChild(style);

  /* ------------------------------------------------------------------ */
  /*  2. MARKUP — trigger button + modal                                 */
  /* ------------------------------------------------------------------ */

  // Search trigger button — floating, bottom-left corner.
  function injectTriggerButton() {
    const btn = document.createElement("button");
    btn.id = "search-trigger-btn";
    btn.setAttribute("aria-label", "Search this site");
    btn.title = "Search (Ctrl+K)";
    btn.innerHTML = '<i class="ri-search-line text-xl"></i>';
    btn.className =
      "fixed bottom-6 left-6 z-[9998] w-14 h-14 rounded-full bg-neo-yellow border-4 border-black shadow-hard hover:bg-black hover:text-white transition-all flex items-center justify-center cursor-hover";
    document.body.appendChild(btn);
    btn.addEventListener("click", openSearch);
  }

  // Modal overlay
  const overlay = document.createElement("div");
  overlay.id = "site-search-overlay";
  overlay.innerHTML = `
    <div id="site-search-panel" role="dialog" aria-modal="true" aria-label="Site search">
      <div id="site-search-input-row">
        <i class="ri-search-line text-white text-xl"></i>
        <input
          id="site-search-input"
          type="text"
          placeholder="Search projects, blogs, skills, experience..."
          autocomplete="off"
          spellcheck="false"
        />
        <button id="site-search-close" aria-label="Close search">&times;</button>
      </div>
      <div id="site-search-results">
        <div id="site-search-hint">
          Start typing to search the entire page —<br />
          projects, blogs, skills, experience &amp; more.
        </div>
      </div>
      <div id="site-search-footer">
        <span><kbd>Esc</kbd> to close</span>
        <span><kbd>Ctrl</kbd>+<kbd>K</kbd> to open</span>
      </div>
    </div>
  `;
  document.addEventListener("DOMContentLoaded", () => {
    document.body.appendChild(overlay);
    injectTriggerButton();
  });

  const resultsEl = () => document.getElementById("site-search-results");
  const inputEl = () => document.getElementById("site-search-input");

  /* ------------------------------------------------------------------ */
  /*  3. INDEX BUILDER — scans the live DOM                              */
  /* ------------------------------------------------------------------ */
  let searchIndex = null;

  function buildIndex() {
    const index = [];

    // ---- About ----
    document.querySelectorAll("#about p").forEach((p) => {
      const text = p.textContent.replace(/\s+/g, " ").trim();
      if (text.length > 5) {
        index.push({
          section: "About",
          icon: "ri-user-3-line",
          title: "Who am I?",
          snippet: text,
          el: p.closest("section") || p,
          sectionId: "about",
        });
      }
    });

    // ---- Skills ----
    document.querySelectorAll(".skills-grid-cell").forEach((cell) => {
      const name = cell.querySelector(".skill-name");
      const cat = cell.querySelector("div");
      if (name) {
        index.push({
          section: "Tech Stack",
          icon: "ri-terminal-box-line",
          title: name.textContent.trim(),
          snippet: cat ? cat.textContent.trim() : "",
          el: cell,
          sectionId: "skills",
        });
      }
    });

    // ---- Experience ----
    document.querySelectorAll("#experience .timeline-entry").forEach((entry) => {
      const role = entry.querySelector("h3");
      const company = entry.querySelector("p");
      const bullets = Array.from(entry.querySelectorAll("li"))
        .map((li) => li.textContent.trim())
        .join(" ");
      index.push({
        section: "Experience",
        icon: "ri-briefcase-4-line",
        title: role ? role.textContent.trim() : "Experience",
        snippet: (company ? company.textContent.trim() + " — " : "") + bullets,
        el: entry,
        sectionId: "experience",
        revealClass: "extra-experience",
      });
    });

    // ---- Projects ----
    document.querySelectorAll("#projects article").forEach((article) => {
      const title = article.querySelector("h3");
      const desc = article.querySelector("p");
      const tags = Array.from(article.querySelectorAll("span"))
        .map((s) => s.textContent.trim())
        .join(" ");
      index.push({
        section: "Projects",
        icon: "ri-folder-3-line",
        title: title ? title.textContent.trim() : "Project",
        snippet: (desc ? desc.textContent.trim() : "") + " " + tags,
        el: article,
        sectionId: "projects",
        revealClass: "extra-project",
      });
    });

    // ---- Blogs (skip cloned marquee duplicates) ----
    document
      .querySelectorAll('#blog-track > a.blog-card:not([aria-hidden="true"])')
      .forEach((card) => {
        const title = card.querySelector("h3");
        const desc = card.querySelector("p");
        index.push({
          section: "Blogs",
          icon: "ri-article-line",
          title: title ? title.textContent.trim() : "Blog post",
          snippet: desc ? desc.textContent.trim() : "",
          el: card,
          sectionId: "blogs",
        });
      });

    // ---- Coding stats / handles ----
    const codingStats = document.getElementById("coding-stats");
    if (codingStats) {
      index.push({
        section: "Coding Stats",
        icon: "ri-bar-chart-2-line",
        title: "GitHub & LeetCode Stats",
        snippet: "Live GitHub contributions, repos, followers, LeetCode stats.",
        el: codingStats,
        sectionId: "coding-stats",
      });
    }

    // ---- Contact ----
    const contact = document.getElementById("contact");
    if (contact) {
      index.push({
        section: "Contact",
        icon: "ri-mail-line",
        title: "Let's Talk Code",
        snippet: "Contact form, email, location — Kolkata, India.",
        el: contact,
        sectionId: "contact",
      });
    }

    return index;
  }

  function getIndex() {
    if (!searchIndex) searchIndex = buildIndex();
    return searchIndex;
  }

  /* ------------------------------------------------------------------ */
  /*  4. SEARCH / MATCH / SCORE                                          */
  /* ------------------------------------------------------------------ */
  function runSearch(query) {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const words = q.split(/\s+/).filter(Boolean);
    const results = [];

    getIndex().forEach((item) => {
      const title = (item.title || "").toLowerCase();
      const snippet = (item.snippet || "").toLowerCase();
      const haystack = title + " " + snippet + " " + item.section.toLowerCase();

      let score = 0;
      let matchedAll = true;
      words.forEach((w) => {
        if (title.includes(w)) score += 3;
        else if (snippet.includes(w)) score += 1;
        else if (item.section.toLowerCase().includes(w)) score += 1;
        else matchedAll = false;
      });

      if (matchedAll) {
        if (title.startsWith(q)) score += 5;
        results.push(Object.assign({ score }, item));
      }
    });

    results.sort((a, b) => b.score - a.score);
    return results.slice(0, 30);
  }

  function highlight(text, words) {
    if (!text) return "";
    let safe = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    words.forEach((w) => {
      if (!w) return;
      const esc = w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      safe = safe.replace(new RegExp("(" + esc + ")", "ig"), "<mark>$1</mark>");
    });
    return safe;
  }

  /* ------------------------------------------------------------------ */
  /*  5. RENDER RESULTS                                                   */
  /* ------------------------------------------------------------------ */
  let currentResults = [];
  let activeIndex = -1;

  function renderResults(query) {
    const container = resultsEl();
    const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    currentResults = runSearch(query);
    activeIndex = -1;

    if (!query.trim()) {
      container.innerHTML = `
        <div id="site-search-hint">
          Start typing to search the entire page —<br />
          projects, blogs, skills, experience &amp; more.
        </div>`;
      return;
    }

    if (currentResults.length === 0) {
      container.innerHTML = `
        <div id="site-search-empty">
          No results for "<span style="color:#121212">${query.replace(
            /</g,
            "&lt;"
          )}</span>"<br />Try a different keyword.
        </div>`;
      return;
    }

    // Group by section, preserving score order within each group,
    // and order groups by best score first.
    const groups = {};
    const groupOrder = [];
    currentResults.forEach((r) => {
      if (!groups[r.section]) {
        groups[r.section] = [];
        groupOrder.push(r.section);
      }
      groups[r.section].push(r);
    });

    let html = "";
    let flatIndex = 0;
    groupOrder.forEach((section) => {
      html += `<div class="search-section-label">${section}</div>`;
      groups[section].forEach((r) => {
        html += `
          <div class="search-result-item" data-idx="${flatIndex}">
            <div class="search-result-icon"><i class="${r.icon}"></i></div>
            <div style="min-width:0;">
              <div class="search-result-title">${highlight(r.title, words)}</div>
              <div class="search-result-snippet">${highlight(r.snippet, words)}</div>
            </div>
          </div>`;
        flatIndex++;
      });
    });

    container.innerHTML = html;

    container.querySelectorAll(".search-result-item").forEach((node) => {
      node.addEventListener("click", () => {
        const idx = parseInt(node.getAttribute("data-idx"), 10);
        jumpToResult(currentResults[idx]);
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /*  6. JUMP TO RESULT + ONE-TIME FLICKER                                */
  /* ------------------------------------------------------------------ */
  function jumpToResult(item) {
    if (!item || !item.el) return;
    closeSearch();

    // If the target lives inside a "Show More" collapsed group
    // (experience / projects), reveal it first via the existing
    // toggle buttons already on the page.
    if (item.revealClass && item.el.classList.contains("hidden")) {
      const btn =
        item.revealClass === "extra-experience"
          ? document.getElementById("experience-toggle-btn")
          : document.getElementById("projects-toggle-btn");
      if (btn) btn.click();
    }

    setTimeout(() => {
      item.el.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => {
        item.el.classList.add("search-flicker-target");
        item.el.addEventListener(
          "animationend",
          () => item.el.classList.remove("search-flicker-target"),
          { once: true }
        );
      }, 400);
    }, 60);
  }

  /* ------------------------------------------------------------------ */
  /*  7. OPEN / CLOSE + KEYBOARD                                         */
  /* ------------------------------------------------------------------ */
  function openSearch() {
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
    renderResults("");
    setTimeout(() => inputEl().focus(), 50);
  }

  function closeSearch() {
    overlay.classList.remove("open");
    document.body.style.overflow = "";
    inputEl().value = "";
  }

  function moveActive(delta) {
    const items = Array.from(document.querySelectorAll(".search-result-item"));
    if (!items.length) return;
    activeIndex = (activeIndex + delta + items.length) % items.length;
    items.forEach((n) => n.classList.remove("kb-active"));
    items[activeIndex].classList.add("kb-active");
    items[activeIndex].scrollIntoView({ block: "nearest" });
  }

  document.addEventListener("keydown", (e) => {
    const isOpen = overlay.classList.contains("open");

    // Open with Ctrl/Cmd+K
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      isOpen ? closeSearch() : openSearch();
      return;
    }

    if (!isOpen) return;

    if (e.key === "Escape") {
      closeSearch();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      moveActive(1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      moveActive(-1);
    } else if (e.key === "Enter") {
      if (activeIndex >= 0 && currentResults[activeIndex]) {
        jumpToResult(currentResults[activeIndex]);
      } else if (currentResults.length > 0) {
        jumpToResult(currentResults[0]);
      }
    }
  });

  document.addEventListener("DOMContentLoaded", () => {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeSearch();
    });
    document.getElementById("site-search-close").addEventListener("click", closeSearch);
    inputEl().addEventListener("input", (e) => renderResults(e.target.value));
  });

  /* ------------------------------------------------------------------ */
  /*  8. PUBLIC API — so other widgets (e.g. the portfolio assistant)     */
  /*     can reuse the same content index & jump-with-flicker logic       */
  /*     instead of re-scanning the page.                                 */
  /* ------------------------------------------------------------------ */
  window.PortfolioSearch = {
    getIndex: getIndex,
    runSearch: runSearch,
    jumpToResult: jumpToResult,
    open: openSearch,
    close: closeSearch,
  };
})();