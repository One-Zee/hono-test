import { createRouter } from '@/lib/create-app'
import * as handlers from '@/modules/auth/handlers/auth.handler'
import * as routes from '@/modules/auth/routes/auth.routes'

const router = createRouter()
  .openapi(routes.register, handlers.register)
  .openapi(routes.login, handlers.login)

export default router
