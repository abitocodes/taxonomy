import { FC } from "react";
import { BsLink45Deg } from "react-icons/bs";
import { FaReddit } from "react-icons/fa";
import { IoImageOutline } from "react-icons/io5";

import useCreatePost from "@/hooks/useCreatePost";
import { Input } from "@/components/shad/new-york/ui/input"
import { Button } from "@/components/shad/new-york/ui/button"
import { Card } from "@/components/shad/new-york/ui/card";

type CreatePostProps = {};

const CreatePostLink: FC<CreatePostProps> = () => {
  const { onClick } = useCreatePost();
  
    return (
      <Card className="flex justify-evenly items-center h-14 rounded-md border border-gray-300 p-2 mb-4">
        <FaReddit className="text-gray-300 text-9xl mr-4" />
        <Input
          type="text"
          placeholder="Create Post"
          className="placeholder-gray-500 text-sm bg-gray-50 border border-gray-200 h-9 rounded-md mr-4 focus:outline-none focus:border-blue-500 focus:bg-white hover:border-blue-500"
          onClick={onClick}
        />
        <IoImageOutline className="text-gray-400 text-6xl mr-4 cursor-pointer" />
        <BsLink45Deg className="text-gray-400 text-6xl cursor-pointer" />
      </Card>
    );
  };
  export default CreatePostLink;