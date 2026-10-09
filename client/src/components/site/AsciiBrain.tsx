import { useEffect, useRef } from "react";
import * as THREE from "three";
import { AsciiEffect } from "three/examples/jsm/effects/AsciiEffect.js";

export type AsciiParticleSeed = { ch: string; x: number; y: number; weight: number };
export type ExplosionData = {
  chars: AsciiParticleSeed[];
  fontSize: number;
  center: { x: number; y: number };
  hostRect: DOMRect;
};

const RAMP = " .:-=+*#%@";
/** Shake energy (accumulated pointer travel, decaying per frame) required to blow the brain apart. */
const SHAKE_LIMIT = 820;
const MAX_PARTICLES = 1800;

/** Ridged pseudo-noise used to carve gyri / sulci folds into the cortex surface. */
function folds(x: number, y: number, z: number) {
  const a = Math.sin(x * 7.1 + Math.sin(y * 5.3) * 1.6) * Math.cos(z * 6.4 + Math.sin(x * 4.2) * 1.4);
  const b = Math.sin(y * 9.2 + Math.cos(z * 6.8) * 1.2) * Math.cos(x * 8.7 - z * 2.1);
  const c = Math.sin(z * 11.3 + x * 3.1 + Math.sin(y * 7.7));
  return 1 - Math.abs(a * 0.55 + b * 0.3 + c * 0.15);
}

function buildHemisphere(side: 1 | -1) {
  const geo = new THREE.SphereGeometry(1, 160, 120);
  const pos = geo.attributes.position;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    v.x *= 0.62;
    v.y *= 0.78;
    v.z *= 1.08;
    if (v.x * side < 0) v.x *= 0.35;
    v.y *= 1 - Math.max(0, v.z) * 0.12;
    if (v.y < -0.35) v.y = -0.35 + (v.y + 0.35) * 0.45;
    const n = v.clone().normalize();
    const d = folds(v.x + side * 0.3, v.y, v.z) * 0.085;
    v.addScaledVector(n, d);
    pos.setXYZ(i, v.x + side * 0.34, v.y, v.z);
  }
  geo.computeVertexNormals();
  return geo;
}

function buildCerebellum() {
  const geo = new THREE.SphereGeometry(1, 96, 64);
  const pos = geo.attributes.position;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    v.set(v.x * 0.62, v.y * 0.32, v.z * 0.4);
    const n = v.clone().normalize();
    v.addScaledVector(n, Math.abs(Math.sin(v.y * 40)) * 0.025);
    pos.setXYZ(i, v.x, v.y - 0.48, v.z - 0.72);
  }
  geo.computeVertexNormals();
  return geo;
}

/** Reads the characters currently rendered by the AsciiEffect along with their on-screen positions. */
function captureChars(el: HTMLElement, host: HTMLElement): ExplosionData | null {
  const td = el.querySelector("td");
  if (!td) return null;
  const lines = td.innerHTML
    .split(/<br\s*\/?>/i)
    .map((l) => l.replace(/&nbsp;/g, " ").replace(/<[^>]+>/g, ""))
    .filter((l, i, arr) => !(i === arr.length - 1 && l.trim() === ""));
  if (!lines.length) return null;

  const range = document.createRange();
  range.selectNodeContents(td);
  const r = range.getBoundingClientRect();
  const cols = Math.max(...lines.map((l) => l.length));
  const cellW = r.width / Math.max(1, cols);
  const cellH = r.height / lines.length;
  const fontSize = parseFloat(getComputedStyle(td).fontSize) || 8;

  const all: AsciiParticleSeed[] = [];
  lines.forEach((line, row) => {
    for (let c = 0; c < line.length; c++) {
      const ch = line[c];
      if (ch === " ") continue;
      all.push({
        ch,
        x: r.left + c * cellW + cellW / 2,
        y: r.top + row * cellH + cellH / 2,
        weight: Math.max(0, RAMP.indexOf(ch)) / (RAMP.length - 1),
      });
    }
  });
  const stride = Math.max(1, Math.ceil(all.length / MAX_PARTICLES));
  const chars = stride > 1 ? all.filter((_, i) => i % stride === 0) : all;
  const hostRect = host.getBoundingClientRect();
  return {
    chars,
    fontSize,
    center: { x: hostRect.left + hostRect.width / 2, y: hostRect.top + hostRect.height / 2 },
    hostRect,
  };
}

export default function AsciiBrain({
  className,
  exploded = false,
  onShake,
  onExplode,
}: {
  className?: string;
  exploded?: boolean;
  /** Called every rendered frame with a 0–1 shake level. Use for imperative UI (no React state). */
  onShake?: (level: number) => void;
  onExplode?: (data: ExplosionData) => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const explodedRef = useRef(exploded);
  const onShakeRef = useRef(onShake);
  const onExplodeRef = useRef(onExplode);
  explodedRef.current = exploded;
  onShakeRef.current = onShake;
  onExplodeRef.current = onExplode;

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const width = () => Math.max(1, host.clientWidth);
    const height = () => Math.max(1, host.clientHeight);
    const hasSize = () => host.clientWidth > 8 && host.clientHeight > 8;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width() / height(), 0.1, 100);
    camera.position.set(0, 0.15, 4.4);

    const renderer = new THREE.WebGLRenderer({ antialias: false });
    const effect = new AsciiEffect(renderer, RAMP, { invert: true, resolution: 0.17 });
    effect.setSize(width(), height());
    const el = effect.domElement;
    el.style.color = "#00a3ff";
    el.style.backgroundColor = "transparent";
    el.style.transition = "opacity 400ms ease";
    el.setAttribute("aria-hidden", "true");
    host.appendChild(el);

    const material = new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: false, shininess: 18 });
    const brain = new THREE.Group();
    brain.add(new THREE.Mesh(buildHemisphere(1), material));
    brain.add(new THREE.Mesh(buildHemisphere(-1), material));
    brain.add(new THREE.Mesh(buildCerebellum(), material));
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.09, 0.7, 24), material);
    stem.position.set(0, -0.75, -0.35);
    stem.rotation.x = 0.35;
    brain.add(stem);
    brain.rotation.set(0.25, 0.6, 0);
    scene.add(brain);

    const key = new THREE.PointLight(0xffffff, 3.2, 0, 0);
    key.position.set(3, 3, 3);
    const fill = new THREE.PointLight(0xffffff, 0.9, 0, 0);
    fill.position.set(-3, -1, 2);
    scene.add(key, fill, new THREE.AmbientLight(0xffffff, 0.08));

    let targetX = 0;
    let targetY = 0;
    let lastPX: number | null = null;
    let lastPY = 0;
    let energy = 0;
    let dragging = false;
    let spinVel = 0;

    const onPointerMove = (e: PointerEvent) => {
      if (explodedRef.current) return;
      const r = host.getBoundingClientRect();
      targetX = ((e.clientX - r.left) / r.width - 0.5) * 0.9;
      targetY = ((e.clientY - r.top) / r.height - 0.5) * 0.5;
      if (lastPX !== null) {
        const dx = e.clientX - lastPX;
        const dy = e.clientY - lastPY;
        energy += Math.hypot(dx, dy);
        if (dragging) spinVel += dx * 0.004;
      }
      lastPX = e.clientX;
      lastPY = e.clientY;
    };
    const onPointerDown = (e: PointerEvent) => {
      dragging = true;
      host.setPointerCapture?.(e.pointerId);
    };
    const onPointerUp = () => {
      dragging = false;
    };
    const onLeave = () => {
      targetX = 0;
      targetY = 0;
      lastPX = null;
    };
    host.addEventListener("pointermove", onPointerMove);
    host.addEventListener("pointerdown", onPointerDown);
    host.addEventListener("pointerup", onPointerUp);
    host.addEventListener("pointercancel", onPointerUp);
    host.addEventListener("pointerleave", onLeave);

    let visible = true;
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting), { threshold: 0 });
    io.observe(host);

    const ro = new ResizeObserver(() => {
      camera.aspect = width() / height();
      camera.updateProjectionMatrix();
      effect.setSize(width(), height());
    });
    ro.observe(host);

    let raf = 0;
    let last = 0;
    let spin = 0;
    let wasExploded = false;
    const tick = (t: number) => {
      raf = requestAnimationFrame(tick);
      if (!visible || !hasSize() || t - last < 33) return;
      const dt = Math.min((t - last) / 1000, 0.1);
      last = t;

      if (explodedRef.current) {
        el.style.opacity = "0";
        wasExploded = true;
        return;
      }
      if (wasExploded) {
        wasExploded = false;
        energy = 0;
        el.style.opacity = "1";
      }

      energy *= 0.9;
      const level = Math.min(1, energy / SHAKE_LIMIT);
      onShakeRef.current?.(level);

      if (!reduce) spin += dt * 0.45;
      spin += spinVel;
      spinVel *= 0.92;
      brain.rotation.y = 0.6 + spin + targetX;
      brain.rotation.x += (0.25 + targetY - brain.rotation.x) * 0.06;
      brain.rotation.z = Math.sin(t / 28) * level * level * 0.35;
      brain.position.x = (Math.random() - 0.5) * level * level * 0.14;
      brain.position.y = Math.sin(t / 1400) * 0.04 + (Math.random() - 0.5) * level * level * 0.1;

      // Shift from signal blue toward white-hot as the brain is stressed.
      const heat = Math.max(0, (level - 0.45) / 0.55);
      const mix = (a: number, b: number) => Math.round(a + (b - a) * heat);
      el.style.color = `rgb(${mix(0, 248)}, ${mix(163, 250)}, ${mix(255, 252)})`;

      effect.render(scene, camera);

      if (level >= 1 && onExplodeRef.current) {
        const data = captureChars(el, host);
        energy = 0;
        if (data && data.chars.length) {
          explodedRef.current = true;
          el.style.opacity = "0";
          onShakeRef.current?.(0);
          onExplodeRef.current(data);
        }
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      host.removeEventListener("pointermove", onPointerMove);
      host.removeEventListener("pointerdown", onPointerDown);
      host.removeEventListener("pointerup", onPointerUp);
      host.removeEventListener("pointercancel", onPointerUp);
      host.removeEventListener("pointerleave", onLeave);
      brain.traverse((o) => {
        if (o instanceof THREE.Mesh) o.geometry.dispose();
      });
      material.dispose();
      renderer.dispose();
      el.remove();
    };
  }, []);

  return <div ref={hostRef} className={`ascii-host overflow-hidden font-mono ${className ?? ""}`} />;
}
