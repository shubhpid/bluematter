import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import type { ExplosionData } from "./AsciiBrain";

type Particle = {
  ch: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  /** Offset from the brain host's top-left, used to fly home. */
  ox: number;
  oy: number;
  scale: number;
  targetScale: number;
  color: 0 | 1 | 2;
  delay: number;
};

const COLORS = ["#00a3ff", "#94a9c8", "#f8fafc"];
const AVOID_RADIUS = 150;

/**
 * Full-viewport canvas that takes the brain's ASCII characters, blasts them across the screen,
 * keeps them drifting away from the cursor, and flies them back home when `returning` is set.
 */
export default function AsciiExplosion({
  data,
  returning,
  getHomeRect,
  onReturned,
}: {
  data: ExplosionData;
  returning: boolean;
  getHomeRect: () => DOMRect | null;
  onReturned: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const returningRef = useRef(returning);
  const onReturnedRef = useRef(onReturned);
  const getHomeRectRef = useRef(getHomeRect);
  returningRef.current = returning;
  onReturnedRef.current = onReturned;
  getHomeRectRef.current = getHomeRect;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = window.innerWidth;
    let h = window.innerHeight;
    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const { center, hostRect, fontSize } = data;
    const particles: Particle[] = data.chars.map((c) => {
      const dx = c.x - center.x;
      const dy = c.y - center.y;
      const dist = Math.hypot(dx, dy) || 1;
      const speed = reduce ? 2 : 10 + Math.random() * 30;
      const swirl = (Math.random() - 0.5) * 10;
      return {
        ch: c.ch,
        x: c.x,
        y: c.y,
        vx: (dx / dist) * speed - (dy / dist) * swirl,
        vy: (dy / dist) * speed + (dx / dist) * swirl - Math.random() * 6,
        ox: c.x - hostRect.left,
        oy: c.y - hostRect.top,
        scale: 1,
        targetScale: 1.4 + Math.random() * 1.8,
        color: c.weight > 0.66 ? 0 : c.weight > 0.33 ? (Math.random() < 0.15 ? 2 : 0) : 1,
        delay: Math.random() * 0.35,
      };
    });

    const mouse = { x: -9999, y: -9999 };
    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onOut = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onOut);

    let raf = 0;
    let last = performance.now();
    let returnStart = 0;
    let done = false;

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const f = Math.min((now - last) / 16.67, 3);
      last = now;
      const isReturning = returningRef.current;
      if (isReturning && !returnStart) returnStart = now;
      const home = isReturning ? getHomeRectRef.current() : null;

      let settled = 0;
      for (const p of particles) {
        if (isReturning && home) {
          const elapsed = (now - returnStart) / 1000 - p.delay;
          if (elapsed > 0) {
            const tx = home.left + p.ox;
            const ty = home.top + p.oy;
            const k = 1 - Math.pow(1 - 0.14, f);
            p.x += (tx - p.x) * k;
            p.y += (ty - p.y) * k;
            p.scale += (1 - p.scale) * k;
            if (Math.abs(tx - p.x) < 0.8 && Math.abs(ty - p.y) < 0.8) settled++;
          }
          continue;
        }

        const mdx = p.x - mouse.x;
        const mdy = p.y - mouse.y;
        const md = Math.hypot(mdx, mdy);
        if (md < AVOID_RADIUS && md > 0.01) {
          const push = (1 - md / AVOID_RADIUS) * 2.6 * f;
          p.vx += (mdx / md) * push;
          p.vy += (mdy / md) * push;
        }
        p.vx += (Math.random() - 0.5) * 0.08 * f;
        p.vy += (Math.random() - 0.5) * 0.08 * f;
        const damp = Math.pow(0.955, f);
        p.vx *= damp;
        p.vy *= damp;
        p.x += p.vx * f;
        p.y += p.vy * f;
        p.scale += (p.targetScale - p.scale) * 0.05 * f;

        const pad = 8;
        if (p.x < pad) {
          p.x = pad;
          p.vx = Math.abs(p.vx) * 0.7;
        } else if (p.x > w - pad) {
          p.x = w - pad;
          p.vx = -Math.abs(p.vx) * 0.7;
        }
        if (p.y < pad) {
          p.y = pad;
          p.vy = Math.abs(p.vy) * 0.7;
        } else if (p.y > h - pad) {
          p.y = h - pad;
          p.vy = -Math.abs(p.vy) * 0.7;
        }
      }

      ctx.clearRect(0, 0, w, h);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      for (let c = 0; c < COLORS.length; c++) {
        ctx.fillStyle = COLORS[c];
        for (const p of particles) {
          if (p.color !== c) continue;
          ctx.font = `600 ${(fontSize * p.scale).toFixed(1)}px ui-monospace, Menlo, monospace`;
          ctx.fillText(p.ch, p.x, p.y);
        }
      }

      const timedOut = returnStart && now - returnStart > 2600;
      if (isReturning && !done && (settled >= particles.length || timedOut)) {
        done = true;
        onReturnedRef.current();
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onOut);
    };
  }, [data]);

  return createPortal(
    <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-40" />,
    document.body,
  );
}
