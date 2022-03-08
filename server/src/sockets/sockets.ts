import { Server, Socket } from 'socket.io';
import mongoose from 'mongoose';
import Room from '../models/Room';
import User, { IUser } from '../models/User';
import Member from '../models/Member';
import Message from '../models/Message';

const EVENTS = {
  connection: 'connection',
  CLIENT: {
    ONLINE: 'ONLINE',
    AWAY: 'AWAY',
    CREATE_ROOM: 'CREATE_ROOM',
    JOINING_ROOM: 'JOINING_ROOM',
    SEND_ROOM_MESSAGE: 'SEND_ROOM_MESSAGE',
    MY_ROOMS: 'MY_ROOMS',
    DISCONNECT: 'DISCONNECT',
    PROFILE: 'PROFILE',
    OFFLINE: 'OFFLINE'
  },
  SERVER: {
    ROOMS: 'ROOMS',
    JOINED_ROOM: 'JOINED_ROOM',
    ROOM_MESSAGE: 'ROOM_MESSAGE',
    SERVER_INIT: 'SERVER_INIT',
    MY_ROOMS: 'MY_ROOMS',
    UPDATE_ROOMS: 'UPDATE_ROOMS',
    PROFILE: 'PROFILE',
    AWAY: 'AWAY',
    ONLINE: 'ONLINE'
  }
};
const socket = ({ io }: { io: Server }) => {
  console.log('Sockets enabled');
  io.on(EVENTS.connection, (socket: Socket) => {
    console.log(`user connected ${socket.id}`);
    //create
    socket.on(
      EVENTS.CLIENT.CREATE_ROOM,
      // create new Room model
      async ({ title, currentUser, roomMembers, roomPhoto, currentRoom }) => {
        if (currentUser) {
          const newRoomId = String(new mongoose.Types.ObjectId());
          if (currentUser && title && roomPhoto) {
            const newRoom = new Room({
              _id: newRoomId,
              owner: String(currentUser._id),
              picture: roomPhoto,
              title: title
            });
            await newRoom.save();

            // add invited members to group (includes self)
            for (let i = 0; i < roomMembers.length; i++) {
              const newMember = new Member({
                roomId: newRoomId,
                userId: String(roomMembers[i].id),
                roomName: title,
                roomPhoto: roomPhoto,
                admin: true
              });
              await newMember.save();
            }
            //Update chats
            //get rooms currentUser are in
            const user = currentUser;
            if (currentRoom) {
              socket.leave(currentRoom);
            }
            const roomId = String(newRoomId);
            socket.join(roomId);
            const getRooms = await Member.find({
              userId: String(currentUser._id)
            }).lean();
            const messages = await Message.find({ roomId: roomId }).lean();
            io.emit(EVENTS.SERVER.MY_ROOMS, { getRooms, user, roomMembers });
            socket.emit(EVENTS.SERVER.JOINED_ROOM, { user, roomId, title });
            socket.nsp
              .in(roomId)
              .emit(EVENTS.SERVER.ROOM_MESSAGE, { messages, roomId });
          }
        }
      }
    );
    //Room Status ============================
    //Set Status of user
    socket.on(EVENTS.CLIENT.ONLINE, async ({ currentUser }) => {
      if (currentUser) {
        //add types to this
        await User.findOneAndUpdate(
          { _id: String(currentUser._id) },
          { status: 'online' }
        );
      }
      const updateStatus = await User.findOne({ _id: String(currentUser._id) });
      socket.emit(EVENTS.SERVER.ONLINE, { updateStatus });
    });
    socket.on(EVENTS.CLIENT.AWAY, async ({ currentUser }) => {
      if (currentUser) {
        await User.findOneAndUpdate(
          { _id: String(currentUser._id) },
          { status: 'away' }
        );
      }
      const updateStatus = await User.findOne({
        _id: String(currentUser._id)
      }).lean();
      socket.emit(EVENTS.SERVER.AWAY, { updateStatus });
    });
    //=============================================
    //Get chat room current user has
    socket.on(EVENTS.CLIENT.MY_ROOMS, async ({ currentUser }) => {
      if (currentUser) {
        const user = currentUser;
        //Get rooms from db
        const getRooms = await Member.find({ userId: String(user._id) }).lean();
        //emit rooms
        socket.emit(EVENTS.SERVER.MY_ROOMS, { getRooms, user });
      }
    });

    // HANDLE JOIN ROOM
    socket.on(
      EVENTS.CLIENT.JOINING_ROOM,
      async ({ roomId, currentUser, currentRoom }) => {
        if (currentRoom) {
          socket.leave(currentRoom);
        }
        const user = currentUser;
        socket.join(String(roomId));
        socket.emit(EVENTS.SERVER.JOINED_ROOM, { user, roomId });
        const messages = await Message.find({ roomId: String(roomId) });
        socket.nsp
          .in(String(roomId))
          .emit(EVENTS.SERVER.ROOM_MESSAGE, { messages, roomId });
        //Then get Messages
      }
    );
    //Revieve new Message, add to db then update all msg in that room
    socket.on(
      EVENTS.CLIENT.SEND_ROOM_MESSAGE,
      async ({ currentRoom, newMessage, currentUser }) => {
        if (currentUser) {
          const roomId = String(currentRoom);
          const message = new Message({
            roomId: roomId,
            sender: String(currentUser._id),
            senderName: currentUser.name,
            senderAvatar: currentUser.avatar,
            content: newMessage
          });
          await message.save();
          const messages = await Message.find({ roomId: roomId }).lean();
          socket.nsp
            .in(roomId)
            .emit(EVENTS.SERVER.ROOM_MESSAGE, { messages, roomId });
        }
      }
    );
    socket.on(EVENTS.CLIENT.DISCONNECT, async ({ currentUser }) => {
      if (currentUser) {
        const user: any = await User.findOneAndUpdate(
          { _id: String(currentUser._id) },
          { status: 'offline' }
        );
        await user.save();
      }
    });
  });
};

export default socket;
