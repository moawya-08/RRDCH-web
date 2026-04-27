import { createClient, type GenericCtx } from '@convex-dev/better-auth'
import { convex, crossDomain } from '@convex-dev/better-auth/plugins'
import { expo } from '@better-auth/expo'
import { betterAuth } from 'better-auth/minimal'
import { query } from './_generated/server'
import { components } from './_generated/api'
import type { DataModel } from './_generated/dataModel'
import authConfig from './auth.config'

export const authComponent = createClient<DataModel>((components as any).betterAuth)

export const createAuth = (ctx: GenericCtx<DataModel>) => {
  const siteUrl = process.env.SITE_URL || 'https://rrdch-web.vercel.app'
  const trustedOrigins = [
    siteUrl,
    'http://localhost:3000',
    'https://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5174',
    'http://localhost:5175',
    'http://127.0.0.1:5175',
    'http://localhost:5180',
    'http://127.0.0.1:5180',
    'https://rrdch.vercel.app',
    'https://rrdch-web.vercel.app',
    'https://team-rocket-web.vercel.app',
    'https://*.vercel.app',
    'rrdchmobile://',
    // Expo Go callback URLs (LAN and tunnel) use exp:// during development/demo.
    'exp://',
    'exp://**',
    'exp+rrdchmobile://',
  ].filter((origin): origin is string => Boolean(origin))

  return betterAuth({
    baseURL: process.env.CONVEX_SITE_URL,
    trustedOrigins,
    database: authComponent.adapter(ctx),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    ...(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET
      ? {
          socialProviders: {
            google: {
              clientId: process.env.AUTH_GOOGLE_ID,
              clientSecret: process.env.AUTH_GOOGLE_SECRET,
              prompt: 'select_account',
            },
          },
        }
      : {}),
    plugins: [expo(), crossDomain({ siteUrl }), convex({ authConfig })],
  })
}

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    return authComponent.getAuthUser(ctx)
  },
})
