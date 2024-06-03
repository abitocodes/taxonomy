import { FC, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import PostLoader from "@/components/reddit/Loader/PostLoader";
import { supabase } from "@/utils/supabase/client";
import usePosts from "@/hooks/usePosts";
import { Genre } from "@/types/genresState";
import { Post } from "@prisma/client";
import PostItem from "./PostItem";
import { RecoilRoot } from "recoil";

type PostsProps = {
  genreData?: Genre;
  userId?: string;
  loadingUser: boolean;
};

const Posts: FC<PostsProps> = ({ genreData, userId, loadingUser }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { postStateValue, setPostsStateValue, onVote, onDeletePost } = usePosts(genreData!);

  const onSelectPost = (post: Post, postIdx: number) => {
    setPostsStateValue((prev) => ({
      ...prev,
      selectedPost: { ...post, postIdx },
    }));
    router.push(`/g/${genreData?.id!}/comments/${post.id}`);
  };

  useEffect(() => {
    if (postStateValue.postsCache[genreData?.id!] && !postStateValue.postUpdateRequired) {
      setPostsStateValue((prev) => ({
        ...prev,
        posts: postStateValue.postsCache[genreData?.id!],
      }));
      return;
    }

    getPosts();
  }, [genreData, postStateValue.postUpdateRequired]);

  const getPosts = async () => {
    setLoading(true);
    try {
      let { data: posts, error } = await supabase
        .from('posts')
        .select('*')
        .eq('genreId', genreData?.id)
        .order('createdAt', { ascending: false });

      if (error) throw error;

      setPostsStateValue((prev) => ({
        ...prev,
        posts: posts as Post[],
        postsCache: {
          ...prev.postsCache,
          [genreData?.id!]: posts as Post[],
        },
        postUpdateRequired: false,
      }));
    } catch (error: any) {
      console.error("getPosts error", error.message);
    }
    setLoading(false);
  };

  return (
    <>
      {loading ? (
        <PostLoader />
      ) : (
        <div className="flex flex-col">
          {postStateValue.posts.map((post: Post, index) => (
            <PostItem
              key={post.id}
              post={post}
              onVote={onVote}
              onDeletePost={onDeletePost}
              userVoteValue={postStateValue.postVotes.find((item) => item.postId === post.id)?.voteValue}
              userIsCreator={userId === post.creatorId}
              onSelectPost={onSelectPost}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default Posts;

// useEffect(() => {
//   if (postStateValue.postsCache[genreData?.id!] && !postStateValue.postUpdateRequired) {
//     setPostsStateValue((prev) => ({
//       ...prev,
//       posts: postStateValue.postsCache[genreData?.id!],
//     }));
//     return;
//   }

//   getPosts();
//   /**
//    * REAL-TIME POST LISTENER
//    * IMPLEMENT AT FIRST THEN CHANGE TO POSTS CACHE
//    *
//    * UPDATE - MIGHT KEEP THIS AS CACHE IS TOO COMPLICATED
//    *
//    * LATEST UPDATE - FOUND SOLUTION THAT MEETS IN THE MIDDLE
//    * CACHE POST DATA, BUT REMOVE POSTVOTES CACHE AND HAVE
//    * REAL-TIME LISTENER ON POSTVOTES
//    */
//   // const postsQuery = query(
//   //   collection(firestore, "posts"),
//   //   where("genreId", "==", genreData.id),
//   //   orderBy("createdAt", "desc")
//   // );
//   // const unsubscribe = onSnapshot(postsQuery, (querySnaption) => {
//   //   const posts = querySnaption.docs.map((post) => ({
//   //     id: post.id,
//   //     ...post.data(),
//   //   }));
//   //   setPostItems((prev) => ({
//   //     ...prev,
//   //     posts: posts as [],
//   //   }));
//   //   setLoading(false);
//   // });

//   // // Remove real-time listener on component dismount
//   // return () => unsubscribe();
//   // eslint-disable-next-line react-hooks/exhaustive-deps
// }, [genreData, postStateValue.postUpdateRequired]);