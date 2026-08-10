import { handlers } from "@/auth"
import { NextRequest } from "next/server"

/**
 * Rewrite the request URL so Auth.js sees the public-facing host instead of
 * the internal Docker address (localhost:3000). Auth.js reads req.url directly
 * in its API route handler path (toInternalRequest), bypassing trustHost header
 * detection that the server-action path uses.
 *
 * Works for: LAN IP (192.168.x.x), ngrok tunnels, any reverse proxy that
 * forwards X-Forwarded-Host.
 */
function withPublicHost(req: NextRequest): NextRequest {
  const fwdHost = req.headers.get("x-forwarded-host")
  const fwdProto = req.headers.get("x-forwarded-proto")

  if (!fwdHost) return req

  const proto = fwdProto ?? req.nextUrl.protocol.replace(":", "")
  const internalOrigin = req.nextUrl.origin           // http://localhost:3000
  const publicOrigin = `${proto}://${fwdHost}`        // http://192.168.68.12:3010

  if (internalOrigin === publicOrigin) return req

  return new NextRequest(req.url.replace(internalOrigin, publicOrigin), req)
}

export const GET = (req: NextRequest) => handlers.GET(withPublicHost(req))
export const POST = (req: NextRequest) => handlers.POST(withPublicHost(req))
