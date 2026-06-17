import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function uploadImage(base64Image, folder = "raftel/posts") {
  const result = await cloudinary.uploader.upload(base64Image, {
    folder,
    max_bytes: 5 * 1024 * 1024,
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  })
  return result.secure_url
}

export default cloudinary
