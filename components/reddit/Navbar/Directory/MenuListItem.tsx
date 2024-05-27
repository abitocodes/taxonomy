import { FC } from "react";
import { IconType } from "react-icons";

import useDirectory from "@/hooks/useDirectory";

type DirectoryItemProps = {
  displayText: string;
  link: string;
  icon: IconType;
  iconColor: string;
  imageURL?: string;
};

const MenuListItem: FC<DirectoryItemProps> = ({ displayText, link, icon, iconColor, imageURL }) => {
  const { onSelectMenuItem } = useDirectory();
  return (
    <li className="w-full text-sm hover:bg-gray-100" onClick={() => onSelectMenuItem({ displayText, link, icon, iconColor, imageURL })}>
      <div className="flex items-center">
        {imageURL ? (
          <img className="rounded-full w-4.5 h-4.5 mr-2" src={imageURL} alt="community image" />
        ) : (
          <svg className={`h-5 w-5 mr-2 text-${iconColor}`} fill="currentColor">
            {/* SVG content should be replaced with actual icon SVG path */}
          </svg>
        )}
        {displayText}
      </div>
    </li>
  );
};

export default MenuListItem;