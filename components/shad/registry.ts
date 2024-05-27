import { blocks } from "@/components/shad/blocks"
import { examples } from "@/components/shad/examples"
import { Registry } from "@/components/shad/schema"
import { ui } from "@/components/shad/ui"

export const registry: Registry = [...ui, ...examples, ...blocks]
