"use client";

import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import Bridge from "@/components/gallery/Icons/Bridge";
import Logo from "@/components/gallery/Icons/Logo";
import Modal from "@/components/gallery/Modal";
import getBase64ImageUrl from "@/utils/gallery/generateBlurPlaceholder";
import type { ImageProps } from "@/utils/gallery/types";
import { useLastViewedPhoto } from "@/utils/gallery/useLastViewedPhoto";
import { Icons } from "@/components/icons"

export default function GalleryPage({ params }: { params?: { photoId?: string } }) {
  const [images, setImages] = useState([]);
  const photoId = params?.photoId;
  const [lastViewedPhoto, setLastViewedPhoto] = useState<string | null>(null);

  const lastViewedPhotoRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const fetchImages = async () => {
      const response = await fetch('/api/getGalleryImages');
      if (!response.ok) {
        console.error('이미지를 불러오는 데 실패했습니다:', response.statusText);
        return;
      }
      const data = await response.json();
      setImages(data.images);
    };
    fetchImages();
  }, []);

  useEffect(() => {
    if (lastViewedPhoto && !photoId) {
      lastViewedPhotoRef.current?.scrollIntoView({ block: "center" });
      setLastViewedPhoto(null);
    }
  }, [photoId, lastViewedPhoto, setLastViewedPhoto]);

  return (
    <>
      <Head>
        <title>Next.js Conf 2022 Photos</title>
        <meta
          property="og:image"
          content="https://nextjsconf-pics.vercel.app/og-image.png"
        />
        <meta
          name="twitter:image"
          content="https://nextjsconf-pics.vercel.app/og-image.png"
        />
      </Head>
      <main className="mx-auto max-w-[1960px] p-4">
        {photoId && (
          <Modal
            images={images}
            onClose={() => {
              setLastViewedPhoto(photoId);
            }}
          />
        )}
        <div className="columns-1 gap-4 sm:columns-2 xl:columns-3 2xl:columns-4">
          <div className="after:content relative mb-5 flex h-[330px] flex-col items-center justify-end gap-4 overflow-hidden rounded-lg bg-white/10 px-6 p-36 text-center text-white shadow-highlight after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight lg:pt-0">
            <h1 className="font-bold uppercase">
              GALLERY
            </h1>
          </div>
          {images.map(({ id, public_id, format, blurDataUrl }) => (
            <div
              key={id}
              // href={`/gallery/p/${id}`}
              // passHref
            >
              <Image
                src={`/gallery/${public_id}.${format}`}
                alt="Gallery image"
                // placeholder="blur"
                // blurDataURL={blurDataUrl}
                width={720}
                height={480}
                sizes="(max-width: 640px) 100vw,
                  (max-width: 1280px) 50vw,
                  (max-width: 1536px) 33vw,
                  25vw"
              />
            </div>
          ))}
        </div>
      </main>
    </>
  );
};