import { useEffect, useRef } from 'react';

/**
 * The water layer over the power plant.
 *
 *  - falling drops that strike the water line and throw a splash
 *  - expanding elliptical ripples on the surface
 *  - condensation beads on the "glass" that swell, release and streak down
 *
 * Everything is one canvas and one requestAnimationFrame loop. The loop stops
 * when the hero scrolls out of view or the tab is hidden, and never starts at
 * all when the visitor has asked for reduced motion.
 */

const AQUA = '111, 227, 212';

function rand(min, max) {
  return min + Math.random() * (max - min);
}

function drawBead(ctx, x, y, r, squash = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(1, squash);

  // Body: a lens of slightly brighter water.
  const body = ctx.createRadialGradient(-r * 0.3, -r * 0.35, r * 0.1, 0, 0, r);
  body.addColorStop(0, `rgba(${AQUA}, 0.42)`);
  body.addColorStop(0.55, `rgba(${AQUA}, 0.16)`);
  body.addColorStop(1, 'rgba(180, 245, 255, 0.06)');
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fillStyle = body;
  ctx.fill();

  // Rim light on the lower right, where light exits the drop.
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.96, Math.PI * -0.15, Math.PI * 0.75);
  ctx.strokeStyle = `rgba(${AQUA}, 0.5)`;
  ctx.lineWidth = Math.max(0.6, r * 0.1);
  ctx.stroke();

  // Specular highlight.
  ctx.beginPath();
  ctx.ellipse(-r * 0.34, -r * 0.4, r * 0.24, r * 0.17, -0.6, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(238, 255, 255, 0.72)';
  ctx.fill();

  ctx.restore();
}

export default function WaterCanvas({ waterLine = 0.74, intensity = 1 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = 0;
    let height = 0;
    let waterY = 0;
    let raf = 0;
    let running = false;
    let last = performance.now();

    const drops = [];
    const ripples = [];
    const splashes = [];
    const beads = [];

    function resize() {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      waterY = height * waterLine;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seedBeads();
    }

    function seedBeads() {
      beads.length = 0;
      const count = Math.round((width / 150) * intensity);
      for (let i = 0; i < count; i += 1) {
        beads.push({
          x: rand(0.04, 0.96) * width,
          y: rand(0.05, 0.9) * height,
          r: rand(3, 11),
          vy: 0,
          hold: rand(1200, 9000),
          trail: []
        });
      }
    }

    function spawnDrop() {
      drops.push({
        x: rand(0, width),
        y: rand(-140, -20),
        r: rand(1.6, 3.4),
        vy: rand(220, 430),
        sway: rand(-14, 14)
      });
    }

    function addRipple(x, strength) {
      ripples.push({ x, r: strength * 2, max: rand(46, 120) * strength, life: 1 });
    }

    function addSplash(x, strength) {
      const count = Math.round(rand(3, 7) * strength);
      for (let i = 0; i < count; i += 1) {
        splashes.push({
          x,
          y: waterY,
          vx: rand(-70, 70),
          vy: rand(-190, -70),
          r: rand(0.8, 2),
          life: 1
        });
      }
    }

    function update(dt) {
      // --- falling drops -------------------------------------------------
      if (Math.random() < 0.045 * intensity && drops.length < 60) spawnDrop();

      for (let i = drops.length - 1; i >= 0; i -= 1) {
        const drop = drops[i];
        drop.vy += 520 * dt;
        drop.y += drop.vy * dt;
        drop.x += drop.sway * dt;
        if (drop.y >= waterY) {
          const strength = Math.min(drop.r / 2.4, 1.4);
          addRipple(drop.x, strength);
          addSplash(drop.x, strength);
          drops.splice(i, 1);
        }
      }

      // --- ripples -------------------------------------------------------
      for (let i = ripples.length - 1; i >= 0; i -= 1) {
        const ring = ripples[i];
        ring.r += (ring.max - ring.r) * 1.6 * dt + 22 * dt;
        ring.life -= dt * 0.62;
        if (ring.life <= 0) ripples.splice(i, 1);
      }

      // --- splash particles ----------------------------------------------
      for (let i = splashes.length - 1; i >= 0; i -= 1) {
        const bit = splashes[i];
        bit.vy += 620 * dt;
        bit.x += bit.vx * dt;
        bit.y += bit.vy * dt;
        bit.life -= dt * 1.1;
        if (bit.life <= 0 || bit.y > waterY + 6) {
          if (bit.life > 0.15) addRipple(bit.x, 0.35);
          splashes.splice(i, 1);
        }
      }

      // --- condensation beads ---------------------------------------------
      for (const bead of beads) {
        if (bead.hold > 0) {
          bead.hold -= dt * 1000;
          // Beads grow while they cling, until gravity wins.
          bead.r = Math.min(bead.r + dt * 0.35, 13);
          continue;
        }
        bead.vy = Math.min(bead.vy + 34 * dt * (bead.r / 7), 190);
        bead.y += bead.vy * dt;
        bead.trail.push({ x: bead.x, y: bead.y, r: bead.r * 0.34, life: 1 });
        if (bead.trail.length > 34) bead.trail.shift();
        // Sliding beads shed volume into the trail they leave behind.
        bead.r = Math.max(bead.r - dt * 0.9, 1.6);

        if (bead.y > height + 20 || bead.r <= 1.7) {
          bead.x = rand(0.04, 0.96) * width;
          bead.y = rand(-0.05, 0.55) * height;
          bead.r = rand(3, 11);
          bead.vy = 0;
          bead.hold = rand(2000, 11000);
          bead.trail.length = 0;
        }
      }
      for (const bead of beads) {
        for (let i = bead.trail.length - 1; i >= 0; i -= 1) {
          bead.trail[i].life -= dt * 0.5;
          if (bead.trail[i].life <= 0) bead.trail.splice(i, 1);
        }
      }
    }

    function render() {
      ctx.clearRect(0, 0, width, height);

      // Falling drops, drawn as a stretched teardrop so they read as motion.
      ctx.save();
      for (const drop of drops) {
        const stretch = 1 + Math.min(drop.vy / 260, 3.4);
        const gradient = ctx.createLinearGradient(drop.x, drop.y - drop.r * stretch, drop.x, drop.y + drop.r);
        gradient.addColorStop(0, `rgba(${AQUA}, 0)`);
        gradient.addColorStop(1, `rgba(${AQUA}, 0.75)`);
        ctx.beginPath();
        ctx.ellipse(drop.x, drop.y, drop.r * 0.72, drop.r * stretch, 0, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }
      ctx.restore();

      // Ripples on the surface: ellipses, because we are looking across water.
      for (const ring of ripples) {
        const alpha = Math.max(ring.life, 0) * 0.5;
        ctx.beginPath();
        ctx.ellipse(ring.x, waterY, ring.r, ring.r * 0.2, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${AQUA}, ${alpha})`;
        ctx.lineWidth = 1.1;
        ctx.stroke();
        if (ring.r > 16) {
          ctx.beginPath();
          ctx.ellipse(ring.x, waterY, ring.r * 0.62, ring.r * 0.125, 0, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${AQUA}, ${alpha * 0.55})`;
          ctx.stroke();
        }
      }

      // Splash droplets.
      for (const bit of splashes) {
        ctx.beginPath();
        ctx.arc(bit.x, bit.y, bit.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(198, 248, 255, ${Math.max(bit.life, 0) * 0.85})`;
        ctx.fill();
      }

      // Condensation: trails first so beads sit on top of their own streak.
      for (const bead of beads) {
        for (const mark of bead.trail) {
          ctx.beginPath();
          ctx.arc(mark.x, mark.y, mark.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${AQUA}, ${mark.life * 0.16})`;
          ctx.fill();
        }
      }
      for (const bead of beads) {
        drawBead(ctx, bead.x, bead.y, bead.r, bead.vy > 12 ? 1.25 : 1);
      }
    }

    function frame(now) {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      update(dt);
      render();
      if (running) raf = requestAnimationFrame(frame);
    }

    function start() {
      if (running || reduced) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }

    function stop() {
      running = false;
      cancelAnimationFrame(raf);
    }

    resize();

    if (reduced) {
      // One still frame: the drops are decoration, not information.
      for (let i = 0; i < 6; i += 1) addRipple(rand(0.1, 0.9) * width, rand(0.5, 1.2));
      render();
    }

    const observer = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0 }
    );
    observer.observe(canvas);

    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('resize', resize);

    return () => {
      stop();
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('resize', resize);
    };
  }, [waterLine, intensity]);

  return <canvas ref={canvasRef} className="water-canvas" aria-hidden="true" />;
}
