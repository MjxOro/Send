import { ChangeEvent } from 'react';
import axios from 'axios';
import { useCreateRoomState, useChatSocket, useAuth } from '../../utils/store';
import Resizer from 'react-image-file-resizer';
import { AiOutlinePicture } from 'react-icons/ai';
import { EVENTS } from '../Layout/ChatSocket/ChatSocket';

const CreateRoom = () => {
  const {
    roomTitle,
    members: roomMembers,
    files,
    tempView
  } = useCreateRoomState();
  const { currentRoom, socket } = useChatSocket();
  const { currentUser } = useAuth();
  const resizeFile = (file: File) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        300,
        300,
        'JPEG',
        100,
        0,
        (uri) => {
          resolve(uri);
        },
        'file'
      );
    });
  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const url = URL.createObjectURL(e.target.files[0]);
      if (
        String(e.target.files[0].type) === 'image/gif' &&
        e.target.files[0].size < 2480000
      ) {
        useCreateRoomState.setState({
          tempView: url,
          files: e.target.files[0]
        });
        return;
      } else if (
        String(e.target.files[0].type) === 'image/gif' &&
        e.target.files[0].size >= 2480000
      ) {
        alert('File Size Too Big');
        useCreateRoomState.setState({ tempView: undefined, files: null });
        return;
      }
      const image: any = await resizeFile(e.target.files[0]);
      useCreateRoomState.setState({ tempView: url, files: image });
      return;
    }
  };
  const handleRoomTitle = (e: ChangeEvent<HTMLInputElement>) => {
    useCreateRoomState.setState({ roomTitle: e.target.value });
  };

  const handleSubmit = async () => {
    const form = new FormData();
    const title = roomTitle || `${currentUser.name}'s Group Chat`;
    form.append('fileName', title);
    files && form.append('file', files);

    useCreateRoomState.setState({ showModal: false });
    useCreateRoomState.setState({ fileLoading: true });
    const { data } = await axios({
      method: 'post',
      url: `${process.env.REACT_APP_API_HOST as string}/roomPhoto`,
      data: form,
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      withCredentials: true
    });

    //call socket pass currentUser, roomTitle, roomPhoto (res.data)
    const roomPhoto = data;
    roomPhoto.split('.')[1] === 'google'
      ? useCreateRoomState.setState({ fileLoading: false })
      : setTimeout(() => {
          useCreateRoomState.setState({ fileLoading: false });
        }, 1000);

    if (socket) {
      socket.emit(EVENTS.CLIENT.CREATE_ROOM, {
        currentUser,
        title,
        roomMembers,
        roomPhoto,
        currentRoom
      });
    }
    //reset form
    useCreateRoomState.setState({
      modalOptions: false,
      roomTitle: '',
      members: [],
      files: null,
      tempView: undefined
    });
  };
  return (
    <>
      <section
        className={
          'flex h-[40vh] w-screen flex-col rounded-md bg-[#f0f0f0] lg:max-h-[35vh] lg:w-[45vw] 2xl:max-h-[35vh] 2xl:w-[50rem]'
        }
      >
        <div className="flex flex-col">
          <header className="flex items-center justify-between p-4">
            <button
              onClick={() =>
                useCreateRoomState.setState({
                  modalOptions: false,
                  files: null,
                  tempView: undefined
                })
              }
              className="rounded  bg-transparent py-2 px-4 font-semibold text-blue-700 hover:border-transparent hover:bg-blue-500 hover:text-white"
            >
              Back
            </button>
            <p className="font-semibold">Set up group chat</p>
            <button
              onClick={handleSubmit}
              className="rounded  bg-transparent py-2 px-4 font-semibold text-blue-700 hover:border-transparent hover:bg-blue-500 hover:text-white"
            >
              Done
            </button>
          </header>
          <section className={'h-8 w-full px-4'}></section>
        </div>
        <div className="flex h-full w-full items-center justify-center p-4">
          <label className="relative left-[5.5rem]">
            <AiOutlinePicture
              size={'3rem'}
              className="bg-gray-500 bg-opacity-60"
            />
            <input
              id="file-input"
              type="file"
              accept="image/*"
              onChange={handleChange}
              className="hidden"
            />
          </label>
          <div className="mx-4 h-24 w-24 overflow-hidden rounded-full">
            {
              //handle empty src...
              files ? (
                <img
                  src={tempView}
                  className="h-full w-full object-cover object-center"
                />
              ) : null
            }
          </div>

          <div className="flex flex-col">
            <label>Enter Group Name</label>
            <input onChange={handleRoomTitle} className="rounded-md px-2" />
          </div>
        </div>
      </section>
    </>
  );
};
export default CreateRoom;
