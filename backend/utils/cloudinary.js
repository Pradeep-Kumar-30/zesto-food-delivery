import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'

const initCloudinary = () => {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error('Missing Cloudinary credentials in environment variables. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET.');
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  })

  console.log('Cloudinary config loaded:', {
    name: process.env.CLOUDINARY_CLOUD_NAME,
    key: process.env.CLOUDINARY_API_KEY ? 'set' : 'missing',
    secret: process.env.CLOUDINARY_API_SECRET ? 'set' : 'missing'
  })
}

initCloudinary()

const uploadOnCloudinary = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file)
    if (fs.existsSync(file)) fs.unlinkSync(file)
    return result.secure_url
  } catch (error) {
    if (fs.existsSync(file)) fs.unlinkSync(file)
    console.error('Cloudinary upload failed:', error)
    throw error
  }
}

export default uploadOnCloudinary