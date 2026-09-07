import { NextFunction, Request, Response } from "express";
import { contrlWrapper, getParams, getUser } from "../utils";
import service from "../service/wishlist";
import { QueryFilter, Types } from "mongoose";
import { SeasonsType, Size } from "../interfaces";

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

const getWishlist = async (req: Request, res: Response, next: NextFunction) => {
  const id = getUser(req);
  const { clothes, outfit, clothesIds, season, color, name, size } = req.query;

  // console.log({ clothesIds });

  // console.log({ name });

  const turningVal = (val: any): boolean => {
    if (val === undefined) return true;
    const finalVal = Array.isArray(val) ? val[0] : val;
    return finalVal !== "false";
  };

  const isClothesSelected = clothes !== undefined ? turningVal(clothes) : true;
  const isOutfitSelected = outfit !== undefined ? turningVal(outfit) : true;

  // console.log(season);

  // const filters: any = {
  //   ownerId: typeof id === "string" ? new Types.ObjectId(id) : id,
  //   isOwned: false,
  // isClothes: isClothesSelected,
  // isOutfit: isOutfitSelected,
  // };

  const filters: QueryFilter<{
    ownerId: Types.ObjectId;
    season?: SeasonsType[];
    name?: string;
    clothesIds?: Types.ObjectId[];
    isClothes?: boolean;
    isOutfit?: boolean;
    isOwned?: boolean;
    color?: string[];
    size?: Size[];
  }> = {
    ownerId: id,
    isClothes: isClothesSelected,
    isOutfit: isOutfitSelected,
    isOwned: false,

    // season: [],
  };

  // const filters: WishlistFilters = {
  //   ownerId: id as unknown as Types.ObjectId,
  //   isClothes: isClothesSelected,
  //   isOutfit: isOutfitSelected,
  //   isOwned: false,
  // };

  if (name && typeof name === "string") {
    filters.name = { $regex: name, $options: "i" };
  }
  if (color && typeof color === "string") {
    const colors =
      color.split(",").map((c) => c.trim()) ??
      color.split(", ").map((c) => c.trim()) ??
      color.split(" ").map((c) => c.trim());

    filters.color = { $in: colors };
  }
  if (season && typeof season == "string") {
    const seasons = season.split(",") as SeasonsType[];
    filters.season = { $in: seasons };
    // filters.season = seasons;
  }
  if (size && typeof size === "string") {
    const sizes = size.split(",") as Size[];
    // console.log({ sizes });
    filters.size = { $in: sizes };
  }

  if (clothesIds && typeof clothesIds === "string") {
    // console.log({ filters });
    // if (color && typeof color === "string") {
    //   filters.color = color.split(",");
    // }

    filters.clothes = clothesIds
      .split(",")
      .map((id) => new Types.ObjectId(id.trim()));
  }

  const result = await service.getWishlist(filters);

  res.status(200).json(result);
};

const getWishlistItemById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = getUser(req);

  const itemId = getParams(req, "itemId", "Item id");

  const result = await service.getWishlistItemById({ userId: id, itemId });

  res.status(200).json(result);
};

const addToWishlist = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = getUser(req);

  const { name, color, season, image, brand, size } = req.body;

  const result = await service.addItemToList({
    name,
    color,
    season,
    image,
    brand,
    size,
    isOwned: true,
    userId: id,
  });

  res.status(201).json(result);
};

const updateOwnership = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = getUser(req);

  const clothesId = getParams(req, "itemId", "Item id");
  console.log({ clothesId });

  const result = await service.updateOwnership(id, clothesId);

  res.status(200).json(result);
};

const updateWishlistItem = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = getUser(req);

  const itemId = getParams(req, "itemId", "Item id");

  const { name, color, season, image, brand, size } = req.body;

  const result = await service.updateWishlistItem({
    name,
    color,
    season,
    image,
    brand,
    size,
    isOwned: true,
    userId: id,
    itemId,
  });

  res.status(200).json(result);
};

const removeFromWishlist = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = getUser(req);

  const itemId = getParams(req, "itemId", "Item id");

  const result = await service.deleteItem({ userId: id, itemId });

  res.status(200).json(result);
};

export default {
  getWishlist: contrlWrapper(getWishlist),
  getWishlistItemById: contrlWrapper(getWishlistItemById),
  addToWishlist: contrlWrapper(addToWishlist),
  updateWishlistItem: contrlWrapper(updateWishlistItem),
  updateOwnership: contrlWrapper(updateOwnership),
  removeFromWishlist: contrlWrapper(removeFromWishlist),
};
