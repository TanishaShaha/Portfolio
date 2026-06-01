/* ============================================================
   TANISHA SHAHA PORTFOLIO — script.js (Enhanced)
   ============================================================ */

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    initCursor();
    initNavbar();
    initHeroCanvas();
    initTypedText();
    initTilt();
    initScrollReveal();
    initSkillBars();
    initProjectFilter();
    initContactForm();
    initScrollTop();
    initMobileMenu();
  }

  /* ── CURSOR ──────────────────────────────────────────────── */
  function initCursor() {
    const cursor = document.getElementById("cursor");
    const trail = document.getElementById("cursorTrail");
    if (!cursor || !trail) return;

    let mouseX = 0, mouseY = 0, trailX = 0, trailY = 0;

    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + "px";
      cursor.style.top = mouseY + "px";
    });

    (function animTrail() {
      trailX += (mouseX - trailX) * 0.12;
      trailY += (mouseY - trailY) * 0.12;
      trail.style.left = trailX + "px";
      trail.style.top = trailY + "px";
      requestAnimationFrame(animTrail);
    })();
  }

  /* ── NAVBAR ──────────────────────────────────────────────── */
  function initNavbar() {
    const navbar = document.getElementById("navbar");
    const navLinks = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll("section[id]");

    window.addEventListener("scroll", () => {
      if (window.scrollY > 30) navbar.classList.add("scrolled");
      else navbar.classList.remove("scrolled");

      const scrollY = window.pageYOffset;
      sections.forEach((sec) => {
        const top = sec.offsetTop - 90;
        const bottom = top + sec.offsetHeight;
        const id = sec.getAttribute("id");
        if (scrollY >= top && scrollY < bottom) {
          navLinks.forEach((l) => l.classList.remove("active"));
          const active = document.querySelector(`.nav-link[href="#${id}"]`);
          if (active) active.classList.add("active");
        }
      });
    }, { passive: true });
  }

  /* ── MOBILE MENU ─────────────────────────────────────────── */
  function initMobileMenu() {
    const btn = document.getElementById("hamburger");
    const menu = document.getElementById("mobileMenu");
    if (!btn || !menu) return;

    btn.addEventListener("click", () => {
      btn.classList.toggle("open");
      menu.classList.toggle("open");
    });

    menu.querySelectorAll(".mob-link").forEach((link) => {
      link.addEventListener("click", () => {
        btn.classList.remove("open");
        menu.classList.remove("open");
      });
    });
  }

  /* ── HERO 3D CANVAS ──────────────────────────────────────── */
  function initHeroCanvas() {
    const canvas = document.getElementById("heroCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let W, H, particles = [], mouse = { x: -9999, y: -9999 };
    const COUNT = 90;

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", () => { resize(); buildParticles(); });

    document.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    function buildParticles() {
      particles = Array.from({ length: COUNT }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.8 + 0.5,
        alpha: Math.random() * 0.5 + 0.15,
        hue: Math.random() < 0.7 ? 190 : (Math.random() < 0.5 ? 245 : 320),
      }));
    }
    buildParticles();

    function draw() {
      ctx.clearRect(0, 0, W, H);

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            const alpha = (1 - dist / 130) * 0.15;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `hsla(190,80%,70%,${alpha})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }

      particles.forEach((p) => {
        const mdx = p.x - mouse.x;
        const mdy = p.y - mouse.y;
        const md = Math.sqrt(mdx * mdx + mdy * mdy);
        if (md < 100) {
          const force = (100 - md) / 100;
          p.vx += (mdx / md) * force * 0.5;
          p.vy += (mdy / md) * force * 0.5;
        }

        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > 2.5) { p.vx *= 0.95; p.vy *= 0.95; }

        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue},80%,75%,${p.alpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = `hsla(${p.hue},90%,80%,0.5)`;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      requestAnimationFrame(draw);
    }
    draw();
  }

  /* ── TYPED TEXT ──────────────────────────────────────────── */
  function initTypedText() {
    const el = document.getElementById("roleText");
    if (!el) return;
    const roles = [
      "Frontend Developer Intern",
      "Mobile App Developer",
      "UI/UX Enthusiast",
      "Computer Engineering Student",
      "Problem Solver",
    ];
    let ri = 0, ci = 0, deleting = false;
    const SPEED = 70, DEL_SPEED = 40, PAUSE = 1800;

    function type() {
      const cur = roles[ri];
      if (!deleting) {
        el.textContent = cur.slice(0, ++ci);
        if (ci === cur.length) { deleting = true; setTimeout(type, PAUSE); return; }
      } else {
        el.textContent = cur.slice(0, --ci);
        if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; }
      }
      setTimeout(type, deleting ? DEL_SPEED : SPEED);
    }
    type();
  }

  /* ── TILT ────────────────────────────────────────────────── */
  function initTilt() {
    document.querySelectorAll("[data-tilt]").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const rx = ((y - cy) / cy) * 6;
        const ry = -((x - cx) / cx) * 6;
        el.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateZ(8px)`;
        el.style.transition = "transform 0.1s ease";
      });
      el.addEventListener("mouseleave", () => {
        el.style.transform = "";
        el.style.transition = "transform 0.4s ease";
      });
    });
  }

  /* ── SCROLL REVEAL ───────────────────────────────────────── */
  function initScrollReveal() {
    const els = document.querySelectorAll(".reveal-up, .reveal-left, .reveal-right");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            const children = entry.target.querySelectorAll(".project-card, .goal-card, .award-card, .skill-group");
            children.forEach((child, i) => {
              child.style.animationDelay = i * 0.08 + "s";
            });
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -50px 0px" }
    );
    els.forEach((el) => obs.observe(el));
  }

  /* ── SKILL BARS (animate when in view) ───────────────────── */
  function initSkillBars() {
    const bars = document.querySelectorAll(".sbar-fill");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animated");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    bars.forEach((bar) => obs.observe(bar));
  }

  /* ── PROJECT FILTER ──────────────────────────────────────── */
  function initProjectFilter() {
    const btns = document.querySelectorAll(".filter-btn");
    const cards = document.querySelectorAll(".project-card");

    btns.forEach((btn) => {
      btn.addEventListener("click", () => {
        btns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const filter = btn.getAttribute("data-filter");

        cards.forEach((card, i) => {
          const cat = card.getAttribute("data-category");
          const show = filter === "all" || cat === filter;
          if (show) {
            card.style.display = "flex";
            card.style.animationDelay = (i % 9) * 0.05 + "s";
            card.style.animation = "none";
            void card.offsetWidth;
            card.style.animation = "cardReveal 0.4s ease both";
          } else {
            card.style.display = "none";
          }
        });
      });
    });
  }

  /* ── CONTACT FORM ────────────────────────────────────────── */
  function initContactForm() {
    const form = document.getElementById("contactForm");
    const success = document.getElementById("formSuccess");
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("emailAddress").value;
      const subject = document.getElementById("subject").value;
      const name = document.getElementById("fullName").value;
      const message = document.getElementById("message").value;

      const mailtoLink =
        `https://mail.google.com/mail/?view=cm&fs=1&to=shaha.tanisha@gmail.com` +
        `&su=${encodeURIComponent(subject)}` +
        `&body=${encodeURIComponent(`From: ${name} <${email}>\n\n${message}`)}`;

      window.open(mailtoLink, "_blank");

      if (success) {
        success.classList.add("visible");
        setTimeout(() => success.classList.remove("visible"), 4000);
      }
      form.reset();
    });
  }

  /* ── SCROLL TO TOP ───────────────────────────────────────── */
  function initScrollTop() {
    const btn = document.getElementById("scrollTopBtn");
    if (!btn) return;

    window.addEventListener("scroll", () => {
      if (window.scrollY > 500) btn.classList.add("visible");
      else btn.classList.remove("visible");
    }, { passive: true });

    btn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

})();