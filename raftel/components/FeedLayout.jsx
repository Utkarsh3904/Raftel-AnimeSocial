import Navbar from "@/components/Navbar"
import LeftSidebar from "@/components/LeftSidebar"
import RightSidebar from "@/components/RightSidebar"

export default function FeedLayout({ user, title, subtitle, children, hideRightSidebar }) {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-32 -left-32 h-[520px] w-[520px] rounded-full bg-orange-600/15 blur-[120px]" />
        <div className="absolute top-24 -right-36 h-[460px] w-[460px] rounded-full bg-white/6 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.45) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.45) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
      </div>

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
