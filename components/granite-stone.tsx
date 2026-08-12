"use client";

import {
    Suspense,
    useLayoutEffect,
    useMemo,
    useRef,
    useSyncExternalStore,
} from "react";
import type { MutableRefObject } from "react";
import {
    Canvas,
    useFrame,
    useLoader,
    useThree,
} from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";
import {
    LAYOUT_POSE,
    MOBILE_POSE,
    morphWeightsAt,
    stonePoseAt,
} from "@/lib/hero-story";

const DETAIL = 32;
const MOBILE_BREAKPOINT = 768;

function hash3(x: number, y: number, z: number) {
    const s =
        Math.sin(x * 127.1 + y * 311.7 + z * 74.7) *
        43758.5453123;

    return s - Math.floor(s);
}

function fbm(v: THREE.Vector3) {
    let value = 0;
    let amplitude = 0.5;
    let frequency = 1;

    for (let i = 0; i < 4; i++) {
        value +=
            hash3(
                Math.floor(v.x * frequency),
                Math.floor(v.y * frequency),
                Math.floor(v.z * frequency),
            ) * amplitude;

        frequency *= 2;
        amplitude *= 0.5;
    }

    return value;
}

// Phase 1 / Formation: rough, organic, irregular — today's noise displaced shape.
function displaceRaw(vertex: THREE.Vector3) {
    const normal = vertex.clone().normalize();

    const largeNoise = fbm(normal.clone().multiplyScalar(2.2));
    const smallNoise = fbm(normal.clone().multiplyScalar(8));

    const displacement =
        1 +
        (largeNoise - 0.5) * 0.22 +
        (smallNoise - 0.5) * 0.035;

    vertex.multiplyScalar(displacement);

    vertex.x *= 1.18;
    vertex.y *= 0.88;
    vertex.z *= 1.05;

    return vertex;
}

// Maps a point on the unit sphere onto the surface of a unit cube (the
// standard sphere<->cube warp used for cube-mapped terrain), so a sphere-like
// mesh can be reshaped into a squared-off block while keeping one vertex per
// input normal — required for morph targets to line up vertex by vertex.
function cubify(normal: THREE.Vector3) {
    const x2 = normal.x * normal.x;
    const y2 = normal.y * normal.y;
    const z2 = normal.z * normal.z;

    return new THREE.Vector3(
        normal.x * Math.sqrt(1 - y2 / 2 - z2 / 2 + (y2 * z2) / 3),
        normal.y * Math.sqrt(1 - z2 / 2 - x2 / 2 + (z2 * x2) / 3),
        normal.z * Math.sqrt(1 - x2 / 2 - y2 / 2 + (x2 * y2) / 3),
    );
}

// Phase 2 / Extraction: a rough-cut block — the sphere warped onto a cube's
// surface so it reads as squared-off, then roughened with stepped + fine
// noise so the faces aren't perfectly flat, like a freshly quarried block
// before polishing.
function displaceQuarried(vertex: THREE.Vector3) {
    const normal = vertex.clone().normalize();
    const radius = vertex.length();

    const largeNoise = fbm(normal.clone().multiplyScalar(1.6));
    const stepped = Math.round(largeNoise * 5) / 5;
    const smallNoise = fbm(normal.clone().multiplyScalar(10));

    const roughness = 1 + (stepped - 0.5) * 0.12 + (smallNoise - 0.5) * 0.03;

    vertex.copy(cubify(normal)).multiplyScalar(radius * roughness);

    vertex.y *= 0.9;

    return vertex;
}

// Phase 3+ / Revelation & Application: a polished slab — the same cube warp
// as displaceQuarried, flattened into a thin rectangular slab and left
// almost perfectly smooth (a hint of noise so it doesn't look synthetic).
function displacePolished(vertex: THREE.Vector3) {
    const normal = vertex.clone().normalize();
    const radius = vertex.length();

    const microNoise = fbm(normal.clone().multiplyScalar(6));
    const smoothness = 1 + (microNoise - 0.5) * 0.01;

    vertex.copy(cubify(normal)).multiplyScalar(radius * smoothness);

    vertex.x *= 1.35;
    vertex.y *= 0.16;
    vertex.z *= 1.35;

    return vertex;
}

function buildVariant(
    template: THREE.BufferAttribute,
    displace: (vertex: THREE.Vector3) => THREE.Vector3,
) {
    const count = template.count;
    const positions = new Float32Array(count * 3);
    const vertex = new THREE.Vector3();

    for (let i = 0; i < count; i++) {
        vertex.fromBufferAttribute(template, i);
        displace(vertex);

        positions[i * 3] = vertex.x;
        positions[i * 3 + 1] = vertex.y;
        positions[i * 3 + 2] = vertex.z;
    }

    return positions;
}

function normalsFor(positions: Float32Array) {
    const temp = new THREE.BufferGeometry();
    temp.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    temp.computeVertexNormals();

    const normals = new Float32Array(
        (temp.attributes.normal as THREE.BufferAttribute).array as Float32Array,
    );

    temp.dispose();

    return normals;
}

// Builds one geometry whose raw (Formation), quarried (Extraction), and
// polished (Revelation/Application) shapes all come from the same base
// icosahedron vertex buffer, same count and order, so the two non-base
// shapes register as three.js morph targets and blend vertex by vertex.
function buildGraniteGeometry() {
    const geometry = new THREE.IcosahedronGeometry(1.45, DETAIL);
    const template = (geometry.attributes.position as THREE.BufferAttribute).clone();

    const rawPositions = buildVariant(template, displaceRaw);
    const quarriedPositions = buildVariant(template, displaceQuarried);
    const polishedPositions = buildVariant(template, displacePolished);

    geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(rawPositions, 3),
    );
    geometry.setAttribute(
        "normal",
        new THREE.Float32BufferAttribute(normalsFor(rawPositions), 3),
    );

    geometry.morphAttributes.position = [
        new THREE.Float32BufferAttribute(quarriedPositions, 3),
        new THREE.Float32BufferAttribute(polishedPositions, 3),
    ];
    geometry.morphAttributes.normal = [
        new THREE.Float32BufferAttribute(normalsFor(quarriedPositions), 3),
        new THREE.Float32BufferAttribute(normalsFor(polishedPositions), 3),
    ];

    return geometry;
}

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

function Boulder({
    progress,
}: {
    progress: MutableRefObject<number>;
}) {
    const groupRef = useRef<THREE.Group>(null);
    const meshRef = useRef<THREE.Mesh>(null);
    const smoothProgress = useRef(0);
    const { viewport } = useThree();

    const reducedMotion = useReducedMotion();
    const isMobile = useIsMobile();

    const geometry = useMemo(() => buildGraniteGeometry(), []);

    const rawTexture = useLoader(
        THREE.TextureLoader,
        "/media/materials/granite-black.jpg",
    );

    // useLoader's returned texture must not be mutated directly; configure a
    // clone constructed fresh here instead.
    const texture = useMemo(() => {
        const configured = rawTexture.clone();

        configured.colorSpace = THREE.SRGBColorSpace;
        configured.anisotropy = 8;
        configured.wrapS = THREE.RepeatWrapping;
        configured.wrapT = THREE.RepeatWrapping;
        configured.repeat.set(1.2, 1.2);
        configured.needsUpdate = true;

        return configured;
    }, [rawTexture]);

    // Mesh.updateMorphTargets() only runs from the THREE.Mesh constructor, not
    // when a geometry with morphAttributes is assigned afterward (as R3F does
    // here), so morphTargetInfluences would stay undefined without this.
    useLayoutEffect(() => {
        if (meshRef.current) {
            meshRef.current.morphTargetInfluences = [0, 0];
        }
    }, [geometry]);

    useFrame((state, delta) => {
        if (!groupRef.current || !meshRef.current) {
            return;
        }

        smoothProgress.current = reducedMotion
            ? 1
            : THREE.MathUtils.lerp(
                  smoothProgress.current,
                  progress.current,
                  // Clamped to 1: MathUtils.lerp doesn't clamp its own alpha, so a
                  // large delta (a tab backgrounded and resumed) would otherwise
                  // overshoot past the actual scroll target instead of snapping to it.
                  Math.min(1, delta * 3.5),
              );

        const s = smoothProgress.current;

        const pose = isMobile
            ? stonePoseAt(s, { intro: LAYOUT_POSE.intro, start: MOBILE_POSE, end: MOBILE_POSE })
            : stonePoseAt(s, LAYOUT_POSE);

        groupRef.current.position.set(
            -viewport.width / 2 + pose.fracX * viewport.width,
            viewport.height / 2 - pose.fracY * viewport.height,
            0,
        );
        groupRef.current.scale.setScalar(pose.scale);

        (window as unknown as { __stoneDebug?: unknown }).__stoneDebug = {
            rawProgress: progress.current,
            s,
            pose,
            viewport: { width: viewport.width, height: viewport.height },
            groupPos: groupRef.current.position.toArray(),
            groupScale: groupRef.current.scale.x,
        };

        const influences = meshRef.current.morphTargetInfluences;

        if (influences) {
            const { wQuarried, wPolished } = morphWeightsAt(s);
            influences[0] = wQuarried;
            influences[1] = wPolished;
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
                castShadow
                receiveShadow
                frustumCulled={false}
            >
                <meshStandardMaterial
                    map={texture}
                    color="#ffffff"
                    roughness={0.68}
                    metalness={0}
                    envMapIntensity={0.7}
                />
            </mesh>
        </group>
    );
}

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
                dpr={[1, 1.75]}
            >
                <ambientLight intensity={0.8} />

                <directionalLight
                    position={[5, 6, 5]}
                    intensity={4}
                />

                <directionalLight
                    position={[-4, 2, 3]}
                    intensity={2}
                />

                <pointLight position={[0, -2, 4]} intensity={1} />

                <Suspense fallback={null}>
                    <Boulder progress={progress} />
                    <Environment
                        preset="studio"
                        environmentIntensity={0.5}
                    />
                </Suspense>
            </Canvas>
        </div>
    );
}
