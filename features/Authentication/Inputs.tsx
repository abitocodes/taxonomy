import { FC } from "react";
import { useRecoilValue } from "recoil";

import { authModalState } from "@/atoms/auth/authModalAtom";
import { ModalView } from "@/types/atoms/AuthModalState";
import Login from "@/features/Authentication/Login";
import SignUp from "@/features/Authentication/SignUp";

type AuthInputsProps = {
  toggleView: (view: ModalView) => void;
};

const AuthInputs: FC<AuthInputsProps> = ({ toggleView }) => {
  const modalState = useRecoilValue(authModalState);

  return (
    <div className="flex flex-col items-center w-full">
      {modalState.view === "login" ? <Login toggleView={toggleView} /> : <SignUp toggleView={toggleView} />}
    </div>
  );
};
export default AuthInputs;

// Abito
