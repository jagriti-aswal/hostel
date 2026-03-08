import cloudinary from "./cloudinary.js";

export const uploadToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "students",
    });

    return result.secure_url; // ye URL DB me save hoga
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
};