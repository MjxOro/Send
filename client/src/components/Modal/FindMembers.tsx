import { useState, ChangeEvent, MouseEvent } from 'react';
import { useChatSocket, useCreateRoomState, useAuth } from '../../utils/store';
import Avatar from '../Avatar/Avatar';
import { AiOutlineSearch } from 'react-icons/ai';

const FindMembers = () => {
  const [query, setQuery] = useState<string>('');
  const { allUsers } = useChatSocket();
  const { queryUser, members } = useCreateRoomState();
  const roomMembers = useCreateRoomState((s) => s.members);
  const currentUser = useAuth((s) => s.currentUser);
  const search = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };
  const handleNext = () => {
    const user = roomMembers.filter(
      (user) => user.id === String(currentUser._id)
    );
    if (user.length) {
      useCreateRoomState.setState({
        modalOptions: true
      });
    } else {
      useCreateRoomState.setState({
        modalOptions: true,
        members: [
          ...roomMembers,
          { name: currentUser.name, id: String(currentUser._id) }
        ]
      });
    }
  };
  const handleAddMembers = (e: MouseEvent<HTMLDivElement>) => {
    if (members.length > 0) {
      useCreateRoomState.setState({ queryUser: [...allUsers] });
    }
    const choice = {
      name: e.currentTarget.innerText,
      id: e.currentTarget.id
    };
    useCreateRoomState.setState({
      members: [...roomMembers, choice]
    });
    const arr = queryUser.filter(
      (
        item: any //types from db
      ) =>
        item &&
        item.email !== currentUser.email &&
        item._id !== e.currentTarget.id
    );
    useCreateRoomState.setState({ queryUser: arr });
  };
  const handleRemove = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const arr = roomMembers.filter(
      (user) => user && user.id !== e.currentTarget.id
    );
    const arr2 = allUsers.filter(
      (user: any) => user._id === e.currentTarget.id
    );
    //useChatSocket.setState({ allUsers: allUsers })
    useCreateRoomState.setState({
      members: arr,
      queryUser: [...queryUser, ...arr2]
    });
  };
  return (
    <>
      <section
        className={
          'flex max-h-[40vh] min-h-[40vh] w-screen flex-col rounded-md bg-[#f0f0f0] lg:max-h-[50vh] lg:min-h-[40vh] lg:w-[30vw]'
        }
      >
        <header className="flex items-center justify-between p-4">
          <button
            onClick={() =>
              useCreateRoomState.setState({ showModal: false, members: [] })
            }
            className="rounded  bg-transparent py-2 px-4 font-semibold text-blue-700 hover:border-transparent hover:bg-blue-500 hover:text-white"
          >
            Back
          </button>
          <p className="font-semibold">Add users to group</p>
          <button
            onClick={handleNext}
            className="rounded  bg-transparent py-2 px-4 font-semibold text-blue-700 hover:border-transparent hover:bg-blue-500 hover:text-white"
          >
            Next
          </button>
        </header>
        <div className="mx-8 my-2 flex items-center justify-start rounded-lg border-2 border-gray-300 bg-white px-2">
          <AiOutlineSearch className="bg-white" />
          <input
            placeholder="Search Users"
            className="w-full bg-white px-2 focus:outline-none"
            onChange={search}
          />
        </div>
        <div className="flex-wrap px-4">
          {roomMembers
            // types from db
            .filter((user: any) => user.id !== currentUser._id)
            .map((user: any) => {
              return (
                <button
                  key={String(user.id)}
                  onClick={handleRemove}
                  className=" bg-gray-300 py-2 px-4 font-bold text-gray-800 hover:bg-gray-400"
                  id={String(user.id)}
                >
                  {user.name}
                </button>
              );
            })}
        </div>
        <div className="max-h-full w-full overflow-y-auto px-8 py-4">
          {queryUser &&
            queryUser
              .filter(
                (
                  user: any //types from db
                ) =>
                  query &&
                  user.email.toLowerCase().includes(query) &&
                  user._id !== currentUser._id
              )
              .map((user: any) => {
                //types from db
                return (
                  <div
                    onClick={handleAddMembers}
                    id={user._id}
                    className="flex w-full items-center py-4"
                    key={user._id}
                  >
                    <Avatar
                      height={'h-12'}
                      width={'w-12'}
                      status={user.status}
                      src={user.avatar}
                    />
                    <p className="ml-4">{user.name}</p>
                  </div>
                );
              })}
        </div>
      </section>
    </>
  );
};
export default FindMembers;
