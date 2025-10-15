'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clapperboard } from 'lucide-react';

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function MobileMenu({ open, onClose }: Props) {
  // close on ESC + lock scroll
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
        document.removeEventListener('keydown', onKey);
      };
    }
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.button
            aria-label='Close menu'
            onClick={onClose}
            className='fixed inset-0 z-[60] bg-black/60 md:hidden'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Drawer */}
          <motion.aside
            className='fixed inset-y-0 left-0 z-[70] w-[82vw] max-w-[320px] bg-black md:hidden'
            initial={{ x: -340, opacity: 0.6 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -340, opacity: 0.6 }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
          >
            {/* Header */}
            <div className='flex items-center justify-between border-b border-white/10 px-4 py-4'>
              <div className='flex items-center gap-2'>
                <span className='inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/10'>
                  <Clapperboard className='h-5 w-5' />
                </span>
                <span className='text-base font-semibold'>Movie</span>
              </div>
              <button
                aria-label='Close'
                onClick={onClose}
                className='rounded-lg p-2 hover:bg-white/5'
              >
                <X className='h-5 w-5' />
              </button>
            </div>

            {/* Nav items */}
            <nav className='px-4 py-4'>
              <ul className='space-y-4 text-sm'>
                <li>
                  <Link
                    href='/'
                    className='block rounded-lg px-2 py-2 hover:bg-white/5'
                    onClick={onClose}
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href='/favorites'
                    className='block rounded-lg px-2 py-2 hover:bg-white/5'
                    onClick={onClose}
                  >
                    Favorites
                  </Link>
                </li>
              </ul>
            </nav>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
