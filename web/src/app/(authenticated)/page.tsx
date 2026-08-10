import { redirect } from "next/navigation"

/**
 * The root of the authenticated group redirects to /dashboard so that
 * visiting "/" while signed in lands on a meaningful page.
 */
export default function AuthenticatedRootPage() {
  redirect("/dashboard")
}
