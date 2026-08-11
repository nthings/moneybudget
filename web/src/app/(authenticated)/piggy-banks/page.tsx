import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { eq } from "drizzle-orm"
import { db } from "@/db"
import { piggyBankGoals } from "@/db/schema"
import { GoalCard } from "@/components/GoalCard"
import { CreateGoalForm } from "@/components/CreateGoalForm"

export default async function PiggyBanksPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/sign-in")

  const userId = session.user.id

  // ── Fetch all savings goals for this user ──────────────────────────────
  const goals = await db.query.piggyBankGoals.findMany({
    where: eq(piggyBankGoals.userId, userId),
    orderBy: (t, { asc }) => [asc(t.createdAt)],
  })

  return (
    <div className="p-8 max-w-2xl">
      {/* ── Page header ──────────────────────────────────────────────────── */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-textPrimary mb-1">Piggy Banks</h1>
        <p className="text-textSecondary text-sm">
          Track your savings goals and deposit progress.
        </p>
      </div>

      {/* ── Goal list or empty state ──────────────────────────────────────── */}
      {goals.length === 0 ? (
        <div className="mb-6 rounded-lg border border-dashed border-zinc-700 p-8 text-center">
          <p className="text-sm text-zinc-500">
            No savings goals yet. Create your first goal below.
          </p>
        </div>
      ) : (
        <div className="mb-6 flex flex-col gap-4">
          {goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </div>
      )}

      {/* ── Create goal form ─────────────────────────────────────────────── */}
      <CreateGoalForm />
    </div>
  )
}
