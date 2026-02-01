(function () {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const supportsViewTransitions = "startViewTransition" in document;
  
    function setYear() {
      const el = document.getElementById("year");
      if (el) el.textContent = String(new Date().getFullYear());
    }
  
    function initTheme() {
      const root = document.documentElement;
      const stored = localStorage.getItem("theme");
  
      const systemPrefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
      const initial = stored || (systemPrefersLight ? "light" : "dark");
      root.setAttribute("data-theme", initial);
  
      const btn = document.getElementById("themeToggle");
      if (!btn) return;
  
      btn.addEventListener("click", () => {
        const current = root.getAttribute("data-theme") || "dark";
        const next = current === "dark" ? "light" : "dark";
        root.setAttribute("data-theme", next);
        localStorage.setItem("theme", next);
      });
    }
  
    function initNavActive() {
      const path = location.pathname.split("/").pop() || "index.html";
      const navLinks = document.querySelectorAll(".nav-link");
      const isMultiPage = Array.from(navLinks).some((a) => (a.getAttribute("href") || "").includes(".html"));

      navLinks.forEach((a) => {
        a.classList.remove("active");
        const href = (a.getAttribute("href") || "").split("/").pop();
        const match = href === path || (path === "" && href === "index.html");
        if (match) a.classList.add("active");
      });

      if (isMultiPage) return;

      const hashLinks = document.querySelectorAll(".nav-link[href^='#']");
      const sections = Array.from(document.querySelectorAll("section[id]"));
      if (!hashLinks.length || !sections.length) return;
      function setActiveFromScroll() {
        const top = window.scrollY + 140;
        let current = "home";
        for (const s of sections) {
          const rect = s.getBoundingClientRect();
          const offsetTop = rect.top + window.scrollY;
          if (offsetTop <= top) current = s.id;
        }
        navLinks.forEach((a) => {
          const href = (a.getAttribute("href") || "").replace("#", "");
          a.classList.toggle("active", href === current);
        });
      }
      setActiveFromScroll();
      window.addEventListener("scroll", () => requestAnimationFrame(setActiveFromScroll), { passive: true });
    }
  
    function initNavToggle() {
      const toggle = document.querySelector(".nav-toggle");
      const links = document.getElementById("navLinks");
      if (!toggle || !links) return;
  
      toggle.addEventListener("click", () => {
        const open = links.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
        toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      });

      links.querySelectorAll(".nav-link").forEach((a) => {
        a.addEventListener("click", () => {
          links.classList.remove("is-open");
          toggle.setAttribute("aria-expanded", "false");
        });
      });

      document.addEventListener("click", (e) => {
        const target = e.target;
        if (!(target instanceof Element)) return;
        const within = target.closest(".nav");
        if (!within && links.classList.contains("is-open")) {
          links.classList.remove("is-open");
          toggle.setAttribute("aria-expanded", "false");
        }
      });
    }
  
    function initReveal() {
      const nodes = Array.from(document.querySelectorAll(".reveal"));
      if (!nodes.length) return;
  
      if (prefersReducedMotion.matches) {
        nodes.forEach((n) => n.classList.add("in"));
        return;
      }

      const io = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) entry.target.classList.add("in");
        }
      }, { threshold: 0.12 });
  
      nodes.forEach((n) => io.observe(n));
    }
  
    function initPrintButtons() {
      const btn = document.getElementById("printBtn");
      const btn2 = document.getElementById("printBtn2");
      const handler = () => window.print();
      if (btn) btn.addEventListener("click", handler);
      if (btn2) btn2.addEventListener("click", handler);
    }
  
    function initMailtoForm() {
      const form = document.getElementById("mailtoForm");
      if (!form) return;
  
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const fd = new FormData(form);
        const subject = String(fd.get("subject") || "").trim();
        const body = String(fd.get("body") || "").trim();
  
        const to = "simranjadhav022003@gmail.com";
        const url = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = url;
      });
    }
  
    function initAnalyticsPlaceholder() {
      const link = document.getElementById("analyticsLink");
      if (!link) return;
  
      link.addEventListener("click", (e) => {
        e.preventDefault();
        console.log("[analytics] placeholder event: footer_click");
        alert("Analytics placeholder: no tracking is installed.");
      });
    }
  
    function initPageTransitions() {
      // Create transition overlay if it doesn't exist
      let overlay = document.querySelector('.page-transition-overlay');
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'page-transition-overlay';
        document.body.appendChild(overlay);
      }

      // Remove overlay on page load
      setTimeout(() => {
        overlay.classList.remove('active');
      }, 100);

      // Skip transitions for users who prefer reduced motion
      if (prefersReducedMotion.matches) return;

      // Intercept all internal navigation links
      document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link) return;

        const href = link.getAttribute('href');
        
        // Check if it's an internal HTML page link (not external, not anchor, not download, not mailto)
        const isInternalPage = href && 
                               (href.endsWith('.html') || href === '/' || href === './') &&
                               !href.startsWith('#') &&
                               !href.startsWith('mailto:') &&
                               !href.startsWith('http://') &&
                               !href.startsWith('https://') &&
                               !link.hasAttribute('download') &&
                               link.getAttribute('target') !== '_blank';

        if (isInternalPage) {
          e.preventDefault();
          
          // Trigger transition
          overlay.classList.add('active');
          
          // Navigate after animation
          setTimeout(() => {
            window.location.href = href;
          }, 400); // Match CSS transition duration
        }
      });

      // Handle browser back/forward buttons
      window.addEventListener('pageshow', (e) => {
        if (e.persisted) {
          // Page was loaded from cache (back/forward button)
          overlay.classList.remove('active');
        }
      });
    }
  
    function initHeroStagger() {
      const hero = document.getElementById("heroSection");
      if (!hero) return;
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReduced) {
        hero.classList.add("hero-stagger");
        return;
      }
      requestAnimationFrame(() => {
        hero.classList.add("hero-stagger");
      });
    }

    function initScrollHeader() {
      const header = document.querySelector(".site-header");
      if (!header) return;
      const onScroll = () => {
        const y = window.scrollY || document.documentElement.scrollTop;
        header.classList.toggle("is-scrolled", y > 80);
      };
      onScroll();
      window.addEventListener("scroll", () => requestAnimationFrame(onScroll), { passive: true });
    }

    function initScrollProgress() {
      const bar = document.getElementById("navProgress");
      if (!bar) return;
      const onScroll = () => {
        const y = window.scrollY || document.documentElement.scrollTop;
        const h = document.documentElement.scrollHeight - window.innerHeight;
        const pct = h > 0 ? Math.min(100, (y / h) * 100) : 0;
        bar.style.width = pct + "%";
      };
      onScroll();
      window.addEventListener("scroll", () => requestAnimationFrame(onScroll), { passive: true });
    }

    function initBackToTop() {
      const link = document.getElementById("backToTop");
      if (!link) return;
      const onScroll = () => {
        const y = window.scrollY || document.documentElement.scrollTop;
        link.classList.toggle("is-visible", y > 400);
      };
      onScroll();
      window.addEventListener("scroll", () => requestAnimationFrame(onScroll), { passive: true });
      link.addEventListener("click", (e) => {
        const path = (window.location.pathname || "").split("/").pop() || "";
        if (path === "index.html" || path === "") {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      });
    }

    setYear();
    initTheme();
    initNavActive();
    initNavToggle();
    initReveal();
    initPrintButtons();
    initMailtoForm();
    initAnalyticsPlaceholder();
    initPageTransitions();
    initHeroStagger();
    initScrollHeader();
    initScrollProgress();
    initBackToTop();
  })();
  

  (() => {
    const els = Array.from(document.querySelectorAll(".reveal"));
    if (!("IntersectionObserver" in window) || els.length === 0) {
      els.forEach(el => el.classList.add("in"));
      return;
    }
  
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
  
    els.forEach(el => io.observe(el));
  })();
  
  // Projects: filter + search + counts + animate featured svg when visible
(() => {
  const grid = document.getElementById("projectGrid");
  const search = document.getElementById("projectSearch");
  const countEl = document.getElementById("projectsCount");
  const clearBtn = document.getElementById("clearProjectsFilters");
  const tagsWrap = document.querySelector(".projects-tags");

  if (!grid || !search || !countEl || !tagsWrap) return;

  const cards = Array.from(grid.querySelectorAll(".project-card"));
  const tagButtons = Array.from(tagsWrap.querySelectorAll(".tag"));

  let activeTag = "all";

  function matchesTag(card) {
    if (activeTag === "all") return true;
    const tags = (card.getAttribute("data-tags") || "").toLowerCase();
    return tags.split(",").map(t => t.trim()).includes(activeTag);
  }

  function matchesSearch(card) {
    const q = (search.value || "").trim().toLowerCase();
    if (!q) return true;
    const title = (card.getAttribute("data-title") || "").toLowerCase();
    const tags = (card.getAttribute("data-tags") || "").toLowerCase();
    const text = (card.innerText || "").toLowerCase();
    return title.includes(q) || tags.includes(q) || text.includes(q);
  }

  function applyFilters() {
    let shown = 0;
    cards.forEach((card) => {
      const ok = matchesTag(card) && matchesSearch(card);
      card.classList.toggle("is-hidden", !ok);
      if (ok) shown += 1;
    });
    countEl.textContent = `Showing ${shown} project${shown === 1 ? "" : "s"}`;
  }

  tagsWrap.addEventListener("click", (e) => {
    const btn = e.target.closest(".tag");
    if (!btn) return;

    activeTag = btn.getAttribute("data-tag") || "all";
    tagButtons.forEach(b => b.classList.toggle("active", b === btn));
    applyFilters();
  });

  search.addEventListener("input", applyFilters);

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      activeTag = "all";
      search.value = "";
      tagButtons.forEach(b => b.classList.toggle("active", (b.getAttribute("data-tag") || "all") === "all"));
      applyFilters();
    });
  }

  // Make featured svg animate only when cards enter view
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("is-visible");
    });
  }, { threshold: 0.15 });

  cards.forEach(c => io.observe(c));

  applyFilters();
})();


document.addEventListener('DOMContentLoaded', () => {
  const items = document.querySelectorAll('.edu-reveal');
  items.forEach(el => el.style.setProperty('--d', el.dataset.delay || '0'));

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -12% 0px' });

  items.forEach(el => io.observe(el));
});



function initEducationTimeline(){
  const section = document.getElementById("education");
  if (!section) return;

  const rail = section.querySelector(".edu-rail");
  const markersWrap = section.querySelector(".edu-markers");
  const rows = Array.from(section.querySelectorAll(".edu-row"));

  if (!rail || !markersWrap || rows.length === 0) return;

  function computeY(){
    const railRect = rail.getBoundingClientRect();

    markersWrap.innerHTML = "";
    rows.forEach((row) => {
      const r = row.getBoundingClientRect();
      const y = (r.top + (r.height / 2)) - railRect.top;

      row.dataset.eduY = String(y);

      const m = document.createElement("div");
      m.className = "edu-marker";
      m.style.setProperty("--y", `${y}px`);
      markersWrap.appendChild(m);
    });
  }

  function setActive(row){
    rows.forEach(r => r.classList.toggle("is-active", r === row));
    const y = Number(row.dataset.eduY || 0);
    rail.style.setProperty("--eduDotY", `${y}px`);
  }

  // Build once, then observe
  const rebuild = () => {
    computeY();
    const current = rows.find(r => r.classList.contains("is-active")) || rows[0];
    setActive(current);
  };

  // Active row selection
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      setActive(e.target);
    });
  }, { threshold: 0.55 });

  rows.forEach(r => io.observe(r));

  // Initial
  rebuild();
  setActive(rows[0]);

  // Recompute on resize and after full load (fonts can shift heights)
  window.addEventListener("resize", () => requestAnimationFrame(rebuild), { passive: true });
  window.addEventListener("load", () => requestAnimationFrame(rebuild), { passive: true });
}

document.addEventListener("DOMContentLoaded", initEducationTimeline);
