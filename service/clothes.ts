import { QueryFilter, Types } from "mongoose";
import { Clothes } from "../models/clothes";
import { errorHandler } from "../utils";

interface IAddClothesItem {
  name: string;
  color: string[];
  season: ("winter" | "spring" | "fall" | "summer")[];
  image?: string;
  brand?: string;
  size: "s" | "m" | "l" | "xl" | "2xl" | "3xl";
  isOwned: boolean;
  userId: string;
}

interface IUpdateClothesItem extends IAddClothesItem {
  clothesId: string;
}

// const getAll = async (
//   id: string,
// ) => {
//   return await Clothes.find({ owner: id });
// };

const getAll = async (
  filter: QueryFilter<{
    owner: Types.ObjectId;
    season?: ("winter" | "spring" | "fall" | "summer")[];
    color?: string[];
    name?: string;
    isOwned?: boolean;
  }>,
) => {
  return await Clothes.find(filter);
};

const getClothesItemById = async (userId: string, clothesId: string) => {
  return await Clothes.findOne({ owner: userId, _id: clothesId });
};

const addClothesItem = async ({
  name,
  color,
  season,
  image,
  brand,
  size,
  isOwned,
  userId,
}: IAddClothesItem) => {
  const newItem = await Clothes.create({
    name,
    color,
    season,
    image,
    brand,
    size,
    isOwned,
    owner: userId,
  });

  if (!newItem) throw errorHandler(500);

  return newItem;
};

const updateClothesItem = async (data: IUpdateClothesItem) => {
  return await Clothes.findByIdAndUpdate(data.clothesId, {
    ...data,
  });
};

const deleteClothesItem = async (userId: string, clothesId: string) => {
  return await Clothes.findOneAndDelete({ owner: userId, _id: clothesId });
};

const deleteAllClothes = async (userId: string) => {
  return await Clothes.deleteMany({ owner: userId });
};

export default {
  getAll,
  getClothesItemById,
  addClothesItem,
  updateClothesItem,
  deleteClothesItem,
  deleteAllClothes,
};
