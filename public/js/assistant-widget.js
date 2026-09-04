/**
 * ============================================================
 *  ANIK.DEV — PORTFOLIO ASSISTANT (RULE-BASED, NO AI)
 * ============================================================
 *  A lightweight, fully client-side FAQ chatbot. It answers
 *  using simple keyword-matching rules against the page's own
 *  content — no external API, no LLM, nothing sent over the
 *  network. If search-widget.js is loaded first, it reuses its
 *  live content index (window.PortfolioSearch) so answers stay
 *  in sync with the page automatically.
 *
 *  Drop this file next to search-widget.js and include it with:
 *    <script src="assistant-widget.js" defer></script>
 * ============================================================
 */

(function () {
  "use strict";

  /* ------------------------------------------------------------------ */
  /*  1. STYLES                                                          */
  /* ------------------------------------------------------------------ */
  const style = document.createElement("style");
  style.textContent = `
    #assistant-trigger-btn {
      transition: all 0.2s ease;
    }
    #assistant-trigger-btn:active { transform: scale(0.92); }
    #assistant-trigger-dot {
      position: absolute;
      top: -2px;
      right: -2px;
      width: 14px;
      height: 14px;
      background: #FF2A2A;
      border: 2px solid #000;
      border-radius: 50%;
      animation: assistant-pulse 1.8s ease-in-out infinite;
    }
    @keyframes assistant-pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.25); }
    }

    #assistant-panel {
      position: fixed;
      bottom: 96px;
      right: 24px;
      width: 380px;
      max-width: calc(100vw - 32px);
      height: 560px;
      max-height: calc(100vh - 140px);
      background: #FFFDF5;
      border: 4px solid #000;
      box-shadow: 8px 8px 0px 0px #000;
      z-index: 9998;
      display: none;
      flex-direction: column;
      overflow: hidden;
      animation: assistant-pop-in 0.18s ease-out;
    }
    #assistant-panel.open { display: flex; }
    @keyframes assistant-pop-in {
      from { opacity: 0; transform: translateY(16px) scale(0.97); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }

    #assistant-header {
      background: #121212;
      color: #fff;
      padding: 0.85rem 1rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 3px solid #000;
      flex-shrink: 0;
    }
    #assistant-header-left {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      min-width: 0;
    }
    #assistant-avatar {
      width: 34px;
      height: 34px;
      background: #33FF57;
      border: 2px solid #000;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #000;
      font-size: 1.1rem;
      flex-shrink: 0;
    }
    #assistant-header-title {
      font-family: "JetBrains Mono", monospace;
      font-weight: 800;
      font-size: 0.9rem;
      letter-spacing: 0.03em;
      line-height: 1.1;
    }
    #assistant-header-status {
      font-family: "JetBrains Mono", monospace;
      font-size: 0.65rem;
      color: #33FF57;
      display: flex;
      align-items: center;
      gap: 4px;
      margin-top: 2px;
    }
    #assistant-header-status .dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #33FF57;
      animation: assistant-blink 1.6s ease-in-out infinite;
    }
    @keyframes assistant-blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }
    #assistant-close {
      background: #FF2A2A;
      border: 2px solid #000;
      color: #000;
      font-weight: 900;
      width: 26px;
      height: 26px;
      line-height: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      flex-shrink: 0;
    }
    #assistant-close:hover { background: #fff; }

    #assistant-messages {
      flex: 1;
      overflow-y: auto;
      padding: 1rem;
      background:
        linear-gradient(#eee 1px, transparent 1px),
        linear-gradient(90deg, #eee 1px, transparent 1px);
      background-size: 24px 24px;
      background-color: #FFFDF5;
    }
    #assistant-messages::-webkit-scrollbar { width: 8px; }
    #assistant-messages::-webkit-scrollbar-thumb { background: #000; }
    #assistant-messages::-webkit-scrollbar-track { background: #eee; }

    .assistant-msg-row {
      display: flex;
      margin-bottom: 0.7rem;
      animation: assistant-msg-in 0.18s ease-out;
    }
    @keyframes assistant-msg-in {
      from { opacity: 0; transform: translateY(6px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .assistant-msg-row.user { justify-content: flex-end; }
    .assistant-bubble {
      max-width: 82%;
      padding: 0.55rem 0.75rem;
      border: 2px solid #000;
      font-family: "JetBrains Mono", monospace;
      font-size: 0.82rem;
      line-height: 1.45;
      white-space: pre-wrap;
    }
    .assistant-msg-row.bot .assistant-bubble {
      background: #fff;
      box-shadow: 2px 2px 0px 0px #000;
    }
    .assistant-msg-row.user .assistant-bubble {
      background: #FBFF48;
      box-shadow: 2px 2px 0px 0px #000;
    }

    .assistant-chip-row {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
      margin: 0.3rem 0 0.8rem 0;
    }
    .assistant-chip {
      background: #121212;
      color: #33FF57;
      border: 2px solid #000;
      font-family: "JetBrains Mono", monospace;
      font-size: 0.72rem;
      font-weight: 700;
      padding: 0.35rem 0.6rem;
      cursor: pointer;
      transition: all 0.12s ease;
      text-transform: uppercase;
    }
    .assistant-chip:hover {
      background: #FBFF48;
      color: #000;
      transform: translate(-1px, -1px);
      box-shadow: 2px 2px 0px 0px #000;
    }

    .assistant-typing {
      display: inline-flex;
      gap: 3px;
      padding: 0.6rem 0.8rem;
    }
    .assistant-typing span {
      width: 6px;
      height: 6px;
      background: #000;
      border-radius: 50%;
      display: inline-block;
      animation: assistant-type-bounce 1s infinite ease-in-out;
    }
    .assistant-typing span:nth-child(2) { animation-delay: 0.15s; }
    .assistant-typing span:nth-child(3) { animation-delay: 0.3s; }
    @keyframes assistant-type-bounce {
      0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
      30% { transform: translateY(-4px); opacity: 1; }
    }

    #assistant-input-row {
      display: flex;
      gap: 0.5rem;
      padding: 0.75rem;
      border-top: 3px solid #000;
      background: #fff;
      flex-shrink: 0;
    }
    #assistant-input {
      flex: 1;
      border: 2px solid #000;
      padding: 0.55rem 0.7rem;
      font-family: "JetBrains Mono", monospace;
      font-size: 0.85rem;
      font-weight: 600;
      outline: none;
    }
    #assistant-input:focus { background: #FBFF48; }
    #assistant-send {
      background: #121212;
      color: #33FF57;
      border: 2px solid #000;
      width: 42px;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 1.05rem;
    }
    #assistant-send:hover { background: #33FF57; color: #000; }

    @media (max-width: 480px) {
      #assistant-panel {
        right: 16px;
        left: 16px;
        width: auto;
        bottom: 88px;
      }
    }
  `;
  document.head.appendChild(style);

  /* ------------------------------------------------------------------ */
  /*  2. MARKUP — trigger button + chat panel                            */
  /* ------------------------------------------------------------------ */
  function buildUI() {
    const btn = document.createElement("button");
    btn.id = "assistant-trigger-btn";
    btn.setAttribute("aria-label", "Open portfolio assistant");
    btn.title = "Ask the portfolio assistant";
    btn.className =
      "fixed bottom-6 right-6 z-[9998] w-14 h-14 rounded-full bg-neo-green border-4 border-black shadow-hard hover:bg-black hover:text-neo-green transition-all flex items-center justify-center cursor-hover";
    btn.innerHTML = `
      <i class="ri-message-3-fill text-xl"></i>
      <span id="assistant-trigger-dot"></span>
    `;
    document.body.appendChild(btn);

    const panel = document.createElement("div");
    panel.id = "assistant-panel";
    panel.innerHTML = `
      <div id="assistant-header">
        <div id="assistant-header-left">
          <div id="assistant-avatar"><i class="ri-robot-2-line"></i></div>
          <div style="min-width:0;">
            <div id="assistant-header-title">ANIK_BOT</div>
            <div id="assistant-header-status"><span class="dot"></span> ONLINE · RULE-BASED</div>
          </div>
        </div>
        <button id="assistant-close" aria-label="Close assistant">&times;</button>
      </div>
      <div id="assistant-messages"></div>
      <div id="assistant-input-row">
        <input
          id="assistant-input"
          type="text"
          placeholder="Ask about projects, skills, contact..."
          autocomplete="off"
          spellcheck="false"
        />
        <button id="assistant-send" aria-label="Send message"><i class="ri-send-plane-fill"></i></button>
      </div>
    `;
    document.body.appendChild(panel);

    btn.addEventListener("click", toggleAssistant);
    document.getElementById("assistant-close").addEventListener("click", closeAssistant);
    document.getElementById("assistant-send").addEventListener("click", handleSend);

    // Click outside the panel (and outside the trigger button) closes it.
    document.addEventListener("click", (e) => {
      const isOpen = panel.classList.contains("open");
      if (!isOpen) return;
      const clickedInsidePanel = panel.contains(e.target);
      const clickedTrigger = btn.contains(e.target);
      if (!clickedInsidePanel && !clickedTrigger) {
        closeAssistant();
      }
    });
    document.getElementById("assistant-input").addEventListener("keydown", (e) => {
      if (e.key === "Enter") handleSend();
    });
  }

  function toggleAssistant() {
    const panel = document.getElementById("assistant-panel");
    if (panel.classList.contains("open")) {
      closeAssistant();
    } else {
      openAssistant();
    }
  }

  let greeted = false;
  function openAssistant() {
    const panel = document.getElementById("assistant-panel");
    panel.classList.add("open");
    const dot = document.getElementById("assistant-trigger-dot");
    if (dot) dot.remove();
    if (!greeted) {
      greeted = true;
      addBotMessage(
        "Hey, I'm Anik's portfolio assistant \u{1F44B}\nI'm rule-based (no AI) — ask me about projects, skills, experience, blogs, or how to get in touch.",
        defaultChips()
      );
    }
    setTimeout(() => document.getElementById("assistant-input").focus(), 80);
  }

  function closeAssistant() {
    document.getElementById("assistant-panel").classList.remove("open");
  }

  /* ------------------------------------------------------------------ */
  /*  3. MESSAGE RENDERING                                               */
  /* ------------------------------------------------------------------ */
  function scrollToBottom() {
    const box = document.getElementById("assistant-messages");
    box.scrollTop = box.scrollHeight;
  }

  function addUserMessage(text) {
    const box = document.getElementById("assistant-messages");
    const row = document.createElement("div");
    row.className = "assistant-msg-row user";
    row.innerHTML = `<div class="assistant-bubble"></div>`;
    row.querySelector(".assistant-bubble").textContent = text;
    box.appendChild(row);
    scrollToBottom();
  }

  function addBotMessage(text, chips) {
    const box = document.getElementById("assistant-messages");
    const row = document.createElement("div");
    row.className = "assistant-msg-row bot";
    row.innerHTML = `<div class="assistant-bubble"></div>`;
    row.querySelector(".assistant-bubble").textContent = text;
    box.appendChild(row);

    if (chips && chips.length) {
      const chipRow = document.createElement("div");
      chipRow.className = "assistant-chip-row";
      chips.forEach((chip) => {
        const c = document.createElement("button");
        c.className = "assistant-chip";
        c.textContent = chip.label;
        c.addEventListener("click", () => chip.action());
        chipRow.appendChild(c);
      });
      box.appendChild(chipRow);
    }
    scrollToBottom();
  }

  function showTyping() {
    const box = document.getElementById("assistant-messages");
    const row = document.createElement("div");
    row.className = "assistant-msg-row bot";
    row.id = "assistant-typing-row";
    row.innerHTML = `
      <div class="assistant-bubble assistant-typing">
        <span></span><span></span><span></span>
      </div>`;
    box.appendChild(row);
    scrollToBottom();
    return row;
  }

  /* ------------------------------------------------------------------ */
  /*  4. HELPERS — pull live data from the page / search index           */
  /* ------------------------------------------------------------------ */
  function getIndex() {
    if (window.PortfolioSearch && window.PortfolioSearch.getIndex) {
      return window.PortfolioSearch.getIndex();
    }
    return [];
  }

  function jumpTo(item) {
    closeAssistant();
    if (window.PortfolioSearch && window.PortfolioSearch.jumpToResult) {
      window.PortfolioSearch.jumpToResult(item);
    } else if (item && item.sectionId) {
      const el = document.getElementById(item.sectionId);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function scrollToSection(id) {
    closeAssistant();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function itemsBySection(sectionName, limit) {
    return getIndex()
      .filter((i) => i.section === sectionName)
      .slice(0, limit || 8);
  }

  function chipsFromItems(items) {
    return items.map((item) => ({
      label: item.title,
      action: () => jumpTo(item),
    }));
  }

  function defaultChips() {
    return [
      { label: "Projects", action: () => runRule("projects") },
      { label: "Skills", action: () => runRule("skills") },
      { label: "Experience", action: () => runRule("experience") },
      { label: "Contact", action: () => runRule("contact") },
    ];
  }

  function getEmail() {
    const el = document.getElementById("contact-email-link");
    const text = el ? el.textContent.trim() : "";
    return text || "anikchand461@gmail.com";
  }

  function getCvLink() {
    const a = document.querySelector('a[download]');
    return a ? a.getAttribute("href") : null;
  }

  /* ------------------------------------------------------------------ */
  /*  5. RULE ENGINE — pure keyword matching, no AI                      */
  /* ------------------------------------------------------------------ */
  const RULES = [
    {
      id: "greeting",
      test: (q) => /\b(hi|hello|hey|yo|sup|hii+|good\s?(morning|evening|afternoon))\b/.test(q),
      run: () =>
        addBotMessage(
          "Hey there! \u{1F44B} Ask me about projects, skills, experience, blogs, or how to reach Anik.",
          defaultChips()
        ),
    },
    {
      id: "thanks",
      test: (q) => /\b(thanks|thank you|thx|ty)\b/.test(q),
      run: () => addBotMessage("You're welcome! Anything else you'd like to know?", defaultChips()),
    },
    {
      id: "bye",
      test: (q) => /\b(bye|goodbye|see ya|see you|cya)\b/.test(q),
      run: () => addBotMessage("Take care! Feel free to reopen me anytime. \u{1F44B}"),
    },
    {
      id: "help",
      test: (q) => /\b(help|what can you do|commands|options)\b/.test(q),
      run: () =>
        addBotMessage(
          "I can answer questions about:\n• Projects\n• Skills / tech stack\n• Work experience\n• Blogs\n• Contact & hiring\n• Resume / CV\n• GitHub & coding stats\n\nJust type your question, or tap a chip below.",
          defaultChips()
        ),
    },
    {
      id: "about",
      test: (q) => /\b(who (are|is)|about (you|anik)|tell me about|introduce)\b/.test(q),
      run: () => {
        const aboutEl = document.querySelector("#about p");
        const text = aboutEl
          ? aboutEl.textContent.replace(/\s+/g, " ").trim()
          : "Anik is a NeoBrutalist full-stack developer working across ML, backend, and frontend.";
        addBotMessage(text, [{ label: "See About section", action: () => scrollToSection("about") }]);
      },
    },
    {
      id: "skills",
      test: (q) => /\b(skill|tech stack|technolog|language|stack|know|framework|library|libraries)\b/.test(q),
      run: () => {
        const skills = itemsBySection("Tech Stack", 40).map((i) => i.title);
        const text = skills.length
          ? `Anik's tech stack includes:\n${skills.join(", ")}`
          : "Anik works mainly with Python, Java, C++, JavaScript, and ML libraries like scikit-learn, TensorFlow, and PyTorch.";
        addBotMessage(text, [{ label: "See full stack", action: () => scrollToSection("skills") }]);
      },
    },
    {
      id: "projects",
      test: (q) => /\b(project|built|build|made|app|apps|portfolio piece|work)\b/.test(q),
      run: () => {
        const items = itemsBySection("Projects", 6);
        if (items.length) {
          addBotMessage(
            `Here are some of Anik's projects — tap one to jump straight to it:`,
            chipsFromItems(items).concat([
              { label: "See all projects", action: () => scrollToSection("projects") },
            ])
          );
        } else {
          addBotMessage("Anik has built several projects — check the Selected Works section!", [
            { label: "Go to Projects", action: () => scrollToSection("projects") },
          ]);
        }
      },
    },
    {
      id: "experience",
      test: (q) => /\b(experience|job|intern|career|work history|role|worked at|company)\b/.test(q),
      run: () => {
        const items = itemsBySection("Experience", 5);
        if (items.length) {
          addBotMessage(
            "Here's a bit of Anik's experience — tap one for details:",
            chipsFromItems(items).concat([
              { label: "Full timeline", action: () => scrollToSection("experience") },
            ])
          );
        } else {
          addBotMessage("Check out Anik's Experience_Log section for the full timeline!", [
            { label: "Go to Experience", action: () => scrollToSection("experience") },
          ]);
        }
      },
    },
    {
      id: "blogs",
      test: (q) => /\b(blog|article|write|writing|post|dev\.to|hashnode)\b/.test(q),
      run: () => {
        const items = itemsBySection("Blogs", 5);
        if (items.length) {
          addBotMessage(
            "Anik writes technical blog posts — here are a few:",
            chipsFromItems(items).concat([{ label: "See all blogs", action: () => scrollToSection("blogs") }])
          );
        } else {
          addBotMessage("Anik publishes blogs on dev.to and Hashnode.", [
            { label: "Go to Blogs", action: () => scrollToSection("blogs") },
          ]);
        }
      },
    },
    {
      id: "contact",
      test: (q) => /\b(contact|email|hire|reach|connect|collaborate|talk|freelance|work together)\b/.test(q),
      run: () => {
        const email = getEmail();
        addBotMessage(
          `You can reach Anik at ${email}, or use the contact form on this page. Currently available for freelance work and full-time opportunities!`,
          [{ label: "Open contact form", action: () => scrollToSection("contact") }]
        );
      },
    },
    {
      id: "resume",
      test: (q) => /\b(resume|cv|download)\b/.test(q),
      run: () => {
        const link = getCvLink();
        if (link) {
          addBotMessage("Here's Anik's CV — tap below to download it.", [
            {
              label: "Download CV",
              action: () => {
                closeAssistant();
                window.open(link, "_blank");
              },
            },
          ]);
        } else {
          addBotMessage("You can find the Download CV button near the top of the page.", [
            { label: "Scroll to top", action: () => scrollToSection("about") },
          ]);
        }
      },
    },
    {
      id: "location",
      test: (q) => /\b(where|location|based|live|from|city)\b/.test(q),
      run: () => addBotMessage("Anik is based in Kolkata, India \u{1F4CD}", defaultChips()),
    },
    {
      id: "availability",
      test: (q) => /\b(available|availability|open to work|hiring|status)\b/.test(q),
      run: () =>
        addBotMessage("Anik is currently available for freelance work and open to full-time opportunities \u{1F7E2}", [
          { label: "Contact now", action: () => scrollToSection("contact") },
        ]),
    },
    {
      id: "github",
      test: (q) => /\b(github|repo|repository|source code|open source)\b/.test(q),
      run: () =>
        addBotMessage("Anik's GitHub is github.com/anikchand461 — check the Coding Stats section for live stats.", [
          { label: "See Coding Stats", action: () => scrollToSection("coding-stats") },
          {
            label: "Open GitHub",
            action: () => {
              closeAssistant();
              window.open("https://github.com/anikchand461", "_blank");
            },
          },
        ]),
    },
    {
      id: "coding-stats",
      test: (q) => /\b(leetcode|codeforces|competitive programming|coding stats|dsa)\b/.test(q),
      run: () =>
        addBotMessage("Anik's live GitHub & LeetCode stats are on this page — check them out!", [
          { label: "See Coding Stats", action: () => scrollToSection("coding-stats") },
        ]),
    },
  ];

  function runRule(id) {
    const rule = RULES.find((r) => r.id === id);
    const typingRow = showTyping();
    setTimeout(() => {
      typingRow.remove();
      if (rule) rule.run();
    }, 350);
  }

  function handleQuery(raw) {
    const q = raw.toLowerCase().trim();

    const typingRow = showTyping();
    setTimeout(() => {
      typingRow.remove();

      for (const rule of RULES) {
        if (rule.test(q)) {
          rule.run();
          return;
        }
      }

      // Fallback: search the whole page content index for a match.
      if (window.PortfolioSearch && window.PortfolioSearch.runSearch) {
        const results = window.PortfolioSearch.runSearch(raw).slice(0, 5);
        if (results.length) {
          addBotMessage(
            `I found a few things on the page that might match "${raw}":`,
            chipsFromItems(results)
          );
          return;
        }
      }

      addBotMessage(
        "I don't have a rule for that one yet \u{1F914} Try asking about projects, skills, experience, blogs, contact, or resume — or use the search icon (bottom-left) to look through the whole page.",
        defaultChips()
      );
    }, 450);
  }

  function handleSend() {
    const input = document.getElementById("assistant-input");
    const text = input.value.trim();
    if (!text) return;
    addUserMessage(text);
    input.value = "";
    handleQuery(text);
  }

  /* ------------------------------------------------------------------ */
  /*  6. INIT                                                             */
  /* ------------------------------------------------------------------ */
  if (document.readyState === "loading") { document.addEventListener("DOMContentLoaded", buildUI); } else { buildUI(); }
})();