import React, { ReactNode, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThree } from '@react-three/fiber';
import { MeshWobbleMaterial, Scroll, Html } from '@react-three/drei';
import { a, easings, useSpring } from '@react-spring/three';
import useStore from '../../utils/store';
//import { EVENTS } from '../Layout/ChatSocket';

export const SidebarDom = ({
  state,
  fullscreen,
  center,
  children
}: {
  state: boolean;
  fullscreen?: boolean;
  left?: boolean;
  center?: boolean;
  children?: ReactNode;
}) => {
  return (
    <AnimatePresence>
      {state && (
        <motion.section
          className={`mt-24  flex ${
            fullscreen ? 'h-screen w-screen' : ''
          } flex-col ${center && `justify-center`}`}
        >
          {children}
        </motion.section>
      )}
    </AnimatePresence>
  );
};
export const Sidebar = ({
  state,
  left
}: {
  state: boolean;
  left?: boolean;
}) => {
  const { width, height } = useThree((s) => s.viewport);
  const startLeft = [
    { position: state ? [-width * 0.55, 0, 4] : null },
    { position: state ? [0, 0, 4] : null },
    { position: !state ? [-width, 0, 4] : null }
  ];
  const startRight = [
    { position: state ? [width * 0.55, 0, 4] : null },
    { position: state ? [0, 0, 4] : null },
    { position: !state ? [width, 0, 4] : null }
  ];
  const springs: any = useSpring({
    from: { position: left ? [-width, 0, 4] : [width, 0, 4] },
    to: left ? startLeft : startRight,
    config: {
      duration: 800,
      easing: easings.easeInOutExpo
    }
  });
  return (
    <a.mesh {...springs}>
      <planeBufferGeometry args={[width, height, 120, 120]} />
      <MeshWobbleMaterial factor={0.1} speed={1} color={'#f0f0f0'} />
    </a.mesh>
  );
};
export default Sidebar;
