import React from 'react'

interface ManipalButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning'
  className?: string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}

const ManipalButton: React.FC<ManipalButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  className = '',
  type = 'button',
  disabled = false
}) => {
  const variantClass = `manipal-btn-${variant}`
  
  return (
    <button
      type={type}
      className={`manipal-btn ${variantClass} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

export default ManipalButton
