import { ChangeEvent } from 'react';
import axios from 'axios';
import { useAuth, useStore } from '../../utils/store';
import Resizer from 'react-image-file-resizer';
import { AiOutlinePicture } from 'react-icons/ai';

const ProfileConfig = () => {
  const { newName, files, tempView } = useStore();
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
        useStore.setState({ tempView: url, files: e.target.files[0] });
        return;
      } else if (
        String(e.target.files[0].type) === 'image/gif' &&
        e.target.files[0].size >= 2480000
      ) {
        alert('File Size Too Big');
        useStore.setState({ tempView: undefined, files: null });
        return;
      }
      const image: any = await resizeFile(e.target.files[0]);
      useStore.setState({ tempView: url, files: image });
      return;
    }
  };
  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    useStore.setState({ newName: e.target.value });
  };

  const handleSubmit = async () => {
    if (!newName && !files) {
      useStore.setState({
        editProfile: false,
        files: null,
        tempView: undefined,
        newName: ''
      });
      return;
    }
    const form = new FormData();
    const name = newName || '';
    form.append('newName', name);
    files && form.append('file', files);

    useStore.setState({ editProfile: false });
    useStore.setState({ fileLoading: true });
    const { data } = await axios({
      method: 'put',
      url: `${process.env.REACT_APP_API_HOST as string}/api/userUpdate/${String(
        currentUser._id
      )}`,
      data: form,
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      withCredentials: true
    });

    //call socket pass currentUser, roomTitle, roomPhoto (res.data)
    const userUpdate = data;
    userUpdate.split('.')[1] === 'google'
      ? useStore.setState({ fileLoading: false })
      : setTimeout(() => {
          useStore.setState({ fileLoading: false });
        }, 1000);

    //reset form
    useStore.setState({
      newName: '',
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
                useStore.setState({
                  editProfile: false,
                  newName: '',
                  files: null,
                  tempView: undefined
                })
              }
              className="rounded  bg-transparent py-2 px-4 font-semibold text-blue-700 hover:border-transparent hover:bg-blue-500 hover:text-white"
            >
              Back
            </button>
            <p className="font-semibold">Edit Profile</p>
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
            <label>Change Name</label>
            <input onChange={handleNameChange} className="rounded-md px-2" />
          </div>
        </div>
      </section>
    </>
  );
};
export default ProfileConfig;
