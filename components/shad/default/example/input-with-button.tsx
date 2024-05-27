import { Button } from "@/components/shad/default/ui/button"
import { Input } from "@/components/shad/default/ui/input"

export default function InputWithButton() {
  return (
    <div className="flex w-full max-w-sm items-center space-x-2">
      <Input type="email" placeholder="Email" />
      <Button type="submit">Subscribe</Button>
    </div>
  )
}
