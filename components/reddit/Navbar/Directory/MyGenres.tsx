import { FC } from "react";
import { FaReddit } from "react-icons/fa";
import { GrAdd } from "react-icons/gr";
import { Icon } from "@radix-ui/react-select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Box, Flex, Text } from "@radix-ui/themes";

import useGenreModal from "@/hooks/useGenreModal";
import { GenreSnippet } from "@/types/GenreState";
import MenuListItem from "./MenuListItem";

type MyCommunitiesProps = {
  snippets: GenreSnippet[];
};

const MyCommunities: FC<MyCommunitiesProps> = ({ snippets }) => {
  const { openModal } = useGenreModal();

  return (
    <Box className="mt-3 mb-3">
      <Text className="pl-3 mb-1 text-xs font-semibold text-gray-500">
        MY COMMUNITIES
      </Text>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="w-full text-sm hover:bg-gray-100" onClick={openModal}>
            <Flex className="items-center">
              <GrAdd className="text-2xl mr-2" />
              Create Genre
            </Flex>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {snippets.map((snippet) => (
            <DropdownMenuItem key={snippet.genreId} asChild>
              <MenuListItem
                icon={FaReddit}
                displayText={`r/${snippet.genreId}`}
                link={`/r/${snippet.genreId}`}
                iconColor="blue.500"
                imageURL={snippet.imageURL}
              />
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </Box>
  );
};
export default MyCommunities;