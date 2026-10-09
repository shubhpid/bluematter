import { useEffect, useRef, useState } from "react";

const items = [
  { name: "Arizona State University", logo: "/logos/asu-logo.jpg" },
  { name: "The Luminosity Lab", logo: "/logos/lum-logo.png" },
  { name: "NEXUS Summit", logo: "/logos/nexus-logo.png" },
];

function Item({ name, logo }: { name: string; logo: string | null }) {
  return (
    <>
      {logo && <img src={logo} alt="" className="size-7 rounded-md border border-paper-line bg-paper object-contain p-0.5" />}
      <span className="whitespace-nowrap text-base font-semibold tracking-tight text-paper-ink">{name}</span>
    </>
  );
}

/**
 * Affiliation strip along the bottom of the hero. Static while everything fits;
 * switches to a looping marquee only when the list overflows the available width.
 */
export default function AffiliationMarquee() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLUListElement>(null);
  const [overflowing, setOverflowing] = useState(false);

  useEffect(() => {
    const viewport = viewportRef.current;
    const measure = measureRef.current;
    if (!viewport || !measure) return;
    const check = () => setOverflowing(measure.scrollWidth > viewport.clientWidth);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(viewport);
    ro.observe(measure);
    return () => ro.disconnect();
  }, []);

  const loop = [...items, ...items, ...items, ...items];

  return (
    <div role="region" aria-label="Affiliations" className="relative flex items-center gap-6 border-t border-paper-line py-4">
      <p className="type-eyebrow hidden shrink-0 pl-10 text-slate lg:block">Built at and backed by</p>
      <div
        ref={viewportRef}
        className={`relative min-w-0 flex-1 overflow-hidden pl-5 md:pl-10 lg:pl-0 ${
          overflowing ? "[mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]" : ""
        }`}
      >
        <ul ref={measureRef} aria-hidden="true" className="invisible absolute flex w-max items-center gap-14">
          {items.map((item) => (
            <li key={item.name} className="flex items-center gap-3">
              <Item {...item} />
            </li>
          ))}
        </ul>

        {overflowing ? (
          <ul className="marquee-track flex w-max items-center gap-14">
            {loop.map((item, i) => (
              <li key={`${item.name}-${i}`} aria-hidden={i >= items.length} className="flex items-center gap-3">
                <Item {...item} />
              </li>
            ))}
          </ul>
        ) : (
          <ul className="flex items-center gap-14">
            {items.map((item) => (
              <li key={item.name} className="flex items-center gap-3">
                <Item {...item} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
