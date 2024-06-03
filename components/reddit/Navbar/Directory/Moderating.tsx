import { FC } from "react";
import { FaReddit } from "react-icons/fa";

import { Box, Text } from "@radix-ui/themes";

import { ChannelSnippet } from "@/types/channelsState";
import MenuListItem from "./MenuListItem";

type ModeratingProps = {
  snippets: ChannelSnippet[];
};

const Moderating: FC<ModeratingProps> = ({ snippets }) => {
  return (
    <Box className="mt-3 mb-3">
      <Text className="pl-3 mb-1" style={{ fontSize: "7pt", fontWeight: 500, color: "gray.500" }}>
        MODERATING
      </Text>
      {snippets.map((snippet) => (
        <MenuListItem key={snippet.channelId} displayText={`r/${snippet.channelId}`} link={`/ch/${snippet.channelId}`} icon={FaReddit} iconColor="brand.100" />
      ))}
    </Box>
  );
};
export default Moderating;
