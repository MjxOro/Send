import { Document, Schema, Types, model } from 'mongoose';

export interface IFriend extends Document {
  sender: Types.ObjectId;
  reciever: Types.ObjectId;
  status: string;
  createdAt: number;
  updatedAt: number;
}

const friendSchema = new Schema<IFriend>(
  {
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    reciever: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, required: true }
  },
  { timestamps: { currentTime: () => +new Date() } }
);
const Friend = model<IFriend>('Friend', friendSchema);
