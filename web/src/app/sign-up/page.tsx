import { redirect } from "next/navigation"

// Sign-ups are disabled — this app is invite-only.
export default function SignUpPage() {
  redirect("/sign-in")
}
