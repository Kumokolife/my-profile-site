(function () {
  const root = document.documentElement;

  // Theme: saved choice > OS preference
  const saved = localStorage.getItem("theme");
  const prefersLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
  const initialTheme = saved || (prefersLight ? "light" : "dark");
  root.dataset.theme = initialTheme;

  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");

  function setTheme(theme) {
    root.dataset.theme = theme;
    localStorage.setItem("theme", theme);
    const isLight = theme === "light";
    themeToggle?.setAttribute("aria-pressed", String(isLight));

    if (themeIcon) {
      themeIcon.innerHTML = isLight
        ? '<path d="M12 18a6 6 0 100-12 6 6 0 000 12z" stroke="currentColor" stroke-width="2"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'
        : '<path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
    }
  }

  setTheme(initialTheme);

  themeToggle?.addEventListener("click", () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    setTheme(next);
    toast(`Switched to ${next} mode`);
  });

  // Mobile menu
  const menuBtn = document.getElementById("menuBtn");
  const mobilePanel = document.getElementById("mobilePanel");
  if (menuBtn && mobilePanel) {
    menuBtn.addEventListener("click", () => {
      const open = mobilePanel.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", String(open));
    });
    mobilePanel.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => {
        mobilePanel.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Reveal on scroll
  const reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealEls = document.querySelectorAll(".reveal");
  if (!reducedMotion && "IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add("in"));
  }

  // Active nav link (scroll spy)
  const navLinks = Array.from(document.querySelectorAll('.nav-links a'));
  const sections = navLinks
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  if ("IntersectionObserver" in window && navLinks.length && sections.length) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(a => a.removeAttribute("aria-current"));
          const id = "#" + entry.target.id;
          const active = navLinks.find(a => a.getAttribute("href") === id);
          if (active) active.setAttribute("aria-current", "page");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0.01 });

    sections.forEach(s => spy.observe(s));
  }

  // Contact form (demo)
  const form = document.getElementById("contactForm");
  const note = document.getElementById("formNote");

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  form?.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name")?.value?.trim() || "";
    const email = document.getElementById("email")?.value?.trim() || "";
    const message = document.getElementById("message")?.value?.trim() || "";

    if (!name) return toast("Please enter your name.");
    if (!isValidEmail(email)) return toast("Please enter a valid email.");
    if (message.length < 10) return toast("Message is too short (min 10 characters).");

    toast("Message ready! Connect this form to a real endpoint.");
    if (note) note.textContent = "Success (demo). To make it real: connect to Formspree/Netlify Forms or your backend API.";
    form.reset();
  });

  // Footer year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Toast helper
  const toastEl = document.getElementById("toast");
  let toastTimer = null;

  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.style.display = "block";
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toastEl.style.display = "none"; }, 2400);
  }

  window.toast = toast;
})();
