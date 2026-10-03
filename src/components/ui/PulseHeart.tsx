'use client';
import { motion, useReducedMotion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

export function PulseHeart({ className = '' }: { className?: string }) {
  const reduce = useReducedMotion();
  return (
    <div aria-hidden="true" className={`relative flex items-center justify-center ${className}`}>
      {!reduce && <motion.span className="absolute h-16 w-16 rounded-full bg-gaucho-red/40 blur-xl" animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0.15, 0.6] }} transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }} />}
      <motion.div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gaucho-red text-xl text-white shadow-lg shadow-red-950/40" animate={reduce ? undefined : { scale: [1, 1.08, 1] }} transition={{ duration: 1.3, repeat: Infinity, ease: 'easeInOut' }}>
        <FontAwesomeIcon icon={faHeart} />
      </motion.div>
    </div>
  );
}
