import { useEffect, KeyboardEvent, ChangeEvent } from 'react';
import {
  useAuth,
  useChatSocket,
  useStore,
  useCreateRoomState
} from '../../utils/store';
import { useThree } from '@react-three/fiber';
import { useScroll, Html, Scroll } from '@react-three/drei';
import { EVENTS } from '../Layout/ChatSocket/ChatSocket';
import Avatar from '../Avatar/Avatar';
import useWindowSize from '../../utils/viewport';

const Chat = () => {
  const { currentRoom, newMessage, socket, currentRoomName, messages } =
    useChatSocket();
  const { showProfile, fileLoading: updateProfile } = useStore();
  const { currentUser } = useAuth();
  const { fileLoading } = useCreateRoomState();
  const scrollH: any = useScroll();
  const { size, viewport } = useThree();
  const centerX = viewport.width / 6;
  const centerY = viewport.height * 0.45;
  const width = useWindowSize();
  const largeScreen = width > 1024;
  const scrollDown = async () => {
    await scrollH.el.scrollTo(0, scrollH.el.scrollHeight);
    scrollH.offset = 1;
    scrollH.el.scrollTop = scrollH.el.scrollHeight;
  };
  useEffect(() => {
    setTimeout(scrollDown, 100);
  }, [messages, currentRoom]);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    useChatSocket.setState({ newMessage: e.target.value });
  };
  const handleSendMessage = (e: KeyboardEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    if (e.key === 'Enter' && !e.shiftKey) {
      if (!String(newMessage).trim() || !currentRoom) {
        //If message empty nor roomId, dont send
        useChatSocket.setState({ newMessage: '' });
        target.value = '';
        return;
      }

      if (socket) {
        socket.emit(EVENTS.CLIENT.SEND_ROOM_MESSAGE, {
          newMessage,
          currentUser,
          currentRoom
        });
        useChatSocket.setState({ newMessage: '' });
        target.value = '';
      }
    }
  };
  return (
    <>
      <Html
        className="flex h-[10vh] w-[100vw] items-center justify-center bg-[#483078] p-4 lg:w-[70vw]"
        center
        style={{
          opacity:
            fileLoading || showProfile || updateProfile || !currentRoomName
              ? 0
              : 1
        }}
        position={largeScreen ? [centerX * 0.9, -centerY, 0] : [0, -centerY, 0]}
      >
        {currentRoom && (
          <input
            onChange={handleChange}
            onKeyPress={handleSendMessage}
            className="h-[3vh] w-[75vw] rounded-lg bg-white px-4 lg:w-[60vw]"
          />
        )}
      </Html>
      {!largeScreen && currentRoomName && (
        <Html
          className=" h-[10vh] w-[100vw] bg-[#483078] p-4 text-[#ffffff] lg:w-[70vw]"
          center
          style={{
            opacity: !currentRoomName ? 0 : 1
          }}
          position={[0, centerY, 0]}
        >
          <header className="flex items-center justify-between p-4">
            <button
              onClick={() =>
                useChatSocket.setState({ currentRoomName: '', messages: [] })
              }
              className="rounded  bg-transparent py-2 px-4 font-semibold text-blue-700 hover:border-transparent hover:bg-blue-500 hover:text-white"
            >
              Back
            </button>
            <p className="font-semibold">{currentRoomName}</p>
            <button className="rounded  bg-transparent  py-2 px-4 font-semibold text-blue-700 opacity-0 hover:border-transparent hover:bg-blue-500 hover:text-white">
              Done
            </button>
          </header>
        </Html>
      )}
      <Scroll html>
        <main
          className="bg-[#483078]"
          style={{
            opacity:
              fileLoading || showProfile || updateProfile || !currentRoomName
                ? 0
                : 1
          }}
        >
          {!showProfile &&
            messages.map((message: any, index: any) => {
              return (
                //framer motion animate
                <div
                  key={index}
                  style={{
                    position: 'absolute',
                    width: largeScreen ? '50vw' : '100vw',
                    height: `${10}vh`,
                    top: largeScreen
                      ? `${index * 20 + 5}vh`
                      : `${index * 20 + 10}vh`,
                    left: largeScreen ? `${size.width * 0.425}px` : 0 //`${size.width * 0.25}px`
                  }}
                  className={
                    String(message.sender) === String(currentUser._id)
                      ? 'flex flex-row-reverse items-center pr-12 text-[#ffffff]'
                      : 'flex items-center pl-8 text-[#ffffff]'
                  }
                >
                  <Avatar
                    src={message.senderAvatar}
                    height={'h-[3rem]'}
                    width={'w-[3rem]'}
                  />

                  <div className="flex min-w-[25vw] flex-col p-4">
                    <div
                      className={
                        String(message.sender) === String(currentUser._id)
                          ? 'flex flex-row-reverse'
                          : 'flex'
                      }
                      //className="flex  justify-between"
                    >
                      <p>{message.senderName}</p>
                    </div>
                    <p
                      className={
                        String(message.sender) === String(currentUser._id)
                          ? 'text-right'
                          : 'text-left'
                      }
                    >
                      {message.content}
                    </p>
                  </div>
                </div>
              );
            })}
        </main>
      </Scroll>
    </>
  );
};
export default Chat;
