import type { z } from 'zod'
import { RegisterUserSchemaZod } from './create-user.schema'

export const PatchUserSchemaZod = RegisterUserSchemaZod
  .partial()

export type UpdateUserType = z.infer<typeof PatchUserSchemaZod>
