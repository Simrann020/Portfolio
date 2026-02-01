(function () {
  const canvas = document.getElementById("bgCanvas");
  if (!canvas) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (prefersReducedMotion.matches) return;

  const ctx = canvas.getContext("2d");
  let animationId = 0;
  let lastSpawn = 0;

  // ---------- Tiny stars (static twinkles) ----------
  let tinyStars = [];
  function initTinyStars(w, h) {
    tinyStars = [];
    for (let i = 0; i < 50; i++) {
      tinyStars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.4 + Math.random() * 0.8,
        opacity: 0.15 + Math.random() * 0.3,
      });
    }
  }

  // ---------- Planets (with subtle lit edge for depth) ----------
  const planets = [
    { x: 0.08, y: 0.15, r: 40, color1: "rgba(139,92,246,.18)", color2: "rgba(80,40,140,.22)", highlight: 0.1 },
    { x: 0.92, y: 0.22, r: 24, color1: "rgba(200,75,255,.16)", color2: "rgba(100,30,120,.2)", highlight: 0.12 },
    { x: 0.15, y: 0.78, r: 32, color1: "rgba(99,102,241,.14)", color2: "rgba(50,40,100,.18)", highlight: 0.08 },
    { x: 0.88, y: 0.72, r: 20, color1: "rgba(168,85,247,.16)", color2: "rgba(70,30,90,.18)", highlight: 0.1 },
    { x: 0.72, y: 0.45, r: 28, color1: "rgba(139,92,246,.14)", color2: "rgba(60,40,100,.16)", highlight: 0.08 },
  ];

  function drawPlanets(w, h) {
    planets.forEach((p) => {
      const x = p.x * w;
      const y = p.y * h;
      const g = ctx.createRadialGradient(x - p.r * 0.4, y - p.r * 0.4, 0, x, y, p.r);
      g.addColorStop(0, p.color1);
      g.addColorStop(0.5, p.color2);
      g.addColorStop(0.85, "rgba(40,20,80,.12)");
      g.addColorStop(1, "transparent");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, p.r, 0, Math.PI * 2);
      ctx.fill();
      if (p.highlight) {
        const hg = ctx.createRadialGradient(x - p.r * 0.5, y - p.r * 0.5, 0, x, y, p.r * 0.9);
        hg.addColorStop(0, `rgba(255,255,255,${p.highlight})`);
        hg.addColorStop(0.4, "rgba(255,255,255,0)");
        hg.addColorStop(1, "transparent");
        ctx.fillStyle = hg;
        ctx.beginPath();
        ctx.arc(x, y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }

  function drawTinyStars(w, h) {
    tinyStars.forEach((s) => {
      ctx.fillStyle = `rgba(255,255,255,${s.opacity})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  // ---------- Morning sky (light theme) ----------
  const birds = [];
  function initBirds(w, h) {
    birds.length = 0;
    for (let i = 0; i < 3; i++) {
      birds.push({
        x: Math.random() * w,
        y: h * (0.15 + Math.random() * 0.5),
        speed: 0.8 + Math.random() * 0.8,
        size: 8 + Math.random() * 6,
        wingPhase: Math.random() * Math.PI * 2,
      });
    }
  }

  function drawMorningSky(w, h) {
    const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
    skyGrad.addColorStop(0, "#87CEEB");
    skyGrad.addColorStop(0.4, "#b8e0f0");
    skyGrad.addColorStop(0.7, "#e8f4fc");
    skyGrad.addColorStop(1, "#ffecd2");
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, h);

    const sunX = w * 0.78;
    const sunY = h * 0.22;
    const sunR = Math.min(w, h) * 0.12;
    const sunGlow = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunR * 2.5);
    sunGlow.addColorStop(0, "rgba(255,255,220,.95)");
    sunGlow.addColorStop(0.25, "rgba(255,230,150,.6)");
    sunGlow.addColorStop(0.5, "rgba(255,200,100,.2)");
    sunGlow.addColorStop(1, "transparent");
    ctx.fillStyle = sunGlow;
    ctx.beginPath();
    ctx.arc(sunX, sunY, sunR * 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fffacd";
    ctx.beginPath();
    ctx.arc(sunX, sunY, sunR, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff8dc";
    ctx.beginPath();
    ctx.arc(sunX, sunY, sunR * 0.85, 0, Math.PI * 2);
    ctx.fill();

    // Soft clouds (no bright glow — one sun only; these are pale puffs, not suns)
    const clouds = [
      { x: w * 0.1, y: h * 0.18, r: 40 },
      { x: w * 0.55, y: h * 0.12, r: 35 },
      { x: w * 0.35, y: h * 0.28, r: 45 },
      { x: w * 0.25, y: h * 0.5, r: 30 },
    ];
    clouds.forEach((c) => {
      ctx.fillStyle = "rgba(255,255,255,.35)";
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,.25)";
      ctx.beginPath();
      ctx.arc(c.x - c.r * 0.3, c.y + c.r * 0.2, c.r * 0.7, 0, Math.PI * 2);
      ctx.arc(c.x + c.r * 0.25, c.y - c.r * 0.15, c.r * 0.6, 0, Math.PI * 2);
      ctx.fill();
    });

    const t = Date.now() * 0.001;
    birds.forEach((b) => {
      b.x -= b.speed;
      if (b.x < -b.size * 4) {
        b.x = w + b.size * 4;
        b.y = h * (0.15 + Math.random() * 0.5);
      }
      b.wingPhase += 0.15;
      const wing = Math.sin(b.wingPhase) * 0.4;
      ctx.strokeStyle = "rgba(60,50,70,.5)";
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(b.x - b.size, b.y);
      ctx.quadraticCurveTo(b.x - b.size * 0.5, b.y - b.size + wing * b.size, b.x, b.y);
      ctx.quadraticCurveTo(b.x + b.size * 0.5, b.y + b.size - wing * b.size, b.x + b.size, b.y);
      ctx.stroke();
    });
  }

  // ---------- Shooting stars ----------
  const stars = [];

  function spawnStar() {
    const w = canvas.width;
    const h = canvas.height;
    const angle = Math.PI / 4 + (Math.random() * 0.5 - 0.25);
    const vx = -Math.cos(angle);
    const vy = Math.sin(angle);
    const speed = 2.2 + Math.random() * 1.8;
    const length = 90 + Math.random() * 100;

    let x, y;
    if (Math.random() > 0.5) {
      x = w + 40 + Math.random() * 120;
      y = Math.random() * h * 0.7;
    } else {
      x = Math.random() * w * 0.85 + w * 0.05;
      y = -30 - Math.random() * 80;
    }

    stars.push({ x, y, vx, vy, speed, length });
  }

  function drawStars(w, h) {
    const now = Date.now();
    if (now - lastSpawn > 3200 + Math.random() * 2000) {
      spawnStar();
      lastSpawn = now;
    }

    for (let i = stars.length - 1; i >= 0; i--) {
      const s = stars[i];
      const x0 = s.x - s.vx * s.length;
      const y0 = s.y - s.vy * s.length;

      const gradient = ctx.createLinearGradient(x0, y0, s.x, s.y);
      gradient.addColorStop(0, "rgba(200, 75, 255, 0)");
      gradient.addColorStop(0.3, "rgba(200, 75, 255, 0.1)");
      gradient.addColorStop(0.65, "rgba(220, 140, 255, 0.28)");
      gradient.addColorStop(0.9, "rgba(250, 230, 255, 0.55)");
      gradient.addColorStop(1, "rgba(255, 255, 255, 0.92)");

      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2.2;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(s.x, s.y);
      ctx.stroke();

      const glowRadius = 8;
      const headGradient = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, glowRadius);
      headGradient.addColorStop(0, "rgba(255, 255, 255, 0.9)");
      headGradient.addColorStop(0.3, "rgba(240, 220, 255, 0.4)");
      headGradient.addColorStop(0.6, "rgba(200, 75, 255, 0.12)");
      headGradient.addColorStop(1, "rgba(200, 75, 255, 0)");

      ctx.fillStyle = headGradient;
      ctx.beginPath();
      ctx.arc(s.x, s.y, glowRadius, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(s.x, s.y, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
      ctx.fill();

      s.x += s.vx * s.speed;
      s.y += s.vy * s.speed;

      if (s.x < -s.length - 30 || s.y > h + s.length + 30) {
        stars.splice(i, 1);
      }
    }
  }

  // ---------- Canvas draw loop ----------
  function isLightTheme() {
    return document.documentElement.getAttribute("data-theme") === "light";
  }

  function drawCanvas() {
    const w = canvas.width;
    const h = canvas.height;
    const light = isLightTheme();

    if (light) {
      if (birds.length === 0) initBirds(w, h);
      drawMorningSky(w, h);
    } else {
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, w, h);
      if (tinyStars.length === 0) initTinyStars(w, h);
      drawTinyStars(w, h);
      drawPlanets(w, h);
      drawStars(w, h);
    }

    animationId = requestAnimationFrame(drawCanvas);
  }

  // ---------- Resize & start ----------
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    tinyStars = [];
    birds.length = 0;
  }

  resize();
  lastSpawn = Date.now();
  drawCanvas();

  window.addEventListener("resize", resize);

  window.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cancelAnimationFrame(animationId);
    } else {
      drawCanvas();
    }
  });
})();
