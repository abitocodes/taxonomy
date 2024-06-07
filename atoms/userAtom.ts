import { atom } from "recoil";

const defaultUserState = {
  currentUser: null,  // userProfileState의 currentUser와 동일한 역할을 하도록 추가
  sessionData: null,
};

export const userState = atom({
  key: "userState",
  default: defaultUserState,
});