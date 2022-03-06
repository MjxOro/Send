import { Canvas } from '@react-three/fiber';
import { Suspense, ReactNode } from 'react';

interface ICanvasLayout {
  children: ReactNode;
  hideScroll?: boolean;
  orthographic?: boolean;
}
const CanvasLayout = ({
  children,
  hideScroll,
  orthographic
}: ICanvasLayout) => {
  return (
    <Canvas
      orthographic={orthographic ? true : false}
      camera={orthographic ? { zoom: 200 } : undefined}
      style={{
        position: 'absolute',
        width: '100vw',
        height: '100vh',
        top: 0,
        left: 0
      }}
      className={hideScroll ? 'three' : undefined}
    >
      <Suspense fallback={null}>
        <ambientLight />
        {children}
      </Suspense>
    </Canvas>
  );
};

export default CanvasLayout;
