import { AnimatePresence, motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import AsciiBrain, { type ExplosionData } from "./AsciiBrain";
import AsciiExplosion from "./AsciiExplosion";
import { EASE } from "./motion";

const METER_CELLS = 14;
const WHEEL_GESTURE_GAP_MS = 180;
const SCROLL_KEYS = new Set([
  "ArrowDown",
  "ArrowUp",
  "PageDown",
  "PageUp",
  " ",
  "Home",
  "End",
]);

function Corner({ className }: { className: string }) {
  return (
    <span
      aria-hidden="true"
      className={`absolute size-4 border-signal ${className}`}
    />
  );
}

/** Framed, interactive ASCII brain. Drag to spin; shake hard enough and it blows apart across the page. */
export default function BrainCard({ className = "" }: { className?: string }) {
  const homeRef = useRef<HTMLDivElement>(null);
  const meterRef = useRef<HTMLSpanElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const lastWheelAtRef = useRef(-Infinity);
  const [explosion, setExplosion] = useState<ExplosionData | null>(null);
  const [returning, setReturning] = useState(false);

  const onShake = useCallback((level: number) => {
    const meter = meterRef.current;
    if (!meter) return;
    const filled = Math.round(level * METER_CELLS);
    meter.textContent = `[${"#".repeat(filled)}${".".repeat(METER_CELLS - filled)}]`;
    meter.style.color = level > 0.7 ? "#f8fafc" : level > 0.05 ? "#00a3ff" : "";
    if (cardRef.current) {
      const j = level * level * 4;
      cardRef.current.style.transform =
        j > 0.2
          ? `translate(${(Math.random() - 0.5) * j}px, ${(Math.random() - 0.5) * j}px)`
          : "";
    }
  }, []);

  const rebuild = useCallback(() => setReturning(true), []);
  const onReturned = useCallback(() => {
    setExplosion(null);
    setReturning(false);
  }, []);

  useEffect(() => {
    // Track wheel bursts even before an explosion so momentum from an existing
    // gesture cannot rebuild it. Scroll-position changes alone are not user input.
    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || (e.deltaX === 0 && e.deltaY === 0)) return;
      const now = performance.now();
      const startsGesture = now - lastWheelAtRef.current > WHEEL_GESTURE_GAP_MS;
      lastWheelAtRef.current = now;
      if (explosion && startsGesture) rebuild();
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    if (!explosion) {
      return () => window.removeEventListener("wheel", onWheel);
    }

    let touchStart: { x: number; y: number } | null = null;
    const onTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      touchStart =
        e.touches.length === 1 ? { x: touch.clientX, y: touch.clientY } : null;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!touchStart || e.touches.length !== 1) return;
      const touch = e.touches[0];
      if (
        Math.hypot(touch.clientX - touchStart.x, touch.clientY - touchStart.y) >
        8
      ) {
        rebuild();
      }
    };
    const onTouchEnd = () => {
      touchStart = null;
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || (!e.repeat && SCROLL_KEYS.has(e.key)))
        rebuild();
    };
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("touchcancel", onTouchEnd, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
      window.removeEventListener("keydown", onKey);
    };
  }, [explosion, rebuild]);

  useEffect(() => {
    const card = cardRef.current;
    if (!explosion || !card) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) return;
        setExplosion(null);
        setReturning(false);
      },
      { threshold: 0 }
    );
    io.observe(card);
    return () => io.disconnect();
  }, [explosion]);

  const exploded = explosion !== null;

  return (
    <div
      ref={cardRef}
      className={`relative overflow-hidden rounded-lg border border-ink-line bg-ink/80 backdrop-blur-sm ${className}`}
    >
      <div className="grid-lines-dark pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      <Corner className="left-3 top-3 border-l border-t" />
      <Corner className="right-3 top-3 border-r border-t" />
      <Corner className="bottom-3 left-3 border-b border-l" />
      <Corner className="bottom-3 right-3 border-b border-r" />

      <div className="absolute inset-x-0 top-0 flex items-center justify-end px-8 pt-5 text-[11px] font-semibold uppercase tracking-widest text-slate">
        <span className="hidden sm:inline">
          Drag to spin · Shake to stress-test
        </span>
      </div>

      <div
        ref={homeRef}
        role="img"
        aria-label="Interactive 3D ASCII rendering of a human brain. Drag to spin it; shake it to make it explode."
        className="absolute inset-6 bottom-12 top-11"
      >
        <AsciiBrain
          exploded={exploded}
          onShake={onShake}
          onExplode={setExplosion}
          className="absolute inset-0 cursor-grab touch-pan-y text-[6px] leading-[6px] active:cursor-grabbing lg:text-[7px] lg:leading-[7px] xl:text-[8px] xl:leading-[8px]"
        />
      </div>

      <AnimatePresence>
        {exploded && !returning && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.6, delay: 0.5, ease: EASE }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-6 text-center"
          >
            <p className="type-h3 text-balance text-2xl text-paper md:text-3xl">
              You blew its mind.
            </p>
            <button
              type="button"
              onClick={rebuild}
              className="inline-flex items-center gap-2 rounded-md bg-paper px-4 py-2.5 text-sm font-semibold text-paper-ink transition-colors hover:bg-signal"
            >
              <RotateCcw className="size-4" aria-hidden="true" />
              Rebuild the brain
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 px-8 pb-4 text-[11px] font-semibold uppercase tracking-widest text-slate">
        <span
          className={`flex items-center gap-2 ${exploded ? "text-slate-light" : "text-signal"}`}
        >
          <span className="relative flex size-1.5">
            {!exploded && (
              <span
                className="absolute inset-0 rounded-full bg-signal"
                style={{ animation: "pulse-ring 2s ease-out infinite" }}
              />
            )}
            <span
              className={`relative size-1.5 rounded-full ${exploded ? "bg-slate" : "bg-signal"}`}
            />
          </span>
          {exploded ? "Signal lost" : "Streaming"}
        </span>
        <span className="flex items-center gap-2">
          <span className="hidden sm:inline">Stress</span>
          <span
            ref={meterRef}
            className="font-mono normal-case tracking-normal transition-colors"
            aria-hidden="true"
          >
            {`[${".".repeat(METER_CELLS)}]`}
          </span>
        </span>
      </div>

      {explosion && (
        <AsciiExplosion
          data={explosion}
          returning={returning}
          getHomeRect={() => homeRef.current?.getBoundingClientRect() ?? null}
          onReturned={onReturned}
          onIdle={rebuild}
        />
      )}
    </div>
  );
}
