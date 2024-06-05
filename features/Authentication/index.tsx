/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from "react";
import { useAuthState } from "@/hooks/useAuthState";

import { useRecoilState, useRecoilValue } from "recoil";
import { authModalState } from "@/atoms/auth/authModalAtom";

import { userState } from "@/atoms/userAtom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { supabase } from "@/utils/supabase/client";
import AuthInputs from "./Inputs";
import OAuthButtons from "./OAuthButtons";
import ResetPassword from "./ResetPassword";
import { Session } from '@supabase/supabase-js';
import { ModalView } from "@/types/atoms/AuthModalState";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Icons } from "@/components/icons"

type AuthModalProps = {};

const AuthModal: FC<AuthModalProps> = () => {
  const [modalState, setModalState] = useRecoilState(authModalState);
  const [session, setSession] = useState<Session | null>(null);

  const handleClose = () => {
    setModalState(prev => ({ ...prev, open: false }));
  };

  const toggleView = (view: ModalView) => {
    setModalState(prev => ({ ...prev, view }));
  };

  const currentUser = useRecoilValue(userState);
  const authState = useAuthState(session);
  const user = authState.user
  const error = authState.error;

  useEffect(() => {
    if (currentUser) handleClose();
  }, [currentUser]);

  useEffect(() => {
    if (user) handleClose();
  }, [user]);

  useEffect(() => {
    const fetchSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Failed to fetch session:', error);
      } else {
        setSession(data.session);
      }
    };

    fetchSession();
  }, []);

  return (
    <Dialog 
      open={modalState.loginOpen} 
      onOpenChange={(loginOpen) => {
        setModalState(prev => ({ ...prev, loginOpen }));
      }}
    >
      <DialogContent className="w-4/5">
          {/* <DialogHeader> */}
            {/* <DialogTitle className="flex items-center"> */}
            {modalState.view === "login" && 
            <div className="mr-6 flex items-center font-gifo font-bold">
                  <Icons.logo className="h-6 w-6" />&nbsp;&nbsp;너와나의 우주 항해 일지
            </div>
            }
            {modalState.view === "signup" && <div>SIGN UP</div>}
            {modalState.view === "resetPassword" && <div>RESET PASSWORD</div>}
            {/* </DialogTitle> */}
            {/* <DialogDescription> */}
              이메일을 입력하고 로그인에 필요한 OTP를 발급 받으세요.
            {/* </DialogDescription> */}
          {/* </DialogHeader> */}
          {modalState.view === "login" || modalState.view === "signup" ? (
              <>
                <AuthInputs toggleView={toggleView} />
                {/* <div>OR</div>
                <OAuthButtons /> */}
              </>
            ) : (
              <ResetPassword toggleView={toggleView} />
            )}
            {user && !currentUser && (
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