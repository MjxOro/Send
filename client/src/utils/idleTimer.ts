import { EVENTS } from '../components/Layout/ChatSocket/ChatSocket';
import { useChatSocket } from './store';

const idleTimer = ({ socket, currentUser, status }: any) => {
  let t: any = null;
  const resetTimer = ({ socket, currentUser }: any) => {
    if (status !== 'online') {
      socket.emit(EVENTS.CLIENT.ONLINE, { currentUser });
      useChatSocket.setState({ status: 'online' });
    }
    clearTimeout(t);
    t = setTimeout(() => setInactive({ socket, currentUser, status }), 10000);
  };
  window.onload = () => void resetTimer({ socket, currentUser, status });
  window.onmousemove = () => void resetTimer({ socket, currentUser, status });
  window.onmousedown = () => void resetTimer({ socket, currentUser, status });
  window.ontouchstart = () => void resetTimer({ socket, currentUser, status });
  window.ontouchmove = () => void resetTimer({ socket, currentUser, status });
  window.onclick = () => void resetTimer({ socket, currentUser, status });
  window.onkeydown = () => void resetTimer({ socket, currentUser, status });
  window.addEventListener(
    'scroll',
    () => void resetTimer({ socket, currentUser, status }),
    true
  );

  const setInactive = ({ socket, currentUser, status }: any) => {
    if (status !== 'away') {
      socket.emit(EVENTS.CLIENT.AWAY, { currentUser });
      useChatSocket.setState({ status: 'away' });
    }
  };
};
export default idleTimer;
