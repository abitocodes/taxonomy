import { FC } from "react";
import { FaReddit } from "react-icons/fa";

import useGenreModal from "@/hooks/useGenreModal";
import useCreatePost from "@/hooks/useCreatePost";
import { Button } from "@/components/ui/button";

const PersonalHome: FC = () => {
  const { onClick } = useCreatePost();
  const { openModal } = useGenreModal();

  return (
    <div className="flex flex-col rounded-md cursor-pointer border border-gray-300 sticky">
      <div
        className="flex items-end justify-between p-[6px_10px] bg-blue-500 h-8.5 rounded-t-md font-semibold"
        style={{ backgroundImage: "url(/images/redditPersonalHome.png)", backgroundSize: "cover" }}
      ></div>
      <div className="flex flex-col p-3">
        <div className="flex items-center mb-2">
          <FaReddit className="text-[#FF4500] text-12.5 mr-2" />
          <span className="font-semibold text-lg">Home</span>
        </div>
        <div className="space-y-3">
          <span className="text-xs">Your personal Reddit frontpage, built for you.</span>
          <Button className="h-7.5 bg-[#FF4500] rounded-md text-white">
            개발자 커피 사주기
          </Button>
        </div>
      </div>
    </div>
  );
};
export default PersonalHome;