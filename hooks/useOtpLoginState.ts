import { useState } from "react";
import { Session } from "@supabase/supabase-js";

export const useOtpLoginState = () => {
  const [form, setForm] = useState<{ email: string; otp: string }>({ email: "", otp: "" });
  const [formError, setFormError] = useState("");
  const [session, setSession] = useState<Session | null>(null);
  const [otpRequestSent, setotpRequestSent] = useState(false);
  const [otpInputWaiting, setotpInputWaiting] = useState(false);
  const [authError, setAuthError] = useState("");

  return {
    form,
    setForm,
    formError,
    setFormError,
    session,
    setSession,
    otpRequestSent,
    setotpRequestSent,
    otpInputWaiting,
    setotpInputWaiting,
    authError,
    setAuthError
  };
};

