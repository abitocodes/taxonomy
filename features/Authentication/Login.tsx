import { FC, useEffect, useState } from "react";
import useSignInWithEmailAndPassword from "@/hooks/useSignInWithEmailAndPassword";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SUPABASE_ERRORS } from "@/utils/supabase/errors";
import { CreateUpdateUser } from "@/helpers/CreateUpdateUser";
import { ModalView } from "@/types/AuthModalState";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/utils/supabase/client";
import { SixPinInputs } from "@/components/SixPinInputs";
import { useOtpLoginState } from "@/hooks/useOtpLoginState";

type LoginProps = {
  toggleView: (view: ModalView) => void;
};

const Login: FC<LoginProps> = ({ toggleView }) => {
  const { 
    form, setForm,
    formError, setFormError,
    session, setSession,
    otpSent, setOtpSent,
    otpInputLoading, setOtpInputLoading,
    authError, setAuthError 
  } = useOtpLoginState();

  const _loginFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    loginFormSubmit(event,
      otpSent, setOtpSent, form, setFormError, setOtpInputLoading, setAuthError, setSession);
  };

  return (
    <form className="w-full" onSubmit={_loginFormSubmit}>
      <div className="grid gap-4 py-4">
        <div className="w-full">
          <Input
            className="w-full text-center" 
            id="email" name="email" type="text" placeholder="이메일 입력" value={form.email} 
            onChange={(event) => onEmailInputBoxChange(event, setForm)} disabled={otpSent}/>
        </div>
        {otpSent && (
          <div className="flex items-center mb-2 space-x-2 rtl:space-x-reverse">
            <SixPinInputs
              id="otp"
              name="otp"
              onChange={(event) => onEmailInputBoxChange(event, setForm)}
              disabled={otpInputLoading} />
          </div>
        )}
      </div>
        <Button className="w-full h-9 mt-2" type="submit" disabled={otpInputLoading}>
          {otpInputLoading ? "기다려주세요..." : otpSent ? "OTP 확인" : "OTP 요청"}
        </Button>
        <div className="text-center text-sm text-red-500">
          {formError || SUPABASE_ERRORS[authError as keyof typeof SUPABASE_ERRORS]}
        </div>
    </form>
  );
};
export default Login;

const loginFormSubmit = (
  event: React.FormEvent<HTMLFormElement>, otpSent: boolean, setOtpSent: (otpSent: boolean) 
  => void, form, setFormError, setOtpInputLoading, setAuthError, setSession) => {
  event.preventDefault();
  if (otpSent) {
    verifyOTP(form, setFormError, setOtpInputLoading, setSession);
  } else {
    requestOTP(form, setFormError, setOtpSent, setOtpInputLoading);
  }
};

const requestOTP = async (form: { email: string; otp: number[] }, setFormError: (error: string) => void, setOtpSent: (otpSent: boolean) => void, setOtpInputLoading: (otpInputLoading: boolean) => void) => {
  if (!form.email.includes("@")) {
    setFormError("유효한 이메일을 입력해주세요.");
    return;
  }
  // Supabase OTP 요청 로직 추가
  const { data, error } = await supabase.auth.signInWithOtp({
    email: form.email,
    options: {
      shouldCreateUser: false
    }
  });
  if (error) {
    setFormError(error.message);
  } else {
    setOtpSent(true);
  }
};

const onEmailInputBoxChange = ({ target: { id, value } }: React.ChangeEvent<HTMLInputElement>, setForm) => {
  setForm((prev) => {
    return (
    {
    ...prev,
    [id]: value,
  })});
};

const verifyOTP = async (form, setFormError, setOtpInputLoading, setSession) => {
  const otp = [form.otp_1, form.otp_2, form.otp_3, form.otp_4, form.otp_5, form.otp_6];
  const { data, error } = await supabase.auth.verifyOtp({
    email: form.email,
    token: otp.join(''),
    type: 'email'
  });
  if (error) {
    setFormError(error.message);
    setOtpInputLoading(false);
  } else {
    setSession(data.session);
    CreateUpdateUser(data.user as User);
    setOtpInputLoading(false);
  }
};