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

const SignUp: React.FC = () => {
  const [name, setName] = useState('')
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [emailLoading, setEmailLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const { signInWithGoogle, signUpWithCredentials } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const requestedRedirect = new URLSearchParams(location.search).get('redirect')
  const redirectPath = resolveRedirectPath(requestedRedirect)
  const googleRedirectUrl = new URL(redirectPath, window.location.origin).toString()
  const signInLink = redirectPath === '/' ? '/sign-in' : `/sign-in?redirect=${encodeURIComponent(redirectPath)}`
  const isSubmitting = emailLoading || googleLoading

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name.trim()) {
      setError('Please enter your full name')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setEmailLoading(true)

    try {
      await signUpWithCredentials(name.trim(), identifier, password)
      navigate(redirectPath, { replace: true })
    } catch (err: any) {
      setError(err.message || 'Failed to sign up')
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
      setError(err.message || 'Failed to start Google sign up')
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="container auth-shell">
        <section className="auth-aside">
          <p className="eyebrow">New Patient</p>
          <h1>Create your account and continue to the booking desk.</h1>
          <p>
            Register once to save time on future appointments, keep your contact details ready, and complete your first booking
            in the same Convex-backed flow.
          </p>

          <ul className="auth-feature-list">
            <li>Reach the appointment form immediately after registration.</li>
            <li>Register with Google, your email address, or your mobile number.</li>
            <li>Create a Convex-backed patient account for future visits.</li>
          </ul>
        </section>

        <section className="auth-card" aria-labelledby="sign-up-title">
          <div className="section-heading">
            <p className="eyebrow">Patient Registration</p>
            <h2 id="sign-up-title">Create your account</h2>
          </div>

          <p className="form-note">Use an email address or mobile number to create your patient login. You can always add your preferred contact email when booking.</p>

          {error && <div className="form-message is-error">{error}</div>}

          <div className="form-actions">
            <button type="button" className="form-submit form-submit-secondary auth-google-button" onClick={handleGoogleSignIn} disabled={isSubmitting}>
              {googleLoading ? 'Redirecting to Google...' : 'Continue with Google'}
            </button>
          </div>

          <p className="auth-divider">or create an account with mobile number or email</p>

          <form className="form-stack" onSubmit={handleSubmit}>
            <div className="form-field">
              <label htmlFor="name">Full Name</label>
              <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" />
            </div>

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
                autoComplete="new-password"
              />
            </div>

            <div className="form-field">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="form-submit auth-google-button" disabled={isSubmitting}>
                {emailLoading ? 'Creating account...' : 'Create account'}
              </button>
            </div>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to={signInLink}>Sign in</Link>
          </p>
        </section>
      </div>
    </div>
  )
}

export default SignUp
