import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilValue } from "recoil";

import { Box, Text } from "@chakra-ui/react";
import { NextPage } from "next";
import { useRouter } from "next/router";

import { genreState } from "@/atoms/genresAtom";
import PageContentLayout from "@/components/Layout/PageContent";
import About from "@/features/Genre/About";
import NewPostForm from "@/features/Post/PostForm/NewPostForm";
import { auth } from "@/firebase/clientApp";
import useGenreData from "@/hooks/useGenreData";

const CreateCommmunityPostPage: NextPage = () => {
  const [user, loadingUser] = useAuthState(auth);
  const router = useRouter();
  const genreStateValue = useRecoilValue(genreState);
  const { loading } = useGenreData();

  useEffect(() => {
    if (!user && !loadingUser && genreStateValue.currentGenre.id) {
      router.push(`/r/${genreStateValue.currentGenre.id}`);
    }
  }, [user, loadingUser, genreStateValue.currentGenre, router]);

  // console.log("HERE IS USER", user, loadingUser);

  return (
    <PageContentLayout maxWidth="1060px">
      <>
        <Box p="14px 0px" borderBottom="1px solid" borderColor="white">
          <Text fontWeight={600}>Create a post</Text>
        </Box>
        {user && <NewPostForm genreId={genreStateValue.currentGenre.id} genreImageURL={genreStateValue.currentGenre.imageURL} user={user} />}
      </>
      {genreStateValue.currentGenre && (
        <>
          <About genreData={genreStateValue.currentGenre} pt={6} onCreatePage loading={loading} />
        </>
      )}
    </PageContentLayout>
  );
};

export default CreateCommmunityPostPage;
