import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useEffect } from "react";

/** How long scrolling must be still before a snap is considered. */
const SETTLE_MS = 140;
/** Only glide to a section top that is already this close ahead (fraction of viewport). Farther away, the page stays put. */
const SNAP_RANGE = 0.22;
const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

/**
 * Free, fast Lenis scrolling with a passive, forward-only snap: once the user stops, the page
 * finishes the last few pixels onto the next section top in the direction they were already
 * scrolling. It never pulls back to a section they have passed, and sections marked
 * `data-no-snap` are skipped entirely.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ autoRaf: true, lerp: 0.11, wheelMultiplier: 1.15, anchors: { duration: 0.9, easing: easeOutCubic } });

    let timer = 0;
    let snapping = false;
    let direction = 0;

    const snapPoints = () =>
      Array.from(document.querySelectorAll<HTMLElement>("main > section, [data-page]"))
        .filter((el) => !el.hasAttribute("data-no-snap"))
        .map((el) => Math.min(Math.round(el.getBoundingClientRect().top + lenis.scroll), lenis.limit));

    const trySnap = () => {
      if (snapping || lenis.isStopped || direction === 0) return;
      const y = lenis.scroll;
      const range = window.innerHeight * SNAP_RANGE;
      const ahead = snapPoints().filter((p) => (direction > 0 ? p > y + 1 : p < y - 1));
      if (ahead.length === 0) return;
      const target = direction > 0 ? Math.min(...ahead) : Math.max(...ahead);
      if (Math.abs(target - y) > range) return;
      snapping = true;
      lenis.scrollTo(target, {
        duration: 0.55,
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

    lenis.on("scroll", () => {
      if (snapping) return;
      if (lenis.direction) direction = lenis.direction;
      schedule();
    });
    const onUserInput = () => {
      snapping = false;
      schedule();
    };
    window.addEventListener("wheel", onUserInput, { passive: true });
    window.addEventListener("touchstart", onUserInput, { passive: true });

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("wheel", onUserInput);
      window.removeEventListener("touchstart", onUserInput);
      lenis.destroy();
    };
  }, []);
  return null;
}
