import mongoose, { Schema, model, models } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser {
  email: string;
  password?: string;
  provider?: "credentials" | "google";
  _id?: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String},
    provider: { type: String, default: "credentials" },
  },
  {
    timestamps: true,
  }
);
userSchema.pre("save", async function (next) {
  if (this.password && this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = models?.User || model<IUser>("User", userSchema);
export default User;
