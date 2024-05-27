"use client"

import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { RecoilRoot } from "recoil"

interface AppLayoutProps {
  children: React.ReactNode
}

// export default function AppLayout({ children }: AppLayoutProps) {
  export default function LandingLayout({ children }: AppLayoutProps) {
  return (
    <>
      <SiteHeader />
      <RecoilRoot>
      <main className="flex-1">
        {children}
      </main>
      <SiteFooter />
      </RecoilRoot>
    </>
  )
}
