import type { AppBindings, IJwtpayload } from '@/lib/types'
import type { Context, Next } from 'hono'
import type { JwtVariables } from 'hono/jwt'
import env from '@/env'
import * as authService from '@/modules/auth/services/auth.service'
import * as userService from '@/modules/user/services/user.service'
import { createMiddleware } from 'hono/factory'
import { decode, jwt, verify } from 'hono/jwt'
import { auth } from 'hono/utils/basic-auth'
import * as HttpStatusCodes from 'stoker/http-status-codes'
import * as HttpStatusPhrases from 'stoker/http-status-phrases'
// import { Jwt } from 'hono/utils/jwt'

// Middleware to verify Bearer Token
export const bearerAuthMiddleware = createMiddleware< AppBindings> (async (ctx, next) => {
  const authorizationHeader = ctx.req.header('Authorization')

  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    return ctx.json({ message: 'Authorization header missing or invalid' }, 401)
  }
  // Extract the token from the header
  const token = authorizationHeader.split(' ')[1]

  try {
    // Verify the token (Assuming a secret for HMAC or public key for RSA)
    const secret = env.JWT_SECRET

    const { payload } = await verify(token, secret)

    // Attach the decoded payload to the context for further use
    const decoded = decode(token).payload as IJwtpayload

    const user = await userService.findOne(decoded.sub)
    if (!user) {
      return ctx.json({ message: HttpStatusPhrases.UNAUTHORIZED }, HttpStatusCodes.UNAUTHORIZED)
    }

    // Attach the decoded payload to the context for further use
    ctx.set('user', decoded)

    // Continue to the next middleware or handler
    await next()
  }
  catch (err) {
    console.error(err)
    return ctx.json({ message: 'Invalid or expired token' }, 401)
  }
})
