import { cookies } from "next/headers"
import Image from "next/image"

import { SoundPost } from "@/app/(landing)/inbox/components/soundPost"
import { soundposts } from "@/app/(landing)/inbox/data"
import { accounts } from "@/app/(landing)/inbox/data"
import Tracklist from '@/components/Tracklist';

export default function InboxPage() {
  const layout = cookies().get("react-resizable-panels:layout")
  const collapsed = cookies().get("react-resizable-panels:collapsed")

  const defaultLayout = layout ? JSON.parse(layout.value) : undefined
  const defaultCollapsed = collapsed ? JSON.parse(collapsed.value) : undefined

  return (
    <>
      <div className="hidden flex-col border border-transparent py-4 md:flex">
        {/* <Tracklist /> */}
        <SoundPost
          // accounts={accounts}
          soundPosts={soundposts}
          defaultLayout={defaultLayout}
          defaultCollapsed={defaultCollapsed}
          navCollapsedSize={4}
        />
      </div>
    </>
  )
}
