import cloudinary from "cloudinary";

const updatedCloudinary = cloudinary.v2;

updatedCloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY,
  secure: true,
});

export default updatedCloudinary;
