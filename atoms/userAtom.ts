import { atom } from "recoil";
import { SessionAndPublicUserStateType } from "@/types/atoms/SessionAndPublicUserStateType";

const defaultUserAndSessionState = {
  currentSessionData: null,
  currentPublicUserData: null,
};

export const userState = atom({
  key: "userState",
  default: defaultUserState,
});