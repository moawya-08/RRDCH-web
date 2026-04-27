import { useConvexAuth, useMutation, useQuery } from 'convex/react'
import React, { ReactNode, createContext, useContext, useEffect } from 'react'
import { convex } from '../lib/convex'
import { ViewerProfile, convexApi } from '../lib/convexApi'
import { authClient } from '../lib/auth-client'

interface AuthContextType {
  user: ViewerProfile | null
  loading: boolean
  isAuthenticated: boolean
  signInWithCredentials: (identifier: string, password: string) => Promise<void>
  signUpWithCredentials: (name: string, identifier: string, password: string) => Promise<void>
  signInWithGoogle: (redirectTo?: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function getFrontendCallbackUrl(path: string) {
  if (/^https?:\/\//i.test(path)) {
    return path
  }

  return new URL(path, window.location.origin).toString()
}

function AuthStateProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useConvexAuth()
  const { data: session, isPending: sessionPending } = authClient.useSession()
  const profile = useQuery(convexApi.users.viewerProfile)
  const ensureViewerProfile = useMutation(convexApi.users.ensureViewerProfile)

  useEffect(() => {
    if (!isAuthenticated || !session?.user) {
      return
    }

    void ensureViewerProfile({
      name: session.user.name ?? undefined,
      email: session.user.email ?? undefined,
      image: session.user.image ?? undefined
    }).catch((error) => {
      console.error('Failed to sync viewer profile', error)
    })
  }, [ensureViewerProfile, isAuthenticated, session?.user?.email, session?.user?.id, session?.user?.image, session?.user?.name])

  const loading = isLoading || sessionPending

  const signInWithCredentials = async (identifier: string, password: string) => {
    const normalizedEmail = identifier.trim().toLowerCase()
    if (!normalizedEmail.includes('@')) {
      throw new Error('Use an email address to sign in.')
    }

    const result = await authClient.signIn.email({
      email: normalizedEmail,
      password
    })

    if (result.error) {
      throw new Error(result.error.message)
    }
  }

  const signUpWithCredentials = async (name: string, identifier: string, password: string) => {
    const normalizedEmail = identifier.trim().toLowerCase()
    if (!normalizedEmail.includes('@')) {
      throw new Error('Use an email address to create an account.')
    }

    const result = await authClient.signUp.email({
      name: name.trim(),
      email: normalizedEmail,
      password,
      callbackURL: getFrontendCallbackUrl('/portal')
    })

    if (result.error) {
      throw new Error(result.error.message)
    }
  }

  const signInWithGoogle = async (redirectTo = '/portal') => {
    const callbackURL = getFrontendCallbackUrl(redirectTo)

    try {
      const result = await authClient.signIn.social({
        provider: 'google',
        callbackURL
      })

      if (result.error) {
        throw new Error(result.error.message)
      }
    } catch (error: any) {
      const message = String(error?.message || error || '')
      const looksLikeNetworkError = message.toLowerCase().includes('failed to fetch') || message.toLowerCase().includes('networkerror')

      if (!looksLikeNetworkError) {
        throw error
      }

      const authBase = (import.meta.env.VITE_CONVEX_SITE_URL || 'https://academic-dodo-992.convex.site').replace(/\/$/, '')
      const payload = JSON.stringify({ provider: 'google', callbackURL })

      const tryEndpoint = async (path: string) => {
        const response = await fetch(`${authBase}${path}`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'content-type': 'application/json'
          },
          body: payload
        })

        if (!response.ok) {
          throw new Error(`Auth endpoint ${path} returned ${response.status}`)
        }

        const data = (await response.json()) as { url?: string }
        if (!data.url) {
          throw new Error(`Auth endpoint ${path} did not return a redirect URL`)
        }

        window.location.assign(data.url)
      }

      try {
        await tryEndpoint('/api/auth/sign-in/social')
      } catch {
        await tryEndpoint('/api/auth/signin/social')
      }
    }
  }

  const signOut = async () => {
    const result = await authClient.signOut()
    if (result.error) {
      throw new Error(result.error.message)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user: profile ?? null,
        loading,
        isAuthenticated,
        signInWithCredentials,
        signUpWithCredentials,
        signInWithGoogle,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  if (!convex) {
    throw new Error('VITE_CONVEX_URL is not configured')
  }

  return <AuthStateProvider>{children}</AuthStateProvider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
