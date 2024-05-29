"use client"

import Navbar from "@/components/reddit/Navbar"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

interface AppLayoutProps {
  children: React.ReactNode
}

  export default function LandingLayout({ children }: AppLayoutProps) {
  return (
    <>
      <SiteHeader />
      {/* <Navbar/> */}
      <main className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </>
  )
}
