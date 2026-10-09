import { useEffect, useRef } from "react";

/** Passive, continuously scrolling multi-channel EEG trace drawn on canvas. */
export default function EegTrace({
  channels = 4,
  color = "#00a3ff",
  className,
}: {
  channels?: number;
  color?: string;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const seeds = Array.from({ length: channels }, (_, i) => ({
      f1: 0.018 + i * 0.006,
      f2: 0.061 + i * 0.011,
      f3: 0.19 + i * 0.03,
      amp: 0.55 + (i % 2) * 0.25,
    }));

    let raf = 0;
    let t = 0;
    const draw = () => {
      raf = requestAnimationFrame(draw);
      if (!reduce) t += 1.6;
      ctx.clearRect(0, 0, w, h);
      const band = h / channels;
      seeds.forEach((s, c) => {
        const mid = band * c + band / 2;
        ctx.beginPath();
        for (let x = 0; x <= w; x += 2) {
          const k = x + t;
          const spike = Math.sin(k * 0.013 + c) > 0.985 ? Math.sin(k * 0.9) * 0.9 : 0;
          const y =
            Math.sin(k * s.f1) * 0.45 +
            Math.sin(k * s.f2 + c) * 0.3 +
            Math.sin(k * s.f3) * 0.12 +
            spike;
          const fade = Math.min(1, x / (w * 0.15));
          const py = mid + y * band * 0.32 * s.amp * fade;
          if (x === 0) ctx.moveTo(x, py);
          else ctx.lineTo(x, py);
        }
        ctx.strokeStyle = color;
        ctx.globalAlpha = 0.35 + (c / channels) * 0.5;
        ctx.lineWidth = 1.25;
        ctx.stroke();
      });
      ctx.globalAlpha = 1;
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [channels, color]);

  return <canvas ref={ref} aria-hidden="true" className={className} />;
}
