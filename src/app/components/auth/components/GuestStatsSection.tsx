'use client';

import { motion } from 'framer-motion';
import { equbCategories, getTotalMembers } from '@/app/data/equbCategories';

export default function GuestStatsSection() {
  const stats = [
    { label: 'Categories', value: equbCategories.length, color: 'bg-[#16357a]' },
    { label: 'Total Members', value: `${getTotalMembers().toLocaleString()}+`, color: 'bg-[#d4af37]' },
    { label: 'On-Time Payouts', value: '99%', color: 'bg-[#27487f]' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-3 gap-3"
    >
      {stats.map((stat, idx) => (
        <motion.div
          key={idx}
          whileHover={{ scale: 1.05 }}
          className={`${stat.color} text-white rounded-lg p-4 text-center`}
        >
          <div className="text-2xl font-black">{stat.value}</div>
          <div className="text-xs font-bold mt-1">{stat.label}</div>
        </motion.div>
      ))}
    </motion.div>
  );
}
