import { atom } from "recoil";

import { Channel, ChannelState } from "@/types/channelsState";

export const defaultChannel: Channel = {
  id: "",
  creatorId: "",
  numberOfMembers: 0,
  privacyType: "public",
};

export const defaultChannelState: ChannelState = {
  mySnippets: [],
  initSnippetsFetched: false,
  visitedChannels: {},
  currentChannel: defaultChannel,
};

export const channelState = atom<ChannelState>({
  key: "channelsState",
  default: defaultChannelState,
});
