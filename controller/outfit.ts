import { NextFunction, Request, Response } from "express";
import { contrlWrapper, getParams, getUser, postPhoto } from "../utils";
import service from "../service/outfit";
import { QueryFilter, Types } from "mongoose";
import { SeasonsType } from "../interfaces";

const getAllOutfits = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = getUser(req);

  const { season, name, clothes, isOwned = "true" } = req.query;

  const filter: QueryFilter<{
    owner: Types.ObjectId;
    season?: SeasonsType[];
    name?: string;
    clothes?: Types.ObjectId[];
    isOwned?: boolean;
  }> = { owner: id };

  if (season && typeof season === "string") {
    const seasons = season.split(",") as SeasonsType[];
    filter.season = { $in: seasons };
  }
  if (name && typeof name === "string") {
    filter.name = { $regex: name, $options: "i" };
  }
  if (clothes && typeof clothes === "string") {
    const clothesList = clothes.split(",") as unknown as Types.ObjectId[];
    filter.clothes = { $in: clothesList };
  }
  if (isOwned === "true") {
    filter.isOwned = true;
  } else if (isOwned === "false") {
    filter.isOwned = false;
  }

  console.log(filter);

  const result = await service.getAllOutfits(filter);

  res.status(200).json(result);
};

const getOutfitById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = getUser(req);
  const outfitId = getParams(req, "outfitId", "Outfit id");

  const result = await service.getOutfitById({ userId: id, outfitId });

  res.status(200).json(result);
};

const addOutfitItem = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = getUser(req);
  let image = "";
  if (req.file) {
    image = await postPhoto(req.file);
  }
  const { name, clothes, season, isOwned } = req.body;
  // const { name } = req.body;

  // console.log({ name });

  const result = await service.addOutfit({
    name,
    season,
    // image: sentImage ? sentImage : image,
    image,
    clothes,
    isOwned,
    userId: id,
  });
  res.status(201).json(result);

  // res.sendStatus(201);
};

const updateOutfitItem = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = getUser(req);
  const outfitId = getParams(req, "outfitId", "Outfit item");

  let image = "";
  if (req.file) {
    image = await postPhoto(req.file);
  }

  const { name, clothes, season, sentImage } = req.body;
  const result = await service.updateOutfit({
    name,
    season,
    image: sentImage ? sentImage : image,
    clothes,
    userId: id,
    outfitId,
  });
  res.status(201).json(result);
};

const deleteOutfitItem = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const outfitId = getParams(req, "outfitId", "Outfit item");
  const result = await service.deleteOutfit({ outfitId });
  res.status(200).json(result);
};

const cleanOutfitStore = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = getUser(req);
  const result = await service.deleteAllOutfits({ userId: id });
  res.status(200).json(result);
};

export default {
  getAllOutfits: contrlWrapper(getAllOutfits),
  getOutfitById: contrlWrapper(getOutfitById),
  addOutfitItem: contrlWrapper(addOutfitItem),
  updateOutfitItem: contrlWrapper(updateOutfitItem),
  deleteOutfitItem: contrlWrapper(deleteOutfitItem),
  cleanOutfitStore: contrlWrapper(cleanOutfitStore),
};
