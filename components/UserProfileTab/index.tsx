import { useState, useEffect } from "react"

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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

import { GameIconChat_bubble } from "@/components/ReactGameIcons"
import { GameIconAndroid_mask } from "@/components/ReactGameIcons"
import { GameIconRadar_dish } from "@/components/ReactGameIcons"
import { GameIconAerial_signal } from "@/components/ReactGameIcons"
import { GameIconSideswipe } from "@/components/ReactGameIcons"
import { GameIconTelepathy } from "@/components/ReactGameIcons"

import { UserPostsBoard } from "./UserPostsBoard"
import { PublicUser } from "@prisma/client"

export function UserProfileTab({ user }: { user: PublicUser }) {
  return (
    <Tabs defaultValue="posts" className="w-full">
        {/* <div className="flex items-center justify-center font-scor p-6">
          우주인 프로필
        </div> */}
      <TabsList className="grid w-1/3 h-full grid-cols-3">
        <TabsTrigger value="posts">
            <GameIconAerial_signal
              backgroundColor="transparent"
              foregroundColor="hsl(var(--foreground))"
              size={42}
            />
          </TabsTrigger>
        <TabsTrigger value="commentList">
          <GameIconTelepathy
              backgroundColor="transparent"
              foregroundColor="hsl(var(--foreground))"
              size={42}
            />
        </TabsTrigger>
        <TabsTrigger value="profile">
          <GameIconAndroid_mask
              backgroundColor="transparent"
              foregroundColor="hsl(var(--foreground))"
              size={42}
            />
        </TabsTrigger>
      </TabsList>
      <TabsContent value="posts">
        <UserPostsBoard userId={user.id}/>
      </TabsContent>
      <TabsContent value="commentList">
        <Card>
          <CardHeader>
            <CardTitle>CommentList</CardTitle>
            <CardDescription>
              Change your commentList here. After saving, you'll be logged out.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="current">Current commentList</Label>
              <Input id="current" type="commentList" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="new">New commentList</Label>
              <Input id="new" type="commentList" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save commentList</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
