import { httpRouter } from 'convex/server'
import { httpAction } from './_generated/server'
import { authComponent, createAuth } from './auth'

const http = httpRouter()

const withCors = (request: Request, response: Response) => {
  const origin = request.headers.get('origin')
  if (!origin) {
    return response
  }

  const headers = new Headers(response.headers)
  headers.set('access-control-allow-origin', origin)
  headers.set('access-control-allow-credentials', 'true')
  headers.set('access-control-expose-headers', 'Set-Better-Auth-Cookie')
  headers.append('vary', 'Origin')

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}

const optionsHandler = httpAction(async (ctx, request) => {
  void ctx
  const origin = request.headers.get('origin')
  return new Response(null, {
    status: 204,
    headers: {
      'access-control-allow-origin': origin ?? '*',
      'access-control-allow-credentials': 'true',
      'access-control-allow-methods': 'GET, POST',
      'access-control-allow-headers': 'Content-Type, Better-Auth-Cookie, Authorization',
      'access-control-expose-headers': 'Set-Better-Auth-Cookie',
      'access-control-max-age': '86400',
      vary: 'Origin',
    },
  })
})

const compatAuthHandler = httpAction(async (ctx, request) => {
  const auth = createAuth(ctx)
  const response = await auth.handler(request)
  return withCors(request, response)
})

const rewriteAuthPath = (request: Request, from: string, to: string) => {
  const url = new URL(request.url)
  if (url.pathname.startsWith(from)) {
    url.pathname = `${to}${url.pathname.slice(from.length)}`
  }
  return new Request(url.toString(), request)
}

const signInCompatHandler = httpAction(async (ctx, request) => {
  const auth = createAuth(ctx)
  const rewrittenRequest = rewriteAuthPath(request, '/api/auth/signin', '/api/auth/sign-in')
  const response = await auth.handler(rewrittenRequest)
  return withCors(request, response)
})

const directAuthHandler = httpAction(async (ctx, request) => {
  const auth = createAuth(ctx)
  const response = await auth.handler(request)
  return withCors(request, response)
})

http.route({
  path: '/api/auth/signin/*',
  method: 'OPTIONS',
  handler: optionsHandler,
})

http.route({
  path: '/api/auth/sign-in/*',
  method: 'OPTIONS',
  handler: optionsHandler,
})

http.route({
  path: '/api/auth/expo-authorization-proxy',
  method: 'GET',
  handler: compatAuthHandler,
})

http.route({
  path: '/api/auth/signin/*',
  method: 'GET',
  handler: signInCompatHandler,
})

http.route({
  path: '/api/auth/signin/*',
  method: 'POST',
  handler: signInCompatHandler,
})

http.route({
  path: '/api/auth/sign-in/*',
  method: 'GET',
  handler: directAuthHandler,
})

http.route({
  path: '/api/auth/sign-in/*',
  method: 'POST',
  handler: directAuthHandler,
})

http.route({
  path: '/api/auth/sign-in/social',
  method: 'POST',
  handler: directAuthHandler,
})

http.route({
  path: '/api/auth/signin/social',
  method: 'POST',
  handler: signInCompatHandler,
})

authComponent.registerRoutes(http, createAuth, { cors: true })

export default http
