import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Sidebar from "@/components/Sidebar"
import { signOutUser } from "@/actions/auth"

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session) {
    redirect("/sign-in")
  }

  return (
    <div className="flex h-screen overflow-hidden bg-bgApp">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Mobile-only top bar */}
        <header className="md:hidden flex items-center justify-between px-4 h-12 shrink-0 bg-sidebarBg border-b border-borderSubtle">
          <span className="text-textPrimary font-semibold tracking-tight">
            moneybudget
          </span>
          <form action={signOutUser}>
            <button
              type="submit"
              className="text-textSecondary hover:text-textPrimary text-sm transition-colors"
            >
              Sign out
            </button>
          </form>
        </header>
        {/* pb reserves space for the fixed mobile bottom nav + iOS home indicator */}
        <main className="flex-1 overflow-y-auto pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-0">
          {children}
        </main>
      </div>
    </div>
  )
}
