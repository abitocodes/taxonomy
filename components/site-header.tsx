import { MainNav } from "@/components/main-nav"

export function SiteHeader() {
  return (
    <header className="sticky top-0 left-0 z-50 h-24 w-full bg-dither mb-12">
      <div className="container flex h-full max-w-screen-2xl items-center">
        <MainNav />
      </div>
    </header>
  )
}