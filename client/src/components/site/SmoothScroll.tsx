import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useEffect } from "react";

/** Lenis inertial scrolling for the whole page. Anchor links are routed through Lenis too. */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ autoRaf: true, lerp: 0.1, anchors: true });
    return () => lenis.destroy();
  }, []);
  return null;
}
