import { UploadApiResponse } from "cloudinary";
import cloudinary from "../lib/cloudinary";
import { errorHandler } from "./errorHandler";

export const postPhoto = async ({
  file,
  userId,
  type,
}: {
  file: Express.Multer.File;
  userId: string;
  type: "clothes" | "outfit";
}): Promise<string> => {
  if (!file) throw errorHandler(400, "No file was sent");

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "wardrobe_catalog",
        filename_override: file.originalname,
        public_id: `wardrobe_${Date.now()}_${file.originalname.split(".")[0]}`,
        overwrite: true,
        context: {
          userId,
          type,
        },
      },
      (error, result) => {
        if (error || !result) {
          console.error("Cloudinary Error: ", error);
          return reject(errorHandler(500, "Cloudinary operation failed"));
        }

        resolve(result.secure_url);
      },
    );

    uploadStream.end(file.buffer);
  });
};

export const deletePhoto = async (link: string) => {
  if (!link) throw errorHandler(404, "id is not found");

  try {
    const parts = link.split("/");
    const folderIndex = parts.indexOf("wardrobe_catalog");

    if (folderIndex === -1) {
      throw errorHandler(400, "Invalid Cloudinary URL structure");
    }

    const fullPathWithExtension = parts.slice(folderIndex).join("/");

    const id = fullPathWithExtension.split(".")[0];
    await cloudinary.uploader.destroy(id);
  } catch (error) {
    console.error(error);
    return;
  }
};

export const deleteAllPhotos = async ({
  userId,
  type,
}: {
  userId: string;
  type?: "outfit" | "clothes";
}) => {
  const expression = !!type
    ? `context.userId:${userId} AND context.type:${type}`
    : `context.userId:${userId}`;
  try {
    const search = (await cloudinary.search
      .expression(expression)
      .execute()) as { resources: UploadApiResponse[] };

    const publicIds = search.resources.map((resource) => resource.public_id);

    if (publicIds.length === 0) return;

    await cloudinary.api.delete_all_resources(publicIds);

    return;
  } catch (error) {
    console.error(error);
    return error;
  }
};
