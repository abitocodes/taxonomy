"use client"

import { FC, useState } from "react";
import { useAuthState } from "@/hooks/useAuthState"
import { defaultMenuItem } from "@/atoms/directoryMenuAtom";
import useDirectory from "@/hooks/useDirectory";
import Directory from "@/components/reddit/Navbar/Directory";
import RightContent from "@/components/reddit/Navbar/RightContent";
import SearchInput from "@/components/reddit/Navbar/SearchInput";

import { Session } from "@supabase/supabase-js";

const Navbar: FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  console.log("Navbar 컴포넌트: session 상태", session);
  const { user, loading: authLoading, error: authError } = useAuthState(session);

  console.log("Navbar 컴포넌트: useAuthState 결과", { user, authLoading, authError });

  const { onSelectMenuItem } = useDirectory();
  console.log("Navbar rendered");
  return (
    <div className="h-11 p-1.5 flex justify-between">
      <div className="flex items-center w-10 md:w-auto mr-0 md:mr-2 cursor-pointer" onClick={() => onSelectMenuItem(defaultMenuItem)}>
        {/* <img src="/images/redditFace.svg" className="h-7.5" alt="reddit icon" />
        <img src="/images/redditText.svg" className="hidden md:block h-11.5" alt="reddit text" /> */}
      </div>
      <Directory />
      <SearchInput user={user} />
      <RightContent user={user} />
    </div>
  );
};
export default Navbar;