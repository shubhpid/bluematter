import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useEffect } from "react";

/** Gentle wheel scrolling without section snapping or input locks. */
export default function SmoothScroll() {
  useEffect(() => {
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lenis: Lenis | undefined;

    const update = () => {
      lenis?.destroy();
      lenis = undefined;
      if (motionPreference.matches) return;

      lenis = new Lenis({
        autoRaf: true,
        smoothWheel: true,
        wheelMultiplier: 0.8,
        lerp: 0.065,
        // Keep native touch momentum and nested horizontal sliders responsive.
        syncTouch: false,
        allowNestedScroll: true,
        virtualScroll: ({ deltaX, deltaY, event }) =>
          !event.shiftKey && Math.abs(deltaY) >= Math.abs(deltaX),
        anchors: true,
      });
    };

    update();
    motionPreference.addEventListener("change", update);
    return () => {
      motionPreference.removeEventListener("change", update);
      lenis?.destroy();
    };
  }, []);

  return null;
}
