"use client"

import { FC, useState } from "react";
import { useAuthState } from "@/hooks/useAuthState"
import { FaRedditSquare } from "react-icons/fa";
import { IoSparkles } from "react-icons/io5";
import { VscAccount } from "react-icons/vsc";
import { useRecoilState } from "recoil";

import { authModalState } from "@/atoms/authModalAtom";
import NoUserList from "./NoUserList";
import UserList from "./UserList";
import { Session } from "@supabase/supabase-js";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem
} from "@/components/ui/context-menu";

type MenuWrapperProps = {};

const MenuWrapper: FC<MenuWrapperProps> = () => {
  const [authModal, setModalState] = useRecoilState(authModalState);
  const [session, setSession] = useState<Session | null>(null);
  const { user, loading: authLoading, error: authError } = useAuthState(session);

  return (
    <ContextMenu>
      <ContextMenuTrigger className="cursor-pointer p-0.5 rounded-md hover:outline hover:outline-1 hover:outline-gray-200">
        <div className="flex items-center">
          <div className="flex items-center">
            {user ? (
              <>
                <FaRedditSquare className="text-gray-300 text-3xl mr-1" />
                <div className="hidden lg:flex flex-col text-xs items-start mr-8">
                  <span className="font-bold">{user?.id || user?.email?.split("@")[0]}</span>
                  <div className="flex items-center">
                    <IoSparkles className="text-brand-100 mr-1" />
                    <span className="text-gray-400">1 karma</span>
                  </div>
                </div>
              </>
            ) : (
              <VscAccount className="text-gray-400 text-3xl mr-1" />
            )}
          </div>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        {user ? (
            <ContextMenuItem>
              <UserList />
            </ContextMenuItem>
          ) : (
            <ContextMenuItem>
              <NoUserList setModalState={setModalState} />
            </ContextMenuItem>
          )}
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default MenuWrapper;