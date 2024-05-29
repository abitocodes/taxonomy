import { Badge } from "@/components/ui/badge"
import { ComponentProps } from "react"

export function getBadgeVariantFromLabel(
    label: string
  ): ComponentProps<typeof Badge>["variant"] {
    if (["Techno"].includes(label.toLowerCase())) {
      return "default"
    }
  
    if (["Doge Sound"].includes(label.toLowerCase())) {
      return "outline"
    }
  
    return "secondary"
  }