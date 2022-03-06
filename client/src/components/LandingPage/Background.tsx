import { useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { useSpring, a } from '@react-spring/three';
import useStore from '../../utils/store';
import '../CustomShader/NoiseShader/NoiseShader';
import THREE from 'three';

const Background = () => {
  const material = useRef<any>(null!);
  const mesh = useRef<THREE.Mesh>(null!);
  const { showSidebar } = useStore();
  const { width } = useThree((s) => s.viewport);
  const { exitThree } = useStore();

  const springs: any = useSpring({
    to: {
      rotation: !exitThree
        ? showSidebar
          ? [(-4 * Math.PI) / 12, 0, 0]
          : [(-4 * Math.PI) / 9, 0, 0]
        : [(-4 * Math.PI) / 12, 0, 0]
    },
    delay: 500
  });
  useFrame((_, delta) => {
    material.current.uTime += delta * 2;
  });
  return (
    <a.mesh ref={mesh} {...springs}>
      <planeBufferGeometry args={[width * 4, width * 3, 300, 300]} />
      <noiseMaterial ref={material} />
    </a.mesh>
  );
};
export default Background;
