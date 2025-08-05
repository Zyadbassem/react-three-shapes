import { useMemo, useRef } from "react";
import * as THREE from "three";
import fragmentShader from "./shaders/galaxyfrag.glsl";
import vertexShader from "./shaders/galaxyver.glsl";
import { useFrame } from "@react-three/fiber";
import type { GalaxyProps } from "./shaders/types";

/**
 * This component represents a galaxy shape in a 3D scene.
 * @param {GalaxyProps} - The properties of the galaxy.
 * @returns The galaxy shape.
 */

function Galaxy({
  position = [0, 0, 0],
  scale = [1, 1, 1],
  rotation = [0, 0, 0],
  inColor = "#000",
  outColor = "#fff",
  spinning = 3,
  count = 30000,
  radius = 5,
  randomness = 10,
  branches = 3,
}: GalaxyProps) {
  // Initialize variables
  const galaxyRef = useRef<THREE.Points>(null);

  // Geometry Initialization
  const geometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const colorInside = new THREE.Color(inColor);
    const colorOutside = new THREE.Color(outColor);
    const speed = new Float32Array(count);

    // Fill positions and colors arrays
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      const radiusCalc = Math.random() * radius;
      const spinAngle = radiusCalc * spinning;
      const branchAngle = ((i % branches) / branches) * Math.PI * 2;

      const randomX =
        Math.pow(Math.random(), randomness) * (Math.random() < 0.5 ? -1 : 1);
      const randomY =
        Math.pow(Math.random(), randomness) * (Math.random() < 0.5 ? -1 : 1);
      const randomZ =
        Math.pow(Math.random(), randomness) * (Math.random() < 0.5 ? -1 : 1);

      positions[i3] = Math.cos(branchAngle + spinAngle) * radiusCalc + randomX;
      positions[i3 + 1] = randomY;
      positions[i3 + 2] =
        Math.sin(branchAngle + spinAngle) * radiusCalc + randomZ;

      const mixedColor = colorInside.clone();
      mixedColor.lerp(colorOutside, radiusCalc / radius);
      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;

      speed[i] = Math.random() - 0.5;
    }

    // Set the attribute
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("speed", new THREE.BufferAttribute(speed, 1));
    return geometry;
  }, [count, radius, branches, spinning, randomness, inColor, outColor]);

  // Initialize the Material
  const material = useMemo(() => {
    const uniforms = {
      u_time: {
        value: 0,
      },
    };
    const material = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      uniforms: uniforms,
    });

    return material;
  }, []);

  // rotate the galaxy
  useFrame(({ clock }) => {
    material.uniforms.u_time.value = clock.getElapsedTime();
    if (galaxyRef.current) {
      galaxyRef.current.rotation.y = clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <points
      material={material}
      geometry={geometry}
      ref={galaxyRef}
      position={position}
      rotation={rotation}
      scale={scale}
    />
  );
}

export default Galaxy;
