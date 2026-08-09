'use client';

import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger';

interface FormButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  icon?: string;
  variant?: ButtonVariant;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-[#16357a] text-white hover:bg-[#27487f] border-2 border-transparent',
  secondary:
    'bg-white text-[#16357a] border-2 border-[#16357a] hover:bg-gray-50',
  danger:
    'bg-[#27487f] text-white hover:bg-[#a50d1c] border-2 border-transparent',
};

export default function FormButton({
  loading = false,
  icon,
  variant = 'primary',
  children,
  disabled,
  className = '',
  ...props
}: FormButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`w-full rounded-lg px-4 py-3 font-bold transition flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60 ${variantStyles[variant]} ${className}`}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
}
