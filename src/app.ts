import configureOpenApi from '@/lib/configure-open-api'
import createApp from '@/lib/create-app'

import auth from '@/modules/auth/routes'
import index from '@/modules/root/routes/index.route'
import user from '@/modules/user/routes'
import { cors } from 'hono/cors'
import { bearerAuthMiddleware } from './middlewares/auth/auth-middlewares'

const app = createApp()

// 2 Way to do it
const routes = [
  auth,
  index,
  user,
] as const // this lets typescript know it wont change at runtime

// The OpenAPI documentation will be available at /doc
configureOpenApi(app)

app.use('/*', cors())

// 1 Way to do it
// or another way is to chain this and export the _app
// const _app = app
//     .route('/api/', index)
//     .route('/api/', user)

app.use('/api/users/*', bearerAuthMiddleware)

// app.use('/api/users/*', async (c, next) => {
//   const payload = c.get('user')
//   const token = c.req.header('Authorization')
//   // eslint-disable-next-line no-console
//   console.log({ payload, token })
//   await next()
// })

// Every route will be available at /api
routes.forEach((route) => {
  app.route('/api/', route)
})

// 2 Way to do it
// now all you have to do is import to the client side code
export type AppType = typeof routes[number] // this will give type of everything at 'number' so [0],[1] etc.

// 1 Way to do it
// export _app as type
// export type AppType = typeof _app

export default app
