/* eslint-disable react/no-unknown-property */
"use client";

import dynamic from "next/dynamic";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { forwardRef, useRef, useMemo, useLayoutEffect } from "react";
import { Color } from "three";

const hexToNormalizedRGB = (hex: string) => {
  hex = hex.replace("#", "");
  return [
    parseInt(hex.slice(0, 2), 16) / 255,
    parseInt(hex.slice(2, 4), 16) / 255,
    parseInt(hex.slice(4, 6), 16) / 255,
  ];
};

const vertexShader = `
varying vec2 vUv;
varying vec3 vPosition;

void main() {
  vPosition = position;
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
varying vec2 vUv;
varying vec3 vPosition;

uniform float uTime;
uniform vec3  uColor;
uniform float uSpeed;
uniform float uScale;
uniform float uRotation;
uniform float uNoiseIntensity;

const float e = 2.71828182845904523536;

float noise(vec2 texCoord) {
  float G = e;
  vec2  r = (G * sin(G * texCoord));
  return fract(r.x * r.y * (1.0 + texCoord.x));
}

vec2 rotateUvs(vec2 uv, float angle) {
  float c = cos(angle);
  float s = sin(angle);
  mat2  rot = mat2(c, -s, s, c);
  return rot * uv;
}

void main() {
  float rnd        = noise(gl_FragCoord.xy);
  vec2  uv         = rotateUvs(vUv * uScale, uRotation);
  vec2  tex        = uv * uScale;
  float tOffset    = uSpeed * uTime;

  tex.y += 0.03 * sin(8.0 * tex.x - tOffset);

  float pattern = 0.6 +
                  0.4 * sin(5.0 * (tex.x + tex.y +
                                   cos(3.0 * tex.x + 5.0 * tex.y) +
                                   0.02 * tOffset) +
                           sin(20.0 * (tex.x + tex.y - 0.1 * tOffset)));

  vec4 col = vec4(uColor, 1.0) * vec4(pattern) - rnd / 15.0 * uNoiseIntensity;
  col.a = 1.0;
  gl_FragColor = col;
}
`;

const SilkPlane = forwardRef<any, { uniforms: any }>(function SilkPlane({ uniforms }, ref) {
  const { viewport } = useThree();

  useLayoutEffect(() => {
    if (ref && typeof ref === 'object' && ref.current) {
      ref.current.scale.set(viewport.width, viewport.height, 1);
    }
  }, [ref, viewport]);

  useFrame((_, delta) => {
    if (ref && typeof ref === 'object' && ref.current) {
      ref.current.material.uniforms.uTime.value += 0.1 * delta;
    }
  });

  return (
    <mesh ref={ref}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  );
});
SilkPlane.displayName = "SilkPlane";

// Функция для генерации случайного светло-серого оттенка стандартных цветов
const getRandomLightColor = () => {
  const baseColors = [
    "#FF0000", // red
    "#00FF00", // green
    "#0000FF", // blue
    "#FFFF00", // yellow
    "#FF00FF", // magenta
    "#00FFFF", // cyan
    "#FFA500", // orange
    "#800080", // purple
    "#FFC0CB", // pink
    "#A52A2A", // brown
  ];

  const baseColor = baseColors[Math.floor(Math.random() * baseColors.length)];

  // Конвертируем в RGB
  const r = parseInt(baseColor.slice(1, 3), 16);
  const g = parseInt(baseColor.slice(3, 5), 16);
  const b = parseInt(baseColor.slice(5, 7), 16);

  // Делаем цвет светлее и более серым (добавляем белого и уменьшаем насыщенность)
  const lightness = 0.3 + Math.random() * 0.4; // от 30% до 70% яркости оригинального цвета
  const grayness = 0.6 + Math.random() * 0.3; // добавляем серость

  const newR = Math.round(r * lightness + 200 * grayness);
  const newG = Math.round(g * lightness + 200 * grayness);
  const newB = Math.round(b * lightness + 200 * grayness);

  // Убеждаемся что значения в пределах 0-255
  const finalR = Math.min(255, Math.max(0, newR));
  const finalG = Math.min(255, Math.max(0, newG));
  const finalB = Math.min(255, Math.max(0, newB));

  return `#${finalR.toString(16).padStart(2, '0')}${finalG.toString(16).padStart(2, '0')}${finalB.toString(16).padStart(2, '0')}`;
};

const SilkCanvas = ({
  speed = 5,
  scale = 1,
  noiseIntensity = 1.5,
  rotation = 0,
}: {
  speed?: number;
  scale?: number;
  noiseIntensity?: number;
  rotation?: number;
}) => {
  const meshRef = useRef();

  // Генерируем случайный цвет при создании компонента
  const randomColor = useMemo(() => getRandomLightColor(), []);

  const uniforms = useMemo(
    () => ({
      uSpeed: { value: speed },
      uScale: { value: scale },
      uNoiseIntensity: { value: noiseIntensity },
      uColor: { value: new Color(...hexToNormalizedRGB(randomColor)) },
      uRotation: { value: rotation },
      uTime: { value: 0 },
    }),
    [speed, scale, noiseIntensity, randomColor, rotation]
  );

  return (
    <Canvas dpr={[1, 2]} frameloop="always">
      <SilkPlane ref={meshRef} uniforms={uniforms} />
    </Canvas>
  );
};

// Динамический импорт для предотвращения проблем с SSR
const Silk = dynamic(() => Promise.resolve(SilkCanvas), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200" />
});

export default Silk;
