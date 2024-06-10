import { useState, useEffect } from "react"
import { PostWith } from "@/types/posts"

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"

interface UserPostsBoardProps {
  userId: string;
}

export const UserPostsBoard = ({ userId }: UserPostsBoardProps) => {
  const [loading, setLoading] = useState(false);
  const [postsStateValue, setPostStateValue] = useState<PostWith[]>([]);

  const getUserPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/getUserPosts?userId=${userId}`);
      const data = await response.json();
      const posts = data.posts;
      console.log("posts: ", posts)
      setPostStateValue(posts as PostWith[]);
    } catch (error: any) {
      console.error("getUserPosts error", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserPosts();
  }, []);

  return (
    <Table className="w-full">
        <TableHeader>
            <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>제목</TableHead>
                <TableHead>송신일</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {loading ? (
                <TableRow>
                    <TableCell colSpan={4} className="text-center">Loading...</TableCell>
                </TableRow>
            ) : (
                postsStateValue.map((post: PostWith, index: number) => (
                    <TableRow key={index}>
                        <TableCell className="font-medium">{post.id}</TableCell>
                        <TableCell>{post.title}</TableCell>
                        <TableCell>{post.createdAt.toISOString()}</TableCell>
                    </TableRow>
                ))
            )}
        </TableBody>
    </Table>
)
                }