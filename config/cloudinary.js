import cloudinary from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: "dnfelxq6z",
  api_key: "343281982817721",
  api_secret: "f9qsxSfOE2hUnpBKk76w_fSqESU",
});

const uploadOnCloud = (file, folder) => {
  return new Promise((resolve) => {
    cloudinary.uploader.upload(
      file,
      (result) => {
        resolve({
          url: result.url,
          id: result.public_id,
        });
      },
      {
        resource_type: "auto",
        folder: folder,
      }
    );
  });
};
export { uploadOnCloud };
