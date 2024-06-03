import { atom } from "recoil";

import { ChannelModalState } from "@/types/channelsModalState";

const defaultModalState: ChannelModalState = {
  open: false,
};

export const channelModalState = atom<ChannelModalState>({
  key: "channelModalState",
  default: defaultModalState,
});
