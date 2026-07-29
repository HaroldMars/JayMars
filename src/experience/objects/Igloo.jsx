import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/** Procedural igloo built from packed snow blocks — Igloo Inc. inspired silhouette. */
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
      const tilt = row * 0.1;
      for (let i = 0; i < count; i++) {
        const a = (i / count) * Math.PI * 2 + row * 0.1;
        // arched doorway gap on the front
        const nx = Math.sin(a);
        const nz = Math.cos(a);
        const inDoor = nz > 0.78 && Math.abs(nx) < 0.42 && row < 4;
        if (inDoor) continue;
        items.push({
          key: `${row}-${i}`,
          position: [nx * radius, y, nz * radius],
          rotation: [tilt * 0.4, a + Math.PI, 0.03 * Math.sin(i + row)],
          scale: [
            0.5 + (i % 3) * 0.035,
            0.36 + (row % 2) * 0.04,
            0.44 + (i % 2) * 0.04,
          ],
          row,
        });
      }
    }
    // dome keystone
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
    const explode = THREE.MathUtils.smoothstep(progress, 0.55, 0.88);
    group.current.children.forEach((child, idx) => {
      const base = blocks[idx];
      if (!base || !dirs[idx]) return;
      const dir = dirs[idx];
      const lift = explode * (0.35 + (base.row % 5) * 0.3);
      child.position.set(
        base.position[0] + dir.x * explode * (0.7 + (idx % 4) * 0.22),
        base.position[1] + lift,
        base.position[2] + dir.z * explode * (0.7 + (idx % 3) * 0.18)
      );
      child.rotation.set(
        base.rotation[0],
        base.rotation[1] + explode * 0.35 * Math.sin(idx),
        base.rotation[2]
      );
    });
    root.current.rotation.y += dt * 0.012 * (1 - explode * 0.7);
    if (door.current) {
      door.current.visible = explode < 0.35;
      door.current.scale.setScalar(1 - explode * 0.5);
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
              roughness={0.92}
              metalness={0.02}
              flatShading
            />
          </mesh>
        ))}
      </group>

      {/* soft interior shadow for the doorway */}
      <group ref={door}>
        <mesh position={[0, 0.95, 1.55]} rotation={[0.08, 0, 0]}>
          <cylinderGeometry args={[0.55, 0.62, 1.85, 20, 1, true]} />
          <meshStandardMaterial
            color="#4a515a"
            roughness={1}
            side={THREE.BackSide}
            transparent
            opacity={0.85}
          />
        </mesh>
        <mesh position={[0, 0.15, 2.35]} receiveShadow>
          <boxGeometry args={[1.5, 0.12, 1.1]} />
          <meshStandardMaterial color="#d5dbe3" roughness={1} />
        </mesh>
      </group>
    </group>
  );
}
