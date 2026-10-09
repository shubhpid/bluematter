import { animate, motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

export const EASE = [0.16, 1, 0.3, 1] as const;

export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li" | "article";
}) {
  const reduce = useReducedMotion();
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      initial={reduce ? false : { opacity: 0, y, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </Comp>
  );
}

/**
 * Slides its content in horizontally from off-screen left. The in-view check runs on the untransformed
 * wrapper, because an element parked at -110vw never intersects the viewport.
 */
export function SlideIn({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const reduce = useReducedMotion();
  return (
    <div ref={ref} className={className}>
      <motion.div
        initial={reduce ? false : { x: "-110vw" }}
        animate={inView || reduce ? { x: 0 } : { x: "-110vw" }}
        transition={{ duration: 1.1, delay, ease: EASE }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/** Word-by-word blur-up headline reveal, in the style of scale.com hero copy. */
export function SplitWords({
  text,
  className,
  delay = 0,
  stagger = 0.06,
  immediate = false,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  immediate?: boolean;
}) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  const target = { opacity: 1, y: "0%", filter: "blur(0px)" };

  if (!immediate) {
    return (
      <span className={className}>
        <span className="sr-only">{text}</span>
        <motion.span
          aria-hidden="true"
          initial={reduce ? false : "hidden"}
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          {words.map((word, i) => (
            <motion.span
              key={`${word}-${i}`}
              className="inline-block"
              variants={{ hidden: { x: "-100vw" }, show: { x: 0 } }}
              transition={{ duration: 1.1, delay: delay + i * stagger, ease: EASE }}
            >
              {word}
              {i < words.length - 1 ? "\u00A0" : ""}
            </motion.span>
          ))}
        </motion.span>
      </span>
    );
  }

  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, i) => (
          <span key={`${word}-${i}`} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
            <motion.span
              className="inline-block"
              initial={reduce ? false : { opacity: 0, y: "60%", filter: "blur(10px)" }}
              {...(immediate ? { animate: target } : { whileInView: target, viewport: { once: true, margin: "-60px" } })}
              transition={{ duration: 1, delay: delay + i * stagger, ease: EASE }}
            >
              {word}
              {i < words.length - 1 ? "\u00A0" : ""}
            </motion.span>
          </span>
        ))}
      </span>
    </span>
  );
}

export function CountUp({
  to,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 1.8,
}: {
  to: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration,
      ease: EASE,
      onUpdate: setValue,
    });
    return () => controls.stop();
  }, [inView, to, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
}

export function Eyebrow({ children, tone = "dark" }: { children: ReactNode; tone?: "dark" | "light" }) {
  return (
    <span
      className={`type-eyebrow inline-flex items-center gap-2 ${
        tone === "dark" ? "text-signal" : "text-signal-deep"
      }`}
    >
      <span className="relative flex size-1.5">
        <span className="absolute inset-0 rounded-full bg-signal" style={{ animation: "pulse-ring 2s ease-out infinite" }} />
        <span className="relative size-1.5 rounded-full bg-signal" />
      </span>
      {children}
    </span>
  );
}
