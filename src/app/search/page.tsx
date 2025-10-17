import { Suspense } from 'react';
import SearchView from './SearchView';

// Hindari prerender statis saat build (memaksa runtime dinamis)
export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className='min-h-screen bg-[#0B0B11] text-white p-6'>
          Loading search…
        </div>
      }
    >
      <SearchView />
    </Suspense>
  );
}
