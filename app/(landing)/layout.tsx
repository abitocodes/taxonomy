"use client"

import { useState } from "react"
import { useDirectory } from "@/hooks/useDirectory"
import { useAuthState } from "@/hooks/useAuthState"
import { Session } from "@supabase/supabase-js"
import { CommandMenu } from "@/components/command-menu"
import { MainNav } from "@/components/main-nav"
import { MobileNav } from "@/components/mobile-nav"
import { Directory } from "@/components/reddit/Navbar/Directory";
import { RightContent } from "@/components/reddit/Navbar/RightContent";
import { SiteFooter } from "@/components/site-footer"

interface AppLayoutProps {
  children: React.ReactNode
}

export default function LandingLayout({ children }: AppLayoutProps) {
  const [session, setSession] = useState<Session | null>(null);
  const { user, loading: authLoading, error: authError } = useAuthState(session);
  const { onSelectMenuItem } = useDirectory();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 left-0 z-50 h-24 w-full bg-dither">
        <div className="container flex h-full max-w-screen-2xl items-center">
          <MainNav />
        </div>
      </header>
      <div className="container flex-1">{children}</div>
        <SiteFooter/>
    </div>
  )
}
