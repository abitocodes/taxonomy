import { atom } from "recoil";
import { GlobalAuthStateType } from "@/types/atoms/GlobalAuthStateType";

const defaultGlobalAuthState: GlobalAuthStateType = {
  globalSessionData: null,
  globalPublicUserData: null,
  globalAuthLoadingState: true,
  globalAuthErrorMsg: null,
};

export const globalAuthState = atom({
  key: "globalAuthState",
  default: defaultGlobalAuthState,
});