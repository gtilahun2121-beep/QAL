'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface FormInputProps {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  hint?: string;
  error?: string;
  icon?: ReactNode;
  disabled?: boolean;
  autoComplete?: string;
}

export default function FormInput({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  maxLength,
  hint,
  error,
  icon,
  disabled = false,
  autoComplete,
}: FormInputProps) {
  return (
    <div>
      <label className="block text-sm font-bold text-[#0d7e4d] mb-2 flex items-center gap-2">
        {icon && <span className="text-lg">{icon}</span>}
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={maxLength}
        disabled={disabled}
        autoComplete={autoComplete}
        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none font-bold transition-all ${
          error
            ? 'border-red-500 bg-red-50 focus:border-red-600'
            : 'border-[#d4af37] focus:border-[#0d7e4d]'
        } ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : ''}`}
      />
      {error && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-red-600 mt-1">
          ❌ {error}
        </motion.p>
      )}
      {!error && hint && (
        <p className="text-xs text-[#5a5a5a] mt-1">{hint}</p>
      )}
    </div>
  );
}
