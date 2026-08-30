import { QueryFilter, Types } from "mongoose";
import { Clothes } from "../models/clothes";
import { Outfit } from "../models/outfit";
import clothes from "./clothes";

type DateData = {
  createdAt: Date;
  [key: string]: any; // Pozwala na inne właściwości z Mongoose (np. _id, name)
};

const getWishlist = async (filter: any) => {
  const resOutfit: DateData[] = [];
  const resClothes: DateData[] = [];

  console.log({ filter });

  if (filter.isClothes) {
    const clothesQuery: any = {
      ownerId: filter.ownerId,
      isOwned: filter.isOwned,
    };

    if (filter.name) {
      clothesQuery.name = filter.name;
    }

    if (filter.season && filter.season.length > 0) {
      clothesQuery.season = { $in: filter.season };
    }

    if (filter.size && filter.size.length > 0) {
      clothesQuery.size = { $in: filter.size };
    }

    if (filter.color) {
      if (filter.color.$in && filter.color.$in.length > 0) {
        clothesQuery.color = filter.color;
      } else if (Array.isArray(filter.color) && filter.color.length > 0) {
        clothesQuery.color = { $in: filter.color };
      }
    }

    console.log({ clothesQuery });

    const clothesData = await Clothes.find(clothesQuery).lean();
    resClothes.push(...clothesData);
  }

  if (filter.isOutfit) {
    const outfitQuery: any = {
      ownerId: filter.ownerId,
      isOwned: filter.isOwned,
    };

    if (filter.name) {
      outfitQuery.name = filter.name;
    }

    if (filter.clothes && filter.clothes.length > 0) {
      outfitQuery.clothes = { $in: filter.clothes };
    }

    if (filter.clothesIds && filter.clothesIds.length > 0) {
      outfitQuery.clothesIds = { $in: filter.clothesIds };
    }

    if (filter.season && filter.season.length > 0) {
      outfitQuery.season = { $in: filter.season };
    }

    // console.log(outfitQuery);

    const outfitData = await Outfit.find(outfitQuery).lean().populate({
      path: "clothes",
      select: "name",
    });
    resOutfit.push(...outfitData);
  }

  const combinedAndSorted = [
    ...resOutfit.map((item) => ({ ...item, type: "outfit" as const })),
    ...resClothes.map((item) => ({ ...item, type: "clothes" as const })),
  ].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return combinedAndSorted;
};

const getWishlistItemById = async ({
  userId,
  itemId,
}: {
  userId: string;
  itemId: string;
}) => {
  return await Clothes.findOne({ owner: userId, _id: itemId });
};

const addItemToList = async ({
  userId,
  name,
  color,
  season,
  image,
  brand,
  size,
  isOwned,
}: {
  name: string;
  color: string[];
  season: ("winter" | "spring" | "fall" | "summer")[];
  image?: string;
  brand: string;
  size: "s" | "m" | "l" | "xl" | "2xl" | "3xl";
  isOwned: boolean;
  userId: string;
}) => {
  return await Clothes.create({
    owner: userId,
    name,
    color,
    season,
    image,
    brand,
    size,
    isOwned,
  });
};

const updateWishlistItem = async ({
  itemId,
  userId,
  name,
  color,
  season,
  image,
  brand,
  size,
  isOwned,
}: {
  itemId: string;
  userId: string;
  name: string;
  color: string[];
  season: ("summer" | "fall" | "winter" | "spiring")[];
  image?: string;
  brand: string;
  size: "s" | "m" | "l" | "xl" | "2xl" | "3xl";
  isOwned: boolean;
}) => {
  return await Clothes.findByIdAndUpdate(
    { owner: userId, _id: itemId },
    {
      name,
      color,
      season,
      image,
      brand,
      size,
      isOwned,
    },
  );
};

const updateOwnership = async (userId: string, clothesId: string) => {
  return await Clothes.findOneAndUpdate(
    { owner: userId, id: clothesId },
    [{ $set: { isOwned: { $not: "$isOwned" } } }],
    { new: true },
  );
};

const deleteItem = async ({
  userId,
  itemId,
}: {
  userId: string;
  itemId: string;
}) => {
  return await Clothes.findOneAndDelete({ owner: userId, _id: itemId });
};

export default {
  getWishlist,
  getWishlistItemById,
  addItemToList,
  updateWishlistItem,
  updateOwnership,
  deleteItem,
};
