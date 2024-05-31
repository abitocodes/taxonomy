import { FC } from "react";
import { useSetRecoilState } from "recoil";

import { Button } from "@/components/ui/button";

import { authModalState } from "@/atoms/authModalAtom";

type AuthButtonsProps = {};

const AuthButtons: FC<AuthButtonsProps> = () => {
  const setAuthModalState = useSetRecoilState(authModalState);

  return (
    <>
      {/* <div className="flex items-center space-x-4"> */}
      <Button
        onClick={() => setAuthModalState({ open: true, view: "login" })}
      >
        로그인
      </Button>
      {/* <Button
        onClick={() => setAuthModalState({ open: true, view: "signup" })}
      >
        Sign Up
      </Button> */}
      {/* </div> */}
    </>
  );
};
export default AuthButtons;

