import { supabase } from "@/utils/supabase/client"
import * as z from "zod"

import { prisma } from "@/lib/prisma"
import { postPatchSchema } from "@/lib/validations/post"

const routeContextSchema = z.object({
  params: z.object({
    postId: z.string(),
  }),
})

export async function DELETE(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    const { params } = routeContextSchema.parse(context)

    if (!(await verifyCurrentUserHasAccessToPost(params.postId))) {
      return new Response(null, { status: 403 })
    }

    await prisma.post.delete({
      where: {
        id: params.postId as string,
      },
    })

    return new Response(null, { status: 204 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    const { params } = routeContextSchema.parse(context)

    if (!(await verifyCurrentUserHasAccessToPost(params.postId))) {
      return new Response(null, { status: 403 })
    }

    const json = await req.json()
    const body = postPatchSchema.parse(json)

    await prisma.post.update({
      where: {
        id: params.postId,
      },
      data: {
        title: body.title,
        body: body.content,
      },
    })

    return new Response(null, { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}

async function verifyCurrentUserHasAccessToPost(postId: string) {
  const { data, error } = await supabase.auth.getSession()
  const session = data.session;

  if (error) {
    console.error("Failed to retrieve session:", error.message)
    return false
  }

  const count = await prisma.post.count({
    where: {
      id: postId,
      creatorId: session?.user.id,
    },
  })

  return count > 0
}