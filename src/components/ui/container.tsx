// components/ui/container.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';

type Props = React.HTMLAttributes<HTMLDivElement>;

export function Container({ className, ...props }: Props) {
  return (
    <div
      className={cn('mx-auto w-full max-w-6xl px-4 md:px-6', className)}
      {...props}
    />
  );
}
