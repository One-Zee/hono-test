import { z } from 'zod'

export const RegisterUserSchemaZod = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters long')
    .max(50, 'Username must be at most 50 characters long'),
  email: z.string()
    .email('Invalid email address'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters long')
    .max(50, 'Password must be at most 50 characters long'),
})

export const UserLoginSchemaZod = RegisterUserSchemaZod.omit({ username: true })

export type RegisterUserType = z.infer<typeof RegisterUserSchemaZod>

export type UserLoginType = z.infer<typeof UserLoginSchemaZod>
