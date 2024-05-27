import { Input } from "@/components/shad/new-york/ui/input"
import { Label } from "@/components/shad/new-york/ui/label"

export default function InputFile() {
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="picture">Picture</Label>
      <Input id="picture" type="file" />
    </div>
  )
}
