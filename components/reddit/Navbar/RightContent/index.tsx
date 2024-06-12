"use client"

import { FC } from "react";
import AuthModal from "@/features/Authentication";
import AuthButtons from "@/components/reddit/Navbar/RightContent/AuthButtons";
import Icons from "@/components/reddit/Navbar/RightContent/Icons";
import MenuWrapper from "./ProfileMenu/MenuWrapper";
import { User } from "@supabase/supabase-js";
import { Directory } from "@/components/reddit/Navbar/Directory";
import { useRecoilState } from "recoil";
import { globalAuthState } from "@/atoms/globalAuthStateAtom";

interface RightContentProps {
  user: User | null;
}

export const RightContent: FC<RightContentProps> = ({ user }) => {
  const [globalAuthLoadingState, setAuthLoadingState] = useRecoilState(globalAuthState)
  
  return (
    <>
      <AuthModal />
      <div className="">
        {user ? <>
        <div className="flex space-x-2">
          <Directory />
          <MenuWrapper />
        </div>
          </> : <AuthButtons />}
      </div>
    </>
  );
};
