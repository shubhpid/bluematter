import { motion, useReducedMotion, useScroll } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { EASE } from "./motion";

export type BentoItem = {
  title: string;
  desc: string;
  image: string;
  alt: string;
  tag?: string;
};

/**
 * Horizontally scrolling bento rail (scale.com) with Stripe-style cards:
 * title + short copy on top, a visual filling the bottom.
 */
export default function BentoRail({
  items,
  label,
}: {
  items: BentoItem[];
  label: string;
}) {
  const railRef = useRef<HTMLUListElement>(null);
  const { scrollXProgress } = useScroll({ container: railRef });
  const reduce = useReducedMotion();
  const [edges, setEdges] = useState({ start: true, end: false });

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    const update = () => {
      const next = {
        start: el.scrollLeft < 8,
        end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 8,
      };
      setEdges(previous =>
        previous.start === next.start && previous.end === next.end
          ? previous
          : next
      );
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(el);
    for (const card of el.children) observer.observe(card);
    return () => {
      el.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, [items]);

  const step = (dir: 1 | -1) => {
    const el = railRef.current;
    if (!el) return;
    const padding = parseFloat(getComputedStyle(el).scrollPaddingLeft) || 0;
    const viewportLeft = el.getBoundingClientRect().left;
    const targets = Array.from(el.children, card =>
      Math.max(
        0,
        Math.min(
          el.scrollWidth - el.clientWidth,
          card.getBoundingClientRect().left -
            viewportLeft +
            el.scrollLeft -
            padding
        )
      )
    );
    const target =
      dir > 0
        ? targets.find(position => position > el.scrollLeft + 8)
        : targets.reverse().find(position => position < el.scrollLeft - 8);
    if (target !== undefined)
      el.scrollTo({ left: target, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <div className="flex min-w-0 flex-col gap-8">
      <ul
        ref={railRef}
        tabIndex={0}
        aria-label={label}
        className="rail flex w-full min-w-0 snap-x snap-proximity gap-4 overflow-x-auto overscroll-x-contain pb-2 outline-none focus-visible:ring-2 focus-visible:ring-signal"
      >
        {items.map((item, i) => (
          <motion.li
            key={item.title}
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{
              duration: 0.9,
              delay: Math.min(i, 4) * 0.08,
              ease: EASE,
            }}
            className="w-[82vw] max-w-[26rem] shrink-0 snap-start sm:w-[24rem] lg:w-[26rem]"
          >
            <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-ink-line bg-ink-raised transition-colors duration-500 hover:border-signal/50">
              <div className="flex flex-col gap-3 p-6 md:p-7">
                {item.tag && (
                  <span className="text-sm font-semibold text-signal">
                    {item.tag}
                  </span>
                )}
                <p className="text-pretty text-lg leading-snug text-slate-light">
                  <span className="type-h3 text-paper">{item.title}.</span>{" "}
                  {item.desc}
                </p>
              </div>
              <div className="relative mt-auto aspect-[4/3] overflow-hidden border-t border-ink-line">
                <img
                  src={item.image}
                  alt={item.alt}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>
            </article>
          </motion.li>
        ))}
      </ul>

      <div className="container flex items-center gap-6">
        <div className="h-px flex-1 bg-ink-line">
          <motion.div
            style={{ scaleX: scrollXProgress }}
            className="h-full origin-left bg-signal"
          />
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => step(-1)}
            disabled={edges.start}
            aria-label="Previous"
            className="flex size-11 items-center justify-center rounded-full border border-ink-line text-paper transition-colors hover:border-paper disabled:opacity-30 disabled:hover:border-ink-line"
          >
            <ArrowLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            disabled={edges.end}
            aria-label="Next"
            className="flex size-11 items-center justify-center rounded-full border border-ink-line text-paper transition-colors hover:border-paper disabled:opacity-30 disabled:hover:border-ink-line"
          >
            <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
