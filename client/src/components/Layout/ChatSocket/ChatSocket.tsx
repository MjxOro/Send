import io, { Socket } from 'socket.io-client';
import { ReactNode, useEffect } from 'react';
import { useAuth, useChatSocket } from '../../../utils/store';
import axios from 'axios';

export const EVENTS = {
  connection: 'connection',
  CLIENT: {
    ONLINE: 'ONLINE',
    OFFLINE: 'OFFLINE',
    AWAY: 'AWAY',
    CREATE_ROOM: 'CREATE_ROOM',
    JOINING_ROOM: 'JOINING_ROOM',
    SEND_ROOM_MESSAGE: 'SEND_ROOM_MESSAGE',
    CLIENT_INIT: 'CLIENT_INIT',
    LEAVE_ROOMS: 'LEAVE_ROOMS',
    MY_ROOMS: 'MY_ROOMS',
    DISCONNECT: 'DISCONNECT',
    PROFILE: 'PROFILE'
  },
  SERVER: {
    ROOMS: 'ROOMS',
    JOINED_ROOM: 'JOINED_ROOM',
    ROOM_MESSAGE: 'ROOM_MESSAGE',
    SERVER_INIT: 'SERVER_INIT',
    MY_ROOMS: 'MY_ROOMS',
    UPDATE_ROOMS: 'UPDATE_ROOMS',
    LEAVE_ROOMS: 'LEAVE_ROOMS',
    PROFILE: 'PROFILE',
    AWAY: 'AWAY',
    ONLINE: 'ONLINE'
  }
};

const ChatSocket = ({ children }: { children: ReactNode }) => {
  const { getUsers, getMyRooms, status } = useChatSocket();
  const { currentUser } = useAuth();
  useEffect(() => {
    const socket: Socket = io(process.env.REACT_APP_API_HOST as string, {
      withCredentials: true
    });
    getUsers();
    useChatSocket.setState({ socket: socket });
    //Connect
    socket.emit(EVENTS.CLIENT.MY_ROOMS, { currentUser });
    if (status === 'offline') {
      socket.emit(EVENTS.CLIENT.ONLINE, { currentUser });
    }
    socket.on(EVENTS.SERVER.JOINED_ROOM, ({ roomId, user, title }) => {
      if (String(user._id) === String(currentUser._id)) {
        useChatSocket.setState({ currentRoom: roomId });
        title && useChatSocket.setState({ currentRoomName: title });
      }
    });
    socket.on(EVENTS.SERVER.AWAY, ({ updateStatus }) => {
      if (
        String(updateStatus._id) === String(currentUser._id) &&
        currentUser.status !== 'away'
      ) {
        useAuth.setState({ currentUser: updateStatus });
      }
    });
    socket.on(EVENTS.SERVER.ONLINE, ({ updateStatus }) => {
      if (
        String(updateStatus._id) === String(currentUser._id) &&
        currentUser.status !== 'online'
      ) {
        useAuth.setState({ currentUser: updateStatus });
      }
    });
    socket.on(EVENTS.SERVER.MY_ROOMS, ({ user, getRooms, roomMembers }) => {
      const uId = String(user._id);
      const cId = String(currentUser._id);
      const roomMember =
        roomMembers && roomMembers.some((item: any) => item.id === cId);

      if (uId === cId) {
        useChatSocket.setState({ myRooms: getRooms });
      } else if (roomMember && uId !== cId) {
        getMyRooms({ currentUser });
      }
    });
    socket.on(EVENTS.SERVER.ROOM_MESSAGE, ({ messages }) => {
      useChatSocket.setState({ messages: messages });
    });
    const handler = ({ currentUser }: any) => {
      axios.put(
        `${process.env.REACT_APP_API_HOST as string}/api/offline`,
        currentUser
      );
    };
    window.addEventListener('beforeunload', (e: any) => {
      e.preventDefault();
      handler({ currentUser });
    });
    return () => {
      socket.emit(EVENTS.CLIENT.LEAVE_ROOMS);
      socket.removeAllListeners();
    };
  }, [currentUser]);

  return <>{children}</>;
};
export default ChatSocket;
