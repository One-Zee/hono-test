import type { OpenAPIHono, RouteConfig, RouteHandler } from '@hono/zod-openapi'
import type { PinoLogger } from 'hono-pino'

export interface IJwtpayload {
  sub: string
  username: string
  email: string
  exp: number
  [key: string]: any
}

interface Variables {
  logger: PinoLogger
  user: IJwtpayload
}

export interface AppBindings {
  Variables: Variables
}

export type AppOpenAPI = OpenAPIHono<AppBindings>

export type AppRouteHandler<R extends RouteConfig> = RouteHandler<R, AppBindings>
