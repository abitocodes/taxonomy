import { ComponentProps } from "react"
import formatDistanceToNow from "date-fns/formatDistanceToNow"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/shad/new-york/ui/badge"
import { ScrollArea } from "@/components/shad/new-york/ui/scroll-area"
import { Separator } from "@/components/shad/new-york/ui/separator"
import { SoundPost } from "@/app/(landing)/inbox/data"
import { useSoundPost } from "@/app/(landing)/inbox/use-soundpost"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/shad/default/ui/avatar"

interface MailListProps {
  items: SoundPost[]
}

export function SoundPostList({ items }: MailListProps) {
  const [mail, setMail] = useSoundPost()

  return (
    // <ScrollArea className="h-screen">
      <div className="flex flex-col gap-6 p-4 pt-0">
        {items.map((item) => (
          <button
            key={item.id}
            className={cn(
              "flex flex-col items-start gap-2 rounded-lg p-3 text-left text-sm transition-all hover:bg-accent",
              // mail.selected === item.id && "bg-muted"
            )}
            onClick={() =>
              setMail({
                ...mail,
                selected: item.id,
              })
            }
          >
                  <div className="flex items-center space-x-2 ">
        <Avatar className="hidden h-6 w-6 border border-primary sm:flex">
          <AvatarImage src="/avatars/01.png" alt="Avatar"/>
        </Avatar>
        <div>
          <p className="text-xs font-semibold">pinae <span className="text-xs text-gray-500">{formatDistanceToNow(new Date(item.date), {
                    addSuffix: true,
                  })}</span> </p>
          
        </div>
        </div>
            <div className="flex space-x-4">
                              <Image
                alt="Vinyl record"
                className="h-[144px] w-[144px]"
                height="500"
                src="/placeholder.svg"
                style={{
                  aspectRatio: "500/500",
                  objectFit: "cover",
                }}
                width="500"
              />
              <div>
            <div className="flex w-full flex-col">

              <div className="flex items-center">

                <div className="flex items-center gap-2">
                  <div className="font-semibold">{item.title}</div>
                  {/* {!item.read && (
                    <span className="flex h-2 w-2 rounded-full bg-blue-600" />
                  )} */}
                </div>
                <div
                  className={cn(
                    "ml-auto text-xs",
                    mail.selected === item.id
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {/* {formatDistanceToNow(new Date(item.date), {
                    addSuffix: true,
                  })} */}
                </div>
              </div>
              <div className="text-xs font-medium">{item.account}</div>
            </div>
            <div className="line-clamp-2 h-16 text-xs text-muted-foreground">
              {item.description.substring(0, 300)}
            </div>
            {item.channels.length ? (
              <div className="mt-2 flex items-center gap-2">
                {item.channels.map((channel) => (
                  <Badge key={channel} variant={getBadgeVariantFromLabel(channel)}>
                    {channel}
                  </Badge>
                ))}
              </div>
            ) : null}
            </div>
            </div>
          </button>
        ))}
      </div>
    // </ScrollArea>
  )
}

function getBadgeVariantFromLabel(
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
