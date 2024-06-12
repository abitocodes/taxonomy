"use client"

import { FC, useState } from "react";
import { useAuthState } from "@/hooks/useAuthState"
import { defaultMenuItem } from "@/atoms/directoryMenuAtom";
import { useDirectory } from "@/hooks/useDirectory";
import { Directory } from "@/components/reddit/Navbar/Directory";
import { RightContent } from "@/components/reddit/Navbar/RightContent";

import { Session } from '@supabase/supabase-js';
import { CommandMenu } from "@/components/command-menu";
import { globalAuthState } from "@/atoms/globalAuthStateAtom";
import { useRecoilValue } from "recoil";

const Navbar: FC = () => {
  const { globalSessionData, globalAuthLoadingState } = useRecoilValue(globalAuthState);
  const { onSelectMenuItem } = useDirectory();
  
  return (
    <div className="h-11 p-1.5 flex justify-between">
      <div className="flex items-center w-10 md:w-auto mr-0 md:mr-2 cursor-pointer" onClick={() => onSelectMenuItem(defaultMenuItem)}>
      </div>
      <Directory />
      <CommandMenu/>
      <RightContent user={globalSessionData?.user ?? null} />
    </div>
  );
};
export default Navbar;