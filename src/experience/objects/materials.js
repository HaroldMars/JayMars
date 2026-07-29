import * as THREE from "three";

/** Soft radial sprite used for smoke / mist billboards */
export function makeSoftTexture(size = 128) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d");
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(255,255,255,0.85)");
  g.addColorStop(0.35, "rgba(255,255,255,0.35)");
  g.addColorStop(0.7, "rgba(255,255,255,0.08)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** Tileable value-noise for ice / snow roughness variation */
export function makeNoiseTexture(size = 256) {
  const data = new Uint8Array(size * size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const n =
        Math.sin(x * 0.11) * Math.cos(y * 0.09) * 0.35 +
        Math.sin(x * 0.27 + y * 0.19) * 0.25 +
        Math.sin((x + y) * 0.07) * 0.2 +
        Math.random() * 0.2;
      data[y * size + x] = Math.floor(THREE.MathUtils.clamp(n * 0.5 + 0.5, 0, 1) * 255);
    }
  }
  const tex = new THREE.DataTexture(data, size, size, THREE.RedFormat);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.needsUpdate = true;
  return tex;
}

export const snowVert = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPos = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

export const snowFrag = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uTint;
  uniform float uRough;
  uniform sampler2D uNoise;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorldPos;

  void main() {
    float n = texture2D(uNoise, vWorldPos.xz * 0.18).r;
    float n2 = texture2D(uNoise, vWorldPos.xz * 0.55 + 0.2).r;
    vec3 col = mix(uColor, uTint, n * 0.35 + n2 * 0.15);
    float fres = pow(1.0 - max(dot(normalize(vNormal), vec3(0.0, 1.0, 0.0)), 0.0), 1.6);
    col += fres * 0.12;
    float shade = 0.72 + 0.28 * max(dot(normalize(vNormal), normalize(vec3(0.4, 1.0, 0.25))), 0.0);
    gl_FragColor = vec4(col * shade, 1.0);
  }
`;

export const smokeVert = /* glsl */ `
  attribute float aScale;
  attribute float aAlpha;
  varying float vAlpha;
  uniform float uTime;
  void main() {
    vAlpha = aAlpha;
    vec3 p = position;
    p.x += sin(uTime * 0.22 + position.z * 0.4) * 0.35;
    p.z += cos(uTime * 0.18 + position.x * 0.3) * 0.35;
    p.y += sin(uTime * 0.3 + aScale) * 0.15;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = aScale * (280.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

export const smokeFrag = /* glsl */ `
  uniform sampler2D uMap;
  varying float vAlpha;
  void main() {
    vec4 t = texture2D(uMap, gl_PointCoord);
    float a = t.a * vAlpha;
    if (a < 0.01) discard;
    gl_FragColor = vec4(0.86, 0.89, 0.93, a);
  }
`;
