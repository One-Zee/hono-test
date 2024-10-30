import { authorizationHeaderZodSchema, conflictSchema, forbiddenSchema, IdParamSchemaZod, notFoundSchema, unauthorizedSchema } from '@/lib/constants'
import { UserZodSchemaZod } from '@/modules/user/validations/user.schema'
import { createRoute, z } from '@hono/zod-openapi'
import * as HttpStatusCodes from 'stoker/http-status-codes'
import { jsonContent, jsonContentOneOf, jsonContentRequired } from 'stoker/openapi/helpers'
import { createErrorSchema } from 'stoker/openapi/schemas'
import { RegisterUserSchemaZod } from '../validations/create-user.schema'
import { PatchUserSchemaZod } from '../validations/patch-user.schema'

const tags = ['User']

export const userList = createRoute({
  path: '/users',
  method: 'get',
  tags,
  summary: 'User list',
  // request: {
  //   headers: authorizationHeaderZodSchema,
  // },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(UserZodSchemaZod),
      'The User list',
    ),
  },
})

export const getOneUser = createRoute({
  path: '/users/{id}',
  method: 'get',
  tags,
  summary: 'Get User By Id',
  request: {
    params: IdParamSchemaZod,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      UserZodSchemaZod,
      'The Requested user',
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      'User not found',
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamSchemaZod),
      'Invalid Id error',
    ),
  },
})

export const getLoggedUser = createRoute({
  path: '/users/me',
  method: 'get',
  tags,
  summary: 'Get Logged User',
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      UserZodSchemaZod,
      'The Logged user',
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      'User not found',
    ),
  },
})

export const userCreate = createRoute({
  path: '/users',
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
      UserZodSchemaZod,
      'The Registered User',
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(RegisterUserSchemaZod),
      'The validation error(s)',
    ),
  },
})

export const userUpdate = createRoute({
  path: '/users',
  method: 'patch',
  tags,
  summary: 'Update Logged User Info',
  request: {
    // params: IdUserParamSchemaZod,
    body: jsonContentRequired(
      PatchUserSchemaZod,
      'The User update Data',
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      UserZodSchemaZod,
      'The updated User',
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContentOneOf(
      [
        createErrorSchema(RegisterUserSchemaZod),
        // createErrorSchema(IdUserParamSchemaZod),
      ],
      'The validation error(s)',
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      'User not found',
    ),
    // [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
    //     createErrorSchema(getOneUserParamSchema),
    //     'Invalid Id error',
    // )
  },
})

export const deleteOneUser = createRoute({
  path: '/users/{id}',
  method: 'delete',
  tags,
  summary: 'Delete User By Id',
  request: {
    params: IdParamSchemaZod,
  },
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: 'User deleted',
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      'User not found',
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamSchemaZod),
      'Invalid Id error',
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(
      forbiddenSchema,
      'cannot delete other users',
    ),
  },
})

export type UserListRoute = typeof userList
export type UserCreateRoute = typeof userCreate
export type UserGetOneRoute = typeof getOneUser
export type UserGetLoggedRoute = typeof getLoggedUser
export type UserPatchRoute = typeof userUpdate
export type UserDeleteRoute = typeof deleteOneUser
