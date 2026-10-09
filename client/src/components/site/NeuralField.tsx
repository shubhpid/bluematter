import { useEffect, useRef } from "react";

const RAMP = " .·:-=+*#";
const CELL = 16;

/**
 * Ambient ASCII "neural field" that ripples around the cursor.
 * Pointer-down anywhere in the parent sends an expanding pulse through it.
 */
export default function NeuralField({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !parent || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const mouse = { x: -9999, y: -9999 };
    const pulses: { x: number; y: number; t: number }[] = [];
    const local = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onMove = (e: PointerEvent) => Object.assign(mouse, local(e));
    const onLeave = () => Object.assign(mouse, { x: -9999, y: -9999 });
    const onDown = (e: PointerEvent) => {
      pulses.push({ ...local(e), t: performance.now() });
      if (pulses.length > 6) pulses.shift();
    };
    parent.addEventListener("pointermove", onMove);
    parent.addEventListener("pointerleave", onLeave);
    parent.addEventListener("pointerdown", onDown);

    let visible = false;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(canvas);

    let raf = 0;
    let last = 0;
    const tick = (t: number) => {
      raf = requestAnimationFrame(tick);
      if (!visible || t - last < 40) return;
      last = t;
      const time = reduce ? 0 : t;

      ctx.clearRect(0, 0, w, h);
      ctx.font = "500 12px ui-monospace, Menlo, monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#00a3ff";

      const cols = Math.ceil(w / CELL);
      const rows = Math.ceil(h / CELL);
      const buckets: [number, number][][] = Array.from({ length: RAMP.length }, () => []);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * CELL + CELL / 2;
          const y = r * CELL + CELL / 2;
          const wave = (Math.sin(c * 0.21 + time * 0.0011) * Math.cos(r * 0.27 - time * 0.0008) + 1) * 0.11;
          const d = Math.hypot(x - mouse.x, y - mouse.y);
          let v = wave + Math.exp(-d / 120) * (0.55 + 0.45 * Math.sin(d * 0.07 - time * 0.009));
          for (const p of pulses) {
            const age = (t - p.t) / 1000;
            const radius = age * 520;
            const pd = Math.abs(Math.hypot(x - p.x, y - p.y) - radius);
            if (pd < 40) v += (1 - pd / 40) * Math.max(0, 1 - age / 1.6);
          }
          const idx = Math.min(RAMP.length - 1, Math.floor(v * RAMP.length));
          if (idx > 0) buckets[idx].push([x, y]);
        }
      }
      for (let i = pulses.length - 1; i >= 0; i--) if (t - pulses[i].t > 1600) pulses.splice(i, 1);

      for (let i = 1; i < buckets.length; i++) {
        ctx.globalAlpha = 0.12 + (i / (RAMP.length - 1)) * 0.6;
        for (const [x, y] of buckets[i]) ctx.fillText(RAMP[i], x, y);
      }
      ctx.globalAlpha = 1;
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      parent.removeEventListener("pointermove", onMove);
      parent.removeEventListener("pointerleave", onLeave);
      parent.removeEventListener("pointerdown", onDown);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className={`pointer-events-none ${className}`} />;
}
