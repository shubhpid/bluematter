import { useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const items = [
  { name: "Arizona State University", logo: "/logos/asu-logo.jpg" },
  { name: "The Luminosity Lab", logo: "/logos/lum-logo.png" },
  { name: "NEXUS Summit", logo: "/logos/nexus-logo.png" },
];

function Item({ name, logo }: { name: string; logo: string | null }) {
  return (
    <>
      {logo && (
        <img
          src={logo}
          alt=""
          width={28}
          height={28}
          draggable={false}
          className="size-7 shrink-0 rounded-md border border-paper-line bg-paper object-contain p-0.5"
        />
      )}
      <span className="whitespace-nowrap text-base font-semibold tracking-tight text-paper-ink">
        {name}
      </span>
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
  const reduce = useReducedMotion();

  useEffect(() => {
    const viewport = viewportRef.current;
    const measure = measureRef.current;
    if (!viewport || !measure) return;
    const check = () => {
      const style = getComputedStyle(viewport);
      const available =
        viewport.clientWidth -
        parseFloat(style.paddingLeft) -
        parseFloat(style.paddingRight);
      setOverflowing(measure.scrollWidth > available);
    };
    check();
    const ro = new ResizeObserver(check);
    ro.observe(viewport);
    ro.observe(measure);
    return () => ro.disconnect();
  }, []);

  const animate = overflowing && !reduce;

  return (
    <div
      role="region"
      aria-label="Affiliations"
      className="relative flex items-center gap-6 border-t border-paper-line py-4"
    >
      <p className="type-eyebrow hidden shrink-0 pl-10 text-slate lg:block">
        Built at and backed by
      </p>
      <div
        ref={viewportRef}
        tabIndex={overflowing && reduce ? 0 : undefined}
        className={`relative min-w-0 flex-1 px-5 md:px-10 lg:px-0 ${
          animate
            ? "overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
            : "overflow-x-auto overscroll-x-contain"
        }`}
      >
        <ul
          ref={measureRef}
          aria-hidden="true"
          className="invisible absolute flex w-max items-center gap-14"
        >
          {items.map(item => (
            <li key={item.name} className="flex shrink-0 items-center gap-3">
              <Item {...item} />
            </li>
          ))}
        </ul>

        {animate ? (
          <div className="marquee-track flex w-max">
            {[0, 1].map(copy => (
              <ul
                key={copy}
                aria-hidden={copy === 1 ? true : undefined}
                className="flex shrink-0 items-center gap-14 pr-14"
              >
                {items.map(item => (
                  <li
                    key={item.name}
                    className="flex shrink-0 items-center gap-3"
                  >
                    <Item {...item} />
                  </li>
                ))}
              </ul>
            ))}
          </div>
        ) : (
          <ul className="flex w-max items-center gap-14">
            {items.map(item => (
              <li key={item.name} className="flex shrink-0 items-center gap-3">
                <Item {...item} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
