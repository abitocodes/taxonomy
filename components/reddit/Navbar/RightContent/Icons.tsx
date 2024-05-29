import { FC } from "react";
import { BsArrowUpRightCircle, BsChatDots } from "react-icons/bs";
import { GrAdd } from "react-icons/gr";
import { IoFilterCircleOutline, IoNotificationsOutline, IoVideocamOutline } from "react-icons/io5";

import useDirectory from "@/hooks/useDirectory";

type ActionIconsProps = {};

const ActionIcons: FC<ActionIconsProps> = () => {
  const { toggleMenuOpen } = useDirectory();
  return (
    <div className="flex items-center flex-grow">
      <div className="hidden md:flex items-center border-r border-gray-200">
        <div className="mr-1.5 ml-1.5 p-1 cursor-pointer rounded hover:bg-gray-200">
          <BsArrowUpRightCircle className="text-sm" />
        </div>
        <div className="mr-1.5 ml-1.5 p-1 cursor-pointer rounded hover:bg-gray-200">
          <IoFilterCircleOutline className="text-sm" />
        </div>
        <div className="mr-1.5 ml-1.5 p-1 cursor-pointer rounded hover:bg-gray-200">
          <IoVideocamOutline className="text-sm" />
        </div>
      </div>
      <div className="hidden md:flex items-center border-r border-gray-200">
        <div className="mr-1.5 ml-1.5 p-1 cursor-pointer rounded hover:bg-gray-200">
          <BsChatDots className="text-sm" />
        </div>
        <div className="mr-1.5 ml-1.5 p-1 cursor-pointer rounded hover:bg-gray-200">
          <IoNotificationsOutline className="text-sm" />
        </div>
        <div className="hidden md:flex mr-3 ml-1.5 p-1 cursor-pointer rounded hover:bg-gray-200" onClick={toggleMenuOpen}>
          <GrAdd className="text-sm" />
        </div>
      </div>
    </div>
  );
};

export default ActionIcons;