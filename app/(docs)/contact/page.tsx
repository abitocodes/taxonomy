export const metadata = {
  title: "Contact",
}

export default function IndexPage() {
  return (
    <div className="container max-w-4xl py-6 lg:py-10 h-screen bg-background/80">
      <div className="my-8" />
      {/* <div className="flex max-w-[980px] flex-col items-start gap-2"> */}
        <div>
          <div className="space-y-4">
            <div className="space-y-2 gap-2">
              <h2 className="text-xl font-semibold">Contact</h2>
              <div><a href="mailto:abito@ayias.io" className="text-gray-muted hover:text-gray-muted-foreground">abito@ayias.io</a></div>
            </div>
          </div>
      </div>
    </div>
  )
}