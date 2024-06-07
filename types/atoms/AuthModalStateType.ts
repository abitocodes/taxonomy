import { Session } from "@supabase/supabase-js";

export type ModalView = "login" | "signup" | "resetPassword";

export type AuthModalStateType = {
  view: ModalView,
  emailInputModalOpen: boolean,
  otpInputModalOpen: boolean,
  emailEntered: boolean,
  otpRequestSent: boolean,  
  otpInputWaiting: boolean,
  otpEntered: boolean,
  otpVerifyWaiting: boolean,
  form: { email: string; otp: string },
  emailInputModalError: string,
  otpInputModalError: string,
  session: Session | null;
};

