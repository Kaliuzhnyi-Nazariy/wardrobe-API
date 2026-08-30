import { QueryFilter, Types } from "mongoose";
import { SeasonsType } from "../interfaces";
import { Outfit } from "../models/outfit";

const getAllOutfits = async (
  filter: QueryFilter<{
    owner: Types.ObjectId;
    season?: SeasonsType[];
    name?: string;
    clothes?: Types.ObjectId[];
  }>,
) => {
  const data = await Outfit.find(filter).populate({
    path: "clothes",
    select: "name",
  });
  return data;
};

const getOutfitById = async ({
  userId,
  outfitId,
}: {
  userId: string;
  outfitId: string;
}) => {
  const data = await Outfit.findOne({ owner: userId, _id: outfitId }).populate({
    path: "clothes",
    select: "name",
  });
  return data;
};

const addOutfit = async ({
  name,
  season,
  image,
  clothes,
  isOwned = true,
  userId,
}: {
  name: string;
  season: SeasonsType[];
  image?: string;
  clothes: string[];
  isOwned?: boolean;
  userId: string;
}) => {
  return await Outfit.create({
    name,
    season,
    image,
    owner: userId,
    clothes,
    isOwned,
  });
};

const updateOutfit = async ({
  name,
  season,
  image,
  clothes,
  userId,
  outfitId,
}: {
  name: string;
  season: SeasonsType[];
  image?: string;
  clothes: string[];
  userId: string;
  outfitId: string;
}) => {
  return Outfit.findOneAndUpdate(
    { _id: outfitId, owner: userId },
    {
      name,
      season,
      image,
      owner: userId,
      clothes,
    },
  );
};

const deleteOutfit = async ({ outfitId }: { outfitId: string }) => {
  return await Outfit.findByIdAndDelete(outfitId);
};

const deleteAllOutfits = async ({ userId }: { userId: string }) => {
  return await Outfit.deleteMany({ owner: userId });
};

export default {
  getAllOutfits,
  getOutfitById,
  addOutfit,
  updateOutfit,
  deleteOutfit,
  deleteAllOutfits,
};
