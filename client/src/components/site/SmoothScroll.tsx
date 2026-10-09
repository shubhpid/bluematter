import Lenis from "lenis";
import "lenis/dist/lenis.css";
import Snap from "lenis/snap";
import { useEffect } from "react";

/**
 * Lenis inertial scrolling with section snapping. Each section snaps to its top;
 * sections taller than the viewport also snap to their bottom, and stay freely
 * scrollable in between so long scroll-driven sections (pipeline rail) still work.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ autoRaf: true, lerp: 0.1, anchors: true });
    const snap = new Snap(lenis, { type: "proximity", distanceThreshold: "45%", duration: 0.9, debounce: 220 });

    const sections = document.querySelectorAll<HTMLElement>("main > section, section#contact");
    const removers = Array.from(sections).map((el) =>
      snap.addElement(el, { align: el.offsetHeight > window.innerHeight * 1.1 ? ["start", "end"] : ["start"] }),
    );

    return () => {
      removers.forEach((remove) => remove());
      snap.destroy();
      lenis.destroy();
    };
  }, []);
  return null;
}
