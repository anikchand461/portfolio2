"use client";

import { useEffect } from "react";
import Script from "next/script";

export default function Home() {
  function toggleMobileMenu() {
    const menu = document.getElementById("mobile-menu");
    const open = menu.classList.contains("open");
    if (open) {
      menu.classList.remove("open");
      document.body.style.overflow = "";
    } else {
      menu.classList.add("open");
      document.body.style.overflow = "hidden";
    }
  }

  function closeMobileMenu() {
    document.getElementById("mobile-menu").classList.remove("open");
    document.body.style.overflow = "";
  }

  function toggleExperience(btn) {
    const items = document.querySelectorAll(".extra-experience");
    const isHidden = items.length > 0 && items[0].classList.contains("hidden");
    items.forEach((el) => {
      el.classList.toggle("hidden", !isHidden);
    });
    btn.textContent = isHidden ? "SHOW LESS \u25B2" : "SHOW MORE \u25BC";
    if (!isHidden) {
      document
        .getElementById("experience")
        .scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function toggleProjects(btn) {
    const items = document.querySelectorAll(".extra-project");
    const isHidden = items.length > 0 && items[0].classList.contains("hidden");
    items.forEach((el) => {
      el.classList.toggle("hidden", !isHidden);
    });
    btn.textContent = isHidden ? "SHOW LESS \u25B2" : "SHOW MORE \u25BC";
    if (!isHidden) {
      document
        .getElementById("projects")
        .scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  useEffect(() => {
    // Blog marquee: duplicate cards for seamless infinite loop
    const track = document.getElementById("blog-track");
    if (track && !track.dataset.cloned) {
      const cards = Array.from(track.children);
      cards.forEach((card) => {
        const clone = card.cloneNode(true);
        clone.setAttribute("aria-hidden", "true");
        track.appendChild(clone);
      });
      track.dataset.cloned = "true";
    }

    // Email link assembled in JS so it can't be scraped as plain text
    (function () {
      const u = "anikchand461";
      const d = "gmail" + ".com";
      const el = document.getElementById("contact-email-link");
      if (el) {
        el.setAttribute("href", ["mai", "lto:", u, "@", d].join(""));
        el.textContent = u + "@" + d;
      }
    })();

    // Escape key closes mobile menu
    function onKeyDown(e) {
      if (e.key === "Escape") closeMobileMenu();
    }
    document.addEventListener("keydown", onKeyDown);

    // Custom cursor (desktop only)
    const cursor = document.getElementById("cursor");
    function onMouseMove(e) {
      if (!cursor) return;
      cursor.style.left = e.clientX + "px";
      cursor.style.top = e.clientY + "px";
    }
    document.addEventListener("mousemove", onMouseMove);

    const hoverEls = document.querySelectorAll(
      ".cursor-hover,a,button,input,textarea",
    );
    function onEnter() {
      if (!cursor) return;
      cursor.style.width = "60px";
      cursor.style.height = "60px";
      cursor.style.backgroundColor = "#FBFF48";
      cursor.style.mixBlendMode = "normal";
      cursor.style.border = "2px solid black";
    }
    function onLeave() {
      if (!cursor) return;
      cursor.style.width = "24px";
      cursor.style.height = "24px";
      cursor.style.backgroundColor = "#fff";
      cursor.style.mixBlendMode = "difference";
      cursor.style.border = "none";
    }
    hoverEls.forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    // GitHub API stats
    async function fetchGitHubStats() {
      try {
        const res = await fetch("https://api.github.com/users/anikchand461", {
          headers: { Accept: "application/vnd.github.v3+json" },
        });
        if (!res.ok) throw new Error("HTTP " + res.status);
        const data = await res.json();
        document.getElementById("repos-count").textContent =
          data.public_repos || "0";
        document.getElementById("followers-count").textContent =
          data.followers || "0";
        if (data.created_at) {
          const d = new Date(data.created_at);
          document.getElementById("created-at").textContent =
            d.toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
            });
        }
        const v = data.public_repos * 20 + data.followers * 5 + "+";
        const h = document.getElementById("total-contributions");
        const g = document.getElementById("total-contributions-grid");
        if (h) h.textContent = v;
        if (g) g.textContent = v;
      } catch (err) {
        [
          "repos-count",
          "followers-count",
          "created-at",
          "total-contributions",
          "total-contributions-grid",
        ].forEach((id) => {
          const el = document.getElementById(id);
          if (el) el.textContent = "ERR";
        });
      }
    }
    fetchGitHubStats();

    // Scroll reveal animations
    const revealObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("active");
        });
      },
      { threshold: 0.1 },
    );
    document.querySelectorAll(".reveal").forEach((el) => {
      revealObs.observe(el);
    });

    // Scroll progress bar
    function onScroll() {
      const s = document.body.scrollTop || document.documentElement.scrollTop;
      const h =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const bar = document.getElementById("progressBar");
      if (bar) bar.style.width = (s / h) * 100 + "%";
    }
    window.addEventListener("scroll", onScroll);

    // Contact form submission
    const form = document.getElementById("contact-form");
    let onSubmit;
    if (form) {
      onSubmit = async function (e) {
        e.preventDefault();
        try {
          await fetch(form.action, {
            method: "POST",
            mode: "no-cors",
            body: new FormData(form),
          });
          const toast = document.getElementById("success-toast");
          toast.classList.remove("opacity-0");
          toast.classList.add("opacity-100");
          form.reset();
          setTimeout(() => {
            toast.classList.remove("opacity-100");
            toast.classList.add("opacity-0");
          }, 4000);
        } catch (err) {
          alert("Error: " + err.message + "\n\nPlease email directly.");
        }
      };
      form.addEventListener("submit", onSubmit);
    }

    // Force Codeforces stats image to reload fresh on every visit
    const cfImg = document.getElementById("cf-stats-img");
    if (cfImg) {
      cfImg.src = cfImg.src.replace("&t=1", "&t=" + Date.now());
    }

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousemove", onMouseMove);
      hoverEls.forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });
      window.removeEventListener("scroll", onScroll);
      if (form && onSubmit) form.removeEventListener("submit", onSubmit);
    };
  }, []);

  return (
    <>
<div
      id="cursor"
      className="w-6 h-6 bg-white rounded-full border-2 border-black hidden lg:block"
    ></div>
    <div
      className="fixed top-0 left-0 h-2 bg-neo-green z-[60] border-b-2 border-black"
      id="progressBar"
      style={{ width: '0%' }}
    ></div>

    {/* MOBILE MENU */}
    <div
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
    >
      <a
        href="#"
        className="text-white text-3xl font-black font-mono hover:text-neo-yellow transition-colors"
        onClick={closeMobileMenu}
        >/HOME</a
      >
      <a
        href="#about"
        className="text-white text-3xl font-black font-mono hover:text-neo-yellow transition-colors"
        onClick={closeMobileMenu}
        >/ABOUT</a
      >
      <a
        href="#skills"
        className="text-white text-3xl font-black font-mono hover:text-neo-yellow transition-colors"
        onClick={closeMobileMenu}
        >/SKILLS</a
      >
      <a
        href="#experience"
        className="text-white text-3xl font-black font-mono hover:text-neo-yellow transition-colors"
        onClick={closeMobileMenu}
        >/LOGS</a
      >
      <a
        href="#projects"
        className="text-white text-3xl font-black font-mono hover:text-neo-yellow transition-colors"
        onClick={closeMobileMenu}
        >/WORK</a
      >
      <a
        href="#contact"
        className="bg-neo-yellow text-black border-2 border-white px-8 py-3 text-2xl font-black font-mono hover:bg-neo-pink transition-colors"
        onClick={closeMobileMenu}
        >HIRE ME</a
      >
      <button
        onClick={closeMobileMenu}
        className="absolute top-6 right-6 text-white text-4xl font-black"
        aria-label="Close menu"
      >
        &times;
      </button>
    </div>

    {/* NAVBAR */}
    <nav className="fixed top-0 w-full z-50 px-4 py-4 pointer-events-none">
      <div
        className="max-w-7xl mx-auto flex justify-between items-center pointer-events-auto"
      >
        <a
          href="#"
          className="bg-neo-white border-2 border-black px-4 py-1 text-2xl font-black shadow-hard hover:bg-neo-yellow transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none cursor-hover"
          >ANIK.</a
        >
        <div
          className="hidden md:flex gap-4 bg-white border-2 border-black p-2 shadow-hard"
        >
          <a
            href="#about"
            className="px-3 py-1 font-mono font-bold text-sm hover:bg-black hover:text-white transition-colors cursor-hover"
            >/ABOUT</a
          >
          <a
            href="#skills"
            className="px-3 py-1 font-mono font-bold text-sm hover:bg-black hover:text-white transition-colors cursor-hover"
            >/SKILLS</a
          >
          <a
            href="#experience"
            className="px-3 py-1 font-mono font-bold text-sm hover:bg-black hover:text-white transition-colors cursor-hover"
            >/LOGS</a
          >
          <a
            href="#projects"
            className="px-3 py-1 font-mono font-bold text-sm hover:bg-black hover:text-white transition-colors cursor-hover"
            >/WORK</a
          >
          <a
            href="#contact"
            className="px-3 py-1 font-mono font-bold text-sm bg-neo-yellow border border-black hover:bg-neo-pink transition-colors cursor-hover"
            >HIRE ME</a
          >
        </div>
        <button
          id="hamburger"
          className="md:hidden flex flex-col gap-1.5 bg-neo-white border-2 border-black p-3 shadow-hard"
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation menu"
        >
          <span className="w-6 h-0.5 bg-black block"></span>
          <span className="w-6 h-0.5 bg-black block"></span>
          <span className="w-4 h-0.5 bg-black block"></span>
        </button>
      </div>
    </nav>

    {/* HERO */}
    <section
      className="min-h-screen flex flex-col justify-center items-center px-4 pt-24 pb-12 relative overflow-hidden border-b-4 border-black"
    >
      <div
        className="absolute top-1/3 left-[10%] w-16 h-16 bg-neo-blue border-4 border-black shadow-hard animate-bounce hidden lg:block rotate-12"
      ></div>
      <div
        className="absolute bottom-1/3 right-[10%] w-24 h-24 bg-neo-pink rounded-full border-4 border-black shadow-hard hidden lg:block animate-pulse"
      ></div>
      <div
        className="absolute top-20 right-20 text-9xl opacity-5 font-black select-none pointer-events-none hidden md:block"
      >
        CODE
      </div>
      <div className="relative z-10 text-center max-w-5xl w-full">
        <div
          className="inline-block bg-neo-white border-2 border-black px-4 py-1 mb-6 shadow-hard rotate-[-2deg] reveal"
        >
          <span className="font-mono font-bold text-neo-green bg-black px-2 mr-2"
            >●</span
          >
          <span className="font-mono font-bold text-sm md:text-base"
            >SYSTEM STATUS: ONLINE</span
          >
        </div>
        <h1
          className="hero-title leading-[0.85] font-black uppercase tracking-tighter mb-6 reveal mix-blend-darken"
          style={{ fontSize: 'clamp(2.5rem, 13vw, 11rem)' }}
        >
          MACHINE LEARNING<br />
          <span className="text-white" style={{ WebkitTextStroke: '3px black' }}
            >ENGINEER</span
          >
        </h1>
        <p
          className="hero-subtitle font-mono text-base md:text-xl lg:text-2xl max-w-2xl mx-auto mb-10 bg-neo-yellow border-2 border-black p-3 md:p-4 shadow-hard reveal rotate-1"
        >
          I build innovative intelligent systems.<br />
          <b>Python • ML • Go</b>
        </p>
        <div
          className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6 reveal px-2"
        >
          <a
            href="#projects"
            className="bg-black text-white border-2 border-black px-8 md:px-10 py-4 md:py-5 text-lg md:text-xl font-bold shadow-hard hover:bg-neo-green hover:text-black hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all cursor-hover"
            >VIEW DATABASE</a
          >
          <a
            href="https://drive.google.com/file/d/1s57IIMSKa-LlbTIEBg8TCK8JHeev9hwf/view?usp=sharing"
            download
            className="bg-neo-white text-black border-2 border-black px-8 md:px-10 py-4 md:py-5 text-lg md:text-xl font-bold shadow-hard hover:bg-neo-pink hover:text-black hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all cursor-hover flex items-center justify-center gap-2"
          >
            <i className="ri-download-line"></i> DOWNLOAD CV
          </a>
        </div>
      </div>
    </section>

    {/* TICKER — single line fix: white-space:nowrap on inner span */}
    <div
      className="border-b-4 border-black bg-neo-blue py-3 relative z-20 overflow-hidden"
    >
      <div className="marquee-container">
        <div
          className="marquee-content ticker-line font-mono font-bold text-lg md:text-2xl text-white"
        >
          <span style={{ whiteSpace: 'nowrap', paddingRight: '4rem' }}
            >/// OPEN FOR WORK /// FULL STACK DEVELOPMENT /// MACHINE LEARNING
            /// ACCESSIBLE /// FAST /// SECURE /// OPEN FOR WORK /// FULL STACK
            DEVELOPMENT /// MACHINE LEARNING /// ACCESSIBLE /// FAST /// SECURE
            ///</span
          >
          <span
            style={{ whiteSpace: 'nowrap', paddingRight: '4rem' }}
            aria-hidden="true"
            >/// OPEN FOR WORK /// FULL STACK DEVELOPMENT /// MACHINE LEARNING
            /// ACCESSIBLE /// FAST /// SECURE /// OPEN FOR WORK /// FULL STACK
            DEVELOPMENT /// MACHINE LEARNING /// ACCESSIBLE /// FAST /// SECURE
            ///</span
          >
        </div>
      </div>
    </div>

    {/* ABOUT */}
    <section
      id="about"
      className="py-16 md:py-24 px-4 max-w-7xl mx-auto border-x-0 md:border-x-4 border-black bg-white my-8 md:my-12 shadow-none md:shadow-hard-lg"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
        <div className="md:col-span-4 reveal">
          <div
            className="aspect-square bg-gray-200 border-4 border-black relative shadow-hard overflow-hidden group max-w-xs mx-auto md:max-w-none"
          >
            <img
              src="/Assets/images/img.jpg"
              alt="Anik"
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
            />
            <span
              className="absolute top-2 left-2 bg-neo-red text-white px-2 font-mono text-xs border border-black z-10"
              >AVATAR.JPG</span
            >
          </div>
        </div>
        <div className="md:col-span-8 flex flex-col justify-center reveal">
          <h2 className="text-4xl md:text-6xl font-black uppercase mb-4 md:mb-6">
            Who am I?
          </h2>
          <p
            className="font-mono text-base md:text-xl leading-relaxed mb-4 md:mb-6"
          >
            I am Anik. A NeoBrutalist developer obsessed with making the web
            feel alive again. I bring
            <span className="bg-neo-yellow px-1 border border-black"
              >intuition</span
            >
            back to code. I write raw, expressive code — and I love tearing
            apart how machines think.
          </p>
          <p
            className="font-mono text-sm md:text-lg mb-6 md:mb-8 text-gray-600 border-l-4 border-neo-purple pl-4"
          >
            {'> '}Experience in ML &amp; AI experimentation.<br />
            {'> '}Full-stack development with personality.<br />
            {'> '}Competitive programming.
          </p>
          <div className="flex flex-wrap gap-3 md:gap-4">
            <div
              className="bg-neo-black text-white px-3 md:px-4 py-2 font-mono text-xs md:text-sm border-2 border-transparent"
            >
              📍 LOCATION: KOLKATA
            </div>
            <div
              className="bg-neo-green text-black px-3 md:px-4 py-2 font-mono text-xs md:text-sm border-2 border-black"
            >
              🟢 STATUS: AVAILABLE
            </div>
            <a
              href="https://github.com/anikchand461"
              target="_blank"
              rel="noopener noreferrer"
              title="GitHub"
              className="bg-neo-black text-white w-10 h-10 md:w-11 md:h-11 flex items-center justify-center border-2 border-black hover:bg-neo-yellow hover:text-black transition-all cursor-hover shrink-0"
            >
              <i className="ri-github-fill text-lg md:text-xl"></i>
            </a>
            <a
              href="https://www.linkedin.com/in/anik-chand-3b14b12b6/"
              target="_blank"
              rel="noopener noreferrer"
              title="LinkedIn"
              className="bg-neo-black text-white w-10 h-10 md:w-11 md:h-11 flex items-center justify-center border-2 border-black hover:bg-neo-blue hover:text-black transition-all cursor-hover shrink-0"
            >
              <i className="ri-linkedin-fill text-lg md:text-xl"></i>
            </a>
          </div>
        </div>
      </div>
    </section>

    {/* SKILLS */}
    <section
      id="skills"
      className="py-16 md:py-20 bg-neo-black text-neo-white border-y-4 border-black relative overflow-hidden"
    >
      <div
        className="absolute inset-0 opacity-20"
        style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '40px 40px' }}
      ></div>
      <div className="max-w-[1400px] mx-auto px-4 relative z-10">
        <div
          className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 border-b-4 border-white pb-4 gap-4"
        >
          <h2
            className="text-5xl md:text-8xl font-black uppercase text-white tracking-tighter"
          >
            TECH<span className="text-neo-green">_STACK</span>
          </h2>
          <div className="flex items-center gap-2 mb-0 md:mb-4">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <p className="font-mono text-neo-green text-sm font-bold">
              /// SYSTEM_OPTIMIZED
            </p>
          </div>
        </div>
        <div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8"
        >
          <div
            className="skills-grid-cell group h-20 md:h-24 border-r-2 border-b-2 border-white/20 bg-neo-black hover:bg-neo-blue transition-all duration-300 hover:z-10 relative cursor-hover flex flex-col items-center justify-center p-2"
          >
            <div
              className="text-neo-green group-hover:text-black font-mono text-[9px] md:text-xs mb-1 opacity-50 uppercase"
            >
              LANGUAGE
            </div>
            <div
              className="skill-name text-white group-hover:text-black font-black font-display uppercase"
            >
              Python
            </div>
          </div>
          <div
            className="skills-grid-cell group h-20 md:h-24 border-r-2 border-b-2 border-white/20 bg-neo-black hover:bg-neo-yellow transition-all duration-300 hover:z-10 relative cursor-hover flex flex-col items-center justify-center p-2"
          >
            <div
              className="text-neo-green group-hover:text-black font-mono text-[9px] md:text-xs mb-1 opacity-50 uppercase"
            >
              LANGUAGE
            </div>
            <div
              className="skill-name text-white group-hover:text-black font-black font-display uppercase"
            >
              Java
            </div>
          </div>
          <div
            className="skills-grid-cell group h-20 md:h-24 border-r-2 border-b-2 border-white/20 bg-neo-black hover:bg-neo-purple transition-all duration-300 hover:z-10 relative cursor-hover flex flex-col items-center justify-center p-2"
          >
            <div
              className="text-neo-green group-hover:text-black font-mono text-[9px] md:text-xs mb-1 opacity-50 uppercase"
            >
              LANGUAGE
            </div>
            <div
              className="skill-name text-white group-hover:text-black font-black font-display uppercase"
            >
              C++
            </div>
          </div>
          <div
            className="skills-grid-cell group h-20 md:h-24 border-r-2 border-b-2 border-white/20 bg-neo-black hover:bg-white transition-all duration-300 hover:z-10 relative cursor-hover flex flex-col items-center justify-center p-2"
          >
            <div
              className="text-neo-green group-hover:text-black font-mono text-[9px] md:text-xs mb-1 opacity-50 uppercase"
            >
              LANGUAGE
            </div>
            <div
              className="skill-name text-white group-hover:text-black font-black font-display uppercase"
            >
              SQL
            </div>
          </div>
          <div
            className="skills-grid-cell group h-20 md:h-24 border-r-2 border-b-2 border-white/20 bg-neo-black hover:bg-neo-pink transition-all duration-300 hover:z-10 relative cursor-hover flex flex-col items-center justify-center p-2"
          >
            <div
              className="text-neo-green group-hover:text-black font-mono text-[9px] md:text-xs mb-1 opacity-50 uppercase"
            >
              LANGUAGE
            </div>
            <div
              className="skill-name text-white group-hover:text-black font-black font-display uppercase"
            >
              JavaScript
            </div>
          </div>
          <div
            className="skills-grid-cell group h-20 md:h-24 border-r-2 border-b-2 border-white/20 bg-neo-black hover:bg-neo-green transition-all duration-300 hover:z-10 relative cursor-hover flex flex-col items-center justify-center p-2"
          >
            <div
              className="text-neo-green group-hover:text-black font-mono text-[9px] md:text-xs mb-1 opacity-50 uppercase"
            >
              LIBRARIES
            </div>
            <div
              className="skill-name text-white group-hover:text-black font-black font-display uppercase"
            >
              NumPy
            </div>
          </div>
          <div
            className="skills-grid-cell group h-20 md:h-24 border-r-2 border-b-2 border-white/20 bg-neo-black hover:bg-neo-yellow transition-all duration-300 hover:z-10 relative cursor-hover flex flex-col items-center justify-center p-2"
          >
            <div
              className="text-neo-green group-hover:text-black font-mono text-[9px] md:text-xs mb-1 opacity-50 uppercase"
            >
              LIBRARIES
            </div>
            <div
              className="skill-name text-white group-hover:text-black font-black font-display uppercase"
            >
              Pandas
            </div>
          </div>
          <div
            className="skills-grid-cell group h-20 md:h-24 border-r-2 border-b-2 border-white/20 bg-neo-black hover:bg-neo-blue transition-all duration-300 hover:z-10 relative cursor-hover flex flex-col items-center justify-center p-2"
          >
            <div
              className="text-neo-green group-hover:text-black font-mono text-[9px] md:text-xs mb-1 opacity-50 uppercase"
            >
              LIBRARIES
            </div>
            <div
              className="skill-name text-white group-hover:text-black font-black font-display uppercase"
            >
              Scikit-learn
            </div>
          </div>
          <div
            className="skills-grid-cell group h-20 md:h-24 border-r-2 border-b-2 border-white/20 bg-neo-black hover:bg-neo-purple transition-all duration-300 hover:z-10 relative cursor-hover flex flex-col items-center justify-center p-2"
          >
            <div
              className="text-neo-green group-hover:text-black font-mono text-[9px] md:text-xs mb-1 opacity-50 uppercase"
            >
              LIBRARIES
            </div>
            <div
              className="skill-name text-white group-hover:text-black font-black font-display uppercase"
            >
              TensorFlow
            </div>
          </div>
          <div
            className="skills-grid-cell group h-20 md:h-24 border-r-2 border-b-2 border-white/20 bg-neo-black hover:bg-neo-orange transition-all duration-300 hover:z-10 relative cursor-hover flex flex-col items-center justify-center p-2"
          >
            <div
              className="text-neo-green group-hover:text-black font-mono text-[9px] md:text-xs mb-1 opacity-50 uppercase"
            >
              LIBRARIES
            </div>
            <div
              className="skill-name text-white group-hover:text-black font-black font-display uppercase"
            >
              Keras
            </div>
          </div>
          <div
            className="skills-grid-cell group h-20 md:h-24 border-r-2 border-b-2 border-white/20 bg-neo-black hover:bg-white transition-all duration-300 hover:z-10 relative cursor-hover flex flex-col items-center justify-center p-2"
          >
            <div
              className="text-neo-green group-hover:text-black font-mono text-[9px] md:text-xs mb-1 opacity-50 uppercase"
            >
              LIBRARIES
            </div>
            <div
              className="skill-name text-white group-hover:text-black font-black font-display uppercase"
            >
              PyTorch
            </div>
          </div>
          <div
            className="skills-grid-cell group h-20 md:h-24 border-r-2 border-b-2 border-white/20 bg-neo-black hover:bg-neo-green transition-all duration-300 hover:z-10 relative cursor-hover flex flex-col items-center justify-center p-2"
          >
            <div
              className="text-neo-green group-hover:text-black font-mono text-[9px] md:text-xs mb-1 opacity-50 uppercase"
            >
              AI/ML
            </div>
            <div
              className="skill-name text-white group-hover:text-black font-black font-display uppercase"
            >
              Hugging Face
            </div>
          </div>
          <div
            className="skills-grid-cell group h-20 md:h-24 border-r-2 border-b-2 border-white/20 bg-neo-black hover:bg-neo-blue transition-all duration-300 hover:z-10 relative cursor-hover flex flex-col items-center justify-center p-2"
          >
            <div
              className="text-neo-green group-hover:text-black font-mono text-[9px] md:text-xs mb-1 opacity-50 uppercase"
            >
              AI/ML
            </div>
            <div
              className="skill-name text-white group-hover:text-black font-black font-display uppercase"
            >
              LangChain
            </div>
          </div>
          <div
            className="skills-grid-cell group h-20 md:h-24 border-r-2 border-b-2 border-white/20 bg-neo-black hover:bg-neo-purple transition-all duration-300 hover:z-10 relative cursor-hover flex flex-col items-center justify-center p-2"
          >
            <div
              className="text-neo-green group-hover:text-black font-mono text-[9px] md:text-xs mb-1 opacity-50 uppercase"
            >
              AI/ML
            </div>
            <div
              className="skill-name text-white group-hover:text-black font-black font-display uppercase"
            >
              FastAPI
            </div>
          </div>
          <div
            className="skills-grid-cell group h-20 md:h-24 border-r-2 border-b-2 border-white/20 bg-neo-black hover:bg-neo-orange transition-all duration-300 hover:z-10 relative cursor-hover flex flex-col items-center justify-center p-2"
          >
            <div
              className="text-neo-green group-hover:text-black font-mono text-[9px] md:text-xs mb-1 opacity-50 uppercase"
            >
              DATABASE
            </div>
            <div
              className="skill-name text-white group-hover:text-black font-black font-display uppercase"
            >
              MySQL
            </div>
          </div>
          <div
            className="skills-grid-cell group h-20 md:h-24 border-r-2 border-b-2 border-white/20 bg-neo-black hover:bg-white transition-all duration-300 hover:z-10 relative cursor-hover flex flex-col items-center justify-center p-2"
          >
            <div
              className="text-neo-green group-hover:text-black font-mono text-[9px] md:text-xs mb-1 opacity-50 uppercase"
            >
              DATABASE
            </div>
            <div
              className="skill-name text-white group-hover:text-black font-black font-display uppercase"
            >
              SQLite
            </div>
          </div>
          <div
            className="skills-grid-cell group h-20 md:h-24 border-r-2 border-b-2 border-white/20 bg-neo-black hover:bg-neo-pink transition-all duration-300 hover:z-10 relative cursor-hover flex flex-col items-center justify-center p-2"
          >
            <div
              className="text-neo-green group-hover:text-black font-mono text-[9px] md:text-xs mb-1 opacity-50 uppercase"
            >
              SOFT SKILL
            </div>
            <div
              className="skill-name text-white group-hover:text-black font-black font-display uppercase"
            >
              Teamwork
            </div>
          </div>
          <div
            className="skills-grid-cell group h-20 md:h-24 border-r-2 border-b-2 border-white/20 bg-neo-black hover:bg-neo-yellow transition-all duration-300 hover:z-10 relative cursor-hover flex flex-col items-center justify-center p-2"
          >
            <div
              className="text-neo-green group-hover:text-black font-mono text-[9px] md:text-xs mb-1 opacity-50 uppercase"
            >
              SOFT SKILL
            </div>
            <div
              className="skill-name text-white group-hover:text-black font-black font-display uppercase"
            >
              Leadership
            </div>
          </div>
          <div
            className="skills-grid-cell group h-20 md:h-24 border-r-2 border-b-2 border-white/20 bg-neo-black hover:bg-neo-purple transition-all duration-300 hover:z-10 relative cursor-hover flex flex-col items-center justify-center p-2"
          >
            <div
              className="text-neo-green group-hover:text-black font-mono text-[9px] md:text-xs mb-1 opacity-50 uppercase"
            >
              SOFT SKILL
            </div>
            <div
              className="skill-name text-white group-hover:text-black font-black font-display uppercase"
            >
              Adaptability
            </div>
          </div>
          <div
            className="skills-grid-cell group h-20 md:h-24 border-r-2 border-b-2 border-white/20 bg-neo-black hover:bg-neo-green transition-all duration-300 hover:z-10 relative cursor-hover flex flex-col items-center justify-center p-2"
          >
            <div
              className="text-neo-green group-hover:text-black font-mono text-[9px] md:text-xs mb-1 opacity-50 uppercase"
            >
              CERT
            </div>
            <div
              className="skill-name text-white group-hover:text-black font-black font-display uppercase"
            >
              Kaggle ML
            </div>
          </div>
          <div
            className="skills-grid-cell group h-20 md:h-24 border-r-2 border-b-2 border-white/20 bg-neo-black hover:bg-neo-blue transition-all duration-300 hover:z-10 relative cursor-hover flex flex-col items-center justify-center p-2"
          >
            <div
              className="text-neo-green group-hover:text-black font-mono text-[9px] md:text-xs mb-1 opacity-50 uppercase"
            >
              CERT
            </div>
            <div
              className="skill-name text-white group-hover:text-black font-black font-display uppercase"
            >
              Data Analysis
            </div>
          </div>
        </div>
        <div
          className="border-t-4 border-white mt-8 pt-4 flex justify-between font-mono text-xs text-gray-500"
        >
          <span>TOTAL_NODES: 16</span>
          <span>MEMORY_USAGE: 128MB</span>
        </div>
      </div>
    </section>

    {/* EXPERIENCE */}
    <section id="experience" className="py-16 md:py-24 px-4 max-w-7xl mx-auto">
      <h2
        className="text-4xl md:text-8xl font-black uppercase mb-10 md:mb-12 tracking-tighter text-center"
      >
        Experience<span className="text-neo-red">_Log</span>
      </h2>
      <div
        className="relative border-l-4 border-black ml-4 md:ml-10 space-y-8 md:space-y-12"
      >

      <div className="reveal relative pl-8 md:pl-16 timeline-entry">
        <div
          className="timeline-dot absolute -left-[14px] top-2 w-6 h-6 bg-neo-blue border-4 border-black"
        ></div>
        <div
          className="bg-white border-4 border-black p-4 md:p-6 shadow-hard hover:shadow-hard-xl transition-all"
        >
          <div
            className="flex flex-col md:flex-row justify-between items-start md:items-center border-b-2 border-dashed border-gray-300 pb-4 mb-4 gap-2"
          >
            <h3 className="text-2xl md:text-3xl font-black uppercase">
                Contributor
            </h3>
            <span
              className="font-mono font-bold bg-neo-black text-white px-2 py-1 text-sm whitespace-nowrap"
              >Apr 2026 - Jun 2026</span
            >
          </div>
          <p
            className="font-mono text-lg md:text-xl mb-2 text-neo-blue font-bold"
          >
            @ Nexus Spring of Code
          </p>
          <ul
            className="list-disc list-inside font-mono text-sm md:text-base text-gray-700 space-y-1"
          >
              <li>
                Built a GitHub API rate-limit status indicator with remaining requests,
                reset time, color-coded usage status, and low-limit warnings.
              </li>
              <li>
                Rewrote the project documentation from scratch, including setup,
                configuration, project structure, dependencies, and contribution guidelines.
              </li>
          </ul>
        </div>
      </div>
      
      
        <div className="reveal relative pl-8 md:pl-16 timeline-entry">
          <div
            className="timeline-dot absolute -left-[14px] top-2 w-6 h-6 bg-neo-pink border-4 border-black"
          ></div>
          <div
            className="bg-white border-4 border-black p-4 md:p-6 shadow-hard hover:shadow-hard-xl transition-all"
          >
            <div
              className="flex flex-col md:flex-row justify-between items-start md:items-center border-b-2 border-dashed border-gray-300 pb-4 mb-4 gap-2"
            >
              <h3 className="text-2xl md:text-3xl font-black uppercase">
                Project Admin
              </h3>
              <span
                className="font-mono font-bold bg-neo-black text-white px-2 py-1 text-sm whitespace-nowrap"
                >Feb 2026 - Mar 2026</span
              >
            </div>
            <p
              className="font-mono text-lg md:text-xl mb-2 text-neo-pink font-bold"
            >
              @ Apertre 3.0
            </p>
            <ul
              className="list-disc list-inside font-mono text-sm md:text-base text-gray-700 space-y-1"
            >
              <li>
                Project Admin for the project 'task' —
                <span className="break-all"
                  >https://github.com/anikchand461/task</span
                >
              </li>
              <li>
                It is a CLI project written in Go for task management using
                terminal.
              </li>
            </ul>
          </div>
        </div>

        <div className="reveal relative pl-8 md:pl-16 timeline-entry">
          <div
            className="timeline-dot absolute -left-[14px] top-2 w-6 h-6 bg-neo-blue border-4 border-black"
          ></div>
          <div
            className="bg-white border-4 border-black p-4 md:p-6 shadow-hard hover:shadow-hard-xl transition-all"
          >
            <div
              className="flex flex-col md:flex-row justify-between items-start md:items-center border-b-2 border-dashed border-gray-300 pb-4 mb-4 gap-2"
            >
              <h3 className="text-2xl md:text-3xl font-black uppercase">
                Contributor - Numpy
              </h3>
              <span
                className="font-mono font-bold bg-neo-black text-white px-2 py-1 text-sm whitespace-nowrap"
                >Oct 2025</span
              >
            </div>
            <p
              className="font-mono text-lg md:text-xl mb-2 text-neo-blue font-bold"
            >
              @ Numpy
            </p>
            <ul
              className="list-disc list-inside font-mono text-sm md:text-base text-gray-700 space-y-1"
            >
              <li>
                Finalized deprecations in linalg/fft modules (PR #29909) to
                enhance type safety for ML workflows.
              </li>
              <li>
                Improved library stability for scientific computing and
                generative models (e.g., GANs) through robust SVD/FFT
                implementations.
              </li>
            </ul>
          </div>
        </div>

        <div className="reveal relative pl-8 md:pl-16 timeline-entry">
          <div
            className="timeline-dot absolute -left-[14px] top-2 w-6 h-6 bg-neo-red border-4 border-black"
          ></div>
          <div
            className="bg-white border-4 border-black p-4 md:p-6 shadow-hard hover:shadow-hard-xl transition-all"
          >
            <div
              className="flex flex-col md:flex-row justify-between items-start md:items-center border-b-2 border-dashed border-gray-300 pb-4 mb-4 gap-2"
            >
              <h3 className="text-2xl md:text-3xl font-black uppercase">
                Contributor - Hactoberfest
              </h3>
              <span
                className="font-mono font-bold bg-neo-black text-white px-2 py-1 text-sm whitespace-nowrap"
                >Oct 2025</span
              >
            </div>
            <p className="font-mono text-lg md:text-xl mb-2 text-neo-red font-bold">
              @ LocalStack
            </p>
            <ul
              className="list-disc list-inside font-mono text-sm md:text-base text-gray-700 space-y-1"
            >
              <li>
                Normalized documentation structure for the "Reproducible ML with
                Cloud Pods" tutorial by adding Introduction and Testing sections
                (PR #268).
              </li>
              <li>
                Enhanced developer onboarding by improving clarity and
                consistency in AWS emulation guides.
              </li>
            </ul>
          </div>
        </div>

        <div className="reveal relative pl-8 md:pl-16 timeline-entry">
          <div
            className="timeline-dot absolute -left-[14px] top-2 w-6 h-6 bg-neo-green border-4 border-black"
          ></div>
          <div
            className="bg-white border-4 border-black p-4 md:p-6 shadow-hard hover:shadow-hard-xl transition-all"
          >
            <div
              className="flex flex-col md:flex-row justify-between items-start md:items-center border-b-2 border-dashed border-gray-300 pb-4 mb-4 gap-2"
            >
              <h3 className="text-2xl md:text-3xl font-black uppercase">
                Machine Learning Trainee
              </h3>
              <span
                className="font-mono font-bold bg-neo-black text-white px-2 py-1 text-sm whitespace-nowrap"
                >Mar - Sep 2025</span
              >
            </div>
            <p
              className="font-mono text-lg md:text-xl mb-2 text-neo-green font-bold"
            >
              @ ISTE HIT Student Chapter
            </p>
            <ul
              className="list-disc list-inside font-mono text-sm md:text-base text-gray-700 space-y-1"
            >
              <li>
                Executed ML pipelines for student projects, boosting model
                accuracy and applying skills to real-world cases.
              </li>
              <li>
                Mentored at BitsNBytes 2025 (ISTE), guiding participants through
                technical challenges and advanced DSA problem-solving.
              </li>
            </ul>
          </div>
        </div>

        <div className="reveal relative pl-8 md:pl-16 timeline-entry extra-experience hidden">
          <div
            className="timeline-dot absolute -left-[14px] top-2 w-6 h-6 bg-neo-blue border-4 border-black"
          ></div>
          <div
            className="bg-white border-4 border-black p-4 md:p-6 shadow-hard hover:shadow-hard-xl transition-all"
          >
            <div
              className="flex flex-col md:flex-row justify-between items-start md:items-center border-b-2 border-dashed border-gray-300 pb-4 mb-4 gap-2"
            >
              <h3 className="text-2xl md:text-3xl font-black uppercase">Mentor</h3>
              <span
                className="font-mono font-bold bg-neo-black text-white px-2 py-1 text-sm whitespace-nowrap"
                >Jul - Sep 2025</span
              >
            </div>
            <p
              className="font-mono text-lg md:text-xl mb-2 text-neo-blue font-bold"
            >
              @ GirlScript Summer of Code
            </p>
            <ul
              className="list-disc list-inside font-mono text-sm md:text-base text-gray-700 space-y-1"
            >
              <li>
                Mentored contributors in Python and ML projects, providing
                expert code reviews and advanced debugging guidance.
              </li>
              <li>
                Led interactive sessions to instill best coding practices,
                enhance collaboration, and foster high-performing teamwork.
              </li>
            </ul>
          </div>
        </div>

        <div className="reveal relative pl-8 md:pl-16 timeline-entry extra-experience hidden">
          <div
            className="timeline-dot absolute -left-[14px] top-2 w-6 h-6 bg-neo-pink border-4 border-black"
          ></div>
          <div
            className="bg-white border-4 border-black p-4 md:p-6 shadow-hard hover:shadow-hard-xl transition-all"
          >
            <div
              className="flex flex-col md:flex-row justify-between items-start md:items-center border-b-2 border-dashed border-gray-300 pb-4 mb-4 gap-2"
            >
              <h3 className="text-2xl md:text-3xl font-black uppercase">
                Winner – Codathon
              </h3>
              <span
                className="font-mono font-bold bg-neo-black text-white px-2 py-1 text-sm whitespace-nowrap"
                >Feb 2025</span
              >
            </div>
            <p
              className="font-mono text-lg md:text-xl mb-2 text-neo-pink font-bold"
            >
              @ ICNSBT at Haldia
            </p>
            <ul
              className="list-disc list-inside font-mono text-sm md:text-base text-gray-700 space-y-1"
            >
              <li>Secured 1st place for innovative algorithmic solutions.</li>
              <li>Delivered optimized solutions under time constraints.</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="text-center mt-10 md:mt-12">
        <button
          id="experience-toggle-btn"
          onClick={(e) => toggleExperience(e.currentTarget)}
          className="inline-block bg-neo-black text-white px-8 md:px-12 py-4 md:py-5 font-bold font-mono text-lg md:text-xl hover:bg-neo-white hover:text-black border-4 border-black transition-all shadow-hard hover:shadow-none cursor-hover"
          >SHOW MORE ▼</button
        >
      </div>
    </section>

    {/* CODING STATS */}
    <section
      id="coding-stats"
      className="py-12 bg-neo-black text-white border-y-4 border-black relative overflow-hidden"
    >
      <div
        className="absolute inset-0 opacity-20"
        style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '40px 40px' }}
      ></div>
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div
          className="flex justify-between items-center mb-6 border-b-2 border-white pb-3"
        >
          <h2
            className="text-3xl md:text-5xl font-black uppercase text-white tracking-tight"
          >
            CODING<span className="text-neo-green">_STATS</span>
          </h2>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <p className="font-mono text-neo-green text-xs font-bold">LIVE</p>
          </div>
        </div>
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {/* GitHub */}
          <div className="reveal flex flex-col stats-col">
            <div
              className="flex items-center gap-2 mb-4 border-b border-white/20 pb-2"
            >
              <div
                className="w-8 h-8 bg-neo-green border-2 border-white flex items-center justify-center"
              >
                <i className="ri-github-fill text-lg text-black"></i>
              </div>
              <h3 className="text-2xl font-black uppercase text-white">GITHUB</h3>
            </div>
            <div
              className="border-4 border-white/20 p-4 md:p-6 bg-black flex-1 flex flex-col shadow-[8px_8px_0_rgba(0,0,0,1)]"
            >
              <div
                className="flex items-center justify-between mb-6 md:mb-8 pb-4 border-b border-white/10"
              >
                <div className="flex items-center gap-3">
                  <i
                    className="ri-github-fill text-2xl md:text-3xl text-neo-green"
                  ></i>
                  <div>
                    <h4
                      className="text-lg md:text-xl font-black text-white leading-tight"
                    >
                      anikchand461
                    </h4>
                    <p
                      className="text-[10px] font-mono text-neo-green uppercase tracking-widest"
                    >
                      Midnight Coder
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    id="total-contributions"
                    className="text-xl md:text-2xl font-black text-neo-green tracking-tighter"
                  >
                    --
                  </div>
                  <p className="text-[8px] font-mono text-gray-500 uppercase">
                    Commits
                  </p>
                </div>
              </div>
              <div
                className="grid grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8 uppercase"
              >
                <div
                  className="border-2 border-neo-green/30 bg-neo-black/60 p-3 md:p-4 hover:border-neo-green transition-colors"
                >
                  <div
                    className="text-[9px] font-mono text-neo-green mb-1 uppercase tracking-widest opacity-70"
                  >
                    Repositories
                  </div>
                  <div
                    id="repos-count"
                    className="text-white font-black text-2xl md:text-3xl tracking-tighter"
                  >
                    --
                  </div>
                </div>
                <div
                  className="border-2 border-neo-green/30 bg-neo-black/60 p-3 md:p-4 hover:border-neo-green transition-colors"
                >
                  <div
                    className="text-[9px] font-mono text-neo-green mb-1 uppercase tracking-widest opacity-70"
                  >
                    Followers
                  </div>
                  <div
                    id="followers-count"
                    className="text-white font-black text-2xl md:text-3xl tracking-tighter"
                  >
                    --
                  </div>
                </div>
                <div
                  className="border-2 border-neo-green/30 bg-neo-black/60 p-3 md:p-4 hover:border-neo-green transition-colors"
                >
                  <div
                    className="text-[9px] font-mono text-neo-green mb-1 uppercase tracking-widest opacity-70"
                  >
                    Commits
                  </div>
                  <div
                    id="total-contributions-grid"
                    className="text-white font-black text-2xl md:text-3xl tracking-tighter"
                  >
                    --
                  </div>
                </div>
                <div
                  className="border-2 border-neo-green/30 bg-neo-black/60 p-3 md:p-4 hover:border-neo-green transition-colors"
                >
                  <div
                    className="text-[9px] font-mono text-neo-green mb-1 uppercase tracking-widest opacity-70"
                  >
                    Joined
                  </div>
                  <div
                    id="created-at"
                    className="text-white font-black text-lg md:text-xl tracking-tighter mt-1 leading-none"
                  >
                    --
                  </div>
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-center mb-6 md:mb-8">
                <div
                  className="bg-black border-2 border-neo-green/30 p-2 overflow-hidden hover:border-neo-green transition-colors duration-500 relative"
                >
                  <div
                    className="absolute top-1 right-1 w-1.5 h-1.5 bg-neo-green rounded-full animate-pulse"
                  ></div>
                  <p
                    className="text-[8px] font-mono text-neo-green/50 uppercase tracking-[0.2em] mb-1"
                  >
                    Matrix_Output
                  </p>
                  <img
                    src="https://ghchart.rshah.org/33FF57/anikchand461"
                    alt="GitHub Contribution Graph"
                    className="w-full h-auto filter brightness-110"
                  />
                </div>
              </div>
              <div
                className="mt-auto flex items-center justify-between text-neo-green p-3 border-2 border-white/10 bg-neo-black font-mono text-[11px]"
              >
                <div className="flex items-center gap-2">
                  <span className="text-white/30">$</span
                  ><span className="text-neo-green">gh --stats</span
                  ><span className="animate-pulse">_</span>
                </div>
                <a
                  href="https://github.com/anikchand461"
                  target="_blank"
                  className="text-neo-green px-3 py-1 font-black uppercase border border-neo-green hover:bg-neo-green hover:text-black transition-all"
                  >VIEW_GH →</a
                >
              </div>
            </div>
          </div>

          {/* LeetCode */}
          <div className="reveal flex flex-col stats-col">
            <div
              className="flex items-center gap-2 mb-4 border-b border-white/20 pb-2"
            >
              <div
                className="w-8 h-8 bg-neo-orange border-2 border-white flex items-center justify-center"
              >
                <i className="ri-code-box-fill text-lg text-black"></i>
              </div>
              <h3 className="text-2xl font-black uppercase text-white">LEETCODE</h3>
            </div>
            <div
              className="border-4 border-white/20 p-4 md:p-6 bg-black flex-1 flex flex-col shadow-[8px_8px_0_rgba(0,0,0,1)]"
            >
              <div
                className="flex items-center justify-between mb-6 md:mb-8 pb-4 border-b border-white/10"
              >
                <div className="flex items-center gap-3">
                  <i
                    className="ri-code-box-fill text-2xl md:text-3xl text-neo-orange"
                  ></i>
                  <div>
                    <h4
                      className="text-lg md:text-xl font-black text-white leading-tight"
                    >
                      anikchand461
                    </h4>
                    <p
                      className="text-[10px] font-mono text-neo-orange uppercase tracking-widest"
                    >
                      Problem solver
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className="text-xl md:text-2xl font-black text-neo-orange tracking-tighter"
                  >
                    #Top
                  </div>
                  <p className="text-[8px] font-mono text-gray-500 uppercase">
                    Ranking
                  </p>
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-center mb-6 md:mb-8">
                <div
                  className="border-2 border-neo-orange/30 p-2 overflow-hidden bg-black hover:border-neo-orange transition-colors duration-500 relative"
                >
                  <div
                    className="absolute top-1 right-1 w-1.5 h-1.5 bg-neo-orange rounded-full animate-pulse"
                  ></div>
                  <img
                    src="https://leetcard.jacoblin.cool/anikchand461?theme=dark&font=Ubuntu&ext=heatmap"
                    alt="LeetCode Stats"
                    className="w-full h-auto object-contain filter contrast-125"
                  />
                </div>
              </div>
              <div
                className="mt-auto flex items-center justify-between text-neo-orange p-3 border-2 border-white/10 bg-neo-black font-mono text-[11px]"
              >
                <div className="flex items-center gap-2">
                  <span className="text-white/30">$</span
                  ><span className="text-neo-orange">leetcode --u</span
                  ><span className="animate-pulse">_</span>
                </div>
                <a
                  href="https://leetcode.com/u/anikchand461/"
                  target="_blank"
                  className="text-neo-orange px-3 py-1 font-black uppercase border border-neo-orange hover:bg-neo-orange hover:text-black transition-all"
                  >VIEW_LC →</a
                >
              </div>
            </div>
          </div>

          {/* Codeforces */}
          <div className="reveal flex flex-col stats-col">
            <div
              className="flex items-center gap-2 mb-4 border-b border-white/20 pb-2"
            >
              <div
                className="w-8 h-8 bg-neo-purple border-2 border-white flex items-center justify-center"
              >
                <i className="ri-code-s-slash-line text-lg text-black"></i>
              </div>
              <h3 className="text-2xl font-black uppercase text-white">
                CODEFORCES
              </h3>
            </div>
            <div
              className="border-4 border-white/20 p-4 md:p-6 bg-black flex-1 flex flex-col shadow-[8px_8px_0_rgba(0,0,0,1)] overflow-hidden"
            >
              <div
                className="flex items-center justify-between mb-6 pb-4 border-b border-white/10"
              >
                <div className="flex items-center gap-3">
                  <i
                    className="ri-code-s-slash-line text-2xl md:text-3xl text-neo-purple"
                  ></i>
                  <div>
                    <h4
                      className="text-lg md:text-xl font-black text-white leading-tight"
                    >
                      anikchand461
                    </h4>
                    <p
                      className="text-[10px] font-mono text-neo-purple uppercase tracking-widest"
                    >
                      Competitive Coder
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className="text-xl md:text-2xl font-black text-neo-purple tracking-tighter"
                  >
                    1084
                  </div>
                  <p className="text-[8px] font-mono text-gray-500 uppercase">
                    Rating
                  </p>
                </div>
              </div>
              <div className="mb-6">
                <div
                  className="border-2 border-neo-purple/30 p-3 overflow-hidden bg-black"
                >
                  <img
                    src="https://codeforces-readme-stats.vercel.app/api/card?username=anikchand461&theme=github_dark&t=1"
                    id="cf-stats-img"
                    className="w-full h-auto object-contain"
                  />
                </div>
              </div>
              <div
                className="mt-auto flex items-center justify-between text-neo-purple p-3 border-2 border-white/10 bg-neo-black font-mono text-[11px]"
              >
                <div className="flex items-center gap-2">
                  <span className="text-white/30">$</span
                  ><span className="text-neo-purple">cf --stats</span
                  ><span className="animate-pulse">_</span>
                </div>
                <a
                  href="https://codeforces.com/profile/anikchand461"
                  target="_blank"
                  className="text-neo-purple px-3 py-1 font-black uppercase border border-neo-purple hover:bg-neo-purple hover:text-black transition-all"
                  >VIEW_CF →</a
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* PROJECTS */}
    <section
      id="projects"
      className="py-16 md:py-24 bg-neo-yellow border-t-4 border-black px-4 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        <h2
          className="font-black mb-10 md:mb-16 uppercase tracking-tighter text-white drop-shadow-[4px_4px_0_rgba(0,0,0,1)]"
          style={{ fontSize: 'clamp(2.5rem, 9vw, 8rem)', WebkitTextStroke: '3px black' }}
        >
          Selected Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">


        <article
          className="reveal group bg-white border-4 border-black p-4 shadow-hard"
        >
          <div
            className="bg-black border-2 border-black aspect-video relative overflow-hidden mb-6"
          >
            <img
              src="/Assets/images/chatwithrepo.png"
              alt="chatwithrepo"
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
            />
          </div>
          <div
            className="flex flex-col sm:flex-row justify-between items-start gap-4"
          >
            <div className="flex-1 min-w-0">
              <h3
                className="text-2xl md:text-4xl font-black uppercase mb-2 group-hover:text-neo-purple transition-colors glitch-hover"
              >
                  Chat With Repo
              </h3>
              <p className="font-mono text-sm mb-4">
                  Chat with any GitHub repository using an advanced RAG pipeline with multi-query retrieval, reranking, and grounded AI answers.
              </p>
              <div className="flex gap-2 font-mono text-xs font-bold flex-wrap">
                <span className="bg-neo-black text-white px-2 py-1">Python</span
                ><span className="bg-neo-black text-white px-2 py-1"
                  >RAG</span
                ><span className="bg-neo-black text-white px-2 py-1"
                  >Developer tool</span
                ><span className="bg-neo-black text-white px-2 py-1"
                  >AI</span
                >
              </div>
            </div>
            <div className="flex flex-row sm:flex-col gap-3 self-start shrink-0">
              <a
                href="https://github.com/anikchand461/chat-with-repo"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 border-2 border-black bg-neo-green flex items-center justify-center hover:bg-black hover:text-white transition-all cursor-hover shadow-hard-sm"
                ><i className="ri-github-fill text-2xl"></i
              ></a>
              <a
                href="https://chatwithrepo-nine.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 border-2 border-black bg-neo-yellow flex items-center justify-center hover:bg-black hover:text-white transition-all cursor-hover shadow-hard-sm"
                ><i className="ri-external-link-line text-2xl"></i
              ></a>
            </div>
          </div>
        </article>

        <article
          className="reveal group bg-white border-4 border-black p-4 shadow-hard md:mt-20"
        >
          <div
            className="bg-black border-2 border-black aspect-video relative overflow-hidden mb-6"
          >
            <img
              src="/Assets/images/ragbucket.png"
              alt="ragbucket"
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
            />
          </div>
          <div
            className="flex flex-col sm:flex-row justify-between items-start gap-4"
          >
            <div className="flex-1 min-w-0">
              <h3
                className="text-2xl md:text-4xl font-black uppercase mb-2 group-hover:text-neo-blue transition-colors glitch-hover"
              >
                  ragbucket
              </h3>
              <p className="font-mono text-sm mb-4">
                Package vectors, chunks, configs, and retrieval memory into portable executable .rag artifacts. 
              </p>
              <div className="flex gap-2 font-mono text-xs font-bold flex-wrap">
                <span className="bg-neo-black text-white px-2 py-1"
                  >Pypi package</span
                ><span className="bg-neo-black text-white px-2 py-1">Python</span
                ><span className="bg-neo-black text-white px-2 py-1"
                  >RAG</span
                ><span className="bg-neo-black text-white px-2 py-1"
                  >Sentence Transformer</span
                >
              </div>
            </div>
            <div className="flex flex-row sm:flex-col gap-3 self-start shrink-0">
              <a
                href="https://github.com/anikchand461/ragbucket"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 border-2 border-black bg-neo-green flex items-center justify-center hover:bg-black hover:text-white transition-all cursor-hover shadow-hard-sm"
                ><i className="ri-github-fill text-2xl"></i
              ></a>
              <a
                href="https://ragbucket.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 border-2 border-black bg-neo-yellow flex items-center justify-center hover:bg-black hover:text-white transition-all cursor-hover shadow-hard-sm"
                ><i className="ri-external-link-line text-2xl"></i
              ></a>
            </div>
          </div>
        </article>

        
          <article
            className="reveal group bg-white border-4 border-black p-4 shadow-hard"
          >
            <div
              className="bg-black border-2 border-black aspect-video relative overflow-hidden mb-6"
            >
              <img
                src="/Assets/images/cvz.png"
                alt="lazytune"
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
              />
            </div>
            <div
              className="flex flex-col sm:flex-row justify-between items-start gap-4"
            >
              <div className="flex-1 min-w-0">
                <h3
                  className="text-2xl md:text-4xl font-black uppercase mb-2 group-hover:text-neo-purple transition-colors glitch-hover"
                >
                  CVZ
                </h3>
                <p className="font-mono text-sm mb-4">
                  A blazing-fast CLI tool that tells you exactly how well your
                  resume matches a job — before a recruiter's ATS does.
                </p>
                <div className="flex gap-2 font-mono text-xs font-bold flex-wrap">
                  <span className="bg-neo-black text-white px-2 py-1">Python</span
                  ><span className="bg-neo-black text-white px-2 py-1"
                    >Command line tool</span
                  ><span className="bg-neo-black text-white px-2 py-1"
                    >Pypi package</span
                  ><span className="bg-neo-black text-white px-2 py-1"
                    >ATS score checker</span
                  >
                </div>
              </div>
              <div className="flex flex-row sm:flex-col gap-3 self-start shrink-0">
                <a
                  href="https://github.com/anikchand461/cvz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 border-2 border-black bg-neo-green flex items-center justify-center hover:bg-black hover:text-white transition-all cursor-hover shadow-hard-sm"
                  ><i className="ri-github-fill text-2xl"></i
                ></a>
                <a
                  href="https://cvz-cli.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 border-2 border-black bg-neo-yellow flex items-center justify-center hover:bg-black hover:text-white transition-all cursor-hover shadow-hard-sm"
                  ><i className="ri-external-link-line text-2xl"></i
                ></a>
              </div>
            </div>
          </article>

          <article
            className="reveal group bg-white border-4 border-black p-4 shadow-hard md:mt-20"
          >
            <div
              className="bg-black border-2 border-black aspect-video relative overflow-hidden mb-6"
            >
              <img
                src="/Assets/images/lazytune.png"
                alt="Movie Recommender System"
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
              />
            </div>
            <div
              className="flex flex-col sm:flex-row justify-between items-start gap-4"
            >
              <div className="flex-1 min-w-0">
                <h3
                  className="text-2xl md:text-4xl font-black uppercase mb-2 group-hover:text-neo-blue transition-colors glitch-hover"
                >
                  LAZYTUNE
                </h3>
                <p className="font-mono text-sm mb-4">
                  A hyperparameter optimization framework built for scikit-learn
                  models. Early pruning of the bad models and full training of
                  the best models.
                </p>
                <div className="flex gap-2 font-mono text-xs font-bold flex-wrap">
                  <span className="bg-neo-black text-white px-2 py-1"
                    >Pypi package</span
                  ><span className="bg-neo-black text-white px-2 py-1">Python</span
                  ><span className="bg-neo-black text-white px-2 py-1"
                    >Macine learning</span
                  ><span className="bg-neo-black text-white px-2 py-1"
                    >Hyperparameter tuning</span
                  >
                </div>
              </div>
              <div className="flex flex-row sm:flex-col gap-3 self-start shrink-0">
                <a
                  href="https://github.com/anikchand461/lazytune"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 border-2 border-black bg-neo-green flex items-center justify-center hover:bg-black hover:text-white transition-all cursor-hover shadow-hard-sm"
                  ><i className="ri-github-fill text-2xl"></i
                ></a>
                <a
                  href="https://lazytune.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 border-2 border-black bg-neo-yellow flex items-center justify-center hover:bg-black hover:text-white transition-all cursor-hover shadow-hard-sm"
                  ><i className="ri-external-link-line text-2xl"></i
                ></a>
              </div>
            </div>
          </article>
          

          <article
            className="reveal group bg-white border-4 border-black p-4 shadow-hard"
          >
            <div
              className="bg-black border-2 border-black aspect-video relative overflow-hidden mb-6"
            >
              <img
                src="/Assets/images/todoc.png"
                alt="todoc"
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
              />
            </div>
            <div
              className="flex flex-col sm:flex-row justify-between items-start gap-4"
            >
              <div className="flex-1 min-w-0">
                <h3
                  className="text-2xl md:text-4xl font-black uppercase mb-2 group-hover:text-neo-purple transition-colors glitch-hover"
                >
                  TODOC
                </h3>
                <p className="font-mono text-sm mb-4">
                  The most powerful terminal task manager. Fast, beautiful, and
                  built entirely in your shell.
                </p>
                <div className="flex gap-2 font-mono text-xs font-bold flex-wrap">
                  <span className="bg-neo-black text-white px-2 py-1">Python</span
                  ><span className="bg-neo-black text-white px-2 py-1"
                    >Command line tool</span
                  ><span className="bg-neo-black text-white px-2 py-1"
                    >Pypi package</span
                  >
                </div>
              </div>
              <div className="flex flex-row sm:flex-col gap-3 self-start shrink-0">
                <a
                  href="https://github.com/anikchand461/todoc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 border-2 border-black bg-neo-green flex items-center justify-center hover:bg-black hover:text-white transition-all cursor-hover shadow-hard-sm"
                  ><i className="ri-github-fill text-2xl"></i
                ></a>
                <a
                  href="https://todocpy.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 border-2 border-black bg-neo-yellow flex items-center justify-center hover:bg-black hover:text-white transition-all cursor-hover shadow-hard-sm"
                  ><i className="ri-external-link-line text-2xl"></i
                ></a>
              </div>
            </div>
          </article>

          <article
            className="reveal group bg-white border-4 border-black p-4 shadow-hard md:mt-20"
          >
            <div
              className="bg-black border-2 border-black aspect-video relative overflow-hidden mb-6"
            >
              <img
                src="/Assets/images/zerokey.png"
                alt="Movie Recommender System"
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
              />
            </div>
            <div
              className="flex flex-col sm:flex-row justify-between items-start gap-4"
            >
              <div className="flex-1 min-w-0">
                <h3
                  className="text-2xl md:text-4xl font-black uppercase mb-2 group-hover:text-neo-blue transition-colors glitch-hover"
                >
                  ZEROKEY
                </h3>
                <p className="font-mono text-sm mb-4">
                  Unified API Key Management for Developers. Securely store,
                  manage, rotate, and call multiple AI/LLM API keys (OpenAI,
                  Anthropic, Groq, Gemini, and more) from one place — with zero
                  plaintext leaks and unified interface.
                </p>
                <div className="flex gap-2 font-mono text-xs font-bold flex-wrap">
                  <span className="bg-neo-black text-white px-2 py-1"
                    >Pypi package</span
                  ><span className="bg-neo-black text-white px-2 py-1">Python</span
                  ><span className="bg-neo-black text-white px-2 py-1"
                    >developer tool</span
                  >
                </div>
              </div>
              <div className="flex flex-row sm:flex-col gap-3 self-start shrink-0">
                <a
                  href="https://github.com/anikchand461/zerokey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 border-2 border-black bg-neo-green flex items-center justify-center hover:bg-black hover:text-white transition-all cursor-hover shadow-hard-sm"
                  ><i className="ri-github-fill text-2xl"></i
                ></a>
                <a
                  href="https://zerokey.onrender.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 border-2 border-black bg-neo-yellow flex items-center justify-center hover:bg-black hover:text-white transition-all cursor-hover shadow-hard-sm"
                  ><i className="ri-external-link-line text-2xl"></i
                ></a>
              </div>
            </div>
          </article>

          <article
            className="reveal group bg-white border-4 border-black p-4 shadow-hard extra-project hidden"
          >
            <div
              className="bg-black border-2 border-black aspect-video relative overflow-hidden mb-6"
            >
              <img
                src="/Assets/images/task-cli.png"
                alt="Task CLI"
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
              />
            </div>
            <div
              className="flex flex-col sm:flex-row justify-between items-start gap-4"
            >
              <div className="flex-1 min-w-0">
                <h3
                  className="text-2xl md:text-4xl font-black uppercase mb-2 group-hover:text-neo-purple transition-colors glitch-hover"
                >
                  TASK CLI
                </h3>
                <p className="font-mono text-sm mb-4">
                  A cross-platform command-line task manager built in Go. Allows
                  users to add, list, complete, and clear tasks directly from
                  the terminal, with support for macOS, Linux, and Windows.
                </p>
                <div className="flex gap-2 font-mono text-xs font-bold flex-wrap">
                  <span className="bg-neo-black text-white px-2 py-1">Go</span
                  ><span className="bg-neo-black text-white px-2 py-1"
                    >Terminal-app</span
                  >
                </div>
              </div>
              <div className="flex flex-row sm:flex-col gap-3 self-start shrink-0">
                <a
                  href="https://github.com/anikchand461/task"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 border-2 border-black bg-neo-green flex items-center justify-center hover:bg-black hover:text-white transition-all cursor-hover shadow-hard-sm"
                  ><i className="ri-github-fill text-2xl"></i
                ></a>
                <a
                  href="https://task-ten-gules.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 border-2 border-black bg-neo-yellow flex items-center justify-center hover:bg-black hover:text-white transition-all cursor-hover shadow-hard-sm"
                  ><i className="ri-external-link-line text-2xl"></i
                ></a>
              </div>
            </div>
          </article>

          <article
            className="reveal group bg-white border-4 border-black p-4 shadow-hard md:mt-20 extra-project hidden"
          >
            <div
              className="bg-black border-2 border-black aspect-video relative overflow-hidden mb-6"
            >
              <img
                src="/Assets/images/movie.jpg"
                alt="Movie Recommender System"
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
              />
            </div>
            <div
              className="flex flex-col sm:flex-row justify-between items-start gap-4"
            >
              <div className="flex-1 min-w-0">
                <h3
                  className="text-2xl md:text-4xl font-black uppercase mb-2 group-hover:text-neo-blue transition-colors glitch-hover"
                >
                  MOVIE RECOMMENDER
                </h3>
                <p className="font-mono text-sm mb-4">
                  A Streamlit web app that recommends movies using TMDB data. It
                  applies NLP and machine learning to suggest films similar to
                  your favorites.
                </p>
                <div className="flex gap-2 font-mono text-xs font-bold flex-wrap">
                  <span className="bg-neo-black text-white px-2 py-1"
                    >Streamlit</span
                  ><span className="bg-neo-black text-white px-2 py-1">Python</span
                  ><span className="bg-neo-black text-white px-2 py-1"
                    >Scikit Learn</span
                  >
                </div>
              </div>
              <div className="flex flex-row sm:flex-col gap-3 self-start shrink-0">
                <a
                  href="https://github.com/anikchand461/tmdb-movie-recommender"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 border-2 border-black bg-neo-green flex items-center justify-center hover:bg-black hover:text-white transition-all cursor-hover shadow-hard-sm"
                  ><i className="ri-github-fill text-2xl"></i
                ></a>
                <a
                  href="https://tmdb-movie-recommender-ptqbdcxa8svjufamz8zm2k.streamlit.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 border-2 border-black bg-neo-yellow flex items-center justify-center hover:bg-black hover:text-white transition-all cursor-hover shadow-hard-sm"
                  ><i className="ri-external-link-line text-2xl"></i
                ></a>
              </div>
            </div>
          </article>

          <article
            className="reveal group bg-white border-4 border-black p-4 shadow-hard extra-project hidden"
          >
            <div
              className="bg-black border-2 border-black aspect-video relative overflow-hidden mb-6"
            >
              <img
                src="/Assets/images/chatbot.png"
                alt="AkBot"
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
              />
            </div>
            <div
              className="flex flex-col sm:flex-row justify-between items-start gap-4"
            >
              <div className="flex-1 min-w-0">
                <h3
                  className="text-2xl md:text-4xl font-black uppercase mb-2 group-hover:text-neo-purple transition-colors glitch-hover"
                >
                  AkBot
                </h3>
                <p className="font-mono text-sm mb-4">
                  Developed a personalized chatbot using RAG + Gemini API,
                  integrated with FastAPI and FAISS index, and deployed on
                  Render with a JS frontend.
                </p>
                <div className="flex gap-2 font-mono text-xs font-bold flex-wrap">
                  <span className="bg-neo-black text-white px-2 py-1">Python</span
                  ><span className="bg-neo-black text-white px-2 py-1">NLP</span
                  ><span className="bg-neo-black text-white px-2 py-1">RAG</span
                  ><span className="bg-neo-black text-white px-2 py-1">FAISS</span>
                </div>
              </div>
              <div className="flex flex-row sm:flex-col gap-3 self-start shrink-0">
                <a
                  href="https://github.com/anikchand461/AkBot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 border-2 border-black bg-neo-green flex items-center justify-center hover:bg-black hover:text-white transition-all cursor-hover shadow-hard-sm"
                  ><i className="ri-github-fill text-2xl"></i
                ></a>
                <a
                  href="https://akbot-mxe4.onrender.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 border-2 border-black bg-neo-yellow flex items-center justify-center hover:bg-black hover:text-white transition-all cursor-hover shadow-hard-sm"
                  ><i className="ri-external-link-line text-2xl"></i
                ></a>
              </div>
            </div>
          </article>

          <article
            className="reveal group bg-white border-4 border-black p-4 shadow-hard md:mt-20 extra-project hidden"
          >
            <div
              className="bg-black border-2 border-black aspect-video relative overflow-hidden mb-6"
            >
              <img
                src="/Assets/images/sentiment-analysis.png"
                alt="Customer Sentiment Segmentation"
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
              />
            </div>
            <div
              className="flex flex-col sm:flex-row justify-between items-start gap-4"
            >
              <div className="flex-1 min-w-0">
                <h3
                  className="text-2xl md:text-4xl font-black uppercase mb-2 group-hover:text-neo-blue transition-colors glitch-hover"
                >
                  Customer Sentiment Segmentation
                </h3>
                <p className="font-mono text-sm mb-4">
                  A sentiment analysis app that classifies IMDB reviews as
                  positive or negative — useful for customer insights and
                  segmentation.
                </p>
                <div className="flex gap-2 font-mono text-xs font-bold flex-wrap">
                  <span className="bg-neo-black text-white px-2 py-1"
                    >Streamlit</span
                  ><span className="bg-neo-black text-white px-2 py-1">Python</span
                  ><span className="bg-neo-black text-white px-2 py-1">ML</span>
                </div>
              </div>
              <div className="flex flex-row sm:flex-col gap-3 self-start shrink-0">
                <a
                  href="https://github.com/anikchand461/sentiment-analysis"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 border-2 border-black bg-neo-green flex items-center justify-center hover:bg-black hover:text-white transition-all cursor-hover shadow-hard-sm"
                  ><i className="ri-github-fill text-2xl"></i
                ></a>
                <a
                  href="https://sentimentt-analysis.streamlit.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 border-2 border-black bg-neo-yellow flex items-center justify-center hover:bg-black hover:text-white transition-all cursor-hover shadow-hard-sm"
                  ><i className="ri-external-link-line text-2xl"></i
                ></a>
              </div>
            </div>
          </article>

          <article
            className="reveal group bg-white border-4 border-black p-4 shadow-hard extra-project hidden"
          >
            <div
              className="bg-black border-2 border-black aspect-video relative overflow-hidden mb-6"
            >
              <img
                src="/Assets/images/personality-predictor.jpg"
                alt="Personality Predictor"
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
              />
            </div>
            <div
              className="flex flex-col sm:flex-row justify-between items-start gap-4"
            >
              <div className="flex-1 min-w-0">
                <h3
                  className="text-2xl md:text-4xl font-black uppercase mb-2 group-hover:text-neo-purple transition-colors glitch-hover"
                >
                  Personality Predictor
                </h3>
                <p className="font-mono text-sm mb-4">
                  A Streamlit web app that predicts whether a person is an
                  introvert or extrovert based on behavioral data using a Random
                  Forest classifier.
                </p>
                <div className="flex gap-2 font-mono text-xs font-bold flex-wrap">
                  <span className="bg-neo-black text-white px-2 py-1">ML</span
                  ><span className="bg-neo-black text-white px-2 py-1">Python</span
                  ><span className="bg-neo-black text-white px-2 py-1"
                    >Streamlit</span
                  ><span className="bg-neo-black text-white px-2 py-1"
                    >Random Forest</span
                  >
                </div>
              </div>
              <div className="flex flex-row sm:flex-col gap-3 self-start shrink-0">
                <a
                  href="https://github.com/anikchand461/personality-predictor"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 border-2 border-black bg-neo-green flex items-center justify-center hover:bg-black hover:text-white transition-all cursor-hover shadow-hard-sm"
                  ><i className="ri-github-fill text-2xl"></i
                ></a>
                <a
                  href="https://personality-predictorr.streamlit.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 border-2 border-black bg-neo-yellow flex items-center justify-center hover:bg-black hover:text-white transition-all cursor-hover shadow-hard-sm"
                  ><i className="ri-external-link-line text-2xl"></i
                ></a>
              </div>
            </div>
          </article>

          <article
            className="reveal group bg-white border-4 border-black p-4 shadow-hard md:mt-20 extra-project hidden"
          >
            <div
              className="bg-black border-2 border-black aspect-video relative overflow-hidden mb-6"
            >
              <img
                src="/Assets/images/quizly.jpg"
                alt="Quizly"
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
              />
            </div>
            <div
              className="flex flex-col sm:flex-row justify-between items-start gap-4"
            >
              <div className="flex-1 min-w-0">
                <h3
                  className="text-2xl md:text-4xl font-black uppercase mb-2 group-hover:text-neo-blue transition-colors glitch-hover"
                >
                  Quizly
                </h3>
                <p className="font-mono text-sm mb-4">
                  AI-based quiz generator for instant MCQ practice. Lightweight,
                  mobile-accessible web and APK app.
                </p>
                <div className="flex gap-2 font-mono text-xs font-bold flex-wrap">
                  <span className="bg-neo-black text-white px-2 py-1">FastAPI</span
                  ><span className="bg-neo-black text-white px-2 py-1">Python</span
                  ><span className="bg-neo-black text-white px-2 py-1"
                    >Gemini-API</span
                  >
                </div>
              </div>
              <div className="flex flex-row sm:flex-col gap-3 self-start shrink-0">
                <a
                  href="https://github.com/anikchand461/quizly"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 border-2 border-black bg-neo-green flex items-center justify-center hover:bg-black hover:text-white transition-all cursor-hover shadow-hard-sm"
                  ><i className="ri-github-fill text-2xl"></i
                ></a>
                <a
                  href="https://quizly-6oo5.onrender.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 border-2 border-black bg-neo-yellow flex items-center justify-center hover:bg-black hover:text-white transition-all cursor-hover shadow-hard-sm"
                  ><i className="ri-external-link-line text-2xl"></i
                ></a>
              </div>
            </div>
          </article>

          <article
            className="reveal group bg-white border-4 border-black p-4 shadow-hard extra-project hidden"
          >
            <div
              className="bg-black border-2 border-black aspect-video relative overflow-hidden mb-6"
            >
              <img
                src="/Assets/images/bill_vault.jpeg"
                alt="BillVault"
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
              />
            </div>
            <div
              className="flex flex-col sm:flex-row justify-between items-start gap-4"
            >
              <div className="flex-1 min-w-0">
                <h3
                  className="text-2xl md:text-4xl font-black uppercase mb-2 group-hover:text-neo-purple transition-colors glitch-hover"
                >
                  BillVault
                </h3>
                <p className="font-mono text-sm mb-4">
                  Digital bill management system with OCR auto-fill
                  capabilities, user authentication, and admin dashboard.
                </p>
                <div className="flex gap-2 font-mono text-xs font-bold flex-wrap">
                  <span className="bg-neo-black text-white px-2 py-1">Python</span
                  ><span className="bg-neo-black text-white px-2 py-1">Django</span
                  ><span className="bg-neo-black text-white px-2 py-1">OCR</span>
                </div>
              </div>
              <div className="flex flex-row sm:flex-col gap-3 self-start shrink-0">
                <a
                  href="https://github.com/anikchand461/WarrantyManager"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 border-2 border-black bg-neo-green flex items-center justify-center hover:bg-black hover:text-white transition-all cursor-hover shadow-hard-sm"
                  ><i className="ri-github-fill text-2xl"></i
                ></a>
                <a
                  href="https://billvault.pythonanywhere.com/accounts/login/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 border-2 border-black bg-neo-yellow flex items-center justify-center hover:bg-black hover:text-white transition-all cursor-hover shadow-hard-sm"
                  ><i className="ri-external-link-line text-2xl"></i
                ></a>
              </div>
            </div>
          </article>

          <article
            className="reveal group bg-white border-4 border-black p-4 shadow-hard md:mt-20 extra-project hidden"
          >
            <div
              className="bg-black border-2 border-black aspect-video relative overflow-hidden mb-6"
            >
              <img
                src="/Assets/images/report_connect.jpg"
                alt="Report Connect"
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
              />
            </div>
            <div
              className="flex flex-col sm:flex-row justify-between items-start gap-4"
            >
              <div className="flex-1 min-w-0">
                <h3
                  className="text-2xl md:text-4xl font-black uppercase mb-2 group-hover:text-neo-blue transition-colors glitch-hover"
                >
                  Report Connect
                </h3>
                <p className="font-mono text-sm mb-4">
                  Secure, anonymous crime-reporting platform with AI-based
                  hotspot prediction using Kernel Density Estimation.
                </p>
                <div className="flex gap-2 font-mono text-xs font-bold flex-wrap">
                  <span className="bg-neo-black text-white px-2 py-1">Python</span
                  ><span className="bg-neo-black text-white px-2 py-1">Django</span
                  ><span className="bg-neo-black text-white px-2 py-1">ML</span>
                </div>
              </div>
              <div className="flex flex-row sm:flex-col gap-3 self-start shrink-0">
                <a
                  href="https://github.com/anikchand461/tmdb-movie-recommender"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 border-2 border-black bg-neo-green flex items-center justify-center hover:bg-black hover:text-white transition-all cursor-hover shadow-hard-sm"
                  ><i className="ri-github-fill text-2xl"></i
                ></a>
              </div>
            </div>
          </article>
        </div>
        <div className="text-center mt-16 md:mt-24">
          <button
            id="projects-toggle-btn"
            onClick={(e) => toggleProjects(e.currentTarget)}
            className="inline-block bg-neo-black text-white px-8 md:px-12 py-4 md:py-5 font-bold font-mono text-lg md:text-xl hover:bg-neo-white hover:text-black border-4 border-black transition-all shadow-hard hover:shadow-none cursor-hover"
            >SHOW MORE ▼</button
          >
        </div>
      </div>
    </section>

    {/* BLOGS */}
    <section
      id="blogs"
      className="py-16 md:py-24 bg-neo-black border-t-4 border-black overflow-hidden relative"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div
          className="flex items-center justify-between mb-10 md:mb-16 bg-white/5 border-2 border-white/10 p-3 md:p-4 shadow-hard w-full"
        >
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex gap-1.5 shrink-0">
              <div
                className="h-3 w-3 bg-red-500 rounded-full border border-black"
              ></div>
              <div
                className="h-3 w-3 bg-yellow-500 rounded-full border border-black"
              ></div>
              <div
                className="h-3 w-3 bg-green-500 rounded-full border border-black"
              ></div>
            </div>
            <h2
              className="font-mono text-white text-base md:text-xl font-bold ml-2 md:ml-4 tracking-tighter"
            >
              Blogs
            </h2>
            <div
              className="ml-2 md:ml-8 px-2 bg-neo-blue text-black text-[10px] font-black uppercase whitespace-nowrap"
            >
              LIVE_FEED
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href="https://dev.to/anikchand461"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 px-3 md:px-4 py-1.5 bg-neo-purple/20 border border-neo-purple text-neo-purple text-xs font-mono font-bold uppercase tracking-wider hover:bg-neo-purple hover:text-black transition-all duration-300 flex items-center gap-1 group"
            >
              <span>dev.to</span
              ><i
                className="ri-external-link-line text-sm group-hover:rotate-45 transition-transform"
              ></i>
            </a>
            <a
              href="https://hashnode.com/@anikchand461"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 md:px-4 py-1.5 bg-neo-blue/20 border border-neo-blue text-neo-blue text-xs font-mono font-bold uppercase tracking-wider hover:bg-neo-blue hover:text-black transition-all duration-300 flex items-center gap-1 group"
            >
              <span>hashnode</span
              ><i
                className="ri-external-link-line text-sm group-hover:rotate-45 transition-transform"
              ></i>
            </a>
          </div>
        </div>
      </div>
      <div className="marquee-container overflow-hidden w-full">
        <div className="marquee-content" id="blog-track">
          <a
            href="https://dev.to/anikchand461/i-was-tired-of-waiting-for-gridsearchcv-so-i-built-something-smarter-323g"
            target="_blank"
            rel="noopener noreferrer"
            className="blog-card bg-neo-black border-4 border-white/10 overflow-hidden shadow-hard hover:border-neo-green/50 hover:-translate-y-2 transition-all duration-500 block"
          >
            <div
              className="w-full h-40 md:h-48 overflow-hidden border-b-4 border-neo-green"
            >
              <img
                src="/Assets/images/lazytune.png"
                alt="Blog 1"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://via.placeholder.com/420x192/121212/33FF57?text=Blog+1'; }}
              />
            </div>
            <div className="p-4 md:p-6">
              <div className="flex justify-between items-start mb-3">
                <div
                  className="font-mono text-neo-green text-xs font-bold tracking-widest uppercase"
                >
                  BLOG_001
                </div>
                <div className="text-[10px] font-mono text-gray-500">2026</div>
              </div>
              <h3
                className="font-black text-base md:text-xl leading-tight mb-3 text-white/90 hover:text-neo-green transition-colors"
              >
                I Was Tired of Waiting for GridSearchCV. So I Built Something
                Smarter
              </h3>
              <p className="font-mono text-gray-300 text-sm mb-4 line-clamp-3">
                Most hyperparameter combinations are obviously bad within the
                first few training rounds. You don't need to fully train them to
                know they're losers.
              </p>
              <span className="font-mono text-xs text-neo-green/70"
                >Read on DEV.to →</span
              >
            </div>
          </a>

          <a
            href="https://dev.to/anikchand461/how-google-translate-chatgpt-work-the-transformer-unboxed-3el"
            target="_blank"
            rel="noopener noreferrer"
            className="blog-card bg-neo-black border-4 border-white/10 overflow-hidden shadow-hard hover:border-neo-green/50 hover:-translate-y-2 transition-all duration-500 block"
          >
            <div
              className="w-full h-40 md:h-48 overflow-hidden border-b-4 border-neo-green"
            >
              <img
                src="/Assets/images/banner-trans.png"
                alt="Blog 1"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://via.placeholder.com/420x192/121212/33FF57?text=Blog+1'; }}
              />
            </div>
            <div className="p-4 md:p-6">
              <div className="flex justify-between items-start mb-3">
                <div
                  className="font-mono text-neo-green text-xs font-bold tracking-widest uppercase"
                >
                  BLOG_002
                </div>
                <div className="text-[10px] font-mono text-gray-500">2025</div>
              </div>
              <h3
                className="font-black text-base md:text-xl leading-tight mb-3 text-white/90 hover:text-neo-green transition-colors"
              >
                How Google Translate &amp; ChatGPT Work: The Transformer,
                Unboxed
              </h3>
              <p className="font-mono text-gray-300 text-sm mb-4 line-clamp-3">
                A beginner-friendly deep dive into transformers powering Google
                Translate, ChatGPT, and modern NLP.
              </p>
              <span className="font-mono text-xs text-neo-green/70"
                >Read on DEV.to →</span
              >
            </div>
          </a>
          <a
            href="https://dev.to/anikchand461/a-beginners-gan-adventure-with-digits-54g4"
            target="_blank"
            rel="noopener noreferrer"
            className="blog-card bg-neo-black border-4 border-white/10 overflow-hidden shadow-hard hover:border-neo-blue/50 hover:-translate-y-2 transition-all duration-500 block"
          >
            <div
              className="w-full h-40 md:h-48 overflow-hidden border-b-4 border-neo-blue"
            >
              <img
                src="/Assets/images/gan-blog.png"
                alt="Blog 2"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://via.placeholder.com/420x192/121212/3B82F6?text=Blog+2'; }}
              />
            </div>
            <div className="p-4 md:p-6">
              <div className="flex justify-between items-start mb-3">
                <div
                  className="font-mono text-neo-blue text-xs font-bold tracking-widest uppercase"
                >
                  BLOG_003
                </div>
                <div className="text-[10px] font-mono text-gray-500">2025</div>
              </div>
              <h3
                className="font-black text-base md:text-xl leading-tight mb-3 text-white/90"
              >
                A Beginner's GAN Adventure with Digits
              </h3>
              <p className="font-mono text-gray-300 text-sm mb-4 line-clamp-3">
                My journey building a simple GAN from scratch to generate
                handwritten digits — with code, failures, and success.
              </p>
              <span className="font-mono text-xs text-neo-blue/70"
                >Read on DEV.to →</span
              >
            </div>
          </a>
          <a
            href="https://dev.to/anikchand461/understanding-the-auc-roc-curve-in-machine-learning-with-python-code-3nlc"
            target="_blank"
            rel="noopener noreferrer"
            className="blog-card bg-neo-black border-4 border-white/10 overflow-hidden shadow-hard hover:border-neo-pink/50 hover:-translate-y-2 transition-all duration-500 block"
          >
            <div
              className="w-full h-40 md:h-48 overflow-hidden border-b-4 border-neo-pink"
            >
              <img
                src="/Assets/images/auc-roc.jpg"
                alt="Blog 3"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://via.placeholder.com/420x192/121212/FF70A6?text=Blog+3'; }}
              />
            </div>
            <div className="p-4 md:p-6">
              <div className="flex justify-between items-start mb-3">
                <div
                  className="font-mono text-neo-pink text-xs font-bold tracking-widest uppercase"
                >
                  BLOG_004
                </div>
                <div className="text-[10px] font-mono text-gray-500">2025</div>
              </div>
              <h3
                className="font-black text-base md:text-xl leading-tight mb-3 text-white/90"
              >
                The Curve That Judges Your ML Model: AUC-ROC Explained
              </h3>
              <p className="font-mono text-gray-300 text-sm mb-4 line-clamp-3">
                Clear explanations, visuals, and intuition behind why AUC-ROC is
                the go-to metric for classification.
              </p>
              <span className="font-mono text-xs text-neo-pink/70"
                >Read on DEV.to →</span
              >
            </div>
          </a>
          <a
            href="https://dev.to/anikchand461/sentiment-analysis-the-classical-way-no-deep-learning-3lc6"
            target="_blank"
            rel="noopener noreferrer"
            className="blog-card bg-neo-black border-4 border-white/10 overflow-hidden shadow-hard hover:border-neo-purple/50 hover:-translate-y-2 transition-all duration-500 block"
          >
            <div
              className="w-full h-40 md:h-48 overflow-hidden border-b-4 border-neo-purple"
            >
              <img
                src="/Assets/images/sentiment-analysis.png"
                alt="Blog 4"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="p-4 md:p-6">
              <div className="flex justify-between items-start mb-3">
                <div
                  className="font-mono text-neo-purple text-xs font-bold tracking-widest uppercase"
                >
                  BLOG_005
                </div>
                <div className="text-[10px] font-mono text-gray-500">2025</div>
              </div>
              <h3
                className="font-black text-base md:text-xl leading-tight mb-3 text-white/90"
              >
                Sentiment Analysis, the Classical Way — No Deep Learning
              </h3>
              <p className="font-mono text-gray-300 text-sm mb-4 line-clamp-3">
                Classical NLP approaches to sentiment classification without any
                deep learning.
              </p>
              <span className="font-mono text-xs text-neo-purple/70"
                >Read on DEV.to →</span
              >
            </div>
          </a>
          <a
            href="https://dev.to/anikchand461/regression-in-ml-explained-the-ultimate-hands-on-guide-484f"
            target="_blank"
            rel="noopener noreferrer"
            className="blog-card bg-neo-black border-4 border-white/10 overflow-hidden shadow-hard hover:border-neo-purple/50 hover:-translate-y-2 transition-all duration-500 block"
          >
            <div
              className="w-full h-40 md:h-48 overflow-hidden border-b-4 border-neo-purple"
            >
              <img
                src="/Assets/images/regression.jpg"
                alt="Blog 5"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="p-4 md:p-6">
              <div className="flex justify-between items-start mb-3">
                <div
                  className="font-mono text-neo-purple text-xs font-bold tracking-widest uppercase"
                >
                  BLOG_006
                </div>
                <div className="text-[10px] font-mono text-gray-500">2025</div>
              </div>
              <h3
                className="font-black text-base md:text-xl leading-tight mb-3 text-white/90"
              >
                Regression in ML Explained: The Ultimate Hands-On Guide
              </h3>
              <p className="font-mono text-gray-300 text-sm mb-4 line-clamp-3">
                A comprehensive hands-on guide to regression techniques in
                machine learning.
              </p>
              <span className="font-mono text-xs text-neo-purple/70"
                >Read on DEV.to →</span
              >
            </div>
          </a>
          <a
            href="https://dev.to/anikchand461/onehotencoder-shape-mismatch-mystery-in-titanic-dataset-solved-3n6"
            target="_blank"
            rel="noopener noreferrer"
            className="blog-card bg-neo-black border-4 border-white/10 overflow-hidden shadow-hard hover:border-neo-purple/50 hover:-translate-y-2 transition-all duration-500 block"
          >
            <div
              className="w-full h-40 md:h-48 overflow-hidden border-b-4 border-neo-purple"
            >
              <img
                src="/Assets/images/titanic.jpg"
                alt="Blog 6"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="p-4 md:p-6">
              <div className="flex justify-between items-start mb-3">
                <div
                  className="font-mono text-neo-purple text-xs font-bold tracking-widest uppercase"
                >
                  BLOG_007
                </div>
                <div className="text-[10px] font-mono text-gray-500">2025</div>
              </div>
              <h3
                className="font-black text-base md:text-xl leading-tight mb-3 text-white/90"
              >
                OneHotEncoder Shape Mismatch Mystery in Titanic Dataset: Solved!
              </h3>
              <p className="font-mono text-gray-300 text-sm mb-4 line-clamp-3">
                Debugging a tricky shape mismatch error in the classic Titanic
                ML dataset.
              </p>
              <span className="font-mono text-xs text-neo-purple/70"
                >Read on DEV.to →</span
              >
            </div>
          </a>
          <a
            href="https://dev.to/anikchand461/crafting-fun-with-code-my-journey-building-the-hangman-game-11ih"
            target="_blank"
            rel="noopener noreferrer"
            className="blog-card bg-neo-black border-4 border-white/10 overflow-hidden shadow-hard hover:border-neo-purple/50 hover:-translate-y-2 transition-all duration-500 block"
          >
            <div
              className="w-full h-40 md:h-48 overflow-hidden border-b-4 border-neo-purple"
            >
              <img
                src="/Assets/images/hangman.jpg"
                alt="Blog 7"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="p-4 md:p-6">
              <div className="flex justify-between items-start mb-3">
                <div
                  className="font-mono text-neo-purple text-xs font-bold tracking-widest uppercase"
                >
                  BLOG_008
                </div>
                <div className="text-[10px] font-mono text-gray-500">2025</div>
              </div>
              <h3
                className="font-black text-base md:text-xl leading-tight mb-3 text-white/90"
              >
                Crafting Fun with Code: My Journey Building the Hangman Game
              </h3>
              <p className="font-mono text-gray-300 text-sm mb-4 line-clamp-3">
                Building the classic hangman game from scratch and lessons
                learned along the way.
              </p>
              <span className="font-mono text-xs text-neo-purple/70"
                >Read on DEV.to →</span
              >
            </div>
          </a>
        </div>
      </div>
    </section>

    {/* CONTACT */}
    <section id="contact" className="py-16 md:py-24 px-4 max-w-5xl mx-auto">
      <div
        className="bg-white border-4 border-black shadow-hard-xl p-6 md:p-8 lg:p-12 relative reveal mt-12"
      >
        <div
          className="absolute -top-8 md:-top-10 left-4 md:-left-6 bg-neo-yellow border-4 border-black px-4 md:px-6 py-2 shadow-hard rotate-[-5deg]"
        >
          <span className="font-black text-lg md:text-2xl">START A PROJECT</span>
        </div>
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 contact-grid"
        >
          <div>
            <h2
              className="text-4xl md:text-6xl font-black uppercase mb-4 md:mb-6 leading-[0.85]"
            >
              Let's<br />Talk<br />Code.
            </h2>
            <p
              className="font-mono text-base md:text-lg mb-6 md:mb-8 text-gray-600"
            >
              I am currently available for freelance work and open to full-time
              opportunities.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3 md:gap-4">
                <div
                  className="w-10 h-10 md:w-12 md:h-12 bg-neo-black text-white flex items-center justify-center border-2 border-black shrink-0"
                >
                  <i className="ri-mail-line text-lg md:text-xl"></i>
                </div>
                {/*
                  EMAIL LINK — built entirely in JS so Cloudflare's bot
                  cannot detect and obfuscate it during deployment.
                  Do NOT add a mailto: href here; the script below sets it.
                */}
                <a
                  id="contact-email-link"
                  href="#"
                  className="text-sm md:text-xl font-bold hover:bg-neo-blue cursor-hover break-all"
                ></a>
              </div>
              <div className="flex items-center gap-3 md:gap-4">
                <div
                  className="w-10 h-10 md:w-12 md:h-12 bg-neo-black text-white flex items-center justify-center border-2 border-black shrink-0"
                >
                  <i className="ri-map-pin-line text-lg md:text-xl"></i>
                </div>
                <span className="text-base md:text-xl font-bold"
                  >Kolkata, India</span
                >
              </div>
            </div>
          </div>
          <form
            id="contact-form"
            action="https://script.google.com/macros/s/AKfycbwoRCPavPCVuaSfllbM-QWxXNWoB3NH7zbOlY67Kv3fyVC_nHOOzBgYcADi8CK1Cf-QmA/exec"
            method="POST"
            className="space-y-5 md:space-y-6 bg-gray-50 p-4 md:p-6 border-2 border-black"
          >
            <div className="flex flex-col">
              <label className="font-mono font-bold mb-1 uppercase text-xs"
                >IDENTITY</label
              >
              <input
                type="text"
                name="identity"
                placeholder="NAME / COMPANY"
                required
                className="bg-white border-2 border-black p-3 font-bold focus:outline-none focus:bg-neo-yellow focus:shadow-hard-sm transition-all cursor-hover"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-mono font-bold mb-1 uppercase text-xs"
                >COORDINATES</label
              >
              <input
                type="email"
                name="email"
                placeholder="EMAIL ADDRESS"
                required
                className="bg-white border-2 border-black p-3 font-bold focus:outline-none focus:bg-neo-yellow focus:shadow-hard-sm transition-all cursor-hover"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-mono font-bold mb-1 uppercase text-xs"
                >TRANSMISSION</label
              >
              <textarea
                name="message"
                rows="4"
                placeholder="PROJECT DETAILS..."
                required
                className="bg-white border-2 border-black p-3 font-bold focus:outline-none focus:bg-neo-yellow focus:shadow-hard-sm transition-all resize-none cursor-hover"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-neo-blue text-white font-black text-lg md:text-xl py-3 md:py-4 border-2 border-black shadow-hard hover:bg-neo-black hover:translate-y-1 hover:shadow-none transition-all cursor-hover"
            >
              TRANSMIT DATA
            </button>
          </form>
        </div>
      </div>
    </section>

    {/* Success Toast */}
    <div
      id="success-toast"
      className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none opacity-0 transition-opacity duration-500 px-4"
    >
      <div
        className="bg-black border-4 border-neo-green text-neo-green px-6 md:px-10 py-5 md:py-6 rounded-none shadow-hard-xl flex items-center gap-4 md:gap-5"
      >
        <div
          className="w-12 h-12 md:w-16 md:h-16 rounded-full border-4 border-neo-green flex items-center justify-center relative animate-check-ring"
        >
          <svg
            className="w-8 h-8 md:w-10 md:h-10 animate-check"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="5"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <div className="font-mono font-black text-xl md:text-2xl tracking-widest">
          TRANSMITTED
        </div>
      </div>
    </div>

    {/* FOOTER */}
    <footer
      className="bg-black text-white py-12 md:py-16 px-4 border-t-8 border-neo-green font-mono relative overflow-hidden"
    >
      <div
        className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 relative z-10 footer-grid"
      >
        <div className="col-span-1 sm:col-span-2">
          <h2 className="text-3xl md:text-4xl font-black mb-4 md:mb-6">ANIK.</h2>
          <p className="text-gray-400 max-w-sm text-sm md:text-base">
            Designing for the future with the raw aesthetics of the past. No
            cookies, no trackers, just code.
          </p>
        </div>
        <div>
          <h3
            className="font-bold text-neo-green mb-4 border-b border-gray-700 pb-2"
          >
            SITEMAP
          </h3>
          <ul className="space-y-2 text-gray-400 text-sm md:text-base">
            <li>
              <a
                href="#"
                className="hover:text-white hover:underline decoration-neo-pink decoration-2 cursor-hover"
                >Home</a
              >
            </li>
            <li>
              <a
                href="#projects"
                className="hover:text-white hover:underline decoration-neo-pink decoration-2 cursor-hover"
                >Works</a
              >
            </li>
            <li>
              <a
                href="#about"
                className="hover:text-white hover:underline decoration-neo-pink decoration-2 cursor-hover"
                >About</a
              >
            </li>
            <li>
              <a
                href="#contact"
                className="hover:text-white hover:underline decoration-neo-pink decoration-2 cursor-hover"
                >Contact</a
              >
            </li>
          </ul>
        </div>

        <div>
          <h3
            className="font-bold text-neo-green mb-4 border-b border-gray-700 pb-2"
          >
            SOCIALS
          </h3>
          <div className="flex gap-4 flex-wrap">
            {/* Portfolio */}
            <a
              href="https://anikchand.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-60 transition-opacity cursor-hover"
              title="Portfolio"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="white"
              >
                <path
                  d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm7.931 9h-2.764a14.67 14.67 0 0 0-1.792-6.243A8.013 8.013 0 0 1 19.931 11zM12.53 4.027c1.035 1.364 2.427 3.78 2.627 6.973H9.03c.139-2.596.994-5.028 2.451-6.974.172-.01.347-.026.519-.026.179 0 .354.016.53.027zm-3.842.2A14.654 14.654 0 0 0 6.836 11H4.069a8.013 8.013 0 0 1 4.619-6.773zM4.069 13h2.767a14.654 14.654 0 0 0 1.852 6.573A8.013 8.013 0 0 1 4.069 13zm7.48 6.973C10.049 18.275 9.222 15.896 9.041 13h6.113c-.208 2.773-1.117 5.196-2.603 6.972a8.3 8.3 0 0 1-1.002.001zm3.842-.2A14.654 14.654 0 0 0 17.157 13h2.772a8.013 8.013 0 0 1-4.538 6.773z"
                />
              </svg>
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/anik-chand-3b14b12b6/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-60 transition-opacity cursor-hover"
              title="LinkedIn"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="white"
              >
                <path
                  d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                />
              </svg>
            </a>

            {/* GitHub */}
            <a
              href="https://github.com/anikchand461"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-60 transition-opacity cursor-hover"
              title="GitHub"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="white"
              >
                <path
                  d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                />
              </svg>
            </a>

            {/* X / Twitter */}
            <a
              href="https://x.com/anikchand461"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-60 transition-opacity cursor-hover"
              title="X / Twitter"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="white"
              >
                <path
                  d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                />
              </svg>
            </a>

            {/* Codeforces */}
            <a
              href="https://codeforces.com/profile/anikchand461"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-60 transition-opacity cursor-hover"
              title="Codeforces"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="white"
              >
                <path
                  d="M4.5 7.5A1.5 1.5 0 0 1 6 9v10.5A1.5 1.5 0 0 1 4.5 21h-3A1.5 1.5 0 0 1 0 19.5V9A1.5 1.5 0 0 1 1.5 7.5h3zm9-4.5A1.5 1.5 0 0 1 15 4.5v15a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 19.5v-15A1.5 1.5 0 0 1 10.5 3h3zm9 7.5A1.5 1.5 0 0 1 24 12v7.5a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 18 19.5V12a1.5 1.5 0 0 1 1.5-1.5h3z"
                />
              </svg>
            </a>

            {/* LeetCode */}
            <a
              href="https://leetcode.com/u/anikchand461/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-60 transition-opacity cursor-hover"
              title="LeetCode"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="white"
              >
                <path
                  d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z"
                />
              </svg>
            </a>

            {/* Codolio — using the code brackets SVG */}
            <a
              href="https://codolio.com/profile/anikchand461"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-60 transition-opacity cursor-hover"
              title="Codolio"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="white"
              >
                <path
                  d="M14.447 6.538a1 1 0 0 1 .553 1.304l-4 10a1 1 0 1 1-1.857-.743l4-10a1 1 0 0 1 1.304-.561zM7.707 8.293a1 1 0 0 1 0 1.414L5.414 12l2.293 2.293a1 1 0 1 1-1.414 1.414l-3-3a1 1 0 0 1 0-1.414l3-3a1 1 0 0 1 1.414 0zm8.586 0a1 1 0 0 1 1.414 0l3 3a1 1 0 0 1 0 1.414l-3 3a1 1 0 1 1-1.414-1.414L18.586 12l-2.293-2.293a1 1 0 0 1 0-1.414z"
                />
              </svg>
            </a>

            {/* DEV.to */}
            <a
              href="https://dev.to/anikchand461"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-60 transition-opacity cursor-hover"
              title="DEV.to"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="white"
              >
                <path
                  d="M7.42 10.05c-.18-.16-.46-.23-.84-.23H6l.02 2.44.04 2.45.56-.02c.41 0 .63-.07.83-.26.24-.24.26-.36.26-2.2 0-1.91-.02-1.96-.29-2.18zM0 4.94v14.12h24V4.94H0zM8.56 15.3c-.44.58-1.06.77-2.53.77H4.71V8.53h1.4c1.67 0 2.16.18 2.6.9.27.43.29.6.32 2.57.05 2.23-.02 2.73-.47 3.3zm5.09-5.47h-2.47v1.77h1.52v1.28l-.72.04-.75.03v1.77l1.22.03 1.2.04v1.28h-1.6c-1.53 0-1.6-.01-1.87-.3l-.3-.28v-3.16c0-3.02.01-3.18.25-3.48.23-.31.25-.31 1.88-.31h1.64v1.29zm4.68 5.45c-.17.43-.64.79-1 .79-.18 0-.45-.15-.67-.39-.32-.32-.45-.63-.82-2.08l-.9-3.39-.45-1.67h.76c.4 0 .75.02.75.05 0 .06 1.16 4.54 1.26 4.83.04.15.32-.7.73-2.3l.66-2.52.74-.04c.4-.02.73 0 .73.04 0 .14-1.67 6.38-1.8 6.68z"
                />
              </svg>
            </a>

            {/* Code360 — using image from socials folder */}
            <a
              href="https://www.naukri.com/code360/profile/anikchand"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-60 transition-opacity cursor-hover"
              title="Code360"
            >
              <img
                src="/Assets/images/socials/code360.png"
                alt="Code360"
                className="w-7 h-7"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            </a>

            {/* Kaggle */}
            <a
              href="https://www.kaggle.com/anikchand"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-60 transition-opacity cursor-hover"
              title="Kaggle"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="white"
              >
                <path
                  d="M18.825 23.859c-.022.092-.117.141-.281.141h-3.139c-.187 0-.351-.082-.492-.248l-5.178-6.589-1.448 1.374v5.111c0 .235-.117.352-.351.352H5.505c-.236 0-.354-.117-.354-.352V.353c0-.233.118-.353.354-.353h2.431c.234 0 .351.12.351.353v14.343l6.203-6.272c.165-.165.33-.246.495-.246h3.239c.144 0 .236.06.285.18.046.149.034.255-.036.315l-6.555 6.344 6.836 8.507c.095.104.117.208.07.334z"
                />
              </svg>
            </a>

            {/* CodeChef — using image from socials folder */}
            <a
              href="https://www.codechef.com/users/anikchand461"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-60 transition-opacity cursor-hover"
              title="CodeChef"
            >
              <img
                src="/Assets/images/socials/codechef.png"
                alt="CodeChef"
                className="w-8 h-8"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            </a>

            {/* HackerRank */}
            <a
              href="https://www.hackerrank.com/profile/anikchand461"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-60 transition-opacity cursor-hover"
              title="HackerRank"
            >
              <img
                src="/Assets/images/socials/hackerrank.png"
                alt="CodeChef"
                className="w-8 h-8"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            </a>

            {/* GitLab */}
            <a
              href="https://gitlab.com/anikchand461"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-60 transition-opacity cursor-hover"
              title="GitLab"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="white"
              >
                <path
                  d="M4.845.904c-.435 0-.82.28-.955.692C2.639 5.449 1.246 9.728.07 13.335a1.437 1.437 0 0 0 .522 1.607l11.071 8.045c.2.145.472.144.67-.004l11.073-8.04a1.436 1.436 0 0 0 .522-1.61c-1.285-3.942-2.683-8.256-3.817-11.746a1.004 1.004 0 0 0-.957-.684.987.987 0 0 0-.949.69l-2.405 7.408H8.2L5.795 1.594a.98.98 0 0 0-.95-.69zm-.006 1.42l2.173 6.678H2.675zm14.326 0l2.168 6.678h-4.341zm-10.593 7.81h6.856l-3.429 10.555z"
                />
              </svg>
            </a>

            {/* GeeksForGeeks — using image from socials folder */}
            <a
              href="https://www.geeksforgeeks.org/user/anikchand461/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-60 transition-opacity cursor-hover"
              title="GeeksForGeeks"
            >
              <img
                src="/Assets/images/socials/gfg.png"
                alt="GeeksForGeeks"
                className="w-7 h-7"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            </a>

            {/* AtCoder */}
            <a
              href="https://atcoder.jp/users/anikchand461"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-60 transition-opacity cursor-hover"
              title="AtCoder"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="white"
              >
                <path
                  d="M12 0L1.5 6v12L12 24l10.5-6V6zm0 2.1l8.5 4.9v9.8L12 21.9 3.5 16.8V7zM8 8l-2 8h1.5l.4-1.5h2.2l.4 1.5H12L10 8zm.75 1.5h.5L10 12.5H8.25zm4.25-.5v1h2v6h1.5v-6H18V9z"
                />
              </svg>
            </a>

            {/* InterviewBit */}
            <a
              href="https://www.interviewbit.com/profile/anik-chand/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-60 transition-opacity cursor-hover"
              title="CodeChef"
            >
              <img
                src="/Assets/images/socials/interviewbit.png"
                alt="CodeChef"
                className="w-9 h-9"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            </a>

            {/* Devfolio */}
            <a
              href="https://devfolio.co/@anikchand461"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-60 transition-opacity cursor-hover"
              title="Devfolio"
            >
              <img
                src="/Assets/images/socials/devfolio.png"
                alt="DevFolio"
                className="w-7 h-7"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            </a>

            {/* Discord */}
            <a
              href="https://discordapp.com/users/1217327551098130546"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-60 transition-opacity cursor-hover"
              title="Discord"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="white"
              >
                <path
                  d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.369-.444.85-.608 1.23a18.566 18.566 0 0 0-5.487 0 12.36 12.36 0 0 0-.617-1.23A.077.077 0 0 0 8.562 3c-1.714.29-3.354.8-4.885 1.491a.07.07 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .031.055 20.03 20.03 0 0 0 5.993 2.98.078.078 0 0 0 .084-.026c.462-.62.874-1.275 1.226-1.963a.075.075 0 0 0-.041-.104 13.2 13.2 0 0 1-1.872-.878.075.075 0 0 1-.008-.125c.126-.093.252-.19.372-.287a.075.075 0 0 1 .078-.01c3.927 1.764 8.18 1.764 12.061 0a.075.075 0 0 1 .079.009c.12.098.245.195.372.288a.075.075 0 0 1-.006.125c-.598.344-1.22.635-1.873.877a.075.075 0 0 0-.041.105c.36.687.772 1.341 1.225 1.962a.077.077 0 0 0 .084.028 19.963 19.963 0 0 0 6.002-2.981.076.076 0 0 0 .032-.054c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 0 0-.031-.028zM8.02 15.278c-1.182 0-2.157-1.069-2.157-2.38 0-1.312.956-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.956 2.38-2.157 2.38zm7.975 0c-1.183 0-2.157-1.069-2.157-2.38 0-1.312.955-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.946 2.38-2.157 2.38z"
                />
              </svg>
            </a>

            {/* YouTube */}
            <a
              href="https://www.youtube.com/@ZenXcode"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-60 transition-opacity cursor-hover"
              title="YouTube"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="white"
              >
                <path
                  d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
                />
              </svg>
            </a>

            {/* Gmail */}
            <a
              href="mailto:anikchand461@gmail.com"
              className="hover:opacity-60 transition-opacity cursor-hover"
              title="Gmail"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="white"
              >
                <path
                  d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
      <div
        className="text-center mt-10 md:mt-16 pt-8 border-t border-gray-800 text-gray-500 text-xs md:text-sm"
      >
        <p>© 2025 ANIK.exe // SYSTEM_END</p>
      </div>
      <div
        className="absolute bottom-0 left-0 w-full text-[20vw] font-black text-white opacity-[0.03] leading-none select-none pointer-events-none text-center"
      >
        BRUTAL
      </div>
    </footer>
      {/* SITE SEARCH: self-contained widget, see /js/search-widget.js */}
      <Script src="/js/search-widget.js" strategy="afterInteractive" />
      {/* PORTFOLIO ASSISTANT: rule-based chatbot, see /js/assistant-widget.js */}
      <Script src="/js/assistant-widget.js" strategy="afterInteractive" />
      {/* FIRST-LOAD ONBOARDING HINTS */}
      <Script src="/js/onboarding-hints.js" strategy="afterInteractive" />
    </>
  );
}
