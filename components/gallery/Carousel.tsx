"use client"

import Image from "next/image";
import { useRouter } from "next/navigation";
import useKeypress from "react-use-keypress";
import type { ImageProps } from "@/utils/gallery/types";
import { useLastViewedPhoto } from "@/utils/gallery/useLastViewedPhoto";
import SharedModal from "@/components/gallery/SharedModal";
import { useState } from 'react';

export default function Carousel({
  index,
  currentPhoto,
}: {
  index: number;
  currentPhoto: ImageProps;
}) {
  const router = useRouter();
  const [lastViewedPhoto, setLastViewedPhoto] = useState<number | null>(null);

  function closeModal() {
    setLastViewedPhoto(currentPhoto.id);
    router.push("/");
  }

  function changePhotoId(newVal: number) {
    return newVal;
  }

  useKeypress("Escape", () => {
    closeModal();
  });

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <button
        className="absolute inset-0 z-30 cursor-default bg-black backdrop-blur-2xl"
        onClick={closeModal}
      >
      <Image
        src={currentPhoto.blurDataUrl || '/default-image.jpg'}  // 대체 이미지 URL을 제공
        className="pointer-events-none h-full w-full"
        alt="blurred background"
        fill
        priority={true}
      />
      </button>
      <SharedModal
        index={index}
        changePhotoId={changePhotoId}
        currentPhoto={currentPhoto}
        closeModal={closeModal}
        navigation={false}
      />
    </div>
  );
}
