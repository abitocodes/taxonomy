"use client"

import Link from "next/link"
import { usePathname, useSelectedLayoutSegment } from "next/navigation"
import React, { useEffect } from "react";

import { MainNavItem } from "types"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { MobileNav } from "@/components/mobile-nav"
import { useDirectory } from "@/hooks/useDirectory"
import { defaultMenuItem } from "@/atoms/directoryMenuAtom";

import { CommandMenu } from "@/components/command-menu"
// import { ModeToggle } from "@/components/mode-toggle"
import { FC, useState } from "react";
import { useAuthState } from "@/hooks/useAuthState"
import { Directory } from "@/components/reddit/Navbar/Directory";
import { RightContent } from "@/components/reddit/Navbar/RightContent";
import { ReloadIcon } from "@radix-ui/react-icons";
import { globalAuthState } from "@/atoms/globalAuthStateAtom";
import { useRecoilValue } from "recoil";

interface MainNavProps {
  items?: MainNavItem[]
  children?: React.ReactNode
}

export function MainNav({ items, children }: MainNavProps) {
  const { globalSessionData, globalAuthLoadingState } = useRecoilValue(globalAuthState);
  const segment = useSelectedLayoutSegment();
  const [showMobileMenu, setShowMobileMenu] = React.useState<boolean>(false);
  const { onSelectMenuItem } = useDirectory();

  const url = usePathname();
  const isHidden = url === "/docs" || url === "/contact" || url === "/gallery";

  return (
    <div className="flex max-md:hidden wrapper w-full h-full items-center justify-between gap-x-gutter">
      <div className="w-full flex gap-6 md:gap-10">
        <Link
          href="/"
          className="mr-6 flex items-center"
          onClick={() => onSelectMenuItem(defaultMenuItem)}
        >
          <Icons.logo className="h-6 w-6" />
          <Icons.logoText className="h-6 w-24" />
        </Link>
        <div className="border-t laptop:flex-1 font-bank">
          <ul className="flex overflow-hidden">
            <li className="tick group relative flex h-nav text-lg uppercase hover:before:h-[12px]">
              <Link className="-ml-px flex items-center pr-lg" href="/">
                <span>FEED</span>
              </Link>
            </li>
            {/* <li className="tick group relative flex h-nav text-lg uppercase hover:before:h-[12px]">
              <Link className="-ml-px flex items-center pr-lg" href="/ch">
                <span>CHANNELS</span>
              </Link>
            </li> */}
            <li className="tick group relative flex h-nav text-lg uppercase hover:before:h-[12px]">
              <Link className="-ml-px flex items-center pr-lg" href="/docs">
                <span>DOCS</span>
              </Link>
            </li>
            <li className="tick group relative flex h-nav text-lg uppercase hover:before:h-[12px]">
              <Link className="-ml-px flex items-center pr-lg" href="/gallery">
                <span>GALLERY</span>
              </Link>
            </li>
            {/* <li className="tick group relative flex h-nav text-lg uppercase hover:before:h-[12px]">
              <Link className="-ml-px flex items-center pr-lg" href="/contact">
                <span>Contact</span>
              </Link>
            </li> */}
          </ul>
        </div>
      </div>
      <div className="flex items-center">
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          {globalAuthLoadingState ? <ReloadIcon className="mr-2 h-4 w-4 animate-spin"/> : (!isHidden && <RightContent user={globalSessionData?.user!} />)}
        </div>
      </div>
    </div>
  );
}