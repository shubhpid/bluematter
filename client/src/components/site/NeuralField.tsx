import { useEffect, useRef } from "react";

const RAMP = " .·:-=+*#";
const MAX_BACKING_PIXELS = 4_000_000;

/**
 * Ambient ASCII "neural field" that ripples around the cursor.
 * Pointer-down anywhere in the parent sends an expanding pulse through it.
 */
export default function NeuralField({
  className = "",
}: {
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !parent || !ctx) return;

    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );
    const compact = window.matchMedia(
      "(pointer: coarse), (max-width: 640px)"
    ).matches;
    const cell = compact ? 22 : 16;
    const frameInterval = compact ? 66 : 40;
    let w = 0;
    let h = 0;
    let visible = false;
    let raf = 0;
    let last = 0;
    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      // Some fields span several screens: keep their entire backing store bounded.
      const dpr = Math.min(
        window.devicePixelRatio || 1,
        compact ? 1.5 : 2,
        Math.sqrt(MAX_BACKING_PIXELS / Math.max(1, w * h))
      );
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      scheduleFrame();
    };

    const mouse = { x: -9999, y: -9999 };
    const pulses: { x: number; y: number; t: number }[] = [];
    const local = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onMove = (e: PointerEvent) => {
      Object.assign(mouse, local(e));
      scheduleFrame();
    };
    const onLeave = () => {
      Object.assign(mouse, { x: -9999, y: -9999 });
      scheduleFrame();
    };
    const onDown = (e: PointerEvent) => {
      if (motionPreference.matches) return;
      pulses.push({ ...local(e), t: performance.now() });
      if (pulses.length > 6) pulses.shift();
      scheduleFrame();
    };
    parent.addEventListener("pointermove", onMove);
    parent.addEventListener("pointerleave", onLeave);
    parent.addEventListener("pointerdown", onDown);

    const draw = (t: number) => {
      const reduce = motionPreference.matches;
      const time = reduce ? 0 : t;
      const activePulses = reduce ? [] : pulses;
      const rect = canvas.getBoundingClientRect();
      // Rasterize only the rows currently visible, including a glyph of overscan.
      const firstRow = Math.max(0, Math.floor(-rect.top / cell) - 1);
      const lastRow = Math.min(
        Math.ceil(h / cell),
        Math.ceil((window.innerHeight - rect.top) / cell) + 1
      );

      ctx.clearRect(0, 0, w, h);
      ctx.font = "500 12px ui-monospace, Menlo, monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#00a3ff";

      const cols = Math.ceil(w / cell);
      const buckets: [number, number][][] = Array.from(
        { length: RAMP.length },
        () => []
      );

      for (let r = firstRow; r < lastRow; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * cell + cell / 2;
          const y = r * cell + cell / 2;
          const wave =
            (Math.sin(c * 0.21 + time * 0.0011) *
              Math.cos(r * 0.27 - time * 0.0008) +
              1) *
            0.11;
          const d = Math.hypot(x - mouse.x, y - mouse.y);
          let v =
            wave +
            Math.exp(-d / 120) *
              (0.55 + 0.45 * Math.sin(d * 0.07 - time * 0.009));
          for (const p of activePulses) {
            const age = (t - p.t) / 1000;
            const radius = age * 520;
            const pd = Math.abs(Math.hypot(x - p.x, y - p.y) - radius);
            if (pd < 40) v += (1 - pd / 40) * Math.max(0, 1 - age / 1.6);
          }
          const idx = Math.min(RAMP.length - 1, Math.floor(v * RAMP.length));
          if (idx > 0) buckets[idx].push([x, y]);
        }
      }
      for (let i = pulses.length - 1; i >= 0; i--)
        if (t - pulses[i].t > 1600) pulses.splice(i, 1);

      for (let i = 1; i < buckets.length; i++) {
        ctx.globalAlpha = 0.12 + (i / (RAMP.length - 1)) * 0.6;
        for (const [x, y] of buckets[i]) ctx.fillText(RAMP[i], x, y);
      }
      ctx.globalAlpha = 1;
    };
    const tick = (t: number) => {
      raf = 0;
      if (!visible || document.hidden || !w || !h) return;
      if (!motionPreference.matches && t - last < frameInterval) {
        scheduleFrame();
        return;
      }
      last = t;
      draw(t);
      if (!motionPreference.matches) scheduleFrame();
    };
    function scheduleFrame() {
      if (!raf && visible && !document.hidden && w && h)
        raf = requestAnimationFrame(tick);
    }
    function updateAnimation() {
      cancelAnimationFrame(raf);
      raf = 0;
      last = 0;
      if (motionPreference.matches) pulses.length = 0;
      scheduleFrame();
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      updateAnimation();
    });
    io.observe(canvas);
    window.addEventListener("scroll", scheduleFrame, { passive: true });
    document.addEventListener("visibilitychange", updateAnimation);
    motionPreference.addEventListener("change", updateAnimation);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("scroll", scheduleFrame);
      document.removeEventListener("visibilitychange", updateAnimation);
      motionPreference.removeEventListener("change", updateAnimation);
      parent.removeEventListener("pointermove", onMove);
      parent.removeEventListener("pointerleave", onLeave);
      parent.removeEventListener("pointerdown", onDown);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none ${className}`}
    />
  );
}
