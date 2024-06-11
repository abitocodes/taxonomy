import { FC } from "react";

import { PostTabItem } from "@/types/post/PostTabItem";

type TabItemProps = {
  item: PostTabItem;
  selected: boolean;
  setSelectedTab: (value: string) => void;
};

const TabItem: FC<TabItemProps> = ({ item, selected, setSelectedTab }) => {
  return (
      <div
        className={`flex justify-center items-center flex-grow p-[14px_0px] cursor-pointer font-bold ${
          selected ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-500 border-b border-gray-200"
        } border-x border-gray-200 ${
          item.disabled ? "bg-gray-100" : "hover:bg-gray-50"
        }`}
        onClick={() => {
          if (!item.disabled) setSelectedTab(item.title);
        }}
      >
        <div className="flex items-center h-5 mr-2">
          <item.icon className="h-full text-lg" />
        </div>
        <span className="text-sm">{item.title}</span>
      </div>
    );
};
export default TabItem;
