import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const resolveRedirectPath = (value: string | null) => {
  if (!value || !value.startsWith('/')) {
    return '/'
  }

  if (value.startsWith('/sign-in') || value.startsWith('/sign-up')) {
    const nestedRedirect = new URLSearchParams(value.split('?')[1] ?? '').get('redirect')
    return nestedRedirect && nestedRedirect.startsWith('/') ? nestedRedirect : '/'
  }

  return value
}

const SignIn: React.FC = () => {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [emailLoading, setEmailLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const { signInWithCredentials, signInWithGoogle } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const requestedRedirect = new URLSearchParams(location.search).get('redirect')
  const redirectPath = resolveRedirectPath(requestedRedirect)
  const googleRedirectUrl = new URL(redirectPath, window.location.origin).toString()
  const signUpLink = redirectPath === '/' ? '/sign-up' : `/sign-up?redirect=${encodeURIComponent(redirectPath)}`
  const isSubmitting = emailLoading || googleLoading

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setEmailLoading(true)

    try {
      await signInWithCredentials(identifier, password)
      navigate(redirectPath, { replace: true })
    } catch (err: any) {
      setError(err.message || 'Failed to sign in')
    } finally {
      setEmailLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setError('')
    setGoogleLoading(true)

    try {
      await signInWithGoogle(googleRedirectUrl)
    } catch (err: any) {
      setError(err.message || 'Failed to start Google sign in')
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="container auth-shell">
        <section className="auth-aside">
          <p className="eyebrow">Patient Access</p>
          <h1>Sign in before booking your appointment.</h1>
          <p>
            Use your Convex patient account to continue to the booking desk, keep your details ready, and store the appointment
            directly in the same backend.
          </p>

          <ul className="auth-feature-list">
            <li>Continue straight into the appointment form after sign-in.</li>
            <li>Use Google, your email address, or your mobile number to sign in.</li>
            <li>Keep your hospital contact details in one place.</li>
          </ul>
        </section>

        <section className="auth-card" aria-labelledby="sign-in-title">
          <div className="section-heading">
            <p className="eyebrow">Welcome Back</p>
            <h2 id="sign-in-title">Sign in to continue</h2>
          </div>

          <p className="form-note">You will return to your requested page as soon as authentication is complete.</p>

          {error && <div className="form-message is-error">{error}</div>}

          <div className="form-actions">
            <button type="button" className="form-submit form-submit-secondary auth-google-button" onClick={handleGoogleSignIn} disabled={isSubmitting}>
              {googleLoading ? 'Redirecting to Google...' : 'Continue with Google'}
            </button>
          </div>

          <p className="auth-divider">or continue with mobile number or email</p>

          <form className="form-stack" onSubmit={handleSubmit}>
            <div className="form-field">
              <label htmlFor="identifier">Email Address or Mobile Number</label>
              <input
                type="text"
                id="identifier"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                autoComplete="username"
                placeholder="name@example.com or +91 9901559955"
              />
            </div>

            <div className="form-field">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="form-submit auth-google-button" disabled={isSubmitting}>
                {emailLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>
          </form>

          <p className="auth-switch">
            Don&apos;t have an account? <Link to={signUpLink}>Create one</Link>
          </p>
        </section>
      </div>
    </div>
  )
}

export default SignIn
