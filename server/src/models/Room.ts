import { Document, Schema, Types, model } from 'mongoose';

export interface IRoom extends Document {
  _id: Types.ObjectId;
  owner: Types.ObjectId;
  title: string;
  picture: string;
  createdAt: number;
  updatedAt: number;
}

const roomSchema = new Schema<IRoom>(
  {
    _id: { type: Schema.Types.ObjectId, required: true },
    owner: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    title: { type: String, required: true },
    picture: { type: String, required: true }
  },
  {
    timestamps: { currentTime: () => +new Date() }
  }
);

const Room = model<IRoom>('Room', roomSchema);

export default Room;
