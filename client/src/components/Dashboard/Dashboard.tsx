import CanvasLayout from '../Layout/CanvasLayout/CanvasLayout';
import ExitAnimation from '../Layout/ExitAnimation/ExitAnimation';
import ChatSocket from '../Layout/ChatSocket/ChatSocket';
import ChatMenu from './ChatMenu';
import Chat from './Chat';
import { ScrollControls } from '@react-three/drei';
import useStore, {
  useAuth,
  useChatSocket,
  useCreateRoomState
} from '../../utils/store';
import Modal from '../Modal/Modal';
import FindMembers from '../Modal/FindMembers';
import CreateRoom from '../Modal/CreateRoom';
import useWindowSize from '../../utils/viewport';
import ProfileTab from './ProfileTab';
import LoadingAnimation from './LoadingAnimation';
import { Html } from '@react-three/drei';
import { AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import idleTimer from '../../utils/idleTimer';

const Dashboard = () => {
  const { messages, currentRoomName, socket, status }: any = useChatSocket();
  const { modalOptions, showModal, fileLoading } = useCreateRoomState();
  const { showProfile, fileLoading: updateProfile } = useStore();
  const { currentUser, isLoading } = useAuth();
  const showLoader = fileLoading || updateProfile;

  const width = useWindowSize();
  const largeScreen = width > 1024;
  const mobileMenu =
    !largeScreen && !currentRoomName && !largeScreen && !showProfile;
  const mobileChat =
    (!largeScreen && currentRoomName) || (!largeScreen && !showProfile);
  useEffect(() => {
    socket && idleTimer({ socket, currentUser, status });
  }, [status, socket]);

  return (
    <ExitAnimation>
      {currentUser && !isLoading && (
        <ChatSocket>
          <CanvasLayout hideScroll>
            <color attach="background" args={['#483078']} />
            {showLoader && <LoadingAnimation />}
            <ProfileTab />
            <Modal state={showModal}>
              {!modalOptions ? <FindMembers /> : <CreateRoom />}
            </Modal>
            {(mobileMenu || largeScreen) && (
              <Html
                position={[0, 0, -5]}
                fullscreen
                className={'h-screen bg-[#301860]'}
                style={{
                  width: largeScreen ? '30vw' : '100vw',
                  opacity:
                    fileLoading || (largeScreen && showProfile) || updateProfile
                      ? 0
                      : 1
                }}
              >
                <AnimatePresence>
                  {(mobileMenu || largeScreen) && <ChatMenu />}
                </AnimatePresence>
              </Html>
            )}
            {(mobileChat || largeScreen) && (
              <ScrollControls
                damping={100}
                pages={messages.length > 0 ? messages.length / 5 + 0.1 : 0}
              >
                <Chat />
              </ScrollControls>
            )}
          </CanvasLayout>
        </ChatSocket>
      )}
    </ExitAnimation>
  );
};
export default Dashboard;
