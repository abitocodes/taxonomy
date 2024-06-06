import { useSetRecoilState } from "recoil";
import { Button } from "@/components/ui/button";
import { LockClosedIcon } from "@radix-ui/react-icons";

import { authModalState } from "@/atoms/auth/authModalAtom";
import { defaultAuthModalState } from "@/atoms/auth/authModalAtom";

type AuthButtonsProps = {};

function AuthButtons({}: AuthButtonsProps): JSX.Element {
  const setAuthModalState = useSetRecoilState(authModalState);

  return (
    <>
      {/* <div className="flex items-center space-x-4"> */}
      <Button
        className="font-scor"
        onClick={() => setAuthModalState(
          (prev) => {
            console.log(prev); // 여기에 console.log를 추가합니다.
            return { 
              ...prev, 
              emailInputModalOpen: true 
            };
          })}
      >
        <LockClosedIcon className="mr-2 h-4 w-4" />
        로그인
      </Button>
      {/* <Button
        onClick={() => setAuthModalState({ open: true, view: "signup" })}
      >
        강
      </Button> */}
      {/* </div> */}
    </>
  );
};
export default AuthButtons;

