import { ChangeEvent, MouseEvent } from 'react';
import { BiCommentAdd } from 'react-icons/bi';
import { AiOutlineSearch } from 'react-icons/ai';
import useStore, {
  useChatSocket,
  useCreateRoomState,
  useAuth
} from '../../utils/store';
import Burger from '../BurgerMenu/BurgerMenu';
import Avatar from '../Avatar/Avatar';
import { EVENTS } from '../Layout/ChatSocket/ChatSocket';
import useScreenSize from '../../utils/viewport';
import { motion } from 'framer-motion';

const ChatRooms = ({ myRooms }: any) => {
  const { socket, currentRoom } = useChatSocket();
  const { chatSearch } = useStore();
  const { currentUser } = useAuth();
  const handleJoin = (e: MouseEvent<HTMLDivElement>) => {
    useChatSocket.setState({ currentRoomName: e.currentTarget.innerText });
    if (socket) {
      const roomId = e.currentTarget.id;
      socket.emit(EVENTS.CLIENT.JOINING_ROOM, {
        roomId,
        currentUser,
        currentRoom
      });
    }
  };
  return (
    <main
      className={`max-h-full overflow-y-auto  overflow-x-hidden bg-[#301860] text-[#ffffff]`}
    >
      {myRooms &&
        myRooms
          .filter(
            ({ roomName }: any) =>
              roomName && roomName.toLowerCase().includes(chatSearch)
          )
          .map((room: any) => {
            //types in db
            return (
              <div
                key={room.roomId}
                id={room.roomId}
                className={
                  currentRoom === room.roomId
                    ? 'flex h-32 max-h-32 cursor-pointer items-center bg-[#906090] p-4'
                    : 'flex h-32 max-h-32 cursor-pointer items-center p-4'
                }
                onClick={handleJoin}
              >
                <div className="flex w-full max-w-[64px] justify-center lg:max-w-[full]">
                  <Avatar height={'h-16'} width={'w-16'} src={room.picture} />
                </div>
                <section
                  className="flex max-h-full w-full 
               min-w-0 flex-col  p-4"
                >
                  <header className="max-h-1/4 flex justify-between">
                    <p>{room.roomName}</p>
                    <p className="hidden">2:13AM</p>
                  </header>
                  <p className="max-h-3/4 hidden truncate">{'Lorem Stuffs'}</p>
                </section>
              </div>
            );
          })}
    </main>
  );
};
const ChatMenu = () => {
  const { myRooms } = useChatSocket();
  const { showProfile, fileLoading: updateProfile } = useStore();
  const { fileLoading } = useCreateRoomState();
  const width = useScreenSize();
  const largeScreen = width > 1024;
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    useStore.setState({ chatSearch: e.target.value });
  };
  const handleClick = () => {
    useStore.setState({ showProfile: true });
  };
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 1 } }}
      exit={{ opacity: 0 }}
      className="flex max-h-full  flex-col text-[#ffffff]"
    >
      <header className="flex h-[10vh] items-center justify-between p-4">
        <Burger state={showProfile} onClick={handleClick} />
        <p>Chats</p>
        <div
          onClick={() => useCreateRoomState.setState({ showModal: true })}
          className="h-8 w-8 cursor-pointer"
        >
          <BiCommentAdd className="h-full w-full" />
        </div>
      </header>
      <div className="mx-8 my-2 flex items-center justify-start rounded-lg border-2 border-gray-300 bg-white px-2">
        <AiOutlineSearch className="bg-white" />
        <input
          placeholder="Search Chat"
          className="w-full bg-white px-2 text-[#000000] focus:outline-none"
          onChange={handleChange}
        />
      </div>
      <ChatRooms myRooms={myRooms} />
    </motion.main>
  );
};
export default ChatMenu;
