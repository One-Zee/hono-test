import mongoose from 'mongoose'
import * as HttpStatusPhrases from 'stoker/http-status-phrases'
import { createMessageObjectSchema } from 'stoker/openapi/schemas'
import { z } from 'zod'

export const IdParamSchemaZod = z.object({
  id: z
  // .instanceof(mongoose.Types.ObjectId)
    .string()
    .min(24, 'Invalid ObjectId')
    .max(24, 'Invalid ObjectId')
    .transform(val => new mongoose.Types.ObjectId(val))
    .openapi({
      param: {
        name: 'id',
        in: 'path',
      },
      // example: new mongoose.Types.ObjectId()
    }),
})

export const notFoundSchema = createMessageObjectSchema(HttpStatusPhrases.NOT_FOUND)
export const conflictSchema = createMessageObjectSchema(HttpStatusPhrases.CONFLICT)
export const badRequestSchema = createMessageObjectSchema(HttpStatusPhrases.BAD_REQUEST)
export const unauthorizedSchema = createMessageObjectSchema(HttpStatusPhrases.UNAUTHORIZED)
export const forbiddenSchema = createMessageObjectSchema(HttpStatusPhrases.FORBIDDEN)
export const internalServerErrorSchema = createMessageObjectSchema(HttpStatusPhrases.INTERNAL_SERVER_ERROR)
export const okSchema = createMessageObjectSchema(HttpStatusPhrases.OK)
export const SaltRounds = 10

export const authorizationHeaderZodSchema = z.object({ Authorization: z.string() })
