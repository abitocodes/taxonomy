import { atom } from "recoil";

const defaultUserState = {
  userData: null,
  sessionData: null,
};

export const userState = atom({
  key: "userState",
  default: defaultUserState,
});
