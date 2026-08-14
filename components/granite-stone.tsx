"use client";

import {
    Suspense,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useSyncExternalStore,
} from "react";
import type { MutableRefObject } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import {
    ARRIVE_END,
    INTRO_FADE_START,
    LAYOUT_POSE,
    lerp,
    MOBILE_POSE,
    morphWeightsAt,
    remap,
    smoothstep,
    stonePoseAt,
} from "@/lib/hero-story";

/* ============================================================
   TUNING
   ============================================================ */

const DETAIL = 36;              // icosphere subdivision (silhouette quality)
const MOBILE_BREAKPOINT = 768;
const BASE_RADIUS = 1.45;

const GRAIN_SCALE = 26;         // granite crystal size (higher = finer grain)
const MAP_SCALE = 0.34;         // triplanar photo texture scale
const BUMP_STRENGTH = 0.55;     // micro-relief of the raw surface

// How far the polished stage may drift from the raw albedo.
// Keep both close to 1.0 — it is the same stone, only finished differently.
const POLISH_DARKEN = 0.97;     // 1.0 = identical brightness to the raw stage
const POLISH_SATURATION = 1.1;  // 1.0 = identical chroma to the raw stage

/* ============================================================
   NOISE  —  value noise with quintic interpolation

   The original hash3() used Math.floor() *inside* the octave loop,
   so the noise had no interpolation at all: it returned a different
   constant per integer cell. That is the main reason the stone reads
   as "computer generated" — the displacement was discontinuous noise,
   not an organic field.
   ============================================================ */

function hash1(n: number) {
    const s = Math.sin(n * 127.1) * 43758.5453123;
    return s - Math.floor(s);
}

function fade(t: number) {
    return t * t * t * (t * (t * 6 - 15) + 10);
}

function valueNoise(x: number, y: number, z: number) {
    const ix = Math.floor(x);
    const iy = Math.floor(y);
    const iz = Math.floor(z);

    const fx = fade(x - ix);
    const fy = fade(y - iy);
    const fz = fade(z - iz);

    const corner = (dx: number, dy: number, dz: number) =>
        hash1((ix + dx) + (iy + dy) * 57.31 + (iz + dz) * 113.77);

    const mix = (a: number, b: number, t: number) => a + (b - a) * t;

    const x00 = mix(corner(0, 0, 0), corner(1, 0, 0), fx);
    const x10 = mix(corner(0, 1, 0), corner(1, 1, 0), fx);
    const x01 = mix(corner(0, 0, 1), corner(1, 0, 1), fx);
    const x11 = mix(corner(0, 1, 1), corner(1, 1, 1), fx);

    return mix(mix(x00, x10, fy), mix(x01, x11, fy), fz);
}

function fbm(v: THREE.Vector3, octaves = 5, frequency = 1) {
    let value = 0;
    let amplitude = 0.5;
    let norm = 0;

    for (let i = 0; i < octaves; i++) {
        value += valueNoise(v.x * frequency, v.y * frequency, v.z * frequency) * amplitude;
        norm += amplitude;
        frequency *= 2.03;
        amplitude *= 0.5;
    }

    return value / norm;
}

/** Ridged noise — produces creases and fracture-like edges instead of blobs. */
function ridged(v: THREE.Vector3, frequency: number) {
    const n = fbm(v, 4, frequency);
    return 1 - Math.abs(n * 2 - 1);
}

/* ============================================================
   FORM

   cubify() was a sphere→cube blend with no control over edge
   sharpness, so the quarried block and the slab both stayed
   soft and balloon-like. A superellipsoid gives an exact surface
   point for any direction, with the exponent controlling how
   crisp the edges are: 2 = ellipsoid, 8 = chamfered block,
   16 = sawn slab.
   ============================================================ */

function superellipsoid(
    direction: THREE.Vector3,
    half: THREE.Vector3,
    exponent: number,
    out: THREE.Vector3,
) {
    const t = Math.pow(
        Math.pow(Math.abs(direction.x) / half.x, exponent) +
        Math.pow(Math.abs(direction.y) / half.y, exponent) +
        Math.pow(Math.abs(direction.z) / half.z, exponent),
        -1 / exponent,
    );

    return out.copy(direction).multiplyScalar(t);
}

/** Fixed set of fracture planes — granite splits along joints, it does not erode into a potato. */
const FRACTURE_PLANES: Array<{ normal: THREE.Vector3; distance: number }> = [
    { normal: new THREE.Vector3(0.82, 0.38, 0.42), distance: 1.34 },
    { normal: new THREE.Vector3(-0.64, 0.22, 0.73), distance: 1.28 },
    { normal: new THREE.Vector3(0.12, -0.94, 0.31), distance: 1.22 },
    { normal: new THREE.Vector3(-0.55, -0.31, -0.77), distance: 1.31 },
    { normal: new THREE.Vector3(0.47, 0.86, -0.2), distance: 1.3 },
    { normal: new THREE.Vector3(0.9, -0.28, -0.33), distance: 1.36 },
].map((plane) => ({ normal: plane.normal.normalize(), distance: plane.distance }));

const RAW_AXES = new THREE.Vector3(1.16, 0.9, 1.04);
const QUARRIED_HALF = new THREE.Vector3(1.06, 0.94, 0.86).multiplyScalar(BASE_RADIUS);
const POLISHED_HALF = new THREE.Vector3(1.9, 0.2, 1.5);

const scratch = new THREE.Vector3();

/** Stage 1 — pedra bruta: fractured, weathered, irregular. */
function displaceRaw(vertex: THREE.Vector3) {
    const direction = vertex.clone().normalize();

    const macro = fbm(scratch.copy(direction).multiplyScalar(1.7), 4) - 0.5;
    const crease = ridged(scratch.copy(direction).multiplyScalar(3.4), 1) - 0.5;
    const grit = fbm(scratch.copy(direction).multiplyScalar(11), 3) - 0.5;

    const radius = BASE_RADIUS * (1 + macro * 0.2 + crease * 0.09 + grit * 0.028);

    vertex.copy(direction).multiplyScalar(radius).multiply(RAW_AXES);

    for (const plane of FRACTURE_PLANES) {
        const jitter =
            plane.distance *
            (1 + (valueNoise(plane.normal.x * 9, plane.normal.y * 9, plane.normal.z * 9) - 0.5) * 0.1);

        const depth = vertex.dot(plane.normal) - jitter;

        if (depth > 0) {
            // Soft shoulder so the cut edge is chipped, not razor-sharp.
            const shoulder = depth / (depth + 0.06);
            vertex.addScaledVector(plane.normal, -depth * (0.75 + shoulder * 0.25));
        }
    }

    return vertex;
}

/** Stage 2 — bloco extraído: sawn faces, wire-saw arcs, drill channels. */
function displaceQuarried(vertex: THREE.Vector3) {
    const direction = vertex.clone().normalize();

    superellipsoid(direction, QUARRIED_HALF, 7, vertex);

    const ax = Math.abs(direction.x);
    const ay = Math.abs(direction.y);
    const az = Math.abs(direction.z);

    // Diamond-wire arcs on the vertical faces.
    const sideFace = smoothstepLocal(0.55, 0.85, Math.max(ax, az));
    const sawArc = Math.sin(vertex.y * 7.5 + vertex.x * 1.4 + vertex.z * 1.1) * 0.012 * sideFace;

    // Half-round drill channels along one flank.
    const drillFace = smoothstepLocal(0.7, 0.95, ax) * (direction.x > 0 ? 1 : 0);
    const drill = Math.abs(Math.sin(vertex.z * 4.2)) * 0.03 * drillFace;

    // Coarse breakage on the top and bottom (where it was split off the bench).
    const topFace = smoothstepLocal(0.6, 0.9, ay);
    const chipped = (fbm(scratch.copy(direction).multiplyScalar(4.5), 3) - 0.5) * 0.075 * topFace;

    const micro = (fbm(scratch.copy(direction).multiplyScalar(14), 3) - 0.5) * 0.016;

    vertex.multiplyScalar(1 + sawArc - drill + chipped + micro);

    return vertex;
}

/** Stage 3 — placa polida: flat, crisp, machine-cut. */
function displacePolished(vertex: THREE.Vector3) {
    const direction = vertex.clone().normalize();

    superellipsoid(direction, POLISHED_HALF, 14, vertex);

    // Only enough deviation to keep the highlight from looking like a mirror plane.
    const micro = (fbm(scratch.copy(direction).multiplyScalar(5), 3) - 0.5) * 0.004;
    vertex.multiplyScalar(1 + micro);

    return vertex;
}

function smoothstepLocal(edge0: number, edge1: number, x: number) {
    const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
    return t * t * (3 - 2 * t);
}

/* ============================================================
   GEOMETRY BUILD
   ============================================================ */

function buildVariant(
    template: THREE.BufferAttribute,
    displace: (vertex: THREE.Vector3) => THREE.Vector3,
) {
    const positions = new Float32Array(template.count * 3);
    const vertex = new THREE.Vector3();

    for (let i = 0; i < template.count; i++) {
        vertex.fromBufferAttribute(template, i);
        displace(vertex);

        positions[i * 3] = vertex.x;
        positions[i * 3 + 1] = vertex.y;
        positions[i * 3 + 2] = vertex.z;
    }

    return positions;
}

function normalsFor(index: THREE.BufferAttribute, positions: Float32Array) {
    const temp = new THREE.BufferGeometry();

    temp.setIndex(index);
    temp.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    temp.computeVertexNormals();

    const normals = new Float32Array(
        (temp.attributes.normal as THREE.BufferAttribute).array as Float32Array,
    );

    temp.dispose();

    return normals;
}

function buildGraniteGeometry() {
    // IcosahedronGeometry is non-indexed, so computeVertexNormals() produced
    // per-face normals — the whole stone was flat-shaded. Merging first gives
    // shared vertices (smooth shading) and cuts the vertex count ~6x, which
    // pays for the higher subdivision.
    const source = new THREE.IcosahedronGeometry(1, DETAIL);
    const geometry = mergeVertices(source, 1e-5);
    source.dispose();

    const index = geometry.getIndex() as THREE.BufferAttribute;
    const template = (geometry.attributes.position as THREE.BufferAttribute).clone();

    const rawPositions = buildVariant(template, displaceRaw);
    const quarriedPositions = buildVariant(template, displaceQuarried);
    const polishedPositions = buildVariant(template, displacePolished);

    geometry.setAttribute("position", new THREE.Float32BufferAttribute(rawPositions, 3));
    geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normalsFor(index, rawPositions), 3));

    geometry.morphAttributes.position = [
        new THREE.Float32BufferAttribute(quarriedPositions, 3),
        new THREE.Float32BufferAttribute(polishedPositions, 3),
    ];
    geometry.morphAttributes.normal = [
        new THREE.Float32BufferAttribute(normalsFor(index, quarriedPositions), 3),
        new THREE.Float32BufferAttribute(normalsFor(index, polishedPositions), 3),
    ];

    geometry.computeBoundingSphere();

    return geometry;
}

/* ============================================================
   MEDIA QUERIES
   ============================================================ */

function subscribeToMedia(query: string) {
    return (callback: () => void) => {
        const list = window.matchMedia(query);
        list.addEventListener("change", callback);
        return () => list.removeEventListener("change", callback);
    };
}

function getMediaSnapshot(query: string) {
    return () => window.matchMedia(query).matches;
}

function getServerSnapshot() {
    return false;
}

const subscribeToReducedMotion = subscribeToMedia("(prefers-reduced-motion: reduce)");
const getReducedMotionSnapshot = getMediaSnapshot("(prefers-reduced-motion: reduce)");

function useReducedMotion() {
    return useSyncExternalStore(
        subscribeToReducedMotion,
        getReducedMotionSnapshot,
        getServerSnapshot,
    );
}

const subscribeToMobile = subscribeToMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
const getMobileSnapshot = getMediaSnapshot(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

function useIsMobile() {
    return useSyncExternalStore(subscribeToMobile, getMobileSnapshot, getServerSnapshot);
}

/* ============================================================
   SHADER — triplanar granite

   Spherical UVs on an icosphere pinch at the poles and leave a
   visible seam, so the photo texture was being stretched over the
   whole stone. Triplanar projection in object space removes both,
   and lets the same material read as raw rock or as polished slab
   by driving a single uPolish uniform.
   ============================================================ */

const GRANITE_GLSL = /* glsl */ `
uniform sampler2D uDetailMap;
uniform float uPolish;
uniform float uGrainScale;
uniform float uMapScale;
uniform float uBumpStrength;
uniform float uPolishDarken;
uniform float uPolishSaturation;

varying vec3 vObjPos;
varying vec3 vObjNrm;
varying mat3 vObjToView;

float gHash(vec3 p) {
    p = fract(p * 0.3183099 + vec3(0.71, 0.113, 0.419));
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}

float gNoise(vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);

    return mix(
        mix(mix(gHash(i + vec3(0,0,0)), gHash(i + vec3(1,0,0)), f.x),
            mix(gHash(i + vec3(0,1,0)), gHash(i + vec3(1,1,0)), f.x), f.y),
        mix(mix(gHash(i + vec3(0,0,1)), gHash(i + vec3(1,0,1)), f.x),
            mix(gHash(i + vec3(0,1,1)), gHash(i + vec3(1,1,1)), f.x), f.y),
        f.z);
}

// Feldspar / quartz crystals.
float graniteGrain(vec3 p) {
    float n  = gNoise(p * uGrainScale);
    n += 0.5  * gNoise(p * uGrainScale * 2.03);
    n += 0.25 * gNoise(p * uGrainScale * 4.11);
    return n / 1.75;
}

// Mica flakes — the tiny specular glints that make granite read as granite.
float micaFlakes(vec3 p) {
    return smoothstep(0.72, 0.89, gNoise(p * uGrainScale * 3.7));
}

vec4 triplanar(sampler2D tex, vec3 p, vec3 n, float scale) {
    vec3 w = pow(abs(n), vec3(6.0));
    w /= (w.x + w.y + w.z);

    return texture2D(tex, p.zy * scale) * w.x
         + texture2D(tex, p.xz * scale) * w.y
         + texture2D(tex, p.xy * scale) * w.z;
}
`;

const GRANITE_VARYINGS_VERT = /* glsl */ `
varying vec3 vObjPos;
varying vec3 vObjNrm;
varying mat3 vObjToView;
`;

/* ============================================================
   STONE
   ============================================================ */

function Boulder({ progress }: { progress: MutableRefObject<number> }) {
    const groupRef = useRef<THREE.Group>(null);
    const meshRef = useRef<THREE.Mesh>(null);
    const smoothProgress = useRef(0);

    const { viewport, gl } = useThree();

    const reducedMotion = useReducedMotion();
    const isMobile = useIsMobile();

    const geometry = useMemo(() => buildGraniteGeometry(), []);

    const [rawTexture, rawDetailTexture] = useLoader(THREE.TextureLoader, [
        "/media/materials/granite-black.jpg",
        "/media/materials/granite-black2.jpg",
    ]);

    const maxAnisotropy = useMemo(() => gl.capabilities.getMaxAnisotropy(), [gl]);

    const texture = useMemo(() => {
        const configured = rawTexture.clone();

        configured.colorSpace = THREE.SRGBColorSpace;
        configured.anisotropy = maxAnisotropy;
        configured.wrapS = THREE.RepeatWrapping;
        configured.wrapT = THREE.RepeatWrapping;
        configured.repeat.set(1, 1); // triplanar handles tiling now
        configured.needsUpdate = true;

        return configured;
    }, [rawTexture, maxAnisotropy]);

    const detailTexture = useMemo(() => {
        const configured = rawDetailTexture.clone();

        configured.colorSpace = THREE.NoColorSpace;
        configured.anisotropy = maxAnisotropy;
        configured.wrapS = THREE.RepeatWrapping;
        configured.wrapT = THREE.RepeatWrapping;
        configured.repeat.set(1, 1);
        configured.needsUpdate = true;

        return configured;
    }, [rawDetailTexture, maxAnisotropy]);

    const uniforms = useMemo(
        () => ({
            uDetailMap: { value: detailTexture },
            uPolish: { value: 0 },
            uGrainScale: { value: GRAIN_SCALE },
            uMapScale: { value: MAP_SCALE },
            uBumpStrength: { value: BUMP_STRENGTH },
            uPolishDarken: { value: POLISH_DARKEN },
            uPolishSaturation: { value: POLISH_SATURATION },
        }),
        [detailTexture],
    );

    const material = useMemo(() => {
        const physical = new THREE.MeshPhysicalMaterial({
            map: texture,
            color: 0xffffff,
            roughness: 1,      // driven procedurally, see roughnessmap_fragment
            metalness: 0,
            envMapIntensity: 1.15,
            clearcoat: 0,
            clearcoatRoughness: 0.35,
        });

        physical.onBeforeCompile = (shader) => {
            Object.assign(shader.uniforms, uniforms);

            shader.vertexShader = shader.vertexShader
                .replace("#include <common>", `#include <common>\n${GRANITE_VARYINGS_VERT}`)
                .replace(
                    "#include <morphtarget_vertex>",
                    `#include <morphtarget_vertex>
                     vObjPos = transformed;
                     vObjToView = normalMatrix;`,
                )
                .replace(
                    "#include <morphnormal_vertex>",
                    `#include <morphnormal_vertex>
                     vObjNrm = objectNormal;`,
                );

            shader.fragmentShader = shader.fragmentShader
                .replace("#include <common>", `#include <common>\n${GRANITE_GLSL}`)
                .replace(
                    "#include <map_fragment>",
                    /* glsl */ `
                    vec3 tpPos = vObjPos;
                    vec3 tpNrm = normalize(vObjNrm);

                    vec3 baseCol = triplanar(map, tpPos, tpNrm, uMapScale).rgb;
                    vec3 detailCol = triplanar(uDetailMap, tpPos, tpNrm, uMapScale * 2.7).rgb;

                    // Second layer at a different scale breaks up photo tiling.
                    baseCol *= mix(vec3(1.0), detailCol * 1.55, 0.32);

                    // Procedural crystal mottling on top of the photo.
                    float crystals = graniteGrain(tpPos);
                    baseCol *= mix(0.84, 1.2, crystals);

                    float luma = dot(baseCol, vec3(0.2126, 0.7152, 0.0722));

                    // It is the same stone in all three stages. The grade only
                    // adds quarry dust at one end and a little depth at the
                    // other — both ends stay close in brightness and chroma,
                    // otherwise the slab reads as a different material.
                    vec3 rawCol = mix(baseCol, vec3(luma), 0.14) * 1.03 + 0.025;
                    vec3 polCol = mix(vec3(luma), baseCol, uPolishSaturation) * uPolishDarken;

                    diffuseColor.rgb *= mix(rawCol, polCol, uPolish);
                    `,
                )
                .replace(
                    "#include <roughnessmap_fragment>",
                    /* glsl */ `
                    float grainR = graniteGrain(vObjPos * 1.9);
                    float flakes = micaFlakes(vObjPos);

                    float rawRough = 0.93 - grainR * 0.17;
                    float polRough = 0.075 + grainR * 0.05;

                    float roughnessFactor = mix(rawRough, polRough, uPolish);

                    // Mica catches light on both stages, far more once polished.
                    roughnessFactor = mix(
                        roughnessFactor,
                        roughnessFactor * 0.3,
                        flakes * mix(0.35, 0.85, uPolish)
                    );

                    roughnessFactor = clamp(roughnessFactor, 0.03, 1.0);
                    `,
                )
                .replace(
                    "#include <normal_fragment_maps>",
                    /* glsl */ `
                    float bumpEps = 0.004;
                    float bump0 = graniteGrain(vObjPos);

                    vec3 bumpGrad = vec3(
                        graniteGrain(vObjPos + vec3(bumpEps, 0.0, 0.0)) - bump0,
                        graniteGrain(vObjPos + vec3(0.0, bumpEps, 0.0)) - bump0,
                        graniteGrain(vObjPos + vec3(0.0, 0.0, bumpEps)) - bump0
                    ) / bumpEps;

                    vec3 bumpNrm = normalize(vObjNrm);
                    bumpGrad -= bumpNrm * dot(bumpGrad, bumpNrm);
                    bumpGrad /= (1.0 + length(bumpGrad));

                    // Polishing removes the micro-relief — that is what "polished" means.
                    float bumpAmount = uBumpStrength * mix(1.0, 0.08, uPolish);

                    normal = normalize(normal - vObjToView * bumpGrad * bumpAmount);
                    `,
                );
        };

        return physical;
    }, [texture, uniforms]);

    useLayoutEffect(() => {
        if (meshRef.current) {
            meshRef.current.morphTargetInfluences = [0, 0];
        }
    }, [geometry]);

    useEffect(() => {
        return () => {
            geometry.dispose();
            material.dispose();
            texture.dispose();
            detailTexture.dispose();
        };
    }, [geometry, material, texture, detailTexture]);

    useFrame((state, delta) => {
        if (!groupRef.current || !meshRef.current) {
            return;
        }

        smoothProgress.current = reducedMotion
            ? 1
            : THREE.MathUtils.lerp(
                smoothProgress.current,
                progress.current,
                Math.min(1, delta * 3.5),
            );

        const s = smoothProgress.current;

        const pose = isMobile
            ? stonePoseAt(s, { intro: LAYOUT_POSE.intro, end: MOBILE_POSE })
            : stonePoseAt(s, LAYOUT_POSE);

        groupRef.current.position.set(
            -viewport.width / 2 + pose.fracX * viewport.width,
            viewport.height / 2 - pose.fracY * viewport.height,
            0,
        );
        groupRef.current.scale.setScalar(pose.scale);

        const influences = meshRef.current.morphTargetInfluences;

        if (influences) {
            const { wQuarried, wPolished } = morphWeightsAt(s);
            influences[0] = wQuarried;
            influences[1] = wPolished;

            // The material tells the same story as the shape: rough quarry
            // face -> sawn block -> mirror finish.
            uniforms.uPolish.value = wPolished;
            // Clearcoat above ~0.4 visibly attenuates the layer underneath in
            // three's physical model, which is what was crushing the slab.
            // The low roughness already carries the polished look.
            material.clearcoat = wPolished * 0.3;
            material.clearcoatRoughness = lerp(0.4, 0.04, wPolished);
            material.envMapIntensity = lerp(1.0, 1.35, wPolished);
        }

        if (!reducedMotion) {
            meshRef.current.rotation.y += delta * 0.025 + (s - 0.5) * delta * 0.4;
            meshRef.current.rotation.x =
                Math.sin(state.clock.elapsedTime * 0.2) * 0.015 + s * 0.5;
            meshRef.current.rotation.z = s * 0.15;
        }
    });

    return (
        <group ref={groupRef}>
            <mesh
                ref={meshRef}
                geometry={geometry}
                material={material}
                frustumCulled={false}
            />
        </group>
    );
}

/* ============================================================
   LIGHTING

   Five hard lights in three different colours (warm key, blue fill,
   orange rim, warm top, warm point) were fighting each other and
   flattening the form — that reads as plastic. Stone is lit almost
   entirely by large soft sources: the environment does the work,
   two directionals only add definition.
   ============================================================ */

const AMBIENT_INTENSITY = 0.1;
const KEY_LIGHT_INTENSITY = 1.35;
const RIM_LIGHT_INTENSITY = 1.1;
const ENV_INTENSITY = 1.0;

const INTRO_DIM_FACTOR = 0.35;

function Lighting({ progress }: { progress: MutableRefObject<number> }) {
    const ambientRef = useRef<THREE.AmbientLight>(null);
    const keyLightRef = useRef<THREE.DirectionalLight>(null);
    const rimLightRef = useRef<THREE.DirectionalLight>(null);

    const smoothProgress = useRef(0);
    const reducedMotion = useReducedMotion();

    const scene = useThree((state) => state.scene);

    useFrame((state, delta) => {
        smoothProgress.current = reducedMotion
            ? 1
            : THREE.MathUtils.lerp(
                smoothProgress.current,
                progress.current,
                Math.min(1, delta * 3.5),
            );

        const arrived = smoothstep(
            remap(smoothProgress.current, INTRO_FADE_START, ARRIVE_END),
        );

        const brightness = lerp(INTRO_DIM_FACTOR, 1, arrived);

        if (ambientRef.current) {
            ambientRef.current.intensity = AMBIENT_INTENSITY * brightness;
        }

        if (keyLightRef.current) {
            keyLightRef.current.intensity = KEY_LIGHT_INTENSITY * brightness;
        }

        if (rimLightRef.current) {
            rimLightRef.current.intensity = RIM_LIGHT_INTENSITY * brightness;
        }

        // Dimming the environment too, otherwise the intro fade only
        // dims the lights and the stone stays lit by the HDRI.
        scene.environmentIntensity = ENV_INTENSITY * brightness;
    });

    return (
        <>
            <ambientLight
                ref={ambientRef}
                intensity={AMBIENT_INTENSITY * INTRO_DIM_FACTOR}
                color="#b9c4d4"
            />

            {/* Definition light — same direction as the main softbox below,
                just enough to keep the fracture faces legible. */}
            <directionalLight
                ref={keyLightRef}
                position={[-4.5, 3, 4]}
                intensity={KEY_LIGHT_INTENSITY * INTRO_DIM_FACTOR}
                color="#fff4e6"
            />

            {/* Separation from the background. Neutral, not orange —
                a coloured rim on grey stone is what made it look fake. */}
            <directionalLight
                ref={rimLightRef}
                position={[3.5, 2.5, -5]}
                intensity={RIM_LIGHT_INTENSITY * INTRO_DIM_FACTOR}
                color="#e8eef7"
            />
        </>
    );
}

/* ============================================================
   STUDIO ENVIRONMENT

   Hand-built instead of preset="studio": the polished slab needs
   long, clean softbox reflections, and a preset gives you whatever
   shape the HDRI happens to have.
   ============================================================ */

function StudioEnvironment() {
    return (
        <Environment resolution={512} frames={1}>
            {/* Main softbox, upper left — the primary reflection on the slab. */}
            <Lightformer
                form="rect"
                intensity={3.2}
                color="#fff6ec"
                position={[-5, 4, 3]}
                scale={[9, 6, 1]}
                target={[0, 0, 0]}
            />

            {/* Narrow strip overhead — draws the long specular streak
                that reads as "polished". */}
            <Lightformer
                form="rect"
                intensity={5}
                color="#ffffff"
                position={[0, 5, 1]}
                scale={[12, 0.6, 1]}
                target={[0, 0, 0]}
            />

            {/* Cool bounce card, right. */}
            <Lightformer
                form="rect"
                intensity={0.9}
                color="#cddaea"
                position={[5, 1, 2]}
                scale={[7, 5, 1]}
                target={[0, 0, 0]}
            />

            {/* Low warm kick from behind to lift the bottom edge. */}
            <Lightformer
                form="rect"
                intensity={1.4}
                color="#f3e2cf"
                position={[2, -3, -4]}
                scale={[6, 3, 1]}
                target={[0, 0, 0]}
            />

            {/* Broad ceiling panel. The slab is nearly horizontal, so its two
                large faces mirror whatever sits directly above — with a dark
                ceiling a polished surface simply goes black, however bright
                the rest of the rig is. */}
            <Lightformer
                form="rect"
                intensity={1.7}
                color="#eef3f9"
                position={[0, 7, -1]}
                scale={[16, 12, 1]}
                target={[0, 0, 0]}
            />
        </Environment>
    );
}

/* ============================================================
   ROOT
   ============================================================ */

export default function GraniteStone({
                                         progress,
                                     }: {
    progress: MutableRefObject<number>;
}) {
    return (
        <div className="relative h-full w-full">
            <Canvas
                camera={{
                    position: [0, 0.2, 4.2],
                    fov: 40,
                    near: 0.1,
                    far: 100,
                }}
                gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: "high-performance",
                }}
                onCreated={({ gl }) => {
                    gl.toneMapping = THREE.ACESFilmicToneMapping;
                    gl.toneMappingExposure = 1.0;
                }}
                dpr={[1, 1.75]}
            >
                <Lighting progress={progress} />

                <Suspense fallback={null}>
                    <Boulder progress={progress} />
                    <StudioEnvironment />
                </Suspense>
            </Canvas>
        </div>
    );
}