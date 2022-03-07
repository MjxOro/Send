import { MouseEvent } from 'react';
import { FcGoogle } from 'react-icons/fc';
import Header from './Header';
import { Html } from '@react-three/drei';
import { useStore } from '../../utils/store';
import { AnimatePresence, motion } from 'framer-motion';
import useWindowSize from '../../utils/viewport';

const Body = () => {
  const { showSidebar } = useStore();
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    useStore.setState({ exitThree: true });
    setTimeout(() => {
      window.location.href = `${process.env.REACT_APP_API_HOST}/auth/google`;
    }, 1000);
  };
  const width: any = useWindowSize();
  const mobile = width <= 1024;
  console.log(mobile);

  return (
    <Html fullscreen>
      <main className={`w-sceen flex h-screen flex-col items-center`}>
        <Header />
        <AnimatePresence>
          {!showSidebar && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 1 } }}
              exit={{ opacity: 0 }}
              className={`absolute top-[65vh] md:top-[75vh] lg:top-[75vh]  flex w-screen flex-col items-center  p-12 text-2xl font-semibold`}
            >
              <p className="mb-8 text-[#f0f0f0]">Login With</p>
              <button
                onClick={handleClick}
                className={`flex h-16 w-16 lg:h-12 lg:w-48 items-center justify-center rounded bg-[#301860] py-2 px-4 font-bold text-white hover:bg-[#001848]`}
              >
                <FcGoogle
                  size={mobile ? 'inherit' : 32}
                  className={`${!mobile && 'mr-4'}`}
                />
                {!mobile && 'Google'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </Html>
  );
};
export default Body;
