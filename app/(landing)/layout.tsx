"use client"

import { MainNav } from "@/components/main-nav"
import { SiteFooter } from "@/components/site-footer"

interface AppLayoutProps {
  children: React.ReactNode
}

export default function LandingLayout({ children }: AppLayoutProps) {

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
