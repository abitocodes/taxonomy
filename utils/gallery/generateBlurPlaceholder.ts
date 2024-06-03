import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const cache = new Map<string, string>();

export default async function getBase64ImageUrl(
  image: { public_id: string; format: string }
): Promise<string> {
  const cacheKey = `${image.public_id}.${image.format}`;
  let url = cache.get(cacheKey);
  if (url) {
    return url;
  }

  const imagePath = path.join(process.cwd(), 'public', 'gallery', `${image.public_id}.${image.format}`);
  try {
    const buffer = fs.readFileSync(imagePath);
    const blurredImage = await sharp(buffer)
      .resize(10, null) // 리사이즈하여 블러 효과 적용
      .jpeg({ quality: 30 }) // 품질을 낮추어 블러 효과 강화
      .toBuffer();

    url = `data:image/jpeg;base64,${blurredImage.toString('base64')}`;
    cache.set(cacheKey, url);
    return url;
  } catch (error) {
    console.error('이미지 처리 중 오류 발생:', error);
    throw new Error('이미지를 처리하는 데 실패했습니다.');
  }
}