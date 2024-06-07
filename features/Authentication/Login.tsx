import { FC, useEffect, useState } from "react";

import { useRecoilState } from 'recoil';
import { authModalState } from '@/atoms/auth/authModalAtom';
import { SUPABASE_ERRORS } from "@/utils/supabase/errors";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerTrigger } from "@/components/ui/drawer";
import { ReloadIcon } from "@radix-ui/react-icons";
import { OtpInput } from '@/features/Authentication/OtpInput';
import { supabase } from "@/utils/supabase/client";

export default function Login() {
  const [_authModalState, _setAuthModalState] = useRecoilState(authModalState);

  const handleClickedEmailInputSubmitButton = async () => {
    _setAuthModalState(prev => ({ ...prev, emailEntered: true }));
    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(_authModalState.form.email)) {
        _setAuthModalState(prev => ({ ...prev, emailEntered: false }));
        throw new Error("유효한 이메일을 입력해주세요.");
      }
  
      const { data, error } = await supabase.auth.signInWithOtp({
        email: _authModalState.form.email,
        options: {
          shouldCreateUser: false
        }
      });

      if (error) {
        console.log("handleClickedEmailInputSubmitButton error: ", error);
        throw error;
      } else {
        console.log("handleClickedEmailInputSubmitButton data: ", data);
        _setAuthModalState(prev => ({ ...prev, otpRequestSent: true, otpInputModalOpen: true }));
      }
    } catch (error) {
      _setAuthModalState(prev => ({ ...prev, emailEntered: false, emailInputModalError: error.message }));
    }
  };

  return (
    <>
     <form className="w-full">
          <div className="grid gap-4 py-4">
              <div className="w-full">
                <Input
                  className="w-full text-center" 
                  id="email" name="email" type="text" placeholder="이메일 입력" value={_authModalState.form.email} 
                  onChange={(event) => onEmailInputBoxChange(event, _setAuthModalState)} disabled={_authModalState.otpEntered}/>
              </div>
              <Drawer open={_authModalState.otpInputModalOpen}>
                <DrawerTrigger asChild>
                    <Button 
                        className="w-full h-9 mt-2" 
                        onClick={() => handleClickedEmailInputSubmitButton()}
                        disabled={_authModalState.emailEntered}>
                        {_authModalState.emailEntered ? <div className="flex items-center font-scor"><ReloadIcon className="mr-2 h-4 w-4 animate-spin"/>.. 기다려 주세요 ..</div> : "OTP 요청"}
                    </Button>
                </DrawerTrigger>
                <OtpInput/>
              </Drawer>
              <div className="text-center text-sm text-red-500 uppercase font-dots">
                {_authModalState.emailInputModalError || SUPABASE_ERRORS[_authModalState.otpInputModalError as keyof typeof SUPABASE_ERRORS]}
              </div>
          </div>
      </form>
    </>
  )
};

const onEmailInputBoxChange = ({ target: { id, value } }: React.ChangeEvent<HTMLInputElement>, setAuthModalState) => {
  setAuthModalState((prev) => {
    console.log("onEmailInputBoxChange, prev: ", prev);
    return ({
    ...prev,
    form: {
      ...prev.form,
      [id]: value,
    }
  })});
  console.log("onEmailInputBoxChange, _setAuthModalState: ", setAuthModalState);
};

// export const handleOtpChange = (
//   otp: string,
//   _setOtpInputModalState: (update: (prev: any) => any) => void
// ) => {
//   _setOtpInputModalState(prevForm => ({
//     ...prevForm,
//     form: {
//       ...prevForm.form,
//       otp: otp
//     }
//   }));
// };

// TypeError: Cannot read properties of undefined (reading 'preventDefault')