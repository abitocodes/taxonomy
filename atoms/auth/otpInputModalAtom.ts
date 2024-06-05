import { atom } from "recoil";

import { OtpInputModalState } from "@/types/atoms/OtpInputModalState";

const defaultOtpModalState: OtpInputModalState = {
  otpInputOpen: false,
  otpEntered: false,
  view: "otpInput",
};

export const otpInputModalState = atom<OtpInputModalState>({
  key: "otpInputModalState",
  default: defaultOtpModalState,
});

