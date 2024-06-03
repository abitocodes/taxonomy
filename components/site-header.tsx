import { CommandMenu } from "@/components/command-menu"
import { MainNav } from "@/components/main-nav"
import { MobileNav } from "@/components/mobile-nav"
// import { ModeToggle } from "@/components/mode-toggle"
import { FC, useState } from "react";
import { useAuthState } from "@/hooks/useAuthState"
import { useDirectory } from "@/hooks/useDirectory";
import { Directory } from "@/components/reddit/Navbar/Directory";
import { RightContent } from "@/components/reddit/Navbar/RightContent";
import { Session } from '@supabase/supabase-js';
import { defaultMenuItem } from "@/atoms/directoryMenuAtom";

export function SiteHeader() {
  const [session, setSession] = useState<Session | null>(null);
  const { user, loading: authLoading, error: authError } = useAuthState(session);
  const { onSelectMenuItem } = useDirectory();

  return (
    <header className="sticky top-0 left-0 z-50 h-24 w-full bg-dither mb-12">
      <div className="container flex h-full max-w-screen-2xl items-center">
        <MainNav />
      </div>
    </header>
  )
}