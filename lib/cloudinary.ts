import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };

export const CLOUDINARY_CONFIG = {
  cloudName: 'koodos',
  baseUrl: 'https://res.cloudinary.com/koodos',
}

export function buildCloudinaryUrl(
  publicId: string,
  options: {
    width?: number
    height?: number
    crop?: string
    quality?: string | number
    format?: string
    folder?: string
  } = {}
) {
  const {
    width = 400,
    height = 225,
    crop = 'fill',
    quality = 'auto',
    format = 'auto',
    folder = 'articles'
  } = options

  const transformations = [
    crop && `c_${crop}`,
    width && `w_${width}`,
    height && `h_${height}`,
    quality && `q_${quality}`,
    format && `f_${format}`
  ].filter(Boolean).join(',')

  return `${CLOUDINARY_CONFIG.baseUrl}/image/upload/${transformations}/v1/${folder}/${publicId}`
}

export function getArticleImageUrl(articleId: string, options?: Parameters<typeof buildCloudinaryUrl>[1]) {
  return buildCloudinaryUrl(articleId, { folder: 'articles', ...options })
}

export function getBannerImageUrl(bannerId: string, options?: Parameters<typeof buildCloudinaryUrl>[1]) {
  return buildCloudinaryUrl(bannerId, { folder: 'banners', ...options })
}

export function getUserAvatarUrl(userId: string, options?: Parameters<typeof buildCloudinaryUrl>[1]) {
  return buildCloudinaryUrl(userId, { folder: 'avatars', width: 100, height: 100, crop: 'thumb', ...options })
}