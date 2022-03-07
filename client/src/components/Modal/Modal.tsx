import { ReactNode } from 'react';
import { Html } from '@react-three/drei';
import { AnimatePresence, motion } from 'framer-motion';

const Modal = ({
  children,
  state
}: {
  children: ReactNode;
  state: boolean;
}) => {
  return (
    <Html
      fullscreen
      className={
        'flex h-screen w-screen items-center items-center justify-center justify-center bg-gray-600 bg-opacity-90'
      }
      style={{
        width: state ? '100vw' : 0,
        opacity: state ? 1 : 0
      }}
    >
      <AnimatePresence>
        {state && (
          <motion.div
            initial={{ opacity: 0, y: 1000 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.25 } }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </Html>
  );
};

export default Modal;
