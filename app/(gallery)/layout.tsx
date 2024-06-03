import Link from "next/link"

import { docsConfig } from "@/config/docs"
import { siteConfig } from "@/config/site"
import { Icons } from "@/components/icons"
import { MainNav } from "@/components/main-nav"
import { DocsSearch } from "@/components/search"
import { DocsSidebarNav } from "@/components/sidebar-nav"
import { SiteFooter } from "@/components/site-footer"

export type NavItem = {
  title: string
  href: string
  disabled?: boolean
}

interface DocsLayoutProps {
  children: React.ReactNode
}

export default function GalleryLayout({ children }: DocsLayoutProps) {
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


// "use client"

// import { useState } from "react"
// import { useDirectory } from "@/hooks/useDirectory"
// import { useAuthState } from "@/hooks/useAuthState"
// import { Session } from "@supabase/supabase-js"
// import { CommandMenu } from "@/components/command-menu"
// import { MainNav } from "@/components/main-nav"
// import { MobileNav } from "@/components/mobile-nav"
// import { Directory } from "@/components/reddit/Navbar/Directory";
// import { RightContent } from "@/components/reddit/Navbar/RightContent";
// import { SiteFooter } from "@/components/site-footer"

// interface AppLayoutProps {
//   children: React.ReactNode
// }

// export default function DocsLayout({ children }: DocsLayoutProps) {
//   return (
//     <div className="flex min-h-screen flex-col">
//       <header className="sticky top-0 left-0 z-50 h-24 w-full bg-dither">
//         <div className="container flex h-full max-w-screen-2xl items-center">
//           <MainNav />
//           <div className="flex flex-1 items-center space-x-4 sm:justify-end">
//             <div className="flex-1 sm:grow-0">
//               <DocsSearch />
//             </div>
//           </div>
//         </div>
//       </header>
//       <div className="container flex-1">{children}</div>
//         <SiteFooter/>
//     </div>
//   )
// }

