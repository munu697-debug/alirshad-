import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary: supports separate keys or single CLOUDINARY_URL
const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME || '';
const apiKey = process.env.CLOUDINARY_API_KEY || '';
const apiSecret = process.env.CLOUDINARY_API_SECRET || '';
const cloudinaryUrl = process.env.CLOUDINARY_URL || '';

if (cloudinaryUrl) {
  cloudinary.config({ secure: true });
} else if (cloudName && apiKey && apiSecret) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
}

export async function uploadToCloudinary(
  fileBufferOrBase64: string,
  folder = 'alirshad'
): Promise<{ url: string; public_id: string } | null> {
  const isConfigured = Boolean(
    process.env.CLOUDINARY_URL ||
    ((process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME) && process.env.CLOUDINARY_API_KEY)
  );
  
  if (!isConfigured) {
    console.warn('Cloudinary environment variables not configured. Returning local/raw URL.');
    return {
      url: fileBufferOrBase64.startsWith('data:') 
        ? fileBufferOrBase64 
        : `https://images.unsplash.com/photo-1544717305-2782549b5136?w=1200&q=80`,
      public_id: 'upload_' + Date.now(),
    };
  }

  try {
    const result = await cloudinary.uploader.upload(fileBufferOrBase64, {
      folder,
      resource_type: 'image',
    });

    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
}

export function getOptimizedImageUrl(url: string, width?: number, height?: number) {
  if (!url) return '';
  if (!url.includes('cloudinary.com')) return url;

  // Insert transformations into Cloudinary URL
  const splits = url.split('/upload/');
  if (splits.length !== 2) return url;

  const transforms: string[] = ['f_auto', 'q_auto'];
  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`, 'c_fill');

  return `${splits[0]}/upload/${transforms.join(',')}/${splits[1]}`;
}

export default cloudinary;
