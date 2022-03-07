import { useThree, useFrame } from '@react-three/fiber';
import { Html, Text } from '@react-three/drei';
import useWindowSize from '../../utils/viewport';
import useStore, { useCreateRoomState } from '../../utils/store';
import { useRef } from 'react';
import { a, useSpring } from '@react-spring/three';
import PaperPlane from '../GLTFModles/PaperPlane/PaperPlane';

const LoadingAnimation = () => {
  const innerWidth = useWindowSize();
  const largeScreen = innerWidth > 1024;
  const { height, width } = useThree((s) => s.viewport);
  const { fileLoading } = useCreateRoomState();
  const { fileLoading: updateProfile } = useStore();
  const loadingText =
    updateProfile && !fileLoading ? 'Updating Profile' : 'Creating Room';
  const material = useRef<any>(null!);
  console.log(largeScreen);
  const springs: any = useSpring({
    loop: true,
    from: {
      rotation: [Math.PI / 4, 0, 0],
      scale: largeScreen ? [1.25, 1.25, 1.25] : [3, 3, 3]
    },
    to: {
      rotation: [Math.PI / 4, Math.PI * 2, 0],
      scale: largeScreen ? [1.25, 1.25, 1.25] : [3, 3, 3]
    },
    config: {
      duration: 10000,
      mass: 1,
      tension: 280,
      friction: 120
    }
  });
  const planeSprings: any = useSpring({
    loop: true,
    from: {
      rotation: [0, 0, 0]
    },
    to: {
      rotation: [0, -Math.PI * 2, 0]
    },
    config: {
      //duration: 10000,
      mass: 5,
      tension: 100,
      friction: 20
    }
  });
  const sign = 'Loading';
  useFrame((_, delta) => {
    material.current.uTime += delta;
  });
  return (
    <>
      <a.group {...springs}>
        <a.group {...planeSprings}>
          <PaperPlane
            scale={[0.001, 0.001, 0.001]}
            position={[-0.25, height * 0.02, 0]}
          />
        </a.group>
        <pointLight position={[0, height * 0.02, 0]} />
        <mesh position={[0, height * 0.02, 0]}>
          <sphereBufferGeometry args={[width * 0.01, 33, 15]} />
          <meshBasicMaterial color={'yellow'} wireframe />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <planeBufferGeometry args={[width * 0.1, width * 0.1, 50, 50]} />
          <noiseMaterial wireframe ref={material} />
        </mesh>
        <Text
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0, width * 0.075]}
          color="#ffffff"
        >
          {sign}
        </Text>
        <Text
          rotation={[-Math.PI / 2, 0, Math.PI / 2]}
          position={[width * 0.075, 0, 0]}
          color="#ffffff"
        >
          {sign}
        </Text>
        <Text
          rotation={[-Math.PI / 2, 0, Math.PI]}
          position={[0, 0, -width * 0.075]}
          color="#ffffff"
        >
          {sign}
        </Text>
        <Text
          rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
          position={[-width * 0.075, 0, 0]}
          color="#ffffff"
        >
          {sign}
        </Text>
      </a.group>
      <Text scale={[2, 2, 2]} position={[0, 1, 0]} color="#ffffff">
        {loadingText}
      </Text>
    </>
  );
};
export default LoadingAnimation;
