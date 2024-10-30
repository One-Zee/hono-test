import { config } from 'dotenv'
import { expand } from 'dotenv-expand'
import { z } from 'zod'

expand(config())

export const EnvSchema = z.object({
  NODE_ENV: z.string().default('development'),
  PORT: z.coerce.number().default(3000),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']),
  DB_URL: z.string().url('Invalid database url'),
  JWT_SECRET: z.string(),
  ACCESS_TOKEN_EXPIRES_IN: z.coerce.number().default(120), // .transform(val => Number(val)).default(120),
  // OPTIONAL_ENV_IN_DEVELOPMENT: z.string().optional()
})
// .refine((input) => {
//     if (input.NODE_ENV === 'production') {
//         return !!input.OPTIONAL_ENV_IN_DEVELOPMENT
//     }
//     return true
// })
// .superRefine((input,ctx) => {
//     if (input.NODE_ENV === 'production' && !input.OPTIONAL_ENV_IN_DEVELOPMENT) {
//         ctx.addIssue({
//             code: z.ZodIssueCode.invalid_type,
//             expected: 'string',
//             received: 'undefined',
//             path: ['OPTIONAL_ENV_IN_DEVELOPMENT'],
//             message: 'If NODE_ENV is production, OPTIONAL_ENV_IN_DEVELOPMENT must be set'
//         })
//         return !!input.OPTIONAL_ENV_IN_DEVELOPMENT
//     }
// })

export type env = z.infer<typeof EnvSchema>

let env: env
try {
  // eslint-disable-next-line node/prefer-global/process
  env = EnvSchema.parse(process.env)
}
catch (e) {
  const error = e as z.ZodError
  console.error('Invalid environment variables: ')
  console.error(error.flatten().fieldErrors)
  // eslint-disable-next-line node/prefer-global/process
  process.exit(1)
}

export default env
