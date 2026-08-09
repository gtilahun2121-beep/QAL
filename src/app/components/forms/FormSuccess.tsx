'use client';

import { motion } from 'framer-motion';

interface FormSuccessProps {
  title: string;
  message: string;
}

export default function FormSuccess({ title, message }: FormSuccessProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-blue-100 border-2 border-blue-200 rounded-lg p-6 text-center"
    >
      <h3 className="text-2xl font-black text-blue-950 mb-2">{title}</h3>
      <p className="text-blue-800 text-sm">{message}</p>
    </motion.div>
  );
}
