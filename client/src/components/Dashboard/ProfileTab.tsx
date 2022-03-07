import useStore, { useAuth } from '../../utils/store';
import { Sidebar, SidebarDom } from '../Sidebar/Sidebar';
import { Html } from '@react-three/drei';
import ProfileConfig from '../Modal/ProfileConfig';
import Modal from '../Modal/Modal';
import useWindowSize from '../../utils/viewport';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useLocation } from 'wouter';

const ProfileTab = () => {
  const { showProfile, editProfile } = useStore();
  const { currentUser } = useAuth();
  const [_, setLocation] = useLocation();
  const width = useWindowSize();
  const mobile = width <= 1024;
  const fullscreen = true;
  const left = true;
  const handleLogout = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_HOST}/logout`,
        currentUser,
        { withCredentials: true }
      );
      useAuth.setState({ currentUser: null });
      useAuth.setState({ isLoading: false });
      setLocation('/');
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <>
      {!mobile && <Sidebar state={showProfile} left />}
      <Html center style={{ opacity: showProfile ? 1 : 0 }}>
        <SidebarDom left fullscreen state={showProfile} center>
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
            onClick={() =>
              useStore.setState({ showProfile: false, editProfile: true })
            }
          >
            Edit Profile
          </motion.p>
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
            onClick={handleLogout}
          >
            Log out
          </motion.p>
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
            onClick={() => useStore.setState({ showProfile: false })}
          >
            Return
          </motion.p>
        </SidebarDom>
      </Html>
      <Modal state={editProfile}>
        <ProfileConfig />
      </Modal>
    </>
  );
};
export default ProfileTab;
