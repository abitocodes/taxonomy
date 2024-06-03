import { useEffect } from "react";
import { FaReddit } from "react-icons/fa";
import { useRecoilState, useRecoilValue } from "recoil";

import { useRouter } from "next/navigation";

import { genreState } from "@/atoms/genresAtom";
import { defaultMenuItem, directoryMenuState } from "@/atoms/directoryMenuAtom";
import { DirectoryMenuItem } from "@/types/DirectoryMenuState";

export const useDirectory = () => {
  const [directoryState, setDirectoryState] = useRecoilState(directoryMenuState);
  console.log("useDirectory Called, directoryState:", directoryState);
  const router = useRouter();

  const genreStateValue = useRecoilValue(genreState);

  const onSelectMenuItem = (menuItem: DirectoryMenuItem) => {
    console.log("onSelectMenuItem called with:", menuItem);
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
    console.log("toggleMenuOpen called, current state:", directoryState.isOpen);
    setDirectoryState((prev) => ({
      ...prev,
      isOpen: !directoryState.isOpen,
    }));
  };

  useEffect(() => {
    console.log("useEffect in useDirectory, genreStateValue:", genreStateValue);
    const existingGenre = genreStateValue.currentGenre;
    console.log("existingGenre:", existingGenre);
  
    if (existingGenre.id) { // 조건을 true일 때로 변경
      console.log("Setting directory state based on existingGenre:", existingGenre);
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
    } else { // false일 때의 로직
      console.log("Setting directory state to defaultMenuItem");
      setDirectoryState((prev) => ({
        ...prev,
        selectedMenuItem: defaultMenuItem,
      }));
    }
  }, [genreStateValue.currentGenre]);
  
  return { directoryState, onSelectMenuItem, toggleMenuOpen };
  };