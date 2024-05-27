import { FC } from "react";
import { useAuthState } from "@/hooks/useAuthState"
import { defaultMenuItem } from "@/atoms/directoryMenuAtom";
import useDirectory from "@/hooks/useDirectory";
import Directory from "@/components/reddit/Navbar/Directory";
import RightContent from "@/components/reddit/Navbar/RightContent";
import SearchInput from "@/components/reddit/Navbar/SearchInput";

const Navbar: FC = () => {
  const { user, loading: authLoading, error: authError } = useAuthState();

  // Use <Link> for initial build; implement directory logic near end
  const { onSelectMenuItem } = useDirectory();

  return (
    <div className="bg-white h-11 p-1.5 flex justify-between">
      <div className="flex items-center w-10 md:w-auto mr-0 md:mr-2 cursor-pointer" onClick={() => onSelectMenuItem(defaultMenuItem)}>
        <img src="/images/redditFace.svg" className="h-7.5" alt="reddit icon" />
        <img src="/images/redditText.svg" className="hidden md:block h-11.5" alt="reddit text" />
      </div>
      {user && <Directory />}
      <SearchInput user={user} />
      <RightContent user={user} />
    </div>
  );
};
export default Navbar;