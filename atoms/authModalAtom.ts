import { atom } from "recoil";

import { AuthModalState } from "@/types/atoms/AuthModalState";

const defaultModalState: AuthModalState = {
  open: false,
  otpSent: false,
  view: "login",
};

export const authModalState = atom<AuthModalState>({
  key: "authModalState",
  default: defaultModalState,
});
