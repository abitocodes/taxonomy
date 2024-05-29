import { FC } from "react";
import { useRecoilValue } from "recoil";

import { authModalState } from "@/atoms/authModalAtom";
import { ModalView } from "../../types/AuthModalState";
import Login from "./Login";
import SignUp from "./SignUp";

type AuthInputsProps = {
  toggleView: (view: ModalView) => void;
};

const AuthInputs: FC<AuthInputsProps> = ({ toggleView }) => {
  const modalState = useRecoilValue(authModalState);

  return (
    <div className="flex flex-col items-center w-full mt-4">
      {modalState.view === "login" ? <Login toggleView={toggleView} /> : <SignUp toggleView={toggleView} />}
    </div>
  );
};
export default AuthInputs;
