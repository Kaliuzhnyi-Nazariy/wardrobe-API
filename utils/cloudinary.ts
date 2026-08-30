import cloudinary from "../lib/cloudinary";
import { errorHandler } from "./errorHandler";

export const postPhoto = async (file: Express.Multer.File): Promise<string> => {
  if (!file) throw errorHandler(400, "No file was sent");

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "wardrobe_catalog",
        filename_override: file.originalname,
        public_id: `wardrobe_${Date.now()}_${file.originalname.split(".")[0]}`,
        overwrite: true,
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

export const deletePhoto = (id: string) => {
  if (!id) throw errorHandler(404, "id is not found");

  try {
    cloudinary.uploader.destroy(id);
  } catch (error) {
    console.error(error);
    return;
  }
};
