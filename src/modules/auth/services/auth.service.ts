import type { IJwtpayload } from '@/lib/types'
import type { UserZodType } from '@/modules/user/schemas/user.schema'
import env from '@/env'
import { SaltRounds } from '@/lib/constants'
import * as bcrypt from 'bcrypt'
import { jwt, sign } from 'hono/jwt'

export async function hashPassword(password: string) {
  const hash = await bcrypt.hash(password, SaltRounds)
  return hash
}

export async function comparePassword(password: string, hash: string) {
  const result = await bcrypt.compare(password, hash)
  return result
}

export async function genToken(user: UserZodType) {
  const payload: IJwtpayload = {
    sub: user._id,
    username: user.username,
    email: user.email,
    exp: Math.floor(Date.now() / 1000) + 60 * env.ACCESS_TOKEN_EXPIRES_IN, // Token expires in 5 minutes
  }
  const secret = env.JWT_SECRET
  const token = await sign(payload, secret)

  return token
}
