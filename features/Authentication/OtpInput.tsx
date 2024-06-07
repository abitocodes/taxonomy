"use client"

import { useState } from "react";
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import PinInput from "@/components/PinInput";
import { useRecoilState } from "recoil";

import { Session } from "@supabase/supabase-js";

import { supabase } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { CreateUpdateUser } from "@/helpers/CreateUpdateUser";

import { AuthModalStateType } from "@/types/atoms/AuthModalStateType";
import { authModalState } from "@/atoms/auth/authModalAtom";
import { defaultAuthModalState } from "@/atoms/auth/authModalAtom";
import { useAuthState } from "@/hooks/useAuthState";

export const OtpInput = () => {
    const [_authModalState, _setAuthModalState] = useRecoilState<AuthModalStateType>(authModalState);
    console.log("OtpInput Arg _authModalState: ", _authModalState);

    const handleOtpChange = (otp: string) => {
        _setAuthModalState(prev => ({
            ...prev,
            form: {
                ...prev.form,
                otp: otp
            }
        }));
    };

    const loginFormSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
        console.log("loginFormSubmitButton Clicked")
        console.log("loginFormSubmit authModalState: ", _authModalState);
    
        _setAuthModalState(prev => ({ ...prev, otpRequestSent: true }));
    
        try {
            const _response = await fetch('/api/verifyOtp?email=' + _authModalState.form.email + '&otp=' + _authModalState.form.otp);
            const response = await _response.json();
            const data = response.data;
    
            if (response.statusCode !== 200) throw new Error(data.message);
    
            // Supabase 클라이언트 세션 설정
            supabase.auth.setSession(data.session);
    
            console.log("loginFormSubmit data: ", data);
            _setAuthModalState(prev => ({ ...prev, otpRequestSent: false, otpInputModalOpen: false, otpEntered: false}));
            _setAuthModalState(prev => defaultAuthModalState);
            console.log("login success authModalState: ", _authModalState);
        } catch (error) {
            _setAuthModalState(prev => ({ ...prev, otpInputModalError: error.message, otpEntered: false }));
        }
    };

    return (
        <DrawerContent>
            <div className="mx-auto w-full max-w-sm">
                <DrawerHeader>
                    <DrawerTitle>이메일을 확인하고, OTP 번호를 입력해주세요.</DrawerTitle>
                    <DrawerDescription>{_authModalState.form.email}</DrawerDescription>
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
                    <Button onClick={loginFormSubmit}>OTP 확인</Button>
                    <DrawerClose asChild>
                        <Button variant="outline" onClick={() => _setAuthModalState(prev => defaultAuthModalState)}>취소</Button>
                    </DrawerClose>
                </DrawerFooter>
            </div>
        </DrawerContent>
    );
};

const verifyOtp = async (email, otp) => {

}


// const _loginFormSubmit = (_event: React.FormEvent<HTMLFormElement>) => {
//     if (_authModalState.form.otp.length === 6) {
//         _setOtpInputModalState(prev => ({
//             ...prev,
//             otpInputModalOpen: false,
//             view: "otpInput",
//             otpEntered: false
//         }));
//         loginFormSubmit(_event, _authModalState, _otpInputModalState);
//     } else {
//         _setOtpInputModalState(prev => ({
//             ...prev,
//             formError: "OTP 번호를 입력해주세요."
//         }));
//     }
// };

