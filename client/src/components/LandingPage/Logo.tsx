import { Text } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useSpring, a, config } from '@react-spring/three';

const Logo = () => {
  const { width, height } = useThree((s) => s.viewport);
  const springs: any = useSpring({
    loop: true,
    from: { rotation: [0, Math.PI * 0.1, 0] },
    to: { rotation: [0, Math.PI * 2, -3 * Math.PI] },
    config: config.molasses
  });
  return (
    <group
      position={[-width * 0.425, height * 0.43, 0]}
      onClick={() => console.log('hovered')}
    >
      <a.mesh {...springs} scale={[0.15, 0.15, 0.15]} position={[0.15, 0, 0]}>
        <torusGeometry />
        <meshToonMaterial color={'#906090'} />
      </a.mesh>
      <Text fontSize={0.25} position={[0.7, 0, 0]}>
        Send
      </Text>
    </group>
  );
};
export default Logo;
