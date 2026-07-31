'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface FormButtonProps {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
  icon?: string;
}

export default function FormButton({
  children,
  onClick,
  disabled = false,
  loading = false,
  variant = 'primary',
  fullWidth = true,
  size = 'md',
  icon,
}: FormButtonProps) {
  const variantClasses = {
    primary: 'bg-gradient-to-r from-[#0d7e4d] to-[#d4af37] text-white',
    secondary: 'border-2 border-[#0d7e4d] text-[#0d7e4d] bg-transparent hover:bg-[#0d7e4d]/10',
    danger: 'bg-gradient-to-r from-[#ce1126] to-[#d4af37] text-white',
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-6 py-4 text-lg',
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={!disabled && !loading ? { scale: 1.05 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.95 } : {}}
      className={`
        ${fullWidth ? 'w-full' : ''}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        font-black rounded-full
        transition-all duration-300
        hover:shadow-lg
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
    >
      <div className="flex items-center justify-center gap-2">
        {loading ? '⏳' : icon ? icon : '✓'}
        {loading ? 'Processing...' : children}
      </div>
    </motion.button>
  );
}
