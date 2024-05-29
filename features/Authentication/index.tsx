/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from "react";
import { useAuthState } from "@/hooks/useAuthState";

import { useRecoilState, useRecoilValue } from "recoil";
import { authModalState } from "@/atoms/authModalAtom";

import { userState } from "@/atoms/userAtom";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { supabase } from "@/utils/supabase/client";
import AuthInputs from "./Inputs";
import OAuthButtons from "./OAuthButtons";
import ResetPassword from "./ResetPassword";
import { Session } from "@supabase/supabase-js";
import { ModalView } from "@/types/AuthModalState";


type AuthModalProps = {};

const AuthModal: FC<AuthModalProps> = () => {
  const [modalState, setModalState] = useRecoilState(authModalState);
  const [session, setSession] = useState<Session | null>(null);
  // const handleClose = () =>
  //   setModalState((prev) => ({
  //     ...prev,
  //     open: false,
  //   }));
  const handleClose = () => {
    console.log("handleClose called, current state:", modalState);
    setModalState(prev => ({ ...prev, open: false }));
  };

  const currentUser = useRecoilValue(userState);
  const authState = useAuthState(session);
  const user = authState.user
  const error = authState.error;

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

  useEffect(() => {
    if (currentUser) handleClose();
  }, [currentUser]);

  // const toggleView = (view: string) => {
  //   setModalState({
  //     ...modalState,
  //     view: view as typeof modalState.view,
  //   });
  //   console.log("hi modalState", modalState)
  // };

  const toggleView = (view: ModalView) => {
    setModalState(prev => ({ ...prev, view }));
  };

  useEffect(() => {
    if (user) handleClose();
  }, [user]);

  console.log("AuthModal rendered, modalState:", modalState);

  return (
    <Dialog 
    open={modalState.open} 
    onOpenChange={(open) => {
      console.log("Dialog onOpenChange called, open:", open);
      setModalState(prev => ({ ...prev, open }));
    }}
  >
    <DialogContent className="overflow-hidden p-0">
      <div className="flex flex-col items-center">
        {modalState.view === "login" && <div>Login</div>}
        {modalState.view === "signup" && <div>Sign Up</div>}
        {modalState.view === "resetPassword" && <div>Reset Password</div>}
      </div>
      <button onClick={handleClose} className="absolute top-0 right-0 p-2">Close</button>
      
      <div className="flex flex-col items-center justify-center p-6">
        <div className="flex flex-col items-center justify-center w-3/4">
          {modalState.view === "login" || modalState.view === "signup" ? (
            <>
              <OAuthButtons />
              <div>OR</div>
              <AuthInputs toggleView={toggleView} />
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
        </div>
      </div>
      </DialogContent>
    </Dialog>
  );
};
export default AuthModal;