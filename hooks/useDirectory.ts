import { useEffect } from "react";
import { FaReddit } from "react-icons/fa";
import { useRecoilState, useRecoilValue } from "recoil";

import { useRouter } from "next/navigation";

import { channelState } from "@/atoms/channelsAtom";
import { defaultMenuItem, directoryMenuState } from "@/atoms/directoryMenuAtom";
import { DirectoryMenuItem } from "@/types/DirectoryMenuState";

export const useDirectory = () => {
  const [directoryState, setDirectoryState] = useRecoilState(directoryMenuState);
  const router = useRouter();

  const channelStateValue = useRecoilValue(channelState);

  const onSelectMenuItem = (menuItem: DirectoryMenuItem) => {
    setDirectoryState((prev) => ({
      ...prev,
      selectedMenuItem: menuItem,
    }));

    router?.push(menuItem.link);
    if (directoryState.isOpen) {
      toggleMenuOpen();
    }
  };

  const toggleMenuOpen = () => {
    setDirectoryState((prev) => ({
      ...prev,
      isOpen: !directoryState.isOpen,
    }));
  };

  useEffect(() => {
    const existingChannel = channelStateValue.currentChannel;
  
    if (existingChannel.id) {
      setDirectoryState((prev) => ({
        ...prev,
        selectedMenuItem: {
          displayText: `r/${existingChannel.id}`,
          link: `r/${existingChannel.id}`,
          icon: FaReddit,
          iconColor: "blue.500",
          imageURL: existingChannel.imageURL,
        },
      }));
    } else {
      setDirectoryState((prev) => ({
        ...prev,
        selectedMenuItem: defaultMenuItem,
      }));
    }
  }, [channelStateValue.currentChannel]);
  
  return { directoryState, onSelectMenuItem, toggleMenuOpen };
  };