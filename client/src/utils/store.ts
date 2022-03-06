import create from 'zustand';
import axios from 'axios';
import { Socket } from 'socket.io-client';

export interface IStore {
  viewportWidth: number;
  showSidebar: boolean;
  exitThree: boolean;
  chatSearch: string;
  showProfile: boolean;
  editProfile: boolean;
  setExit: () => void;
  newName: string;
  files?: File | null;
  fileLoading: boolean;
  tempView: string | undefined;
}
export const useStore = create<IStore>((set) => ({
  viewportWidth: window.innerWidth,
  showSidebar: false,
  exitThree: false,
  showProfile: false,
  editProfile: false,
  chatSearch: '',
  setExit: () => set({ exitThree: true }),
  newName: '',
  files: null,
  fileLoading: false,
  tempView: undefined
}));

interface IStoreAuth {
  currentUser: any; //Types from db
  getAuth: () => void;
  isLoading: boolean;
}
export const useAuth = create<IStoreAuth>((set) => ({
  currentUser: null,
  isLoading: true,
  getAuth: async () => {
    try {
      const res: any = await axios.get(
        `${process.env.NEXT_PUBLIC_API_HOST as string}/auth/getUser`,
        {
          withCredentials: true
        }
      );
      set({ currentUser: res.data, isLoading: false });
      return;
    } catch (e) {
      set({ currentUser: null, isLoading: false });
      return;
    }
  }
}));

export interface IChatSocket {
  myRooms: any[];
  messages: string[];
  currentRoom: string;
  newMessage: string;
  socket: Socket | null;
  allUsers: any | null; //Get types from db
  getUsers: () => void;
  getMyRooms: ({ currentUser }: any) => void;
  currentRoomName: string;
}

export const useChatSocket = create<IChatSocket>((set) => ({
  myRooms: [],
  currentRoom: '',
  currentRoomName: '',
  messages: [],
  socket: null,
  newMessage: '',
  allUsers: null,
  getUsers: async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_HOST as string}/userQuery`,
        {
          withCredentials: true
        }
      );
      set({ allUsers: res.data });
      useCreateRoomState.setState({ queryUser: res.data });
      return;
    } catch (e) {
      set({ allUsers: null });
      return;
    }
  },
  getMyRooms: async ({ currentUser }) => {
    try {
      if (!currentUser) {
        set({ myRooms: [] });
        return;
      }
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_HOST as string}/myRooms/${String(
          currentUser._id
        )}`,
        {
          withCredentials: true
        }
      );
      set({ myRooms: data });
      console.log(data);
      return;
    } catch (e) {
      set({ myRooms: [] });
    }
  }
}));

export interface ICreateRoom {
  showModal: boolean;
  modalOptions: boolean;
  roomTitle: string;
  members: { name: string; id: string }[];
  tempView?: string | undefined;
  files?: File | null;
  queryUser: any[];
  fileLoading: boolean;
}

export const useCreateRoomState = create<ICreateRoom>(() => ({
  showModal: false,
  queryUser: [],
  modalOptions: false,
  roomTitle: '',
  members: [],
  files: null,
  tempView: undefined,
  fileLoading: false
}));

export default useStore;
