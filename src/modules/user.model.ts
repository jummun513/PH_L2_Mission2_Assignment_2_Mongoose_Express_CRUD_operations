import { Schema, model } from 'mongoose';
import { TOrder, TUser, User } from './users/user.interface';
import bcrypt from 'bcrypt';
import config from '../config';

const orderSchema = new Schema<TOrder>({
  productName: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
});

const userSchema = new Schema<TUser>({
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
  isActive: { type: Boolean, required: true, default: true },
  hobbies: [{ type: String, required: true }],
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
  },
  orders: [orderSchema],
  isDeleted: { type: Boolean, default: false, required: true },
});

// mongoose document middleware
userSchema.pre('save', async function (next) {
  const user = this;
  // hashing password and before save to DB
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  );
  next();
});

// mongoose query middleware
userSchema.pre('find', async function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

userSchema.pre('findOne', async function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

// mongoose aggregate middleware
// userSchema.pre('aggregate', async function (next) {
//   this.pipeline.unshift({ $match: { isDeleted: { $ne: true } } });
//   next();
// });

// mongoose instance method for check user is exist or not
userSchema.methods.isUserExists = async function name(userId: number) {
  const existingUser = await UserModel.findOne({ userId });
  return existingUser;
};

const UserModel = model<TUser, User>('User', userSchema);

export default UserModel;
