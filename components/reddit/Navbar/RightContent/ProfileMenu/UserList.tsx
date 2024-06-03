"use client"

import { FC, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { MdOutlineLogin } from "react-icons/md";
import { useResetRecoilState } from "recoil";
import { Icon } from "@radix-ui/react-select";

import { supabase } from "@/utils/supabase/client";

import { channelState } from "@/atoms/channelsAtom";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { Session } from '@supabase/supabase-js';

type UserListProps = {};

const UserList: FC<UserListProps> = () => {
  const resetChannelState = useResetRecoilState(channelState);
  const [session, setSession] = useState<Session | null>(null);

  const logout = async () => {
    resetChannelState();
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout failed:', error.message);
    }
  };

  return (
      <div>
        <div onSelect={() => {}}>
          <div className="flex items-center">
              <CgProfile style={{ fontSize: '20px', marginRight: '8px' }} />
              Profile
          </div>
        </div>
        <div />
        <div onSelect={logout}>
          
          <div className="flex items-center">
          <MdOutlineLogin style={{ fontSize: '20px', marginRight: '8px' }} />
            Log Out
          </div>
        </div>
      </div>
  );
};
export default UserList;
