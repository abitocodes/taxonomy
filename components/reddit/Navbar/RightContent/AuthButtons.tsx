import { FC } from "react";
import { useSetRecoilState } from "recoil";

import { Button } from "@/components/ui/button";

import { authModalState } from "@/atoms/authModalAtom";

type AuthButtonsProps = {};

const AuthButtons: FC<AuthButtonsProps> = () => {
  const setAuthModalState = useSetRecoilState(authModalState);

  return (
    <>
      <Button
        className="border border-gray-300 text-gray-700 py-1 hidden sm:flex w-18 md:w-28 mr-2"
        onClick={() => setAuthModalState({ open: true, view: "login" })}
      >
        Log In
      </Button>
      <Button
        className="bg-blue-500 text-white py-1 hidden sm:flex w-18 md:w-28 mr-2"
        onClick={() => setAuthModalState({ open: true, view: "signup" })}
      >
        Sign Up
      </Button>
    </>
  );
};
export default AuthButtons;
