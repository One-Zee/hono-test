import type { AppRouteHandler } from '@/lib/types'
import type { RegisterUserType } from '@/modules/user/validations/create-user.schema'
import type { UserResponseType } from '@/modules/user/validations/user.schema'
import type { LoginRouteType, RegisterRouteType } from '../routes/auth.routes'
import type { LoginResponseSchemaType } from '../validations/login-response.schema'
import * as authService from '@/modules/auth/services/auth.service'
import * as userService from '@/modules/user/services/user.service'
import * as HttpStatusCodes from 'stoker/http-status-codes'
import * as HttpStatusPhrases from 'stoker/http-status-phrases'

export const register: AppRouteHandler<RegisterRouteType> = async (ctx) => {
  const user = ctx.req.valid('json')

  const emailExist = await userService.findOneByEmail(user.email)
  const usernameExist = await userService.findOneByUsername(user.username)
  if (emailExist || usernameExist) {
    return ctx.json(
      {
        message: HttpStatusPhrases.CONFLICT,
      },
      HttpStatusCodes.CONFLICT,
    )
  }

  const createUser: RegisterUserType = {
    username: user.username,
    email: user.email,
    password: await authService.hashPassword(user.password),
  }

  const newUser = await userService.create(createUser)

  const result: UserResponseType = {
    _id: newUser._id,
    username: newUser.username,
    email: newUser.email,
    createdAt: newUser.createdAt,
    updatedAt: newUser.updatedAt,
  }
  // ctx.status(201)
  return ctx.json(result, HttpStatusCodes.CREATED)
}

export const login: AppRouteHandler<LoginRouteType> = async (ctx) => {
  const { email, password } = ctx.req.valid('json')

  const user = await userService.findOneByEmail(email)

  if (!user) {
    return ctx.json(
      {
        message: HttpStatusPhrases.UNAUTHORIZED,
      },
      HttpStatusCodes.UNAUTHORIZED,
    )
  }
  const validPassword = await authService.comparePassword(password, user.password)
  if (!validPassword) {
    return ctx.json(
      {
        message: HttpStatusPhrases.UNAUTHORIZED,
      },
      HttpStatusCodes.UNAUTHORIZED,
    )
  }

  const token = await authService.genToken(user)
  const result: LoginResponseSchemaType = {
    accessToken: token,
  }
  // ctx.status(201)
  return ctx.json(result, HttpStatusCodes.CREATED)
}
