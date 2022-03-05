import { Document, Schema, Types, model } from 'mongoose';

export interface IMessage extends Document {
  sender: Types.ObjectId;
  senderName: string;
  senderAvatar: string;
  content?: string;
  roomId: Types.ObjectId;
  createdAt: number;
  updatedAt: number;
}

const messageSchema = new Schema<IMessage>(
  {
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, default: '' },
    senderName: { type: String, ref: 'User', required: true },
    senderAvatar: { type: String, ref: 'User', required: true },
    roomId: { type: Schema.Types.ObjectId, ref: 'Room', required: true }
  },
  {
    timestamps: { currentTime: () => +new Date() }
  }
);

const Room = model<IMessage>('Message', messageSchema);

export default Room;
