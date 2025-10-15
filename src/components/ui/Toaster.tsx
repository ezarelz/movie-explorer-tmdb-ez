// components/ui/Toast.tsx
'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/cn';

type Toast = { id: number; message: string };

export default function Toast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    let next = 1;
    const onToast = (e: Event) => {
      const ce = e as CustomEvent<{ message: string }>;
      const id = next++;
      setToasts((t) => [...t, { id, message: ce.detail.message }]);
      setTimeout(() => {
        setToasts((t) => t.filter((x) => x.id !== id));
      }, 2000);
    };
    window.addEventListener('toast', onToast as EventListener);
    return () => window.removeEventListener('toast', onToast as EventListener);
  }, []);

  return (
    <div className='pointer-events-none fixed inset-x-0 top-4 z-[100] flex justify-center px-4'>
      <AnimatePresence initial={false}>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className={cn(
              // pill container
              'pointer-events-auto flex items-center gap-3 rounded-2xl px-4 py-2',
              'backdrop-blur-md shadow-lg',
              // <<< warna sesuai screenshot
              'bg-white/20 text-white'
            )}
          >
            {/* bulatan putih dengan icon check */}
            <span
              className={cn(
                'inline-flex h-5 w-5 items-center justify-center rounded-full',
                'bg-white'
              )}
            >
              <Check className='h-3.5 w-3.5 text-neutral-900' />
            </span>

            {/* pesan */}
            <span className={cn('text-sm', 'text-white')}>{t.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
