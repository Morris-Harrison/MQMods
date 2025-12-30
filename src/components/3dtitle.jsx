"use client";

import React, {
  useEffect,
  useMemo,
  useState,
  useRef,
  useLayoutEffect,
} from "react";
import { Center, Text3D } from "@react-three/drei";

/**
 * 3D text with depth/bevel using drei's Text3D.
 * Cycles fonts & words every 3s (like titlelogic.js) by default.
 * Requires .json typeface font files in /public/fonts (e.g., /fonts/ysl.json, /fonts/dior.json).
 */
export default function Title3D({
  // Static fallbacks (used when cycle=false)
  text = "MQMODS",
  font = "/fonts/mono.json",
  // Cycle behavior
  cycle = false,
  fonts = ["/fonts/mono.json", "/fonts/mono.json"],
  words = ["MQ MODS"],
  
  intervalMs = 3000,
  // Geometry/material
  size = 2,
  height = 5,
  curveSegments = 12,
  bevelEnabled = true,
  bevelThickness = 0.04,
  bevelSize = 0.02,
  bevelSegments = 5,
  color = "#000000ff",
  metalness = 1,
  roughness = 0.4,
  ...props
}) {
  const pairs = useMemo(() => {
    const n = Math.min(fonts?.length || 0, words?.length || 0);
    if (!cycle || n === 0) return [{ font, word: text }];
    return Array.from({ length: n }, (_, i) => ({
      font: fonts[i],
      word: words[i],
    }));
  }, [cycle, fonts, words, font, text]);

  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!cycle || pairs.length <= 1) return;
    let mounted = true;
    const id = setInterval(() => {
      if (!mounted) return;
      setIdx((i) => (i + 1) % pairs.length);
    }, intervalMs);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, [cycle, pairs.length, intervalMs]);

  const current = pairs[idx] ?? { font, word: text };

  // Force-center the geometry around its origin for any word/font
  const textRef = useRef();
  useLayoutEffect(() => {
    const mesh = textRef.current;
    if (!mesh || !mesh.geometry) return;
    // Ensure bbox is up to date, then center geometry in-place
    mesh.geometry.computeBoundingBox();
    if (mesh.geometry.boundingBox) {
      mesh.geometry.center();
    }
  }, [
    current.font,
    current.word,
    size,
    height,
    curveSegments,
    bevelEnabled,
    bevelThickness,
    bevelSize,
    bevelSegments,
    
  ]);

  return (
    <group castShadow receiveShadow {...props}>
      <Center>
        <Text3D
          ref={textRef}
          key={`${current.font}-${current.word}-${size}-${height}`}
          font={current.font}
          size={size}
          height={height}
          curveSegments={curveSegments}
          bevelEnabled={bevelEnabled}
          bevelThickness={bevelThickness}
          bevelSize={bevelSize}
          bevelSegments={bevelSegments}
          color={color}
          
        >
          {current.word}
          <meshStandardMaterial
            key={color}
            color={color}
            metalness={metalness}
            roughness={roughness}
          />
        </Text3D>
      </Center>
    </group>
  );
}
