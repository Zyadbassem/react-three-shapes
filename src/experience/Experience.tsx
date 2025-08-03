import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

export default function Experience() {
  return (
    <Canvas
      fallback={<div>Sorry no WebGL supported!</div>}
      gl={{ alpha: false }}
    >
      <OrbitControls />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#fff" />
      </mesh>
    </Canvas>
  );
}
