import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import {
  EffectComposer,
  DepthOfField,
  Bloom,
  Vignette,
  Noise,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import Igloo from "./objects/Igloo";
import { Terrain, Hills, Snow, Smoke, IceShards } from "./objects/Environment";

function CameraRig({ progressRef, mobile }) {
  const { camera } = useThree();
  const look = useMemo(() => new THREE.Vector3(), []);
  const desired = useMemo(() => new THREE.Vector3(), []);
  const smooth = useRef(0);

  useFrame((_, dt) => {
    const p = progressRef.current ?? 0;
    smooth.current += (p - smooth.current) * Math.min(1, dt * 2.4);
    const t = mobile ? THREE.MathUtils.lerp(0.06, 0.5, smooth.current) : smooth.current;

    const radius = THREE.MathUtils.lerp(10.2, 4.8, Math.min(t * 1.25, 1));
    const height = THREE.MathUtils.lerp(4.2, 1.45, Math.min(t * 1.15, 1));
    const angle = -0.65 + t * 2.55;

    desired.set(
      Math.sin(angle) * radius,
      height + Math.sin(t * Math.PI) * 0.28,
      Math.cos(angle) * radius
    );
    camera.position.lerp(desired, 1 - Math.exp(-dt * 3.2));
    look.set(0, 1.15 + t * 0.35, Math.sin(t * 0.8) * 0.2);
    camera.lookAt(look);
    camera.fov = THREE.MathUtils.lerp(44, 34, Math.min(t, 1));
    camera.updateProjectionMatrix();
  });

  return null;
}

function ScrollFX({ progressRef, mobile }) {
  const [tier, setTier] = useState(0);
  const last = useRef(0);

  useFrame((state) => {
    // throttle React updates (~8fps) so EffectComposer props stay in sync with scroll
    if (state.clock.elapsedTime - last.current < 0.12) return;
    last.current = state.clock.elapsedTime;
    const next = Math.round((progressRef.current ?? 0) * 20) / 20;
    setTier((prev) => (prev === next ? prev : next));
  });

  const bokeh = THREE.MathUtils.lerp(mobile ? 1.4 : 2.4, mobile ? 2.8 : 5.2, tier);
  const focal = THREE.MathUtils.lerp(0.02, 0.045, tier);

  return (
    <EffectComposer multisampling={0} enableNormalPass={false}>
      <DepthOfField
        focusDistance={0.035}
        focalLength={focal}
        bokehScale={bokeh}
        height={mobile ? 320 : 480}
      />
      <Bloom luminanceThreshold={0.85} luminanceSmoothing={0.4} intensity={mobile ? 0.2 : 0.35} mipmapBlur />
      <Noise opacity={0.025} premultiply blendFunction={BlendFunction.SOFT_LIGHT} />
      <Vignette eskil={false} offset={0.2} darkness={0.5} />
    </EffectComposer>
  );
}

function World({ progressRef, projects, onSelectProject, selectedId, mobile }) {
  return (
    <>
      <color attach="background" args={["#b9c0ca"]} />
      <fog attach="fog" args={["#b9c0ca", 10, 38]} />

      <ambientLight intensity={0.58} />
      <hemisphereLight args={["#eef2f6", "#8e98a4", 0.7]} />
      <directionalLight
        castShadow={!mobile}
        position={[7, 16, 5]}
        intensity={1.5}
        color="#fff4e8"
        shadow-mapSize={[mobile ? 512 : 1024, mobile ? 512 : 1024]}
        shadow-camera-far={40}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
        shadow-bias={-0.0002}
      />
      <directionalLight position={[-6, 4, -4]} intensity={0.32} color="#c5d4e8" />

      <CameraRig progressRef={progressRef} mobile={mobile} />
      <Terrain />
      <Hills />
      <Igloo progressRef={progressRef} />
      <Snow count={mobile ? 180 : 560} reduced={mobile} />
      <Smoke count={mobile ? 32 : 72} reduced={mobile} />
      {!mobile && (
        <IceShards
          projects={projects}
          progressRef={progressRef}
          onSelect={onSelectProject}
          selectedId={selectedId}
        />
      )}

      <ContactShadows
        position={[0, 0.01, 0]}
        opacity={0.32}
        scale={28}
        blur={2.4}
        far={8}
        resolution={mobile ? 256 : 512}
        color="#6a7380"
      />

      <ScrollFX progressRef={progressRef} mobile={mobile} />
    </>
  );
}

export default function SceneCanvas({
  progressRef,
  projects,
  onSelectProject,
  selectedId,
  mobile = false,
}) {
  return (
    <Canvas
      className="exp-canvas"
      shadows={!mobile}
      dpr={mobile ? [1, 1.25] : [1, 1.5]}
      camera={{ position: [0, 4.2, 10.5], fov: 42, near: 0.1, far: 90 }}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: mobile ? "low-power" : "high-performance",
        stencil: false,
      }}
      onCreated={({ gl }) => {
        gl.setClearColor("#b9c0ca");
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.08;
        gl.outputColorSpace = THREE.SRGBColorSpace;
      }}
    >
      <World
        progressRef={progressRef}
        projects={projects}
        onSelectProject={onSelectProject}
        selectedId={selectedId}
        mobile={mobile}
      />
    </Canvas>
  );
}
