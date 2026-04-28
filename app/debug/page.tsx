import DebugLogger from '@/components/debug/DebugLogger';

export const dynamic = 'force-dynamic';

export default function DebugPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-12">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Diagnostic Logs</h1>
        <p className="text-sm sm:text-base text-slate-300">
          Real-time monitoring of hydration consistency, memory snapshots, and application health.
        </p>
      </div>

      <div className="grid gap-5 sm:gap-8">
        <section className="bg-slate-900/30 border border-slate-800 rounded-2xl sm:rounded-3xl p-5 sm:p-8 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-5 sm:mb-8">
            <h2 className="text-base sm:text-xl font-bold flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 animate-pulse"></span> Event Stream
            </h2>
            <div className="flex gap-2">
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-1 rounded uppercase font-bold tracking-wider">
                Strict Mode
              </span>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded uppercase font-bold tracking-wider">
                Live
              </span>
            </div>
          </div>
          <DebugLogger />
        </section>

        <section className="grid sm:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl sm:rounded-2xl p-5 sm:p-6">
            <h3 className="font-bold mb-1.5 text-sm sm:text-base">Hydration Check</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Computes a checksum of SSR data on the server and compares it against client-hydrated data. Any mismatch is flagged immediately.
            </p>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl sm:rounded-2xl p-5 sm:p-6">
            <h3 className="font-bold mb-1.5 text-sm sm:text-base">Memory Delta</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Monitors JS Heap usage on every route transition. If the memory delta exceeds 10MB, a diagnostic entry is generated.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
