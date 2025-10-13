import { Schema, model, models } from "mongoose";
import { IUser } from "./user.model";

export interface ITransaction {
  _id?: string;
  createdAt: string; // using string because in frontend you’ll receive ISO date string
  stripeId: string;
  amount: number;
  plan?: string;
  credits?: number;
  buyer?: string | IUser; // could be just user id or populated user object
}

const TransactionSchema = new Schema(
  {
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    stripeId: {
      type: String,
      required: true,
      unique: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    plan: {
      type: String,
    },
    credits: {
      type: Number,
    },
    buyer: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Transaction =
  models?.Transaction || model("Transaction", TransactionSchema);

export default Transaction;
