export const dynamic = 'force-dynamic';

import PerformanceClient from '@/components/performance/PerformanceClient';

const DEFAULT_LIMIT = 350_000;

export default function PerformancePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-12">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">System Performance</h1>
        <p className="text-sm sm:text-base text-slate-300">
          Compute-intensive tasks offloaded to Web Workers to keep the main thread fluid.
          The prime-number sieve runs inside a dedicated worker thread so the UI stays
          fully responsive (targeting &lt;200ms INP).
        </p>
      </div>

      <PerformanceClient defaultLimit={DEFAULT_LIMIT} />
    </div>
  );
}
