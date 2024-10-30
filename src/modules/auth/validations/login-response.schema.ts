import { UserResponseSchemaZod } from '@/modules/user/validations/user.schema'
import { z } from 'zod'

export const LoginResponseSchemaZod = z.object({
  accessToken: z.string(),
  // refreshToken: z.string(),
//   user: UserResponseSchemaZod,
})

export type LoginResponseSchemaType = z.infer<typeof LoginResponseSchemaZod>
