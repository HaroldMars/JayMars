import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { makeNoiseTexture, snowVert, snowFrag } from "./materials";

/**
 * Procedural igloo — denser packing + shared snow shader (Igloo Inc. silhouette).
 */
export default function Igloo({ progressRef }) {
  const root = useRef();
  const group = useRef();
  const door = useRef();
  const noise = useMemo(() => makeNoiseTexture(256), []);

  const material = useMemo(() => {
    const m = new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color("#e9eef3") },
        uTint: { value: new THREE.Color("#d5dde6") },
        uRough: { value: 0.9 },
        uNoise: { value: noise },
      },
      vertexShader: snowVert,
      fragmentShader: snowFrag,
    });
    return m;
  }, [noise]);

  const darkMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#1c2026", roughness: 1, metalness: 0 }),
    []
  );
  const stepMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#d8dee6", roughness: 0.95 }),
    []
  );

  const blocks = useMemo(() => {
    const items = [];
    const rows = 9;
    for (let row = 0; row < rows; row++) {
      const t = row / (rows - 1);
      const y = 0.2 + row * 0.34;
      const radius = Math.sin(Math.PI * (0.12 + t * 0.78)) * 2.55;
      const count = Math.max(12, Math.floor(22 - row * 1.5));
      for (let i = 0; i < count; i++) {
        const a = (i / count) * Math.PI * 2 + row * 0.07;
        const nx = Math.sin(a);
        const nz = Math.cos(a);
        const inDoor = nz > 0.76 && Math.abs(nx) < 0.4 && row < 4;
        if (inDoor) continue;
        const jitter = 0.02 * Math.sin(i * 12.989 + row * 78.233);
        items.push({
          key: `${row}-${i}`,
          position: [nx * (radius + jitter), y, nz * (radius + jitter)],
          rotation: [row * 0.05, a + Math.PI, ((i % 5) - 2) * 0.02],
          scale: [
            0.46 + (i % 3) * 0.028,
            0.32 + (row % 2) * 0.03,
            0.4 + (i % 2) * 0.03,
          ],
          row,
        });
      }
    }
    items.push({
      key: "cap",
      position: [0, 3.15, 0],
      rotation: [0, 0, 0],
      scale: [0.95, 0.42, 0.95],
      row: 99,
    });
    return items;
  }, []);

  const dirs = useMemo(
    () => blocks.map((b) => new THREE.Vector3(...b.position).normalize()),
    [blocks]
  );

  useFrame((state, dt) => {
    if (!group.current || !root.current) return;
    const progress = progressRef?.current ?? 0;
    const explode = THREE.MathUtils.smoothstep(progress, 0.78, 0.97) * 0.4;
    const breathe = Math.sin(state.clock.elapsedTime * 0.55) * 0.008;

    group.current.children.forEach((child, idx) => {
      const base = blocks[idx];
      if (!base || !dirs[idx]) return;
      const dir = dirs[idx];
      child.position.set(
        base.position[0] + dir.x * explode * (0.25 + (idx % 4) * 0.08),
        base.position[1] + explode * (0.15 + (base.row % 4) * 0.12) + breathe * ((idx % 3) - 1),
        base.position[2] + dir.z * explode * (0.25 + (idx % 3) * 0.06)
      );
      child.rotation.set(
        base.rotation[0],
        base.rotation[1] + explode * 0.12 * Math.sin(idx),
        base.rotation[2]
      );
    });

    root.current.rotation.y += dt * 0.008 * (1 - explode * 0.6);
    if (door.current) {
      door.current.visible = explode < 0.5;
      door.current.scale.setScalar(1 - explode * 0.3);
    }
  });

  return (
    <group ref={root}>
      <group ref={group}>
        {blocks.map((b) => (
          <mesh
            key={b.key}
            position={b.position}
            rotation={b.rotation}
            scale={b.scale}
            castShadow
            receiveShadow
            material={material}
          >
            <boxGeometry args={[1, 1, 1]} />
          </mesh>
        ))}
      </group>

      <group ref={door}>
        <mesh position={[0, 0.9, 1.35]} castShadow material={darkMat}>
          <boxGeometry args={[1.15, 1.75, 1.2]} />
        </mesh>
        <mesh position={[0, 1.72, 1.35]} rotation={[Math.PI / 2, 0, 0]} material={darkMat}>
          <cylinderGeometry args={[0.58, 0.58, 1.2, 20, 1, false, 0, Math.PI]} />
        </mesh>
        <mesh position={[0, 0.06, 2.15]} receiveShadow material={stepMat}>
          <boxGeometry args={[1.6, 0.1, 1.4]} />
        </mesh>
      </group>
    </group>
  );
}
