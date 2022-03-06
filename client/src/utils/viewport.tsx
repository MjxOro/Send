import { useEffect } from 'react';
import useStore from './store';

const useWindowSize = () => {
  const { viewportWidth } = useStore();
  useEffect(() => {
    const handleResize = () => {
      useStore.setState({ viewportWidth: window.innerWidth });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  });
  return viewportWidth;
};
export default useWindowSize;
