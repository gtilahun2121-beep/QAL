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
    'bg-[#0d7e4d] text-white hover:bg-[#0a5c38] border-2 border-transparent',
  secondary:
    'bg-white text-[#0d7e4d] border-2 border-[#0d7e4d] hover:bg-gray-50',
  danger:
    'bg-[#ce1126] text-white hover:bg-[#a50d1c] border-2 border-transparent',
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
