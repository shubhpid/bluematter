import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useEffect } from "react";

/** How long scrolling must be still before a snap is considered. */
const SETTLE_MS = 160;
/** Only snap when a section edge is within this fraction of the viewport. Anything farther stays where the user left it. */
const SNAP_RANGE = 0.28;
const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

/**
 * Free, fast Lenis scrolling with a lenient snap (scale.com-style): the page moves at native
 * speed while the user scrolls, then, once it settles, eases onto a nearby section edge.
 * Long sections can be read freely from top to bottom without being pulled away.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const els = Array.from(document.querySelectorAll<HTMLElement>("main > section, [data-page]"));
    const lenis = new Lenis({ autoRaf: true, lerp: 0.11, wheelMultiplier: 1.15, anchors: { duration: 0.9, easing: easeOutCubic } });

    let timer = 0;
    let snapping = false;

    const snapPoints = () => {
      const vh = window.innerHeight;
      const points: number[] = [];
      for (const el of els) {
        const top = Math.round(el.getBoundingClientRect().top + window.scrollY);
        points.push(top);
        if (el.offsetHeight > vh + 4) points.push(top + el.offsetHeight - vh);
      }
      return points.map((p) => Math.min(p, lenis.limit));
    };

    const trySnap = () => {
      if (snapping || lenis.isStopped) return;
      const y = lenis.scroll;
      const range = window.innerHeight * SNAP_RANGE;
      let best = y;
      let bestDist = Infinity;
      for (const p of snapPoints()) {
        const d = Math.abs(p - y);
        if (d < bestDist) {
          bestDist = d;
          best = p;
        }
      }
      if (bestDist < 2 || bestDist > range) return;
      snapping = true;
      lenis.scrollTo(best, {
        duration: 0.7,
        easing: easeOutCubic,
        onComplete: () => {
          snapping = false;
        },
      });
    };

    const schedule = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(trySnap, SETTLE_MS);
    };
    const onUserInput = () => {
      snapping = false;
      schedule();
    };

    lenis.on("scroll", () => {
      if (!snapping) schedule();
    });
    window.addEventListener("wheel", onUserInput, { passive: true });
    window.addEventListener("touchend", onUserInput, { passive: true });

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("wheel", onUserInput);
      window.removeEventListener("touchend", onUserInput);
      lenis.destroy();
    };
  }, []);
  return null;
}
