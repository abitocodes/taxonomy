"use client"

import { FC, useState } from "react";
import { useAuthState } from "@/hooks/useAuthState"
import { defaultMenuItem } from "@/atoms/directoryMenuAtom";
import { useDirectory } from "@/hooks/useDirectory";
import { Directory } from "@/components/reddit/Navbar/Directory";
import { RightContent } from "@/components/reddit/Navbar/RightContent";

import { Session } from '@supabase/supabase-js';
import { CommandMenu } from "@/components/command-menu";

const Navbar: FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const { user, loading: authLoading, error: authError } = useAuthState(session);
  const { onSelectMenuItem } = useDirectory();
  
  return (
    <div className="h-11 p-1.5 flex justify-between">
      <div className="flex items-center w-10 md:w-auto mr-0 md:mr-2 cursor-pointer" onClick={() => onSelectMenuItem(defaultMenuItem)}>
      </div>
      <Directory />
      <CommandMenu/>
      <RightContent user={user} />
    </div>
  );
};
export default Navbar;