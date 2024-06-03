"use client"

import { useEffect, useState } from "react";
import { useAuthState } from "@/hooks/useAuthState";
import { useRecoilValue } from "recoil";

import { useRouter } from "next/navigation";

import { genreState } from "@/atoms/genresAtom";
import PageContentLayout from "@/components/reddit/Layout/PageContent";
import About from "@/features/Genre/About";
import NewPostForm from "@/features/Post/PostForm/NewPostForm";
import useGenreData from "@/hooks/useGenreData";
import { useUser } from "@/hooks/useUser";

export default function CreateCommmunityPostPage ({ params }: { params: { genre: string, pid: string } }) {
  const { user, loadingUser } = useUser()
  const router = useRouter();
  const genreStateValue = useRecoilValue(genreState);
  const { loading } = useGenreData();

  useEffect(() => {
    if (!user && !loadingUser && genreStateValue.currentGenre.id) {
      router.push(`/g/${genreStateValue.currentGenre.id}`);
    }
  }, [user, loadingUser, genreStateValue.currentGenre, router]);

  return (
    <PageContentLayout maxWidth="1060px">
      <div className="p-3.5 border-b border-white">
        <p className="font-semibold">Create a post</p>
      </div>
      {user && <NewPostForm genreId={genreStateValue.currentGenre.id} genreImageURL={genreStateValue.currentGenre.imageURL} user={user} />}
      {genreStateValue.currentGenre && (
        <About genreData={genreStateValue.currentGenre} pt={6} onCreatePage loading={loading} />
      )}
    </PageContentLayout>
  );
};