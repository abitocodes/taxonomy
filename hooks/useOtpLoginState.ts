import { useState } from "react";
import { Session } from "@supabase/supabase-js";

export const useOtpLoginState = () => {
  const [form, setForm] = useState<{ email: string; otp: string }>({ email: "", otp: "" });
  const [formError, setFormError] = useState("");
  const [otpRequestSent, setotpRequestSent] = useState(false);
  const [otpEntered, setotpEntered] = useState(false);
  const [globalAuthErrorMsg, setAuthErrorMsg] = useState("");

  return {
    form,
    setForm,
    formError,
    setFormError,
    session,
    setSession,
    otpRequestSent,
    setotpRequestSent,
    otpEntered,
    setotpEntered,
    globalAuthErrorMsg,
    setAuthErrorMsg
  };
};

