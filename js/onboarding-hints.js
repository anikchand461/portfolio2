/**
 * ============================================================
 *  ANIK.DEV — FIRST-LOAD ONBOARDING HINTS
 * ============================================================
 *  Two little callouts that flicker on 2–3 times when the page
 *  first opens, pointing a hand-drawn curved arrow at:
 *    - the search trigger  (bottom-left)  → "SEARCH ON THE PAGE — CTRL+K"
 *    - the assistant trigger (bottom-right) → "CHAT WITH PORTFOLIO"
 *  After a few seconds they fade out and remove themselves.
 *  Purely decorative — never blocks clicks (pointer-events: none)
 *  and never touches the buttons it points at.
 *
 *  Include AFTER search-widget.js and assistant-widget.js:
 *    <script src="onboarding-hints.js" defer></script>
 * ============================================================
 */

(function () {
  "use strict";

  /* ------------------------------------------------------------------ */
  /*  1. STYLES                                                          */
  /* ------------------------------------------------------------------ */
  const style = document.createElement("style");
  style.textContent = `
    .onboard-hint {
      position: fixed;
      z-index: 9997;
      display: flex;
      flex-direction: column;
      pointer-events: none;
      opacity: 0;
      animation: onboard-hint-life 3.5s ease-in-out forwards;
    }
    .onboard-hint-left  { left: 104px;  bottom: 62px; align-items: flex-start; }
    .onboard-hint-right { right: 104px; bottom: 62px; align-items: flex-end; }

    /* Two flickers, then a short hold, then fade out for good. */
    @keyframes onboard-hint-life {
      0%   { opacity: 0; transform: translateY(4px); }
      10%  { opacity: 1; transform: translateY(0); }
      24%  { opacity: 0; }
      40%  { opacity: 1; }
      75%  { opacity: 1; }
      100% { opacity: 0; transform: translateY(4px); }
    }

    .onboard-bubble {
      font-family: "JetBrains Mono", monospace;
      font-weight: 800;
      font-size: 0.88rem;
      letter-spacing: 0.03em;
      text-transform: uppercase;
      line-height: 1.4;
      color: #121212;
      border: 3px solid #000;
      box-shadow: 5px 5px 0px 0px #000;
      padding: 0.65rem 0.95rem;
      max-width: 220px;
      white-space: normal;
    }
    .onboard-hint-left .onboard-bubble  { background: #FBFF48; text-align: left; }
    .onboard-hint-right .onboard-bubble { background: #33FF57; text-align: right; }
    .onboard-bubble kbd {
      background: #121212;
      color: #fff;
      border-radius: 2px;
      padding: 2px 7px;
      font-size: 0.82rem;
      margin: 0 1px;
      display: inline-block;
    }

    .onboard-arrow { display: block; overflow: visible; }
    .onboard-arrow-curve {
      stroke-dasharray: 150;
      stroke-dashoffset: 150;
      animation: onboard-draw 1s 0.15s ease-out forwards;
    }
    .onboard-arrow-head {
      opacity: 0;
      animation: onboard-fade-in 0.25s 1s ease-out forwards;
    }
    @keyframes onboard-draw {
      to { stroke-dashoffset: 0; }
    }
    @keyframes onboard-fade-in {
      to { opacity: 1; }
    }

    @media (max-width: 640px) {
      .onboard-hint-left  { left: 76px; }
      .onboard-hint-right { right: 76px; }
    }
    @media (max-width: 480px) {
      .onboard-bubble { font-size: 0.72rem; max-width: 168px; padding: 0.55rem 0.75rem; }
      .onboard-bubble kbd { font-size: 0.68rem; }
      .onboard-hint-left,
      .onboard-hint-right { bottom: 56px; }
      .onboard-hint-left  { left: 62px; }
      .onboard-hint-right { right: 62px; }
    }
    @media (max-width: 360px) {
      .onboard-hint { display: none; }
    }
  `;
  document.head.appendChild(style);

  /* ------------------------------------------------------------------ */
  /*  2. MARKUP                                                          */
  /* ------------------------------------------------------------------ */
  function buildHints() {
    // Curved "spring" arrow, tip bottom-left, pointing down toward the
    // search button that sits just below-left of the callout.
    const leftHint = document.createElement("div");
    leftHint.className = "onboard-hint onboard-hint-left";
    leftHint.innerHTML = `
      <div class="onboard-bubble">Search on the page<br><kbd>Ctrl</kbd>+<kbd>K</kbd></div>
      <svg class="onboard-arrow" width="92" height="108" viewBox="0 0 66 78" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path class="onboard-arrow-curve" d="M56 6 C 20 2, 4 34, 30 42 C 52 48, 40 66, 14 70" stroke="#000" stroke-width="4" stroke-linecap="round" fill="none"/>
        <path class="onboard-arrow-head" d="M14 70 L26 63 M14 70 L21 81" stroke="#000" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      </svg>
    `;

    // Mirrored curve, tip bottom-right, pointing down toward the chat button.
    const rightHint = document.createElement("div");
    rightHint.className = "onboard-hint onboard-hint-right";
    rightHint.innerHTML = `
      <div class="onboard-bubble">Chat with portfolio</div>
      <svg class="onboard-arrow" width="92" height="108" viewBox="0 0 66 78" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path class="onboard-arrow-curve" d="M10 6 C 46 2, 62 34, 36 42 C 14 48, 26 66, 52 70" stroke="#000" stroke-width="4" stroke-linecap="round" fill="none"/>
        <path class="onboard-arrow-head" d="M52 70 L40 63 M52 70 L45 81" stroke="#000" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      </svg>
    `;

    document.body.appendChild(leftHint);
    document.body.appendChild(rightHint);

    // Fully remove from the DOM once the fade-out finishes so they
    // never linger (and never intercept clicks even by accident).
    // animationend bubbles up from the child arrow's own animations too,
    // so only react to the container's own life-cycle animation ending.
    [leftHint, rightHint].forEach((hint) => {
      hint.addEventListener("animationend", (e) => {
        if (e.target === hint && e.animationName === "onboard-hint-life") {
          hint.remove();
        }
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /*  3. INIT — wait until both trigger buttons actually exist           */
  /* ------------------------------------------------------------------ */
  function init() {
    let tries = 0;
    const check = setInterval(() => {
      tries++;
      const searchBtn = document.getElementById("search-trigger-btn");
      const chatBtn = document.getElementById("assistant-trigger-btn");
      if (searchBtn && chatBtn) {
        clearInterval(check);
        buildHints();
      } else if (tries > 40) {
        // Buttons never showed up (widget missing) — bail out quietly.
        clearInterval(check);
      }
    }, 100);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();