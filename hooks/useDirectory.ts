import { useEffect } from "react";
import { FaReddit } from "react-icons/fa";
import { useRecoilState, useRecoilValue } from "recoil";

import { useRouter } from "next/navigation";

import { genreState } from "@/atoms/genresAtom";
import { defaultMenuItem, directoryMenuState } from "@/atoms/directoryMenuAtom";
import { DirectoryMenuItem } from "@/types/DirectoryMenuState";

export const useDirectory = () => {
  const [directoryState, setDirectoryState] = useRecoilState(directoryMenuState);
  const router = useRouter();

  const genreStateValue = useRecoilValue(genreState);

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
    const existingGenre = genreStateValue.currentGenre;
  
    if (existingGenre.id) {
      setDirectoryState((prev) => ({
        ...prev,
        selectedMenuItem: {
          displayText: `r/${existingGenre.id}`,
          link: `r/${existingGenre.id}`,
          icon: FaReddit,
          iconColor: "blue.500",
          imageURL: existingGenre.imageURL,
        },
      }));
    } else {
      setDirectoryState((prev) => ({
        ...prev,
        selectedMenuItem: defaultMenuItem,
      }));
    }
  }, [genreStateValue.currentGenre]);
  
  return { directoryState, onSelectMenuItem, toggleMenuOpen };
  };