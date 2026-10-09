const items = [
  { name: "Arizona State University", logo: "/logos/asu-logo.jpg" },
  { name: "The Luminosity Lab", logo: "/logos/lum-logo.png" },
  { name: "NEXUS Summit 2026", logo: "/logos/nexus-logo.png" },
  { name: "Health Track", logo: null },
  { name: "ASU Luminosity", logo: null },
];

export default function AffiliationMarquee() {
  const loop = [...items, ...items, ...items, ...items];
  return (
    <section aria-label="Affiliations" className="border-y border-ink-line/60 py-8">
      <div className="container mb-6">
        <p className="type-eyebrow text-center text-slate">Built at and backed by</p>
      </div>
      <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
        <ul className="marquee-track flex w-max items-center gap-16">
          {loop.map((item, i) => (
            <li
              key={`${item.name}-${i}`}
              aria-hidden={i >= items.length}
              className="flex items-center gap-3 opacity-60 grayscale transition-all duration-500 hover:opacity-100 hover:grayscale-0"
            >
              {item.logo && (
                <img src={item.logo} alt="" className="size-8 rounded-md bg-paper object-contain p-1" />
              )}
              <span className="whitespace-nowrap text-lg font-semibold tracking-tight text-paper">{item.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
