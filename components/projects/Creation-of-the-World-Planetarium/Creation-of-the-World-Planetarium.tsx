'use client';

import React, { useMemo, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, useVideoTexture } from '@react-three/drei';
import * as THREE from 'three';
import styles from './Creation-of-the-World-Planetarium.module.css';

const Dome = () => {
  const videoTexture = useVideoTexture(
    'https://res.cloudinary.com/dpzh6zrh7/video/upload/v1773832335/Prilepskiy_vhutein_1_nhoynq.mp4',
    { crossOrigin: 'Anonymous', muted: true, loop: true, playsInline: true }
  );

  const shaderArgs = useMemo(() => ({
    uniforms: {
      u_texture: { value: videoTexture }
    },
    vertexShader: `
      varying vec3 vPosition;
      void main() {
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D u_texture;
      varying vec3 vPosition;
      const float PI = 3.14159265359;

      void main() {
        vec3 dir = normalize(vPosition);
        float r = acos(dir.y) / (PI / 2.0);
        float phi = atan(dir.z, dir.x);

        // --- ИСПРАВЛЕНИЕ: МЕНЯЕМ ЗНАК '+' НА '-' ---
        // Это зеркалит текстуру, чтобы по умолчанию был виден перед видео.
        vec2 uv = vec2(
          0.5 - r * cos(phi) * 0.5,
          0.5 - r * sin(phi) * 0.5
        );

        gl_FragColor = texture2D(u_texture, uv);
      }
    `,
    side: THREE.BackSide
  }), [videoTexture]);

  return (
    <mesh>
      <sphereGeometry args={[500, 64, 64, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <shaderMaterial args={[shaderArgs]} />
    </mesh>
  );
};

export default function CreationOfTheWorldPlanetarium() {
  return (
    <div className={styles.container}>
      <Canvas>
        <Suspense fallback={null}>
          {/* Камера по-прежнему на 45°: [0, -0.01, -0.01] */}
          <PerspectiveCamera
            makeDefault
            position={[0, -0.01, -0.01]} 
            fov={80} 
          />

          <OrbitControls
            target={[0, 0, 0]}
            enableZoom={false}
            enablePan={false}
            minPolarAngle={Math.PI / 2} 
            maxPolarAngle={Math.PI - 0.0001}
            rotateSpeed={-0.6} 
          />

          <Dome />
        </Suspense>
      </Canvas>
    </div>
  );
}