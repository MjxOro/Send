import { Document, Schema, Types, model } from 'mongoose';

export interface ISessions extends Document {
  userId: Types.ObjectId;
  userAgent?: string;
  valid: boolean;
  createdAt: number;
  updatedAt: number;
}

const sessionSchema = new Schema<ISessions>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
      ref: 'User'
    },
    valid: { type: Boolean, default: true },
    createdAt: { type: Number },
    updatedAt: { type: Number },
    userAgent: { type: String }
  },
  {
    timestamps: { currentTime: () => +new Date() }
  }
);

const Session = model<ISessions>('Session', sessionSchema);

export default Session;
