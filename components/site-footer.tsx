import * as React from "react"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { ModeToggle } from "@/components/mode-toggle"
import Link from "next/link"
import { TwitterLogoIcon } from "@radix-ui/react-icons"
import { InstagramLogoIcon } from "@radix-ui/react-icons"
import { Icon } from "@radix-ui/react-select"

export function SiteFooter({ className }: React.HTMLAttributes<HTMLElement>) {
    const links = [
      { href: "/terms", label: "TERMS" },
      { href: "/privacy", label: "PRIVACY" }
    ];

    const socialLinks = [
      { href: "https://instagram.com/dogesoundclub", label: "Instagram", icon: <InstagramLogoIcon className="h-3 w-3" /> },
      { href: "https://twitter.com/dogesoundclub", label: "Twitter", icon: <TwitterLogoIcon className="h-3 w-3" /> }
    ];
    return (
      <footer className="wrapper mt-md flex flex-wrap items-center opacity-60 laptop:mt-xxl">
        <div className="container flex h-full items-center justify-between">
          <div className="flex w-full items-center gap-x-gutter font-cpmo">
            <div className="flex max-md:hidden flex-1 border-t laptop:block">
              <ul className="flex overflow-hidden">
                {links.map((link) => (
                  <li key={link.href} className="tick group relative flex h-nav text-xs uppercase hover:before:h-[12px]">
                    <Link className="-ml-px flex items-center pr-lg" target="_self" rel="" href={link.href}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          <div className="tick relative z-50 flex h-nav flex-1 items-center border-t text-xs uppercase laptop:flex-[0_0_25%]">
            {socialLinks.map((link) => (
              <div key={link.label} className="relative">
                <Link className="tick flex h-nav w-lg items-center pr-sm" href={link.href} target="_blank" rel="noreferrer noopener">
                  <span className="sr-only">{link.label}</span>
                  {link.icon}
                </Link>
              </div>
            ))}
            <div className="ml-auto">© DOGESOUNDCLUB</div>
          </div>
          </div>
        </div>
      </footer>
  )
}
