import { FC } from "react";
import { useRecoilValue } from "recoil";

import { authModalState } from "@/atoms/auth/authModalAtom";
import Login from "@/features/Authentication/Login";
import SignUp from "@/features/Authentication/SignUp";

const AuthInputs = () => {
  const modalState = useRecoilValue(authModalState);

  return (
    <div className="flex flex-col items-center w-full">
      <Login/> 
      {/* {modalState.view === "login" ? <Login/> : <SignUp toggleView={toggleView} />} */}
    </div>
  );
};
export default AuthInputs;

// Abito
