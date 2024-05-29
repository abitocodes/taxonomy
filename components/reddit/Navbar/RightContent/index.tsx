"use client"

import { FC } from "react";
import AuthModal from "@/features/Authentication";
import AuthButtons from "./AuthButtons";
import Icons from "./Icons";
import MenuWrapper from "./ProfileMenu/MenuWrapper";
import { User } from "@supabase/supabase-js";

interface RightContentProps {
  user: User | null;
}

const RightContent: FC<RightContentProps> = ({ user }) => {
  console.log("RightContent rendered, user:", user);
  return (
    <>
      <AuthModal />
      <div className="flex justify-between items-center">
        {user ? <Icons /> : <AuthButtons />}
        <MenuWrapper />
      </div>
    </>
  );
};

export default RightContent;