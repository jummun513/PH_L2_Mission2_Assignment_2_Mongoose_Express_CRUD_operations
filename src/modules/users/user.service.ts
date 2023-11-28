import User from '../user.model';
import { TUser } from './user.interface';

const createUserInDB = async (userData: TUser) => {
  const user = new User(userData);
  if (await user.isUserExists(userData.userId)) {
    throw new Error('user already exists');
  }
  const result = await user.save();
  return result;
};

const getUsersFromDB = async () => {
  const result = await User.find().select(
    'username fullName age email address -_id',
  );
  return result;
};

const getSingleUserFromDB = async (userId: string) => {
  const id = parseInt(userId);
  const user = await User.findOne({ userId: id });

  if (await user?.isUserExists(id)) {
    return user;
  } else {
    throw new Error('User not found');
  }
};

export const UserServices = {
  createUserInDB,
  getUsersFromDB,
  getSingleUserFromDB,
};
