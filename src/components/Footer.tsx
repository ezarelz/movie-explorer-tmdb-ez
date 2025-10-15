// components/Footer.tsx
import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className='mt-16 text-white/80'>
      {/* top hairline */}
      <div className='h-px w-full bg-gradient-to-r from-white/10 via-white/5 to-transparent' />

      <div className='mx-auto flex max-w-6xl items-center justify-between px-4 py-8'>
        {/* Brand */}
        <Link href='/' className='flex items-center gap-2'>
          <span className='inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 overflow-hidden'>
            <Image
              src='/icons/movie-icon.svg'
              alt='Movie'
              width={20}
              height={20}
              priority={false}
            />
          </span>
          <span className='text-base font-semibold text-white'>Movie</span>
        </Link>

        {/* Copyright */}
        <p className='text-sm text-white/60'>
          Copyright ©{year} Movie Explorer
        </p>
      </div>
    </footer>
  );
}
