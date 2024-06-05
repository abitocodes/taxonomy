import { FC, useEffect, useState } from "react";
import { useRecoilState } from 'recoil';
import { authModalState } from '@/atoms/authModalAtom';
import { SUPABASE_ERRORS } from "@/utils/supabase/errors";
import { ModalView } from "@/types/atoms/AuthModalState";
import { useOtpLoginState } from "@/hooks/useOtpLoginState";
import PinInput from "@/components/PinInput";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

import { ReloadIcon } from "@radix-ui/react-icons";

type LoginProps = {
  toggleView: (view: ModalView) => void;
};

export default function Login({ toggleView }) {
  const [modalState, setModalState] = useRecoilState(authModalState);
  const {
    form, setForm,
    formError, setFormError,
    session, setSession,
    otpInputLoading, setOtpInputLoading,
    authError, setAuthError
  } = useOtpLoginState();

  // OTP 상태를 modalState에서 관리
  const otpSent = modalState.otpSent;
  const setOtpSent = (value: boolean) => {
    setModalState(prev => ({ ...prev, otpSent: value }));
  };

  const _loginFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    if (!form.email.includes("@")) {
      setFormError("유효한 이메일을 입력해주세요.");
      return;
    }
    setOtpInputLoading(true);
    loginFormSubmit(event, otpSent, setOtpSent, form, setFormError, setOtpInputLoading, setAuthError, setSession);
  };

  const handleOtpVerification = () => {
    setModalState(prev => ({ ...prev, otpSent: true }));
    // OTP 검증 로직을 여기에 추가하세요.
    verifyOTP(form, setFormError, setOtpInputLoading, setSession);
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
          <Drawer>
            <DrawerTrigger asChild>
              <Button className="w-full h-9 mt-2" type="submit" disabled={otpInputLoading}>
                {otpInputLoading ? <><ReloadIcon className="mr-2 h-4 w-4 animate-spin"/>OTP 확인중</> : "OTP 요청"}
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              {}
              <div className="mx-auto w-full max-w-sm">
                <DrawerHeader>
                  <DrawerTitle>이메일을 확인하고, OTP 번호를 입력해주세요.</DrawerTitle>
                  <DrawerDescription>{form.email}</DrawerDescription>
                </DrawerHeader>
                <div className="flex items-center justify-center space-x-2">
                  <PinInput
                    length={6} 
                    initialValue=""
                    onChange={handleOtpChange} 
                    type="numeric" 
                    inputMode="numeric"
                    inputStyle={{borderColor: 'red'}}
                    inputFocusStyle={{borderColor: 'blue'}}
                    onComplete={(value, index) => {}}
                    autoSelect={true}
                    regexCriteria={/^[ A-Za-z0-9_@./#&+-]*$/}
                  />
                </div>
                <DrawerFooter>
                  <Button onClick={handleOtpVerification}>OTP 확인</Button>
                    <DrawerClose asChild>
                      <Button variant="outline" onClick={() => setModalState(prev => ({ ...prev, isOpen: !prev.open }))}>취소</Button>
                    </DrawerClose>
                </DrawerFooter>
              </div>
            </DrawerContent>
          </Drawer>
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
  if (otpSent) {
    verifyOTP(form, setFormError, setOtpInputLoading, setSession);
  } else {
    requestOTP(form, setFormError, setOtpSent, setOtpInputLoading);
  }
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

const verifyOTP = async (form, setFormError, setOtpInputLoading, setSession) => {
  setOtpInputLoading(false);
  // const otp = form.otp
  // const { data, error } = await supabase.auth.verifyOtp({
  //   email: form.email,
  //   token: otp.join(''),
  //   type: 'email'
  // });
  // if (error) {
  //   setFormError(error.message);
  //   setOtpInputLoading(false);
  // } else {
  //   setSession(data.session);
  //   CreateUpdateUser(data.user as User);
  //   setOtpInputLoading(false);
  // }
};