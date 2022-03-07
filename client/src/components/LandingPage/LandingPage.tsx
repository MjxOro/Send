import { Suspense, useEffect } from 'react';
import CanvasLayout from '../Layout/CanvasLayout/CanvasLayout';
import { Stars } from '@react-three/drei';
import Background from './Background';
import useStore, { useAuth } from '../../utils/store';
import { useSpring } from '@react-spring/three';
import PaperPlane from '../GLTFModles/PaperPlane/PaperPlane';
import Sidebar from '../Sidebar/Sidebar';
import Body from './Body';
import ExitAnimation from '../Layout/ExitAnimation/ExitAnimation';
import { useLocation } from 'wouter';

const LandingPage = () => {
  const { showSidebar, exitThree, editProfile } = useStore();
  const { currentUser, isLoading } = useAuth();
  const [_, setLocation] = useLocation();
  if (currentUser && !isLoading) {
    setLocation('/dashboard');
  }
  const springs: any = useSpring({
    loop: { reverse: true },
    from: {
      position: !exitThree
        ? showSidebar
          ? [0, 0, -2]
          : [0, 0, 4]
        : [0, 0, -2],
      rotation: [Math.PI / 9, 0, 0]
    },
    to: {
      position: !exitThree
        ? showSidebar
          ? [0, 0, -2]
          : [0, -0.1, 4]
        : [0, 0, -2],
      rotation: [Math.PI / 15, 0, 0]
    },

    config: {
      mass: 1,
      tension: 280,
      friction: 120
    }
  });

  return (
    <ExitAnimation>
      <CanvasLayout hideScroll>
        <pointLight position={[0, 10, 4]} color={'#FFD042'} />
        <color attach="background" args={['#301860']} />
        <Stars
          radius={100}
          depth={50}
          count={5000}
          factor={4}
          saturation={0}
          fade
        />
        <Suspense fallback={null}>
          <Background />
          <PaperPlane {...springs} scale={[0.003, 0.003, 0.003]} />
        </Suspense>
        <Sidebar state={showSidebar} />
        <Body />
      </CanvasLayout>
    </ExitAnimation>
  );
};

export default LandingPage;
