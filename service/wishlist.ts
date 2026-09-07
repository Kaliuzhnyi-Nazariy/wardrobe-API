import { QueryFilter, Types } from "mongoose";
import { Clothes } from "../models/clothes";
import { Outfit } from "../models/outfit";
import clothes from "./clothes";
import { SeasonsType, Size } from "../interfaces";

type DateData = {
  createdAt: Date;
  [key: string]: any; // Pozwala na inne właściwości z Mongoose (np. _id, name)
};

export interface WishlistFilters {
  ownerId: Types.ObjectId;
  isOwned: boolean;
  isClothes: boolean;
  isOutfit: boolean;
  name?: { $regex: string; $options: string };
  color?: { $in: string[] };
  season?: { $in: string[] };
  size?: { $in: Size[] };
  clothes?: { $in: Types.ObjectId[] };
}

// const getWishlist = async (filter: any) => {
const getWishlist = async (
  filter: QueryFilter<{
    ownerId: Types.ObjectId;
    season?: SeasonsType[];
    name?: string;
    clothesIds?: Types.ObjectId[];
    isClothes?: boolean;
    isOutfit?: boolean;
    isOwned?: boolean;
    color?: string[];
    size?: Size[];
  }>,
) => {
  const resOutfit: DateData[] = [];
  const resClothes: DateData[] = [];

  // console.log({ filter });

  if (filter.isClothes) {
    const clothesQuery: any = {
      ownerId: filter.ownerId,
      isOwned: filter.isOwned,
    };

    if (filter.name) {
      clothesQuery.name = filter.name;
    }

    if (filter.season) {
      clothesQuery.season = filter.season;
      // clothesQuery.season = { $in: filter.season };
    }

    if (filter.size) {
      clothesQuery.size = filter.size;
      // clothesQuery.size = { $in: filter.size };
    }

    // if (filter.season && filter.season.length > 0) {
    //   clothesQuery.season = { $in: filter.season };
    // }

    // if (filter.size && filter.size.length > 0) {
    //   clothesQuery.size = { $in: filter.snize };
    // }

    // if (filter.color) {
    //   if (filter.color.$in && filter.color.$in.length > 0) {
    //     clothesQuery.color = filter.color;
    //   } else if (Array.isArray(filter.color) && filter.color.length > 0) {
    //     clothesQuery.color = { $in: filter.color };
    //   }
    // }

    // console.log({ clothesQuery });

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

    // if (filter.clothesIds && filter.clothesIds.length > 0) {
    //   outfitQuery.clothesIds = { $in: filter.clothesIds };
    // }

    if (filter.clothesIds) {
      outfitQuery.clothesIds = filter.clothesIds;
    }

    // if (filter.season && filter.season.length > 0) {
    //   outfitQuery.season = { $in: filter.season };
    // }
    if (filter.season) {
      outfitQuery.season = filter.season;
      // clothesQuery.season = { $in: filter.season };
    }

    // console.log(outfitQuery);

    const outfitData = await Outfit.find(outfitQuery)
      .lean()
      .populate({
        path: "clothes",
        select: ["name", "isOwned"],
      });
    resOutfit.push(...outfitData);
  }

  const combinedAndSorted = [
    ...resOutfit.map((item) => ({ ...item, type: "outfit" as const })),
    ...resClothes.map((item) => ({ ...item, type: "clothes" as const })),
  ].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  // if (filter.isClothes) {
  //   const clothesQuery: any = {
  //     ownerId: filter.ownerId,
  //     isOwned: filter.isOwned,
  //   };

  //   if (filter.name) clothesQuery.name = filter.name;
  //   if (filter.color) clothesQuery.color = filter.color;

  //   // POPRAWKA: Dostęp do .$in.length zamiast bezpośrednio .length
  //   if (filter.season?.$in && filter.season.$in.length > 0) {
  //     clothesQuery.season = filter.season;
  //   }
  //   // POPRAWKA: Dostęp do .$in.length zamiast bezpośrednio .length
  //   if (filter.size?.$in && filter.size.$in.length > 0) {
  //     clothesQuery.size = filter.size;
  //   }

  //   const clothesData = await Clothes.find(clothesQuery).lean();
  //   resClothes.push(...clothesData);
  // }

  // // 2. Pobieranie zestawów (Outfit)
  // if (filter.isOutfit) {
  //   const outfitQuery: any = {
  //     ownerId: filter.ownerId,
  //     isOwned: filter.isOwned,
  //   };

  //   if (filter.name) outfitQuery.name = filter.name;

  //   // POPRAWKA: Zmiana filter.clothesIds na filter.clothes oraz sprawdzenie .$in.length
  //   if (filter.clothes?.$in && filter.clothes.$in.length > 0) {
  //     outfitQuery.clothes = filter.clothes;
  //   }
  //   // POPRAWKA: Dostęp do .$in.length zamiast bezpośrednio .length
  //   if (filter.season?.$in && filter.season.$in.length > 0) {
  //     outfitQuery.season = filter.season;
  //   }

  //   const outfitData = await Outfit.find(outfitQuery).lean().populate({
  //     path: "clothes",
  //     select: "name",
  //   });
  //   resOutfit.push(...outfitData);
  // }

  // // 3. Łączenie i sortowanie wyników
  // const combinedAndSorted = [
  //   ...resOutfit.map((item) => ({ ...item, type: "outfit" as const })),
  //   ...resClothes.map((item) => ({ ...item, type: "clothes" as const })),
  // ].sort(
  //   (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  // );

  return combinedAndSorted;
};

const getWishlistItemById = async ({
  userId,
  itemId,
}: {
  userId: string;
  itemId: string;
}) => {
  // return await Clothes.findOne({ owner: userId, _id: itemId });

  const clothesItem = await Clothes.findOne({
    owner: userId,
    _id: itemId,
  }).lean();

  const outfitItem = await Outfit.findOne({
    owner: userId,
    _id: itemId,
  })
    .populate({ path: "clothes", select: ["name", "isOwned"] })
    // .populate({ path: "clothes", select: "name" })
    .lean();

  return (
    (clothesItem && { ...clothesItem, type: "clothes" }) ||
    (outfitItem && { ...outfitItem, type: "outfit" })
  );
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
  storeLink,
}: {
  name: string;
  color: string[];
  season: ("winter" | "spring" | "fall" | "summer")[];
  image?: string;
  brand: string;
  size: "s" | "m" | "l" | "xl" | "2xl" | "3xl";
  isOwned: boolean;
  userId: string;
  storeLink?: string;
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
    storeLink,
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
  const updatedClothes = await Clothes.findOneAndUpdate(
    { owner: userId, _id: clothesId },
    { $set: { isOwned: true } },
    { returnDocument: "after" },
  );

  if (updatedClothes) {
    return updatedClothes;
  }

  return await Outfit.findOneAndUpdate(
    { owner: userId, _id: clothesId },
    { $set: { isOwned: true } },
    { returnDocument: "after" },
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
