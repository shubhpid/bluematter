const items = [
  { name: "Arizona State University", logo: "/logos/asu-logo.jpg" },
  { name: "The Luminosity Lab", logo: "/logos/lum-logo.png" },
  { name: "NEXUS Summit 2026", logo: "/logos/nexus-logo.png" },
  { name: "Health Track", logo: null },
  { name: "ASU Luminosity", logo: null },
];

/** Compact, light-surface affiliation strip that sits along the bottom of the hero. */
export default function AffiliationMarquee() {
  const loop = [...items, ...items, ...items, ...items];
  return (
    <div
      role="region"
      aria-label="Affiliations"
      className="relative flex items-center gap-6 border-t border-paper-line py-4"
    >
      <p className="type-eyebrow hidden shrink-0 pl-5 text-slate md:block md:pl-10">Built at and backed by</p>
      <div className="relative min-w-0 flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <ul className="marquee-track flex w-max items-center gap-14">
          {loop.map((item, i) => (
            <li
              key={`${item.name}-${i}`}
              aria-hidden={i >= items.length}
              className="flex items-center gap-3 opacity-60 grayscale transition-all duration-500 hover:opacity-100 hover:grayscale-0"
            >
              {item.logo && (
                <img src={item.logo} alt="" className="size-7 rounded-md border border-paper-line bg-paper object-contain p-0.5" />
              )}
              <span className="whitespace-nowrap text-base font-semibold tracking-tight text-paper-ink">{item.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
