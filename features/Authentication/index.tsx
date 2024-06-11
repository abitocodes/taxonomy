/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from "react";
import { useAuthState } from "@/hooks/useAuthState";

import { useRecoilState, useRecoilValue } from "recoil";
import { authModalState } from "@/atoms/auth/authModalAtom";

import { sessionAndPublicUserState } from "@/atoms/sessionAndUserAtom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { supabase } from "@/utils/supabase/client";
import AuthInputs from "./Inputs";
import OAuthButtons from "./OAuthButtons";
import ResetPassword from "./ResetPassword";
import { Session } from '@supabase/supabase-js';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Icons } from "@/components/icons"

type AuthModalProps = {};

const AuthModal: FC<AuthModalProps> = () => {
  const [_authModalState, _setAuthModalState] = useRecoilState(authModalState);
  const { session } = useAuthState();

  const handleClose = () => {
    _setAuthModalState(prev => ({ ...prev, emailInputModalOpen: false }));
  };

  useEffect(() => {
    if (session?.user) handleClose();
  }, [session?.user]);

  useEffect(() => {
    if (session?.user) handleClose();
  }, [session?.user]);

  // useEffect(() => {
  //   console.log("AuthModal useEffect 실행")
  //   const fetchSession = async () => {
  //     const { data, error } = await supabase.auth.getSession();
  //     if (error) {
  //       console.error('Failed to fetch session:', error);
  //     } else {
  //       setSession(data.session);
  //     }
  //   };

  //   fetchSession();
  // }, []);

  return (
    <Dialog 
      open={_authModalState.emailInputModalOpen}
      onOpenChange={(emailInputModalOpen) => {
        _setAuthModalState(prev => ({ ...prev, emailInputModalOpen: emailInputModalOpen }));
        if (!emailInputModalOpen) {
          _setAuthModalState(prev => ({ ...prev, emailEntered: false }));
        }
      }}
    >
      <DialogContent className="w-4/5">
          {/* <DialogHeader> */}
            {/* <DialogTitle className="flex items-center"> */}
            {_authModalState.view === "login" && 
            <div className="mr-6 flex items-center font-gifo font-bold">
                  <Icons.logo className="h-6 w-6" />&nbsp;&nbsp;너와나의 우주 항해 일지
            </div>
            }
            {_authModalState.view === "signup" && <div>SIGN UP</div>}
            {_authModalState.view === "resetPassword" && <div>RESET PASSWORD</div>}
            {/* </DialogTitle> */}
            {/* <DialogDescription> */}
              이메일을 입력하고 로그인에 필요한 OTP를 발급 받으세요.
            {/* </DialogDescription> */}
          {/* </DialogHeader> */}
          {_authModalState.view === "login" || _authModalState.view === "signup" ? (
              <>
                <AuthInputs/>
                {/* <div>OR</div>
                <OAuthButtons /> */}
              </>
            ) : (
              <>
              {/* <ResetPassword/> */}
              </>
            )}
            {session?.user && (
              <>
                <div className="spinner-border animate-spin mt-2 mb-2 h-8 w-8 border-4"></div>
                <p className="text-xs text-center text-blue-500">
                  You are logged in. You will be redirected soon
                </p>
              </>
            )}
      </DialogContent>
    </Dialog>
  );
};
export default AuthModal;