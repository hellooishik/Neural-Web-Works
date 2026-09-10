import { useEffect, useRef } from 'react';

/**
 * The page-wide background: a neural field you travel down as you scroll.
 *
 * Nodes live in a virtual space taller than the viewport. Scrolling moves them
 * up at a rate set by each node's depth, so near nodes rush past and far ones
 * barely shift — the page reads as one continuous structure rather than a
 * background that stops when the hero does.
 *
 * All of it runs in one rAF loop reading window.scrollY directly. Nothing here
 * touches React state, because a background that re-rendered the tree on every
 * scroll frame would cost more than it is worth.
 */

const FIELD_SPAN = 2.4; // virtual field height, in viewports
const LINK_DIST = 150; // px between nodes before a synapse is drawn
const MAX_NODES = 120;

export default function Backdrop() {
  const rootRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!canvas || !root) return undefined;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return undefined;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = 0;
    let height = 0;
    let fieldHeight = 0;
    let nodes = [];
    let frame = 0;
    let last = 0;
    let running = true;

    function build() {
      // Scale the node count to the viewport so a phone does not carry a
      // desktop's worth of geometry.
      const target = Math.round((width * height) / 11000);
      const count = Math.max(26, Math.min(MAX_NODES, target));
      fieldHeight = height * FIELD_SPAN;

      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * fieldHeight,
        vx: (Math.random() - 0.5) * 7,
        vy: (Math.random() - 0.5) * 7,
        r: 0.7 + Math.random() * 1.8,
        // How strongly this node answers the scroll. Low is far away.
        depth: 0.25 + Math.random() * 0.75,
        pulse: Math.random() * Math.PI * 2
      }));
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = root.clientWidth;
      height = root.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
      draw(0);
    }

    function scrollProgress() {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      return max > 0 ? Math.min(window.scrollY / max, 1) : 0;
    }

    function draw(dt) {
      const progress = scrollProgress();
      // Travel further than the page itself, so the field keeps giving even
      // on a very long document.
      const travel = progress * height * (FIELD_SPAN - 1) * 1.6;

      root.style.setProperty('--sp', progress.toFixed(4));

      ctx.clearRect(0, 0, width, height);

      // Resolve every node to a screen position once, then link neighbours.
      const points = nodes.map((node) => {
        if (dt) {
          node.x += node.vx * dt;
          node.y += node.vy * dt;
          node.pulse += dt * 0.8;
          if (node.x < -40) node.x = width + 40;
          if (node.x > width + 40) node.x = -40;
          if (node.y < 0) node.y += fieldHeight;
          if (node.y > fieldHeight) node.y -= fieldHeight;
        }

        // Wrap into the visible band so the field never runs out.
        let y = (node.y - travel * node.depth) % fieldHeight;
        if (y < 0) y += fieldHeight;
        // Centre the band on the viewport.
        y -= (fieldHeight - height) / 2;

        return { x: node.x, y, r: node.r, depth: node.depth, pulse: node.pulse };
      });

      // Synapses. Deeper pairs draw fainter, which reads as distance.
      ctx.lineWidth = 1;
      for (let i = 0; i < points.length; i += 1) {
        const a = points[i];
        if (a.y < -180 || a.y > height + 180) continue;
        for (let j = i + 1; j < points.length; j += 1) {
          const b = points[j];
          if (b.y < -180 || b.y > height + 180) continue;
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist > LINK_DIST) continue;
          const near = 1 - dist / LINK_DIST;
          const alpha = near * 0.32 * ((a.depth + b.depth) / 2);
          ctx.strokeStyle = `rgba(${Math.round(111 + progress * 30)}, ${Math.round(
            227 - progress * 40
          )}, ${Math.round(212 + progress * 30)}, ${alpha.toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      // Nodes on top of their own connections.
      for (const point of points) {
        if (point.y < -40 || point.y > height + 40) continue;
        const breathe = reduced ? 1 : 0.75 + Math.sin(point.pulse) * 0.25;
        const alpha = 0.2 + point.depth * 0.52 * breathe;
        ctx.fillStyle = `rgba(150, 240, 226, ${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(point.x, point.y, point.r * (0.7 + point.depth * 0.6), 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function tick(now) {
      frame = 0;
      if (!running) return;
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
      last = now;
      draw(dt);
      frame = requestAnimationFrame(tick);
    }

    const onResize = () => resize();

    // Reduced motion still gets the field and the parallax, just no drift.
    const onScroll = () => {
      if (reduced && !frame) frame = requestAnimationFrame(() => draw(0));
    };

    const onVisibility = () => {
      running = !document.hidden && !reduced;
      if (running && !frame) {
        last = 0;
        frame = requestAnimationFrame(tick);
      }
    };

    resize();
    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVisibility);

    if (reduced) {
      running = false;
      window.addEventListener('scroll', onScroll, { passive: true });
    } else {
      frame = requestAnimationFrame(tick);
    }

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <div className="backdrop" ref={rootRef} aria-hidden="true">
      <canvas className="backdrop__field" ref={canvasRef} />
      <div className="backdrop__glow backdrop__glow--one" />
      <div className="backdrop__glow backdrop__glow--two" />
      <div className="backdrop__grain" />
    </div>
  );
}
