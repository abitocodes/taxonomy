import Link from "next/link"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { CommandMenu } from "@/components/command-menu"
import { Icons } from "@/components/icons"
import { MainNav } from "@/components/main-nav"
import { MobileNav } from "@/components/mobile-nav"
import { ModeToggle } from "@/components/mode-toggle"
import { buttonVariants } from "@/components/shad/new-york/ui/button"
import WalletLogin from "@/components/walletLogin"
// import DeployButton from "@/components/auth/supabase/DeployButton";
import AuthButton from "@/components/auth/AuthButton";
import { supabase } from "@/utils/supabase/client";
import { Suspense, useState, useEffect } from "react"
import { RecoilRoot } from "recoil"

export function SiteHeader() {
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        setIsSupabaseConnected(data.session !== null);
      } catch (error) {
        console.error('Supabase 연결 확인 중 오류 발생:', error);
        setIsSupabaseConnected(false);
      }
    };

    checkConnection();
  }, []);
  
  return (
    // <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    // <RecoilRoot>
    <header className="bg-dither sticky left-0 top-0 z-50 mb-12 h-24 w-full">
      <div className="container flex h-full max-w-screen-2xl items-center">
        <MainNav />
        <MobileNav items={[
          { title: "Home", href: "/home", disabled: false },
          { title: "About", href: "/about", disabled: false },
          { title: "Contact", href: "/contact", disabled: false }
        ]} />
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <CommandMenu/>
          </div>
          <ModeToggle/>
          <Suspense fallback={<>Loading...</>}>
          {isSupabaseConnected && <AuthButton/>}
          </Suspense>
        </div>
      </div>
    </header>
    // </RecoilRoot>
  )
}
