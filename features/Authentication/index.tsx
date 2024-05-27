/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect } from "react";
import { useAuthState } from "@/hooks/useAuthState"
import { useRecoilState, useRecoilValue } from "recoil";


import { authModalState } from "@/atoms/authModalAtom";
import { userState } from "@/atoms/userAtom";
import ModalWrapper from "../../components/reddit/Modal/ModalWrapper";
import { auth } from "../../utils/supabase/client";
import AuthInputs from "./Inputs";
import OAuthButtons from "./OAuthButtons";
import ResetPassword from "./ResetPassword";

type AuthModalProps = {};

const AuthModal: FC<AuthModalProps> = () => {
  const [modalState, setModalState] = useRecoilState(authModalState);
  const handleClose = () =>
    setModalState((prev) => ({
      ...prev,
      open: false,
    }));

  const currentUser = useRecoilValue(userState);
  const [user, loading, error] = useUser(auth);

  useEffect(() => {
    if (currentUser) handleClose();
  }, [currentUser]);

  const toggleView = (view: string) => {
    setModalState({
      ...modalState,
      view: view as typeof modalState.view,
    });
  };

  useEffect(() => {
    if (user) handleClose();
  }, [user]);

  return (
    <div className={`modal-wrapper ${modalState.open ? 'open' : ''}`} onClose={handleClose}>
      <div className="modal-header flex flex-col items-center">
        {modalState.view === "login" && "Login"}
        {modalState.view === "signup" && "Sign Up"}
        {modalState.view === "resetPassword" && "Reset Password"}
      </div>
      <button className="modal-close-button" onClick={handleClose}>X</button>
      <div className="modal-body flex flex-col items-center justify-center pb-6">
        <div className="flex flex-col items-center justify-center w-70%">
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
              <div className="spinner large mt-2 mb-2"></div>
              <p className="text-8pt text-center text-blue-500">
                You are logged in. You will be redirected soon
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default AuthModal;