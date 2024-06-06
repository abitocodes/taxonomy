import { FC } from "react";
import { MdOutlineLogin } from "react-icons/md";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { AuthModalState } from "@/types/atoms/AuthModalStateType";

type NoUserListProps = {
  setModalState: (value: AuthModalState) => void;
};

const NoUserList: FC<NoUserListProps> = ({ setModalState }) => {
  return (
    <>
        <DropdownMenuItem className="menuItem" onClick={() => setModalState({ open: true, view: "login" })}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <MdOutlineLogin style={{ fontSize: '20px', marginRight: '8px' }} />
            Log In / Sign Up
          </div>
        </DropdownMenuItem>
    </>
  );
};
export default NoUserList;