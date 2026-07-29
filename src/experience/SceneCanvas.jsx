import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useMemo } from "react";
import Igloo from "./objects/Igloo";
import { Terrain, Hills, Snow, Mist, IceShards } from "./objects/Environment";

function CameraRig({ progressRef, mobile }) {
  const { camera } = useThree();
  const look = useMemo(() => new THREE.Vector3(), []);
  const target = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    const p = progressRef.current ?? 0;
    const t = mobile ? THREE.MathUtils.lerp(0.08, 0.55, p) : p;

    const radius = THREE.MathUtils.lerp(9.5, 5.2, Math.min(t * 1.4, 1));
    const height = THREE.MathUtils.lerp(3.8, 1.6, Math.min(t * 1.2, 1));
    const angle = -0.55 + t * 2.4;

    target.set(
      Math.sin(angle) * radius,
      height + Math.sin(t * Math.PI) * 0.35,
      Math.cos(angle) * radius
    );
    camera.position.lerp(target, 0.08);
    look.set(0, 1.2 + t * 0.3, 0);
    camera.lookAt(look);
    camera.fov = THREE.MathUtils.lerp(42, 36, Math.min(t, 1));
    camera.updateProjectionMatrix();
  });

  return null;
}

function World({ progressRef, projects, onSelectProject, selectedId, mobile }) {
  return (
    <>
      <color attach="background" args={["#c5cad3"]} />
      <fog attach="fog" args={["#c5cad3", 12, 42]} />
      <ambientLight intensity={0.72} />
      <directionalLight
        castShadow={!mobile}
        position={[8, 14, 6]}
        intensity={1.35}
        shadow-mapSize={[1024, 1024]}
        color="#fff7ed"
      />
      <hemisphereLight args={["#e8eef5", "#9aa3ad", 0.55]} />

      <CameraRig progressRef={progressRef} mobile={mobile} />
      <Terrain />
      <Hills />
      <Igloo progressRef={progressRef} />
      <Snow count={mobile ? 160 : 420} reduced={mobile} />
      <Mist count={mobile ? 24 : 55} reduced={mobile} />
      {!mobile && (
        <IceShards
          projects={projects}
          progressRef={progressRef}
          onSelect={onSelectProject}
          selectedId={selectedId}
        />
      )}
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
      dpr={mobile ? [1, 1.5] : [1, 2]}
      camera={{ position: [0, 4, 10], fov: 42, near: 0.1, far: 80 }}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: mobile ? "low-power" : "high-performance",
      }}
      onCreated={({ gl }) => {
        gl.setClearColor("#c5cad3");
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
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
