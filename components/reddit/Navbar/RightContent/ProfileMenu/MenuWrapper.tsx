"use client"

import { FC, useState } from "react";
import { useAuthState } from "@/hooks/useAuthState"
import { FaRedditSquare } from "react-icons/fa";
import { IoSparkles } from "react-icons/io5";
import { VscAccount } from "react-icons/vsc";
import { useRecoilState } from "recoil";

import { authModalState } from "@/atoms/auth/authModalAtom";
import NoUserList from "./NoUserList";
import UserList from "./UserList";
import { Session } from '@supabase/supabase-js';

import { Button } from "@/components/ui/button"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type MenuWrapperProps = {};

const MenuWrapper: FC<MenuWrapperProps> = () => {
  const [authModal, setModalState] = useRecoilState(authModalState);
  const [session, setSession] = useState<Session | null>(null);
  const { sessionUser, authLoadingState, authError } = useAuthState(session);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
      <Button
        variant="ghost"
        className="flex justify-center w-full"
      >
        <div className="flex items-center space-x-2">
          <FaRedditSquare className="text-gray-300 text-3xl" />
        </div>
      </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <div className="shadow-lg mt-1 rounded-md">
          <UserList />
        </div>
      </DropdownMenuContent>
      </DropdownMenu>
  );
};
export default MenuWrapper;