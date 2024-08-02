"use client"

import { SiteFooter } from "@/components/site-footer"

interface AppLayoutProps {
  children: React.ReactNode
}

export default function AuthLayout({ children }: AppLayoutProps) {

  return (
    <div className="flex min-h-screen flex-col">
      <>HERO</>
      <div className="container flex-1">{children}</div>
        <SiteFooter/>
    </div>
  )
}
