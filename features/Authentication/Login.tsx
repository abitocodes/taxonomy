import { FC, useEffect, useState } from "react";
import { useRecoilState } from 'recoil';
import { authModalState } from '@/atoms/auth/authModalAtom';
import { SUPABASE_ERRORS } from "@/utils/supabase/errors";
import { ModalView } from "@/types/atoms/AuthModalState";
import { useOtpLoginState } from "@/hooks/useOtpLoginState";
import PinInput from "@/components/PinInput";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";

import { ReloadIcon } from "@radix-ui/react-icons";

import { useSetRecoilState } from "recoil";
import { LockClosedIcon } from "@radix-ui/react-icons";

import { otpInputModalState } from "@/atoms/auth/otpInputModalAtom";
type OtpInputButtonsProps = {};
import { OtpInput } from '@/features/Authentication/OtpInput';

import { OtpInputModalState } from "@/types/atoms/OtpInputModalState";


type LoginProps = {
  toggleView: (view: ModalView) => void;
};

export default function Login({ toggleView }) {
  const setOtpInputModalState = useSetRecoilState(otpInputModalState);
  const [_otpInputModalState, _setOtpInputModalState] = useRecoilState(otpInputModalState);
  const [_authModalState, _setAuthModalState] = useRecoilState(authModalState);
  const {
    form, setForm,
    formError, setFormError,
    session, setSession,
    otpInputLoading, setOtpInputLoading,
    authError, setAuthError
  } = useOtpLoginState();

  // OTP 상태를 _authModalState에서 관리
  const otpSent = _authModalState.otpSent;
  const setOtpSent = (value: boolean) => {
    _setAuthModalState(prev => ({ ...prev, otpSent: value }));
  };

  const _loginFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    if (!form.email.includes("@")) {
      setFormError("유효한 이메일을 입력해주세요.");
      return;
    }
    setOtpInputLoading(true);
    loginFormSubmit(event, otpSent, setOtpSent, form, setFormError, setOtpInputLoading, setAuthError, setSession);
  };

  const handleOtpChange = (otp: string) => {
    console.log("handle otp:", otp)
    setForm(prevForm => ({
      ...prevForm,
      otp: otp
    }));
  };

  return (
  <>
      <form className="w-full" onSubmit={_loginFormSubmit}>
          <div className="grid gap-4 py-4">
            <div className="w-full">
              <Input
                className="w-full text-center" 
                id="email" name="email" type="text" placeholder="이메일 입력" value={form.email} 
                onChange={(event) => onEmailInputBoxChange(event, setForm)} disabled={otpSent}/>
            </div>
            <OtpInput
              setOtpInputModalState={_setOtpInputModalState}
              otpInputLoading={otpInputLoading}
              form={form}
              setForm={setForm}
              setFormError={setFormError}
              setOtpInputLoading={setOtpInputLoading}
              setSession={setSession}
              handleOtpChange={handleOtpChange}
              _setAuthModalState={_setAuthModalState}
            />
            </div>
            <div className="text-center text-sm text-red-500">
              {formError || SUPABASE_ERRORS[authError as keyof typeof SUPABASE_ERRORS]}
            </div>
      </form>
  </>
  );
};

const loginFormSubmit = (
    event: React.FormEvent<HTMLFormElement>, otpSent: boolean, setOtpSent: (otpSent: boolean) 
    => void, form, setFormError, setOtpInputLoading, setAuthError, setSession) => {
    event.preventDefault();
    requestOTP(form, setFormError, setOtpSent, setOtpInputLoading);
};

const requestOTP = async (form: { email: string; otp: number[] }, setFormError: (error: string) => void, setOtpSent: (otpSent: boolean) => void, setOtpInputLoading: (otpInputLoading: boolean) => void) => {
  setOtpSent(true);
  // // Supabase OTP 요청 로직 추가
  // const { data, error } = await supabase.auth.signInWithOtp({
  //   email: form.email,
  //   options: {
  //     shouldCreateUser: false
  //   }
  // });
  // if (error) {
  //   setFormError(error.message);
  // } else {
  //   setOtpSent(true);
  // }
};

const onEmailInputBoxChange = ({ target: { id, value } }: React.ChangeEvent<HTMLInputElement>, setForm) => {
  setForm((prev) => {
    return (
    {
    ...prev,
    [id]: value,
  })});
};
