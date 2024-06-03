"use client"

import type { ImageProps } from "@/utils/gallery/types";
import Head from "next/head";
import Carousel from "@/components/gallery/Carousel";
import { useEffect, useState } from 'react';

async function loader(photoId) {
  const response = await fetch('/api/getGalleryImages');
  const data = await response.json();
  const images: ImageProps[] = data.images;

  const currentPhoto = images.find(
    (img) => img.id === Number(photoId)
  );

  if (!currentPhoto) {
    throw new Response("Not Found", { status: 404 });
  }

  return { currentPhoto };
}

export default function PhotoPage({ params }: { params: { photoId: string } }) {
  const [currentPhoto, setCurrentPhoto] = useState<ImageProps | null>(null);
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState('');

  useEffect(() => {
    async function fetchPhoto() {
      try {
        const photo = await loader(params.photoId);
        setCurrentPhoto(photo.currentPhoto);
        const url = `/gallery/${photo.currentPhoto.public_id}.${photo.currentPhoto.format}`;
        setCurrentPhotoUrl(url);
      } catch (error) {
        console.error('Failed to load photo', error);
      }
    }

    fetchPhoto();
  }, [params.photoId]);

  if (!currentPhoto) return <div>Loading...</div>;

  const index = Number(params.photoId);

  return (
    <>
      <Head>
        <title>Next.js Conf 2022 Photos</title>
        <meta property="og:image" content={currentPhotoUrl} />
        <meta name="twitter:image" content={currentPhotoUrl} />
      </Head>
      <div className="mx-auto max-w-[1960px] p-4">
        <Carousel currentPhoto={currentPhoto} index={index} />
      </div>
    </>
  );
}