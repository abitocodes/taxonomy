import { FC, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import PostLoader from "@/components/reddit/Loader/PostLoader";
import { supabase } from "@/utils/supabase/client";
import usePosts from "@/hooks/usePosts";
import { Channel } from "@/types/channelsState";
import { Post } from "@prisma/client";
import PostItem from "./PostItem";
import { RecoilRoot } from "recoil";
import { PostWith } from "@/types/posts";
import { useRecoilState } from "recoil";
import { sessionAndPublicUserState } from "@/atoms/sessionAndUserAtom";

type PostsProps = {
  channelData?: Channel;
  userId?: string;
  loadingUser: boolean;
};

const Posts: FC<PostsProps> = ({ channelData, userId, loadingUser }) => {
  const _sessionAndPublicUserState = useRecoilState(sessionAndPublicUserState);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { postStateValue, setPostsStateValue, onVote, onDeletePost } = usePosts(channelData!);

  const onSelectPost = (post: PostWith, postIdx: number) => {
    setPostsStateValue((prev) => ({
      ...prev,
      selectedPost: { ...post, postIdx },
    }));
    router.push(`/ch/${channelData?.id!}/comments/${post.id}`);
  };

  useEffect(() => {
    if (postStateValue.postsCache[channelData?.id!] && !postStateValue.postUpdateRequired) {
      setPostsStateValue((prev) => ({
        ...prev,
        posts: postStateValue.postsCache[channelData?.id!],
      }));
      return;
    }

    getPosts();
  }, [channelData, postStateValue.postUpdateRequired]);

  const getPosts = async () => {
    setLoading(true);
    try {
      let { data: posts, error } = await supabase
        .from('posts')
        .select(`
          *,
          labels:labels(*),
          creator:users(*)
        `)
        .eq('channelId', channelData?.id)
        .order('createdAt', { ascending: false });
  
      if (error) throw error;
  
      setPostsStateValue((prev) => ({
        ...prev,
        posts: posts as PostWith[], // 여기서 posts는 labels와 creator를 포함해야 합니다.
        postsCache: {
          ...prev.postsCache,
          [channelData?.id!]: posts as PostWith[],
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
          {postStateValue.posts.map((post: PostWith, index) => (
            <PostItem
              key={post.id}
              post={post}
              onVote={onVote} // 'vote'는 적절한 숫자 값으로 설정해야 합니다.
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