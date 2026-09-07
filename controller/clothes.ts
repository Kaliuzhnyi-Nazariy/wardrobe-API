import { NextFunction, Request, Response } from "express";
import {
  contrlWrapper,
  errorHandler,
  getParams,
  getUser,
  postPhoto,
} from "../utils";
import service from "../service/clothes";
import { QueryFilter, Types } from "mongoose";
import { SeasonsType, Size } from "../interfaces";

const getClothesById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = getUser(req);

  const clothesId = getParams(req, "clothesId", "Clothes item");

  const result = await service.getClothesItemById(id, clothesId);

  if (!result) return next(errorHandler(404, "Clothes item is not found"));

  res.status(200).json(result);
};

const getAllClothes = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = getUser(req);

  const { season, color, name, size, isOwned = "true" } = req.query;

  const filter: QueryFilter<{
    owner: Types.ObjectId;
    season?: SeasonsType[];
    color?: string[];
    name?: string;
    size?: Size[];
    isOwned?: boolean;
  }> = { owner: id };

  if (season && typeof season === "string") {
    const seasons = season.split(",") as SeasonsType[];
    filter.season = { $in: seasons };
  }
  if (color && typeof color === "string") {
    const colors = color.split(",");
    filter.color = { $in: colors };
  }
  if (name && typeof name === "string") {
    filter.name = { $regex: name, $options: "i" };
  }
  if (size && typeof size === "string") {
    const sizes = size.split(",") as Size[];
    filter.size = { $in: sizes };
  }
  if (isOwned === "true") {
    filter.isOwned = true;
  } else if (isOwned === "false") {
    filter.isOwned = false;
  }

  const result = await service.getAll(filter);

  return res.status(200).json(result);
};

const addClothesItem = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = getUser(req);

  let image = "";

  if (req.file) {
    image = await postPhoto({ file: req.file, userId: id, type: "clothes" });
  }

  const { name, color, season, brand, size, isOwned, storeLink } = req.body;

  const result = await service.addClothesItem({
    name,
    color,
    season,
    image,
    brand,
    size,
    isOwned,
    userId: id,
    storeLink,
  });

  res.status(201).json(result);
};

const updateClothesItem = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = getUser(req);

  const clothesId = getParams(req, "clothesId", "Clothes item");

  const { name, color, season, image, brand, size, isOwned } = req.body;

  let newImage = "";

  if (req.file) {
    newImage = await postPhoto({ file: req.file, userId: id, type: "clothes" });
  }
  const result = await service.updateClothesItem({
    name,
    color,
    season,
    image: newImage ? newImage : image,
    brand,
    size,
    isOwned,
    userId: id,
    clothesId,
  });

  res.status(200).json(result);
};

const deleteClothesItem = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = getUser(req);

  const clothesId = getParams(req, "clothesId", "Clothes item");

  const result = await service.deleteClothesItem(id, clothesId);

  res.status(200).json(result);
};

const cleanClothesStore = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = getUser(req);

  const result = await service.deleteAllClothes(id);

  res.status(200).json(result);
};

export default {
  getClothesById: contrlWrapper(getClothesById),
  getAllClothes: contrlWrapper(getAllClothes),
  addClothesItem: contrlWrapper(addClothesItem),
  updateClothesItem: contrlWrapper(updateClothesItem),
  deleteClothesItem: contrlWrapper(deleteClothesItem),
  cleanClothesStore: contrlWrapper(cleanClothesStore),
};
