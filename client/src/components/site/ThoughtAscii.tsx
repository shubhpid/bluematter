import { useEffect, useId, useRef, useState } from "react";

const RAMP = " .:-=+*#%@";
const COLS = 56;
const ROWS = 13;
const SUB_X = 4;
const SUB_Y = 8;

/** Rasterises a word onto an offscreen canvas and samples it into an ASCII grid. */
function rasterize(word: string): string[] {
  const canvas = document.createElement("canvas");
  canvas.width = COLS * SUB_X;
  canvas.height = ROWS * SUB_Y;
  const ctx = canvas.getContext("2d");
  if (!ctx) return [];
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  let size = canvas.height * 0.82;
  ctx.font = `800 ${size}px Manrope, sans-serif`;
  const measured = ctx.measureText(word || " ").width;
  const maxW = canvas.width * 0.94;
  if (measured > maxW) {
    size *= maxW / measured;
    ctx.font = `800 ${size}px Manrope, sans-serif`;
  }
  ctx.fillText(word, canvas.width / 2, canvas.height / 2 + size * 0.04);
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

  const lines: string[] = [];
  for (let r = 0; r < ROWS; r++) {
    let line = "";
    for (let c = 0; c < COLS; c++) {
      let sum = 0;
      for (let y = 0; y < SUB_Y; y++) {
        for (let x = 0; x < SUB_X; x++) {
          sum += data[((r * SUB_Y + y) * canvas.width + (c * SUB_X + x)) * 4];
        }
      }
      const v = sum / (SUB_X * SUB_Y * 255);
      line += RAMP[Math.min(RAMP.length - 1, Math.floor(v * RAMP.length))];
    }
    lines.push(line);
  }
  return lines;
}

/** "Think of a word" toy: whatever you type is decoded, scrambled and resolved into ASCII. */
export default function ThoughtAscii() {
  const [word, setWord] = useState("think");
  const preRef = useRef<HTMLPreElement>(null);
  const inputId = useId();
  const [pressed, setPressed] = useState(false);
  const resetRef = useRef<number | undefined>(undefined);

  const pressMindButton = () => {
    setPressed(true);
    window.clearTimeout(resetRef.current);
    resetRef.current = window.setTimeout(() => setPressed(false), 2600);
  };

  useEffect(() => () => window.clearTimeout(resetRef.current), []);

  useEffect(() => {
    const pre = preRef.current;
    if (!pre) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const target = rasterize(word.trim());
    if (reduce) {
      pre.textContent = target.join("\n");
      return;
    }
    const start = performance.now();
    const duration = 900;
    let raf = 0;
    const frame = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const out = target.map((line) =>
        Array.from(line, (ch, c) => {
          const settleAt = c / COLS;
          if (p >= settleAt + 0.25) return ch;
          if (p < settleAt * 0.6) return Math.random() < 0.04 ? RAMP[1 + Math.floor(Math.random() * 3)] : " ";
          return ch === " " && Math.random() < 0.6 ? " " : RAMP[1 + Math.floor(Math.random() * (RAMP.length - 1))];
        }).join(""),
      );
      pre.textContent = out.join("\n");
      if (p < 1) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [word]);

  return (
    <div className="flex h-full flex-col gap-6 rounded-lg border border-ink-line bg-ink-raised/80 p-6 backdrop-blur-sm md:p-8">
      <div className="flex min-h-36 flex-1 items-center justify-center">
        <button
          type="button"
          onClick={pressMindButton}
          aria-live="polite"
          className={`min-h-24 w-full rounded-lg bg-signal px-6 text-xl font-semibold tracking-tight text-ink shadow-[0_0_0_1px_rgba(0,163,255,0.4),0_20px_60px_-20px_rgba(0,163,255,0.7)] transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110 active:translate-y-0.5 active:scale-[0.99] md:text-2xl ${
            pressed ? "bg-signal-deep text-paper" : ""
          }`}
        >
          {pressed ? (
            <span className="flex flex-col items-center gap-1">
              <span>...but nothing happened</span>
              <span className="text-[11px] font-semibold uppercase tracking-widest text-paper/70">(coming soon!)</span>
            </span>
          ) : (
            "Read my mind"
          )}
        </button>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="type-h3 text-2xl text-paper">Think of a word.</h3>
        <p className="text-pretty text-sm leading-relaxed text-slate-light">
          Type anything and watch it get decoded. One day the keyboard part will be optional.
        </p>
      </div>

      <div className="flex min-w-0 flex-col gap-4">
        <div className="overflow-hidden rounded-md border border-ink-line bg-ink px-3 py-4">
          <pre
            ref={preRef}
            aria-hidden="true"
            className="mx-auto w-fit select-none font-mono text-[6px] leading-[7px] text-signal sm:text-[8px] sm:leading-[9px] lg:text-[6px] lg:leading-[7px] xl:text-[7.5px] xl:leading-[8.5px]"
          />
          <p className="sr-only" aria-live="polite">
            Decoded: {word}
          </p>
        </div>
        <label htmlFor={inputId} className="sr-only">
          Word to decode
        </label>
        <div className="flex items-center gap-3 rounded-md border border-ink-line bg-ink px-4 focus-within:border-signal">
          <span className="font-mono text-sm text-signal" aria-hidden="true">
            {">"}
          </span>
          <input
            id={inputId}
            value={word}
            maxLength={12}
            onChange={(e) => setWord(e.target.value)}
            spellCheck={false}
            autoComplete="off"
            placeholder="type a thought"
            className="h-11 min-w-0 flex-1 bg-transparent font-mono text-sm text-paper outline-none placeholder:text-slate"
          />
        </div>
      </div>
    </div>
  );
}
