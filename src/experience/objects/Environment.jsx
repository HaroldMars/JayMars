import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { makeSoftTexture, makeNoiseTexture, snowVert, snowFrag, smokeVert, smokeFrag } from "./materials";

export function Terrain() {
  const noise = useMemo(() => makeNoiseTexture(256), []);
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(90, 90, 96, 96);
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const d = Math.hypot(x, y);
      const h =
        Math.sin(x * 0.15) * Math.cos(y * 0.12) * 0.28 +
        Math.sin(x * 0.06 + y * 0.08) * 0.5 +
        Math.sin(x * 0.35) * Math.cos(y * 0.3) * 0.08 +
        Math.max(0, d - 9) * 0.03;
      const flatten = THREE.MathUtils.smoothstep(5 - d, 0, 5);
      pos.setZ(i, h * (1 - flatten * 0.97));
    }
    g.computeVertexNormals();
    return g;
  }, []);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uColor: { value: new THREE.Color("#e2e7ed") },
          uTint: { value: new THREE.Color("#c8d0d9") },
          uRough: { value: 0.98 },
          uNoise: { value: noise },
        },
        vertexShader: snowVert,
        fragmentShader: snowFrag,
      }),
    [noise]
  );

  return (
    <mesh geometry={geo} rotation={[-Math.PI / 2, 0, 0]} receiveShadow material={material} />
  );
}

export function Hills() {
  const noise = useMemo(() => makeNoiseTexture(128), []);
  const hills = useMemo(
    () => [
      { pos: [-20, -1.4, -24], s: [16, 6.5, 11] },
      { pos: [18, -1.7, -22], s: [14, 6, 10] },
      { pos: [-6, -2.2, -30], s: [20, 7.5, 13] },
      { pos: [24, -2, -14], s: [10, 5, 9] },
      { pos: [-26, -1.8, -10], s: [11, 5.5, 10] },
      { pos: [8, -2.4, -32], s: [15, 6, 12] },
    ],
    []
  );

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uColor: { value: new THREE.Color("#cdd4dc") },
          uTint: { value: new THREE.Color("#b8c1cb") },
          uRough: { value: 1 },
          uNoise: { value: noise },
        },
        vertexShader: snowVert,
        fragmentShader: snowFrag,
      }),
    [noise]
  );

  return (
    <group>
      {hills.map((h, i) => (
        <mesh key={i} position={h.pos} scale={h.s} receiveShadow material={material}>
          <sphereGeometry args={[1, 32, 20]} />
        </mesh>
      ))}
    </group>
  );
}

export function Snow({ count = 700, reduced = false }) {
  const ref = useRef();
  const n = reduced ? Math.min(count, 220) : count;
  const data = useMemo(() => {
    const positions = new Float32Array(n * 3);
    const speeds = new Float32Array(n);
    const drift = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 48;
      positions[i * 3 + 1] = Math.random() * 20 + 1;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 48;
      speeds[i] = 0.35 + Math.random() * 1.1;
      drift[i] = 0.3 + Math.random() * 0.8;
    }
    return { positions, speeds, drift };
  }, [n]);

  useFrame((state, dt) => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position.array;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < n; i++) {
      pos[i * 3 + 1] -= data.speeds[i] * dt;
      pos[i * 3] += Math.sin(t * 0.4 + i) * 0.01 * data.drift[i];
      pos[i * 3 + 2] += Math.cos(t * 0.3 + i * 0.5) * 0.008 * data.drift[i];
      if (pos[i * 3 + 1] < 0) {
        pos[i * 3 + 1] = 14 + Math.random() * 8;
        pos[i * 3] = (Math.random() - 0.5) * 48;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 48;
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={n} array={data.positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.055}
        color="#ffffff"
        transparent
        opacity={0.7}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

/** Realistic soft volumetric-style ground smoke / frost mist */
export function Smoke({ count = 90, reduced = false }) {
  const ref = useRef();
  const soft = useMemo(() => makeSoftTexture(128), []);
  const n = reduced ? Math.min(count, 36) : count;

  const { positions, scales, alphas } = useMemo(() => {
    const positions = new Float32Array(n * 3);
    const scales = new Float32Array(n);
    const alphas = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 2.8 + Math.random() * 14;
      positions[i * 3] = Math.cos(a) * r;
      positions[i * 3 + 1] = 0.35 + Math.random() * 1.4;
      positions[i * 3 + 2] = Math.sin(a) * r;
      scales[i] = 22 + Math.random() * 48;
      alphas[i] = 0.06 + Math.random() * 0.12;
    }
    return { positions, scales, alphas };
  }, [n]);

  const uniforms = useMemo(
    () => ({
      uMap: { value: soft },
      uTime: { value: 0 },
    }),
    [soft]
  );

  useFrame((state) => {
    if (!ref.current) return;
    uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={n} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-aScale" count={n} array={scales} itemSize={1} />
        <bufferAttribute attach="attributes-aAlpha" count={n} array={alphas} itemSize={1} />
      </bufferGeometry>
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={smokeVert}
        fragmentShader={smokeFrag}
        transparent
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </points>
  );
}

/** Keep Mist as light alias for compatibility */
export function Mist(props) {
  return <Smoke {...props} />;
}

export function IceShards({ projects, progressRef, onSelect, selectedId }) {
  const group = useRef();
  const shards = useMemo(
    () =>
      projects.map((p, i) => {
        const a = (i / Math.max(projects.length, 1)) * Math.PI * 2 - Math.PI / 2;
        const r = 5.4 + (i % 2) * 0.7;
        return {
          ...p,
          id: p.title,
          position: [Math.sin(a) * r, 1.15 + (i % 3) * 0.3, Math.cos(a) * r],
          rot: a,
        };
      }),
    [projects]
  );

  useFrame((state) => {
    if (!group.current) return;
    const progress = progressRef?.current ?? 0;
    const reveal = THREE.MathUtils.smoothstep(progress, 0.3, 0.52);
    group.current.children.forEach((child, i) => {
      const s = shards[i];
      if (!s) return;
      const bob = Math.sin(state.clock.elapsedTime * 1.1 + i) * 0.1;
      child.position.y = s.position[1] + bob;
      child.rotation.y = state.clock.elapsedTime * 0.35 + s.rot;
      child.rotation.x = Math.sin(state.clock.elapsedTime * 0.4 + i) * 0.15;
      const active = selectedId === s.id ? 1.2 : 1;
      child.scale.setScalar(reveal * active * (0.75 + (i % 3) * 0.06));
      child.visible = reveal > 0.04;
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
          <octahedronGeometry args={[0.42, 0]} />
          <meshPhysicalMaterial
            color={selectedId === s.id ? "#a8cceb" : "#d7e6f2"}
            roughness={0.15}
            metalness={0.08}
            transparent
            opacity={0.82}
            clearcoat={0.55}
            clearcoatRoughness={0.25}
          />
        </mesh>
      ))}
    </group>
  );
}
