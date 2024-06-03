import { useState } from "react";
import { Session } from "@supabase/supabase-js";

export const useOtpLoginState = () => {
  const [form, setForm] = useState<{ email: string; otp_1: number, otp_2: number, otp_3: number, otp_4: number, otp_5: number, otp_6: number }>({ email: "", otp_1: 0, otp_2: 0, otp_3: 0, otp_4: 0, otp_5: 0, otp_6: 0 });
  const [formError, setFormError] = useState("");
  const [session, setSession] = useState<Session | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otpInputLoading, setOtpInputLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  return {
    form,
    setForm,
    formError,
    setFormError,
    session,
    setSession,
    otpSent,
    setOtpSent,
    otpInputLoading,
    setOtpInputLoading,
    authError,
    setAuthError
  };
};

