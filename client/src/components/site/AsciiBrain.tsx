import { useEffect, useRef } from "react";
import * as THREE from "three";
import { AsciiEffect } from "three/examples/jsm/effects/AsciiEffect.js";

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
    // Elongated, slightly egg-shaped hemisphere.
    v.x *= 0.62;
    v.y *= 0.78;
    v.z *= 1.08;
    // Flatten the medial wall facing the longitudinal fissure.
    if (v.x * side < 0) v.x *= 0.35;
    // Taper the frontal lobe and fuller occipital region.
    v.y *= 1 - Math.max(0, v.z) * 0.12;
    // Flatten the inferior surface.
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

export default function AsciiBrain({ className }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);

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
    const effect = new AsciiEffect(renderer, " .:-=+*#%@", { invert: true, resolution: 0.17 });
    effect.setSize(width(), height());
    const el = effect.domElement;
    el.style.color = "#00a3ff";
    el.style.backgroundColor = "transparent";
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
    const onPointer = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      targetX = ((e.clientX - r.left) / r.width - 0.5) * 0.9;
      targetY = ((e.clientY - r.top) / r.height - 0.5) * 0.5;
    };
    const onLeave = () => {
      targetX = 0;
      targetY = 0;
    };
    host.addEventListener("pointermove", onPointer);
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
    const tick = (t: number) => {
      raf = requestAnimationFrame(tick);
      if (!visible || !hasSize() || t - last < 33) return;
      const dt = Math.min((t - last) / 1000, 0.1);
      last = t;
      if (!reduce) spin += dt * 0.45;
      brain.rotation.y = 0.6 + spin + targetX;
      brain.rotation.x += (0.25 + targetY - brain.rotation.x) * 0.06;
      brain.position.y = Math.sin(t / 1400) * 0.04;
      effect.render(scene, camera);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      host.removeEventListener("pointermove", onPointer);
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
