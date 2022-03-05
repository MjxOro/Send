import { Document, Schema, Types, model } from 'mongoose';

export interface IMember extends Document {
  roomId: Types.ObjectId;
  userId: Types.ObjectId;
  roomPhoto: string;
  roomName: string;
  admin: boolean;
  banned: boolean;
  createdAt: number;
  updatedAt: number;
}

const memberSchema = new Schema<IMember>(
  {
    roomId: { type: Schema.Types.ObjectId, ref: 'Room', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    roomName: { type: String, required: true, ref: 'Room' },
    roomPhoto: { type: String, required: true, ref: 'Room' },
    admin: { type: Boolean, default: false },
    banned: { type: Boolean, default: false }
  },
  {
    timestamps: { currentTime: () => +new Date() }
  }
);

const Member = model<IMember>('Member', memberSchema);

export default Member;
