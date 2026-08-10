import { redirect } from 'next/navigation'

// Root page redirects to the authenticated area.
// Middleware handles unauthenticated redirect to /sign-in.
export default function RootPage() {
  redirect('/dashboard')
}
