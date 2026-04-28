'use client';

import { useState, useRef, useEffect } from 'react';

interface BenchmarkResult {
  primesCount: number;
  duration: number;
  estimatedCPU: number;
  lastPrime: number;
}

interface PerformanceClientProps {
  defaultLimit: number;
}

export default function PerformanceClient({ defaultLimit }: Readonly<PerformanceClientProps>) {
  const [limit, setLimit] = useState(defaultLimit);
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<BenchmarkResult | null>(null);

  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const runBenchmark = () => {
    setIsRunning(true);
    setResult(null);

    const worker = new Worker(new URL('@/workers/prime-worker.ts', import.meta.url));
    workerRef.current = worker;

    worker.onmessage = (e: MessageEvent<BenchmarkResult>) => {
      setResult(e.data);
      setIsRunning(false);
      worker.terminate();
    };

    worker.postMessage({ limit });
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 space-y-6">
        <h2 className="text-xl font-bold">Prime Benchmark</h2>
        <p className="text-sm text-slate-300">
          Calculate all prime numbers up to a specific limit. This tests raw CPU throughput
          and worker communication latency.
        </p>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-slate-300">
            Limit:{' '}
            <span className="text-blue-400">{limit.toLocaleString()}</span>
          </label>
          <input
            type="range"
            min="100000"
            max="1000000"
            step="50000"
            value={limit}
            onChange={(e) => setLimit(Number.parseInt(e.target.value))}
            disabled={isRunning}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>

        <button
          onClick={runBenchmark}
          disabled={isRunning}
          className={`w-full py-4 rounded-xl font-bold transition-all ${
            isRunning
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20'
          }`}
        >
          {isRunning ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Computing…
            </span>
          ) : (
            'Execute Benchmark'
          )}
        </button>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8">
        <h2 className="text-xl font-bold mb-6">Execution Results</h2>

        {result ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Stat label="Execution Time"  value={`${result.duration.toFixed(2)} ms`}  color="text-blue-400" />
              <Stat label="CPU Estimation"  value={`${result.estimatedCPU.toFixed(1)}%`} color="text-purple-400" />
              <Stat label="Primes Found"    value={result.primesCount.toLocaleString()}  color="text-emerald-400" />
              <Stat label="Last Prime"      value={result.lastPrime.toLocaleString()}    color="text-amber-400" />
            </div>
            <div className="pt-4">
              <div className="w-full bg-slate-800 rounded-full h-1.5 mb-2">
                <div
                  className="bg-blue-500 h-1.5 rounded-full transition-transform duration-1000 origin-left"
                  style={{ transform: `scaleX(${Math.min(100, result.estimatedCPU) / 100})`, width: '100%' }}
                />
              </div>
              <p className="text-[10px] text-center text-slate-300 uppercase tracking-widest">
                Load Signature Profile
              </p>
            </div>
          </div>
        ) : isRunning ? (
          <div className="flex flex-col items-center justify-center h-full py-12 space-y-4">
            <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
            <p className="text-slate-300 text-sm animate-pulse">Monitoring CPU Threads…</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full py-12 text-center">
            <div className="w-16 h-16 bg-slate-950 rounded-full flex items-center justify-center mb-4 border border-slate-800">
              <svg className="w-8 h-8 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <p className="text-slate-300 text-sm">Start the benchmark to see results</p>
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  color = 'text-slate-300',
}: Readonly<{ label: string; value: string; color?: string }>) {
  return (
    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
      <p className="text-[10px] uppercase tracking-wider text-slate-300 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}
