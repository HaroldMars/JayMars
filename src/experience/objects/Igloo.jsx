import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/** Procedural igloo — stable packed-snow silhouette inspired by Igloo Inc. */
export default function Igloo({ progressRef }) {
  const root = useRef();
  const group = useRef();
  const door = useRef();
  const blocks = useMemo(() => {
    const items = [];
    const rows = 8;
    for (let row = 0; row < rows; row++) {
      const y = 0.22 + row * 0.38;
      const radius = 2.45 - row * 0.2;
      const count = Math.max(10, 20 - row * 2);
      const tilt = row * 0.08;
      for (let i = 0; i < count; i++) {
        const a = (i / count) * Math.PI * 2 + row * 0.08;
        const nx = Math.sin(a);
        const nz = Math.cos(a);
        const inDoor = nz > 0.78 && Math.abs(nx) < 0.42 && row < 4;
        if (inDoor) continue;
        items.push({
          key: `${row}-${i}`,
          position: [nx * radius, y, nz * radius],
          rotation: [tilt * 0.35, a + Math.PI, 0.02 * Math.sin(i + row)],
          scale: [
            0.5 + (i % 3) * 0.03,
            0.36 + (row % 2) * 0.035,
            0.44 + (i % 2) * 0.035,
          ],
          row,
        });
      }
    }
    items.push({
      key: "cap",
      position: [0, 3.2, 0],
      rotation: [0, 0, 0],
      scale: [1.05, 0.5, 1.05],
      row: 99,
    });
    return items;
  }, []);

  const dirs = useMemo(
    () => blocks.map((b) => new THREE.Vector3(...b.position).normalize()),
    [blocks]
  );

  useFrame((_, dt) => {
    if (!group.current || !root.current) return;
    const progress = progressRef?.current ?? 0;
    // Gentle separation only near the end — keep igloo readable for most of the scroll
    const explode = THREE.MathUtils.smoothstep(progress, 0.72, 0.95) * 0.55;
    group.current.children.forEach((child, idx) => {
      const base = blocks[idx];
      if (!base || !dirs[idx]) return;
      const dir = dirs[idx];
      const lift = explode * (0.2 + (base.row % 5) * 0.18);
      child.position.set(
        base.position[0] + dir.x * explode * (0.35 + (idx % 4) * 0.1),
        base.position[1] + lift,
        base.position[2] + dir.z * explode * (0.35 + (idx % 3) * 0.08)
      );
      child.rotation.set(
        base.rotation[0],
        base.rotation[1] + explode * 0.15 * Math.sin(idx),
        base.rotation[2]
      );
    });
    root.current.rotation.y += dt * 0.01 * (1 - explode * 0.5);
    if (door.current) {
      door.current.visible = explode < 0.45;
      door.current.scale.setScalar(1 - explode * 0.35);
    }
  });

  return (
    <group ref={root} position={[0, 0, 0]}>
      <group ref={group}>
        {blocks.map((b) => (
          <mesh
            key={b.key}
            position={b.position}
            rotation={b.rotation}
            scale={b.scale}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial
              color="#e8edf2"
              roughness={0.88}
              metalness={0.04}
              flatShading
            />
          </mesh>
        ))}
      </group>

      <group ref={door}>
        <mesh position={[0, 0.95, 1.55]} rotation={[0.08, 0, 0]}>
          <cylinderGeometry args={[0.55, 0.62, 1.85, 20, 1, true]} />
          <meshStandardMaterial
            color="#3d4450"
            roughness={1}
            side={THREE.BackSide}
            transparent
            opacity={0.9}
          />
        </mesh>
        <mesh position={[0, 0.12, 2.35]} receiveShadow>
          <boxGeometry args={[1.5, 0.12, 1.1]} />
          <meshStandardMaterial color="#d5dbe3" roughness={1} />
        </mesh>
      </group>
    </group>
  );
}
