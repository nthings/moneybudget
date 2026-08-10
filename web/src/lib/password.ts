import bcrypt from "bcryptjs"

const SALT_ROUNDS = 10

/**
 * Hash a plaintext password with bcrypt.
 * bcryptjs is pure JS — no native build deps, safe in Docker Alpine.
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

/**
 * Verify a plaintext password against a bcrypt hash.
 * Returns false for any mismatch, never throws.
 */
export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash)
}
