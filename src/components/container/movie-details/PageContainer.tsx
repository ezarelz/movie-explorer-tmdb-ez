import { cn } from '@/lib/cn';

type Props = { children: React.ReactNode; className?: string };

export default function PageContainer({ children, className }: Props) {
  return (
    <div className='min-h-screen w-full bg-black text-white'>
      <div
        className={cn('mx-auto w-full max-w-6xl px-4 md:px-6 py-8', className)}
      >
        {children}
      </div>
    </div>
  );
}
