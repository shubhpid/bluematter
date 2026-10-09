import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useEffect } from "react";

type Page = { top: number; end: number };

const PAGE_DURATION = 1.05;
/** A wheel gesture must go quiet this long before it can turn the next page (swallows trackpad inertia). */
const GESTURE_GAP = 220;
const easeInOutQuart = (t: number) => (t < 0.5 ? 8 * t ** 4 : 1 - (-2 * t + 2) ** 4 / 2);

/**
 * Full-page section paging on top of Lenis. One wheel gesture moves exactly one section.
 * Sections taller than the viewport (hero, pipeline rail) scroll freely inside, clamped to
 * their own bounds, and only page onward after a fresh gesture at their edge.
 * Touch keeps native scrolling.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const els = Array.from(document.querySelectorAll<HTMLElement>("main > section, [data-page]"));
    let paging = false;
    let lastWheelAt = 0;
    let edgeHeldUntil = 0;

    const measure = (limit: number): Page[] =>
      els.map((el) => {
        const top = Math.min(el.getBoundingClientRect().top + window.scrollY, limit);
        const end = Math.min(Math.max(top, top + el.offsetHeight - window.innerHeight), limit);
        return { top: Math.round(top), end: Math.round(end) };
      });

    let lenis: Lenis;

    const pageTo = (target: number) => {
      paging = true;
      lenis.scrollTo(target, {
        duration: PAGE_DURATION,
        easing: easeInOutQuart,
        lock: true,
        force: true,
        onComplete: () => {
          paging = false;
        },
      });
    };

    const onWheel = ({ deltaY, event }: { deltaY: number; event: WheelEvent | TouchEvent }) => {
      if (event.type.startsWith("touch")) return true;
      if (event.cancelable) event.preventDefault();

      const now = performance.now();
      const freshGesture = now - lastWheelAt > GESTURE_GAP;
      lastWheelAt = now;
      if (paging || Math.abs(deltaY) < 1) return false;

      const pages = measure(lenis.limit);
      const y = lenis.targetScroll;
      let i = 0;
      for (let k = 0; k < pages.length; k++) if (pages[k].top <= y + 2) i = k;
      const page = pages[i];

      if (deltaY > 0) {
        if (y < page.end - 1) {
          const next = Math.min(y + deltaY, page.end);
          if (next >= page.end) edgeHeldUntil = now + GESTURE_GAP;
          lenis.scrollTo(next, { lerp: 0.12, force: true });
          return false;
        }
        if (!freshGesture && now < edgeHeldUntil + GESTURE_GAP) return false;
        const target = pages[i + 1]?.top ?? lenis.limit;
        if (target > y + 1) pageTo(target);
      } else {
        if (y > page.top + 1) {
          const next = Math.max(y + deltaY, page.top);
          if (next <= page.top) edgeHeldUntil = now + GESTURE_GAP;
          lenis.scrollTo(next, { lerp: 0.12, force: true });
          return false;
        }
        if (!freshGesture && now < edgeHeldUntil + GESTURE_GAP) return false;
        const prev = pages[i - 1];
        if (prev) pageTo(prev.end);
      }
      return false;
    };

    lenis = new Lenis({ autoRaf: true, lerp: 0.12, anchors: { duration: PAGE_DURATION, easing: easeInOutQuart }, virtualScroll: onWheel });

    return () => lenis.destroy();
  }, []);
  return null;
}
