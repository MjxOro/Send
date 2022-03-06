import useStore from '../../utils/store';
import Burger from '../BurgerMenu/BurgerMenu';
import { SidebarDom } from '../Sidebar/Sidebar';
import { motion } from 'framer-motion';
import useWindowSize from '../../utils/viewport';

const Menu = () => {
  const handleClick = () => {
    useStore.setState({ exitThree: true });
    setTimeout(() => {
      window.location.href = `${process.env.REACT_APP_API_HOST}/auth/google`;
    }, 1000); // 1second on closing sidebar + 1 second on plane animation + 1 second exitAnimation
  };
  return (
    <div className="flex w-1/4 justify-evenly text-[#f0f0f0]">
      <p onClick={handleClick} className="cursor-pointer">
        Log in
      </p>
    </div>
  );
};
const Header = () => {
  const width = useWindowSize();
  const { showSidebar } = useStore();
  const handleClick = () => {
    useStore.setState({ showSidebar: !showSidebar });
  };
  const handleSidebarClick = () => {
    useStore.setState({ showSidebar: false });
    setTimeout(() => useStore.setState({ exitThree: true }), 1000);
    setTimeout(() => {
      window.location.href = `${process.env.REACT_APP_API_HOST}/auth/google`;
    }, 3000); // 1second on closing sidebar + 1 second on plane animation + 1 second exitAnimation
  };
  const left = false;
  const fullscreen = false;
  return (
    <>
      <nav className="flex h-36 w-screen items-center justify-between px-9">
        <div className="h-24 w-24" />
        {width > 1024 ? (
          <Menu />
        ) : (
          <Burger state={showSidebar} onClick={handleClick} />
        )}
      </nav>
      <SidebarDom state={showSidebar}>
        <motion.p
          className={`h-24 -8 flex ${
            fullscreen && 'w-screen'
          } cursor-pointer items-center justify-center text-center font-sans text-5xl`}
          initial={{ opacity: 0, x: left ? -width : width }}
          animate={{
            opacity: 1,
            x: 0,
            transition: { delay: 1 }
          }}
          exit={{ opacity: 0, x: left ? -width / 2 : width / 2 }}
          onClick={handleSidebarClick}
        >
          Log in
        </motion.p>
      </SidebarDom>
    </>
  );
};
export default Header;
