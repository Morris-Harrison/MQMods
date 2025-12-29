"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import Title3D from "./3dtitle";

// Click: single full spin (2π) with ease-out, stops at same facing
export default function SpinningTitle3D() {
  const group = useRef(null);
  const playing = useRef(false);
  const elapsed = useRef(0);
  const baseAngle = useRef(0);
  const DURATION = 0.75; // seconds
  const TWO_PI = Math.PI * 2;

  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    if (!playing.current) return;
    elapsed.current += delta;
    const t = Math.min(1, elapsed.current / DURATION);
    const eased = easeOutCubic(t);
    g.rotation.y = baseAngle.current + TWO_PI * eased;
    if (t >= 1) {
      // Snap exactly back to the starting facing
      g.rotation.y = baseAngle.current;
      playing.current = false;
      elapsed.current = 0;
    }
  });

  const handleClick = () => {
    const g = group.current;
    if (!g) return;
    if (playing.current) return; // ignore clicks while spinning
    // Start from current orientation; animate one full turn with ease-out
    baseAngle.current = g.rotation.y;
    elapsed.current = 0;
    playing.current = true;
  };

  return (
    <group
      ref={group}
      onClick={handleClick}
      onPointerDown={(e) => e.stopPropagation()}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = playing.current ? "default" : "pointer";
      }}
      onPointerOut={() => (document.body.style.cursor = "auto")}
    >
      <Title3D size={2.5} />
    </group>
  );
}
