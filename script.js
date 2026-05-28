// ─────────────────────────────────────────────
//  Portfolio · interactions
// ─────────────────────────────────────────────

(() => {
  const $  = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  // ── Theme toggle (light / dark / cyan) ──────
  const THEMES = ['light', 'dark', 'cyan'];
  const themeToggle = $('.theme-toggle');
  const root = document.documentElement;
  const stored = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initial = THEMES.includes(stored) ? stored : (prefersDark ? 'dark' : 'light');
  root.setAttribute('data-theme', initial);

  themeToggle?.addEventListener('click', () => {
    const cur = root.getAttribute('data-theme');
    const next = THEMES[(THEMES.indexOf(cur) + 1) % THEMES.length];
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });

  // ── Neural-net constellation ────────────────
  let mouseX = -9999, mouseY = -9999;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  document.addEventListener('mouseleave', () => { mouseX = mouseY = -9999; });

  const canvas = $('.particle-net');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W = 0, H = 0, dpr = 1;
    let particles = [];

    const cfg = {
      density: 0.00009,   // particles per pixel² (≈ 130 on 1440×900)
      maxLink: 130,       // px — distance for inter-particle lines
      cursorR: 200,       // px — radius of cursor influence
      drift:   0.25,      // base velocity
    };

    const themeColor = () => {
      const t = root.getAttribute('data-theme');
      // returns "r,g,b" so we can append ", alpha" in calls
      if (t === 'cyan') return '92,225,255';
      if (t === 'dark') return '242,185,122';
      return '177,74,47';
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width  = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width  = W + 'px';
      canvas.style.height = H + 'px';
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      // Re-seed particles proportional to viewport area
      const count = Math.max(40, Math.min(160, Math.round(W * H * cfg.density)));
      particles = Array.from({ length: count }, () => ({
        x:  Math.random() * W,
        y:  Math.random() * H,
        vx: (Math.random() - 0.5) * cfg.drift,
        vy: (Math.random() - 0.5) * cfg.drift,
        r:  Math.random() * 1.2 + 0.6,
      }));
    };
    resize();
    window.addEventListener('resize', resize);

    const tick = () => {
      ctx.clearRect(0, 0, W, H);
      const c = themeColor();

      // 1. Update positions + wrap at edges
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;
        if (p.y < -10) p.y = H + 10;
        if (p.y > H + 10) p.y = -10;
      }

      // 2. Lines between nearby particles
      ctx.lineWidth = 0.6;
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d2 = dx*dx + dy*dy;
          if (d2 < cfg.maxLink * cfg.maxLink) {
            const d = Math.sqrt(d2);
            const op = (1 - d / cfg.maxLink) * 0.22;
            ctx.strokeStyle = `rgba(${c},${op})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // 3. Cursor connections + particle dots
      for (const p of particles) {
        const dx = p.x - mouseX, dy = p.y - mouseY;
        const d  = Math.sqrt(dx*dx + dy*dy);
        let radius = p.r;
        let alpha  = 0.45;

        if (d < cfg.cursorR) {
          const t = 1 - d / cfg.cursorR;
          // Bright connection from cursor to this node
          ctx.strokeStyle = `rgba(${c},${t * 0.8})`;
          ctx.lineWidth   = 1;
          ctx.beginPath();
          ctx.moveTo(mouseX, mouseY);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();
          // Inflate + brighten the node itself
          radius = p.r + t * 2.5;
          alpha  = 0.45 + t * 0.55;
        }

        ctx.fillStyle = `rgba(${c},${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      requestAnimationFrame(tick);
    };
    tick();
  }

  // ── Scroll progress + nav state ─────────────
  const progress = $('.progress span');
  const nav      = $('.nav');
  const onScroll = () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    const p = (window.scrollY / h) * 100;
    progress.style.width = `${p}%`;
    nav.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ── Fade-in on scroll ───────────────────────
  const fadeTargets = $$('.section, .marquee');
  fadeTargets.forEach((el) => el.classList.add('fade-in'));

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  fadeTargets.forEach((el) => io.observe(el));

  // ── Work list hover image preview ───────────
  const hoverWrap = $('.work-hover-img');
  const hoverImg  = hoverWrap?.querySelector('img');
  let hoverRAF;

  $$('.work-item').forEach((item) => {
    const src  = item.dataset.img;
    const href = item.dataset.href;
    item.addEventListener('mouseenter', () => {
      if (!src) return;
      hoverImg.src = src;
      hoverWrap.classList.add('show');
    });
    item.addEventListener('mouseleave', () => {
      hoverWrap.classList.remove('show');
    });
    if (href) {
      item.addEventListener('click', () => {
        window.open(href, '_blank', 'noopener');
      });
    }
  });

  const moveHover = () => {
    hoverWrap.style.left = `${mouseX}px`;
    hoverWrap.style.top  = `${mouseY}px`;
    hoverRAF = requestAnimationFrame(moveHover);
  };
  if (hoverWrap) moveHover();

  // ── Live clock (IST) ────────────────────────
  const clockEl = $('#clock');
  const tickClock = () => {
    if (!clockEl) return;
    const fmt = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    clockEl.textContent = `${fmt.format(new Date())} IST`;
  };
  tickClock();
  setInterval(tickClock, 1000 * 30);

  // ── Footer big text horizontal parallax ─────
  const footerBig = $('.footer-big');
  if (footerBig) {
    const onScrollFooter = () => {
      const rect = footerBig.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const progress = 1 - rect.top / window.innerHeight;
        footerBig.style.transform = `translateX(${-(progress * 60)}px)`;
      }
    };
    window.addEventListener('scroll', onScrollFooter, { passive: true });
    onScrollFooter();
  }
})();


