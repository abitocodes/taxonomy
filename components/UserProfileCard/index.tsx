import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PublicUser } from "@prisma/client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export const UserProfileCard = ({ publicUser }: { publicUser: PublicUser }) => {
  return (    
        <Card className="w-full font-scor">
            <div className="space-y-1.5 p- flex flex-row items-center">
                <div className="flex items-center space-x-4">
                    <span className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full">
                        <img className="aspect-square h-full w-full" alt="Image" src="/avatars/01.png"/>
                    </span>
                <div>
                    <p className="text-sm font-medium leading-none">Sofia Davis</p>
                    <p className="text-sm text-muted-foreground">m@example.com</p>
                </div>
            </div>
                </div>

          <CardContent>
            <form>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Name of your project" />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="framework">Framework</Label>
                  <Select>
                    <SelectTrigger id="framework">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="next">Next.js</SelectItem>
                      <SelectItem value="sveltekit">SvelteKit</SelectItem>
                      <SelectItem value="astro">Astro</SelectItem>
                      <SelectItem value="nuxt">Nuxt.js</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Cancel</Button>
            <Button>Deploy</Button>
          </CardFooter>
        </Card>
      )
    }   

{/* <div className="w-full h-full flex justify-center items-center m-12">
<div className="w-[20rem] mx-auto flex flex-col gap-2 px-4 shadow-lg border rounded-lg bg-background/80 shadow-green-500/40">
    <div className="w-full flex justify-center items-center">
        <Avatar className="w-6 h-6">
            <AvatarImage src={publicUser.profileImageUrl || ''} alt="Profile Image" />
            <AvatarFallback>CN</AvatarFallback>
        </Avatar>
    </div>
    <div className="w-full h-full text-center flex flex-col gap-4 relative">
        <h1 className="uppercase text-lg font-semibold dark:text-white">
            {publicUser.handler}
        </h1>

        <h2 className="text-xl font-semibold">
            {publicUser.nickName}
        </h2>
        <p>
            Adaptable developer with experience in frontend (Nuxt.js) and backend (Laravel/Nest.js). Passionate
            about web development, quick learner, and committed to exceptional websites. Let's collaborate!
        </p>
    </div>

</div>
</div> */}