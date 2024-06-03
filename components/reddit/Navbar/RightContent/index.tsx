"use client"

import { FC } from "react";
import AuthModal from "@/features/Authentication";
import AuthButtons from "@/components/reddit/Navbar/RightContent/AuthButtons";
import Icons from "@/components/reddit/Navbar/RightContent/Icons";
import MenuWrapper from "./ProfileMenu/MenuWrapper";
import { User } from "@supabase/supabase-js";
import { Directory } from "@/components/reddit/Navbar/Directory";

interface RightContentProps {
  user: User | null;
}

export const RightContent: FC<RightContentProps> = ({ user }) => {
  return (
    <>
      <AuthModal />
      <div className="">
        {user ? <>
        <div className="grid grid-cols-1 gap-2">
          <Directory />
          <MenuWrapper />
        </div>
          </> : <AuthButtons />}
      </div>
    </>
  );
};
