import { pinnoLogger } from '@/middlewares/loggers/pino-logger'
import { OpenAPIHono } from '@hono/zod-openapi'
import { defaultHook } from 'stoker/openapi'
// import { logger } from 'hono/logger'

import type { AppBindings } from './types'
import { notFound, onError } from 'stoker/middlewares'

export function createRouter() {
  return new OpenAPIHono<AppBindings>({
    strict: false,
    defaultHook,
  })
}

export default function createApp() {
  // const app = new OpenAPIHono<AppBindings>()
  const app = createRouter()
  app.use(pinnoLogger())

  // app.use((c, next) => {
  //   c.set('message', 'costum message')
  //   return next()
  // })

  app.notFound(notFound)
  app.onError(onError)

  return app
}
