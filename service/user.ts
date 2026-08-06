import { Clothes } from "../models/clothes";
import { Outfit } from "../models/outfit";
import { User } from "../models/user";
import { errorHandler } from "../utils";
import bcrypt from "bcryptjs";

const getData = async (id: string) => {
  const [userData, clothesCount, outfitCount] = await Promise.all([
    User.findById(id).select("-password -token"),
    Clothes.countDocuments({ owner: id }),
    Outfit.countDocuments({ owner: id }),
  ]);

  if (!userData) {
    throw errorHandler(404, "User not found");
  }

  return { userData, clothesCount, outfitCount };
};

const updateUserData = async ({
  id,
  name,
  email,
}: {
  id: string;
  name: string;
  email: string;
}) => {
  const user = await User.findByIdAndUpdate(
    id,
    {
      name,
      email,
    },
    { new: true },
  ).select("-password -token");

  if (!user) {
    throw errorHandler(404, "User not found");
  }

  return user;
};

const updatePassword = async ({
  id,
  password,
}: {
  id: string;
  password: string;
}) => {
  const user = await User.findById(id);

  if (!user) throw errorHandler(404, "User not found");

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.findByIdAndUpdate(id, {
    password: hashedPassword,
  });

  return;
};

const deleteUser = async (id: string) => {
  const user = await User.findByIdAndDelete(id);

  if (!user) {
    throw errorHandler(404, "User not found");
  }

  return user;
};

export default { getData, deleteUser, updateUserData, updatePassword };
