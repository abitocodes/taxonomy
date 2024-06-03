// "use client"

// import { FC, useState } from "react";
// import { useAuthState } from "@/hooks/useAuthState"
// import { FaRedditSquare } from "react-icons/fa";
// import { IoSparkles } from "react-icons/io5";
// import { VscAccount } from "react-icons/vsc";
// import { useRecoilState } from "recoil";

// import { authModalState } from "@/atoms/authModalAtom";
// import NoUserList from "./NoUserList";
// import UserList from "./UserList";
// import { Session } from '@supabase/supabase-js';

// import { Button } from "@/components/ui/button"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuGroup,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuPortal,
//   DropdownMenuSeparator,
//   DropdownMenuShortcut,
//   DropdownMenuSub,
//   DropdownMenuSubContent,
//   DropdownMenuSubTrigger,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"

// type MenuWrapperProps = {};

// const MenuWrapper: FC<MenuWrapperProps> = () => {
//   const [authModal, setModalState] = useRecoilState(authModalState);
//   const [session, setSession] = useState<Session | null>(null);
//   const { user, loading: authLoading, error: authError } = useAuthState(session);
//   return (
//       <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//       <Button
//         variant="outline"
//         className="w-[100px] justify-between"
//       >
//         <div className="flex items-center">
//           <div className="flex items-center">
//             {user ? (
//               <>
//                 <FaRedditSquare className="text-gray-300 text-3xl mr-1" />
//                 <div className={`hidden lg:flex flex-col text-xs items-start mr-8`}>
//                   <span className="font-bold">
//                     {/* {(user?.id ?? user?.email?.split("@")[0] ?? '').slice(0, 12) + ((user?.id ?? user?.email?.split("@")[0] ?? '').length > 12 ? '...' : '')} */}
//                   </span>
//                   {/* <div className="flex items-center">
//                     <IoSparkles className="text-brand-100 mr-1" />
//                     <span className="text-gray-400">0 MIX</span>
//                   </div> */}
//                 </div>
//               </>
//             ) : (
//               <VscAccount className="text-gray-400 text-3xl mr-1" />
//             )}
//           </div>
//           <svg className="w-6 h-6 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
//             <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
//           </svg>
//         </div>
//       </Button>
//       </DropdownMenuTrigger>
//       <div className="absolute shadow-lg mt-1 rounded-md">
//         {user ? <UserList /> : <NoUserList setModalState={setModalState} />}
//       </div>
//       </DropdownMenu>
//   );
// };
// export default MenuWrapper;


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
import { Session } from '@supabase/supabase-js';

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type MenuWrapperProps = {};

const MenuWrapper: FC<MenuWrapperProps> = () => {
  const [authModal, setModalState] = useRecoilState(authModalState);
  const [session, setSession] = useState<Session | null>(null);
  const { user, loading: authLoading, error: authError } = useAuthState(session);
  return (

    <Popover>
      <PopoverTrigger asChild>
      <Button
        variant="outline"
        className="flex justify-center w-full"
      >
        <div className="flex items-center space-x-2">
            {user ? (
              <>
                <FaRedditSquare className="text-gray-300 text-3xl" />
                <div className="flex">
                  <div>
                  <span className="font-bold text-xs">
                    {(user?.id ?? user?.email?.split("@")[0] ?? '').slice(0, 8) + ((user?.id ?? user?.email?.split("@")[0] ?? '').length > 8 ? ' ..' : '')}
                  </span>
                  {/* <div className="flex items-center">
                    <IoSparkles className="text-brand-100 mr-1" />
                    <span className="text-gray-400">0 MIX</span>
                  </div> */}
                  </div>
                  <svg className="w-6 h-6 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </>
            ) : (
              <VscAccount className="text-gray-400 text-3xl mr-1" />
            )}
        </div>
      </Button>
      </PopoverTrigger>
      <PopoverContent>
      <div className="absolute shadow-lg mt-1 rounded-md">
        {user ? <UserList /> : <NoUserList setModalState={setModalState} />}
      </div>
      </PopoverContent>
      </Popover>
  );
};
export default MenuWrapper;