import Navbar from "@/components/Navbar"
import LeftSidebar from "@/components/LeftSidebar"
import RightSidebar from "@/components/RightSidebar"

export default function FeedLayout({ user, title, subtitle, children, hideRightSidebar }) {
  return (
    <main className="min-h-screen bg-black text-white">

      <Navbar user={user} />

      <div className="mx-auto flex w-full max-w-7xl gap-6 px-5 py-6">
        <LeftSidebar user={user} />

        <div className="min-w-0 flex-1">
          {(title || subtitle) && (
            <div className="mb-4">
              {title && <h1 className="text-xl font-extrabold tracking-tight text-white">{title}</h1>}
              {subtitle && <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>}
            </div>
          )}
          {children}
        </div>

        {!hideRightSidebar && <RightSidebar user={user} />}
      </div>
    </main>
  )
}
