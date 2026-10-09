import AsciiBrain from "./AsciiBrain";

function Corner({ className }: { className: string }) {
  return <span aria-hidden="true" className={`absolute size-4 border-signal ${className}`} />;
}

/** Framed, interactive ASCII brain — the site's signature visual. */
export default function BrainCard({ className = "" }: { className?: string }) {
  return (
    <div
      role="img"
      aria-label="Interactive 3D ASCII rendering of a human brain, slowly rotating"
      className={`relative overflow-hidden rounded-lg border border-ink-line bg-ink ${className}`}
    >
      <div className="grid-lines-dark pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      <Corner className="left-3 top-3 border-l border-t" />
      <Corner className="right-3 top-3 border-r border-t" />
      <Corner className="bottom-3 left-3 border-b border-l" />
      <Corner className="bottom-3 right-3 border-b border-r" />
      <div className="absolute inset-x-0 top-0 flex items-center justify-between px-8 pt-5 text-[11px] font-semibold uppercase tracking-widest text-slate">
        <span>Cortex / 3D</span>
        <span className="hidden sm:inline">Hover to steer</span>
      </div>
      <AsciiBrain className="absolute inset-6 top-11 bottom-11 cursor-grab text-[6px] leading-[6px] lg:text-[7px] lg:leading-[7px] xl:text-[8px] xl:leading-[8px]" />
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-8 pb-4 text-[11px] font-semibold uppercase tracking-widest text-slate">
        <span className="flex items-center gap-2 text-signal">
          <span className="relative flex size-1.5">
            <span className="absolute inset-0 rounded-full bg-signal" style={{ animation: "pulse-ring 2s ease-out infinite" }} />
            <span className="relative size-1.5 rounded-full bg-signal" />
          </span>
          Streaming
        </span>
        <span className="tabular-nums">256 Hz</span>
      </div>
    </div>
  );
}
