import { Document, Schema, model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  googleId?: number;
  email: string;
  avatar?: string;
  status: string;
  createdAt: number;
  updatedAt: number;
  banned: boolean;
}

const userSchema = new Schema<IUser>(
  {
    googleId: { type: Number, unique: true },
    name: { type: String },
    email: { type: String, required: true, unique: true },
    avatar: { type: String },
    status: { type: String, default: 'offline' },
    createdAt: { type: Number },
    updatedAt: { type: Number },
    banned: { type: Boolean, default: false }
  },
  {
    timestamps: { currentTime: () => +new Date() }
  }
);

const UserModel = model<IUser>('User', userSchema);

export default UserModel;
