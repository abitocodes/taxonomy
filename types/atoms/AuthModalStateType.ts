import { Session } from "@supabase/supabase-js";

export type AuthModalStateType = {
  emailInputModalOpen: boolean,
  otpInputModalOpen: boolean,
  otpRequestSent: boolean,
  otpInputWaiting: boolean,
  otpEntered: boolean,
  otpVerifyWaiting: boolean,
  form: { email: string; otp: string },
  emailInputModalError: string,
  otpInputModalError: string,
  session: Session | null;
};

