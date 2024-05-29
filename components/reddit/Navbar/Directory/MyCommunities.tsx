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

import useCommunityModal from "@/hooks/useCommunityModal";
import { CommunitySnippet } from "@/types/CommunityState";
import MenuListItem from "./MenuListItem";

type MyCommunitiesProps = {
  snippets: CommunitySnippet[];
};

const MyCommunities: FC<MyCommunitiesProps> = ({ snippets }) => {
  const { openModal } = useCommunityModal();

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
              Create Community
            </Flex>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {snippets.map((snippet) => (
            <DropdownMenuItem key={snippet.communityId} asChild>
              <MenuListItem
                icon={FaReddit}
                displayText={`r/${snippet.communityId}`}
                link={`/r/${snippet.communityId}`}
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