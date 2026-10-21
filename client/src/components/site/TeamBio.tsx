import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type TeamBioProps = {
  id: string;
  member: { name: string; photo: string; bio?: string };
  expanded: boolean;
  pinned: boolean;
  cursorX: MotionValue<number>;
  cursorY: MotionValue<number>;
  trigger: HTMLButtonElement | null;
  onClose: (restoreFocus?: boolean) => void;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
};

const clamp = (value: number, size: number, viewport: number) =>
  Math.max(16, Math.min(value, viewport - size - 16));

/** One cursor-following portrait, with a biography that unfolds from its right edge. */
export default function TeamBio({
  id,
  member,
  expanded,
  pinned,
  cursorX,
  cursorY,
  trigger,
  onClose,
  onPointerEnter,
  onPointerLeave,
}: TeamBioProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [portrait, setPortrait] = useState(member.photo);
  const [geometry, setGeometry] = useState(() => ({
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    height: 256,
  }));
  const desktop = geometry.viewportWidth >= 1024;
  const width = expanded
    ? Math.min(desktop ? 760 : 560, geometry.viewportWidth - 32)
    : 200;
  const left = useTransform(cursorX, value =>
    desktop
      ? clamp(value - 100, width, geometry.viewportWidth)
      : (geometry.viewportWidth - width) / 2
  );
  const top = useTransform(cursorY, value =>
    clamp(
      desktop ? value - 128 : value + 20,
      geometry.height,
      geometry.viewportHeight
    )
  );
  const x = useSpring(left, { stiffness: 250, damping: 30 });
  const y = useSpring(top, { stiffness: 250, damping: 30 });

  useEffect(() => {
    let current = true;
    const image = new Image();
    image.src = member.photo;
    void image
      .decode()
      .then(() => {
        if (current) setPortrait(member.photo);
      })
      .catch(() => {
        // Keep the previous portrait if the next image cannot be decoded.
      });
    return () => {
      current = false;
    };
  }, [member.photo]);

  useLayoutEffect(() => {
    const measure = () => {
      const height = cardRef.current?.offsetHeight ?? 256;
      setGeometry(previous =>
        previous.height === height &&
        previous.viewportWidth === window.innerWidth &&
        previous.viewportHeight === window.innerHeight
          ? previous
          : {
              viewportWidth: window.innerWidth,
              viewportHeight: window.innerHeight,
              height,
            }
      );
    };
    measure();
    const resize = new ResizeObserver(measure);
    if (cardRef.current) resize.observe(cardRef.current);
    window.addEventListener("resize", measure);
    return () => {
      resize.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  useEffect(() => {
    if (expanded && pinned) cardRef.current?.focus({ preventScroll: true });
  }, [expanded, pinned]);

  useEffect(() => {
    if (!expanded) return;
    const outside = (event: Event) => {
      if (
        event.target instanceof Node &&
        !trigger?.contains(event.target) &&
        !cardRef.current?.contains(event.target)
      )
        onClose();
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose(true);
      }
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("focusin", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("focusin", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [expanded, trigger, onClose]);

  if (!desktop && !expanded) return null;

  return createPortal(
    <motion.div
      ref={cardRef}
      id={expanded ? id : undefined}
      role={expanded ? "dialog" : undefined}
      aria-labelledby={expanded ? `${id}-title` : undefined}
      aria-describedby={expanded ? `${id}-body` : undefined}
      aria-hidden={!expanded || undefined}
      tabIndex={expanded ? -1 : undefined}
      data-lenis-prevent={expanded || undefined}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      style={{ x: reduce ? left : x, y: reduce ? top : y, width }}
      className={`fixed left-0 top-0 z-[60] flex max-h-[calc(100dvh-32px)] flex-col overflow-y-auto overscroll-contain rounded-lg text-paper outline-none lg:flex-row lg:items-center lg:overflow-visible ${expanded ? "pointer-events-auto bg-[#17173f] shadow-2xl lg:pointer-events-none lg:bg-transparent lg:shadow-none" : "pointer-events-none"}`}
    >
      <div className="pointer-events-none relative z-10 m-6 mb-0 h-40 w-32 shrink-0 overflow-hidden rounded-lg shadow-2xl lg:m-0 lg:h-64 lg:w-[200px]">
        <AnimatePresence initial={false}>
          <motion.img
            key={portrait}
            src={portrait}
            alt=""
            width={200}
            height={256}
            decoding="async"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.24, ease: "easeOut" }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </AnimatePresence>
      </div>
      {expanded && (
        <motion.div
          initial={
            reduce
              ? false
              : { opacity: 0, x: -32, clipPath: "inset(0 100% 0 0)" }
          }
          animate={{ opacity: 1, x: 0, clipPath: "inset(0 0% 0 0)" }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-auto relative min-w-0 flex-1 bg-[#17173f] p-6 lg:max-h-[calc(100dvh-32px)] lg:overflow-y-auto lg:px-9 lg:py-10 lg:shadow-2xl"
        >
          <h4 id={`${id}-title`} className="sr-only">
            {member.name}
          </h4>
          <p
            id={`${id}-body`}
            className="text-sm leading-relaxed text-slate-light"
          >
            {member.bio}
          </p>
        </motion.div>
      )}
      {expanded && (
        <button
          type="button"
          aria-label="Close biography"
          onClick={() => onClose(true)}
          className="pointer-events-auto absolute right-2 top-2 z-20 flex size-8 items-center justify-center rounded-md text-slate-light transition-colors hover:bg-white/10 hover:text-paper focus-visible:outline-2 focus-visible:outline-signal"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      )}
    </motion.div>,
    document.body
  );
}
