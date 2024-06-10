import { atom } from "recoil";
import { SessionAndPublicUserStateType } from "@/types/atoms/SessionAndPublicUserStateType";

const defaultSessionAndPublicUserState: SessionAndPublicUserStateType = {
  currentSessionData: null,
  currentPublicUserData: null,
};

export const sessionAndPublicUserState = atom({
  key: "sessionAndPublicUserState",
  default: defaultSessionAndPublicUserState,
});