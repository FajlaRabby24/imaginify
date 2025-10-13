import { model, models, Schema } from "mongoose";

export interface IUser {
  _id?: string; // MongoDB document ID (optional if coming from backend)
  clerkId: string;
  email: string;
  userName: string;
  photo: string;
  firstName?: string;
  lastName?: string;
  planId: number;
  creditBalance: number;
  createdAt?: string; // optional if you use timestamps in schema
  updatedAt?: string;
}

const UserSchema = new Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    photo: {
      type: String,
      required: true,
    },
    firstName: { type: String },
    lastName: { type: String },
    planId: {
      type: Number,
      default: 1,
    },
    creditBalance: {
      type: Number,
      default: 10,
    },
  },
  { timestamps: true }
);

const UserModel = models.User || model("User", UserSchema);
export default UserModel;
