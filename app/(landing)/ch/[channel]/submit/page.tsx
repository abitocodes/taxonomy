"use client"

import { useEffect, useState } from "react";
import { useAuthState } from "@/hooks/useAuthState";
import { useRecoilValue } from "recoil";

import { useRouter } from "next/navigation";

import { genreState } from "@/atoms/channelsAtom";
import PageContentLayout from "@/components/reddit/Layout/PageContent";
import About from "@/features/Channel/About";
import NewPostForm from "@/features/Post/PostForm/NewPostForm";
import useChannelData from "@/hooks/useChannelData";
import { useUser } from "@/hooks/useUser";

export default function CreateCommmunityPostPage ({ params }: { params: { genre: string, pid: string } }) {
  const { user, loadingUser } = useUser()
  const router = useRouter();
  const genreStateValue = useRecoilValue(genreState);
  const { loading } = useChannelData();

  useEffect(() => {
    if (!user && !loadingUser && genreStateValue.currentChannel.id) {
      router.push(`/ch/${genreStateValue.currentChannel.id}`);
    }
  }, [user, loadingUser, genreStateValue.currentChannel, router]);

  return (
    <PageContentLayout maxWidth="1060px">
      <div className="p-3.5 border-b border-white">
        <p className="font-semibold">Create a post</p>
      </div>
      {user && <NewPostForm genreId={genreStateValue.currentChannel.id} genreImageURL={genreStateValue.currentChannel.imageURL} user={user} />}
      {genreStateValue.currentChannel && (
        <About genreData={genreStateValue.currentChannel} pt={6} onCreatePage loading={loading} />
      )}
    </PageContentLayout>
  );
};