import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function Terrain() {
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(80, 80, 64, 64);
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const d = Math.hypot(x, y);
      const h =
        Math.sin(x * 0.18) * Math.cos(y * 0.14) * 0.35 +
        Math.sin(x * 0.07 + y * 0.09) * 0.55 +
        Math.max(0, d - 10) * 0.035;
      // flatten near igloo
      const flatten = THREE.MathUtils.smoothstep(4.5 - d, 0, 4.5);
      pos.setZ(i, h * (1 - flatten * 0.95));
    }
    g.computeVertexNormals();
    return g;
  }, []);

  return (
    <mesh
      geometry={geo}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0, 0]}
      receiveShadow
    >
      <meshStandardMaterial color="#dfe4ea" roughness={0.98} metalness={0} />
    </mesh>
  );
}

export function Hills() {
  const hills = useMemo(
    () => [
      { pos: [-18, -1.2, -22], s: [14, 6, 10] },
      { pos: [16, -1.5, -20], s: [12, 5.5, 9] },
      { pos: [-8, -2, -28], s: [18, 7, 12] },
      { pos: [22, -1.8, -12], s: [9, 4.5, 8] },
      { pos: [-24, -1.6, -8], s: [10, 5, 9] },
    ],
    []
  );

  return (
    <group>
      {hills.map((h, i) => (
        <mesh key={i} position={h.pos} scale={h.s} receiveShadow>
          <sphereGeometry args={[1, 24, 16]} />
          <meshStandardMaterial color="#c9d0d8" roughness={1} metalness={0} />
        </mesh>
      ))}
    </group>
  );
}

export function Snow({ count = 500, reduced = false }) {
  const ref = useRef();
  const n = reduced ? Math.min(count, 180) : count;
  const data = useMemo(() => {
    const positions = new Float32Array(n * 3);
    const speeds = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 1] = Math.random() * 18 + 1;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40;
      speeds[i] = 0.4 + Math.random() * 1.2;
    }
    return { positions, speeds };
  }, [n]);

  useFrame((_, dt) => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position.array;
    for (let i = 0; i < n; i++) {
      pos[i * 3 + 1] -= data.speeds[i] * dt;
      pos[i * 3] += Math.sin(i + performance.now() * 0.0004) * 0.01;
      if (pos[i * 3 + 1] < 0) {
        pos[i * 3 + 1] = 14 + Math.random() * 6;
        pos[i * 3] = (Math.random() - 0.5) * 40;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 40;
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={n}
          array={data.positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.07}
        color="#ffffff"
        transparent
        opacity={0.75}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

/** Soft ground mist / smoke drifting around the igloo */
export function Mist({ count = 60, reduced = false }) {
  const ref = useRef();
  const n = reduced ? Math.min(count, 28) : count;
  const data = useMemo(() => {
    const positions = new Float32Array(n * 3);
    const phases = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 4.5 + Math.random() * 12;
      positions[i * 3] = Math.cos(a) * r;
      positions[i * 3 + 1] = 0.25 + Math.random() * 0.9;
      positions[i * 3 + 2] = Math.sin(a) * r;
      phases[i] = Math.random() * Math.PI * 2;
    }
    return { positions, phases };
  }, [n]);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const pos = ref.current.geometry.attributes.position.array;
    for (let i = 0; i < n; i++) {
      const ph = data.phases[i];
      pos[i * 3] += Math.sin(t * 0.15 + ph) * 0.003;
      pos[i * 3 + 2] += Math.cos(t * 0.12 + ph) * 0.003;
      pos[i * 3 + 1] = 0.3 + Math.sin(t * 0.3 + ph) * 0.15 + (i % 4) * 0.05;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
    ref.current.rotation.y = t * 0.015;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={n}
          array={data.positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.55}
        color="#cfd7e0"
        transparent
        opacity={0.18}
        depthWrite={false}
        sizeAttenuation
        blending={THREE.NormalBlending}
      />
    </points>
  );
}

/** Ice crystal markers for projects — clickable in the scene. */
export function IceShards({ projects, progressRef, onSelect, selectedId }) {
  const group = useRef();
  const shards = useMemo(
    () =>
      projects.map((p, i) => {
        const a = (i / Math.max(projects.length, 1)) * Math.PI * 2 - Math.PI / 2;
        const r = 5.2 + (i % 2) * 0.8;
        return {
          ...p,
          id: p.title,
          position: [Math.sin(a) * r, 1.1 + (i % 3) * 0.35, Math.cos(a) * r],
          rot: a,
        };
      }),
    [projects]
  );

  useFrame((state) => {
    if (!group.current) return;
    const progress = progressRef?.current ?? 0;
    const reveal = THREE.MathUtils.smoothstep(progress, 0.28, 0.55);
    group.current.children.forEach((child, i) => {
      const s = shards[i];
      if (!s) return;
      const bob = Math.sin(state.clock.elapsedTime * 1.2 + i) * 0.08;
      child.position.y = s.position[1] + bob;
      child.rotation.y = state.clock.elapsedTime * 0.25 + s.rot;
      const active = selectedId === s.id ? 1.25 : 1;
      child.scale.setScalar(reveal * active * (0.85 + (i % 3) * 0.08));
      child.visible = reveal > 0.05;
    });
  });

  return (
    <group ref={group}>
      {shards.map((s) => (
        <mesh
          key={s.id}
          position={s.position}
          onClick={(e) => {
            e.stopPropagation();
            onSelect?.(s);
          }}
          onPointerOver={() => {
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            document.body.style.cursor = "auto";
          }}
        >
          <octahedronGeometry args={[0.38, 0]} />
          <meshPhysicalMaterial
            color={selectedId === s.id ? "#9ec5e8" : "#cfe0ef"}
            roughness={0.18}
            metalness={0.08}
            transparent
            opacity={0.78}
          />
        </mesh>
      ))}
    </group>
  );
}
