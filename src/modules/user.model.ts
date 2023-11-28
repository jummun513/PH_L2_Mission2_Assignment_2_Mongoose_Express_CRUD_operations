import { Schema, model } from 'mongoose';
import { TOrder, TUser, UserMethod, UserModel } from './users/user.interface';

const orderSchema = new Schema<TOrder>({
  productName: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
});

const userSchema = new Schema<TUser, UserModel, UserMethod>({
  userId: {
    type: Number,
    required: true,
    unique: true,
  },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
  },
  age: { type: Number, required: true },
  email: { type: String, required: true, unique: true },
  isActive: { type: Boolean, required: true },
  hobbies: [{ type: String, required: true }],
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
  },
  orders: [orderSchema],
});

userSchema.methods.isUserExists = async function name(userId: number) {
  const existingUser = await User.findOne({ userId });
  return existingUser;
};

const User = model<TUser, UserModel>('User', userSchema);

export default User;
