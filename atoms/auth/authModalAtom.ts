import { atom } from "recoil";

import { AuthModalStateType } from "@/types/atoms/AuthModalStateType";

export const defaultAuthModalState: AuthModalStateType = {
  view: "login",

  emailInputModalOpen: false,
  otpInputModalOpen: false,

  otpRequestSent: false,
  otpInputWaiting: false,

  otpEntered: false,
  otpVerifyWaiting: false,

  form: { email: "", otp: "" },
  emailInputModalError: "",
  otpInputModalError: "",
  session: null,
};

export const authModalState = atom<AuthModalStateType>({
  key: "authModalState",
  default: defaultAuthModalState,
});
