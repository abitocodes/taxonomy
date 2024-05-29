import { FC } from "react";
import { MdOutlineLogin } from "react-icons/md";
// import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
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
import { AuthModalState } from "@/types/AuthModalState";

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