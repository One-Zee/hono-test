import { badRequestSchema, conflictSchema, notFoundSchema, unauthorizedSchema } from '@/lib/constants'
import { RegisterUserSchemaZod, UserLoginSchemaZod } from '@/modules/user/validations/create-user.schema'
import { UserResponseSchemaZod } from '@/modules/user/validations/user.schema'
import { createRoute, z } from '@hono/zod-openapi'
import * as HttpStatusCodes from 'stoker/http-status-codes'
import { jsonContent, jsonContentOneOf, jsonContentRequired } from 'stoker/openapi/helpers'
import { createErrorSchema } from 'stoker/openapi/schemas'
import { LoginResponseSchemaZod } from '../validations/login-response.schema'

const tags = ['Auth']

export const register = createRoute({
  path: '/auth/register',
  method: 'post',
  tags,
  summary: 'User Registration',
  request: {
    body: jsonContentRequired(
      RegisterUserSchemaZod,
      'The User Registering Data',
    ),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      UserResponseSchemaZod,
      'The Registered User',
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(RegisterUserSchemaZod),
      'The validation error(s)',
    ),
    [HttpStatusCodes.CONFLICT]: jsonContent(
      conflictSchema,
      'Username or email already exists',
    ),
  },
})

export const login = createRoute({
  path: '/auth/login',
  method: 'post',
  tags,
  summary: 'User login',
  request: {
    body: jsonContentRequired(
      UserLoginSchemaZod,
      'The User login Data',
    ),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      LoginResponseSchemaZod,
      'The Logged User',
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(RegisterUserSchemaZod),
      'The validation error(s)',
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      unauthorizedSchema,
      'Wrong credentials',
    ),
  },
})

export type RegisterRouteType = typeof register
export type LoginRouteType = typeof login
