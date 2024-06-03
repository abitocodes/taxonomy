import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

type ImageProps = {
  id: number;
  height: number;
  width: number;
  public_id: string;
  format: string;
  blurDataUrl?: string;
};

export async function GET(req: Request, res: Response) {
  const directoryPath = path.join(process.cwd(), 'public', 'gallery');
  try {
    const files = fs.readdirSync(directoryPath);
    const images: ImageProps[] = files.map((file, index) => {
      const [public_id, format] = file.split('.');
      // Dummy values for width and height, replace with actual dimensions if needed
      return {
        id: index,
        height: 480, // 예시 높이
        width: 720,  // 예시 너비
        public_id,
        format,
      };
    });
    return Response.json({
      statusCode: 200,
      message: '200 OK',
      images: images
    });
  } catch (error) {
    return Response.json({
      statusCode: 500,
      message: 'An error occurred while retrieving posts'
  });
  }
}