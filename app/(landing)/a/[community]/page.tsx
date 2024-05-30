

export default async function APage({ params }: { params: { community: string } }) {
  const slug = params
  console.log("APage called, slug: ", slug)

  return (
    <div>{slug.community}</div>
  )
}
