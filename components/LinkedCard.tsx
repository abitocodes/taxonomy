import Link from "next/link"
import { cn } from "@/lib/utils";
import React from "react";

export const LinkedCard = React.forwardRef<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement>>(
    ({ className, ...props }, ref) => (
      props.href ? (
        <Link
          ref={ref}
          href={props.href} // 명시적으로 href를 Url 타입으로 전달
          className={cn(
            "flex w-full flex-col items-center rounded-xl bg-cuted/50 p-6 text-card-foreground shadow transition-colors hover:bg-card sm:p-10",
            className
          )}
          {...props}
        />
      ) : null
    )
);