"use client"

import { useActionState } from "react"
import { signInWithCredentials } from "@/actions/auth"

export default function SignInPage() {
  const [state, action, isPending] = useActionState(signInWithCredentials, null)

  return (
    <main className="min-h-screen bg-bgApp flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-bgSurface rounded-2xl p-8 border border-borderSubtle shadow-lg">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-textPrimary">Sign in</h1>
            <p className="mt-1 text-sm text-textSecondary">
              Enter your credentials to access MoneyBudget
            </p>
          </div>

          <form action={action} className="space-y-5">
            {/* Error banner */}
            {state?.error && (
              <div
                role="alert"
                className="bg-budgetOverspent/10 border border-budgetOverspent/30 rounded-lg px-4 py-3 text-sm text-budgetOverspent"
              >
                {state.error}
              </div>
            )}

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-textSecondary mb-1.5"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                disabled={isPending}
                className="w-full bg-bgElevated border border-borderSubtle rounded-lg px-4 py-2.5 text-textPrimary placeholder-textMuted focus:outline-none focus:ring-2 focus:ring-accentBlue/50 focus:border-accentBlue transition-colors disabled:opacity-50"
                placeholder="you@example.com"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-textSecondary mb-1.5"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                disabled={isPending}
                className="w-full bg-bgElevated border border-borderSubtle rounded-lg px-4 py-2.5 text-textPrimary placeholder-textMuted focus:outline-none focus:ring-2 focus:ring-accentBlue/50 focus:border-accentBlue transition-colors disabled:opacity-50"
                placeholder="••••••••"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-accentBlue hover:bg-accentBlue/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg px-4 py-2.5 transition-colors"
            >
              {isPending ? "Signing in…" : "Sign in"}
            </button>
          </form>

          {/* Footer — sign-up disabled */}
        </div>
      </div>
    </main>
  )
}
