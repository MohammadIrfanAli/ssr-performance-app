'use client';

import { useEffect, useState } from 'react';
import { debugStore } from '@/lib/debug-store';

export default function DebugLogger() {
  const [logs, setLogs] = useState(debugStore.getLogs());

  useEffect(() => {
    return debugStore.subscribe(() => {
      setLogs([...debugStore.getLogs()]);
    });
  }, []);

  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-slate-500">
        <p>No debug logs found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {logs.map((log) => (
        <div 
          key={log.id} 
          className="rounded-lg border border-slate-800 bg-slate-900/50 p-4 font-mono text-xs overflow-hidden"
        >
          <div className="flex items-center justify-between mb-2">
            <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
              log.type === 'hydration' ? 'bg-blue-500/20 text-blue-400' :
              log.type === 'memory' ? 'bg-purple-500/20 text-purple-400' :
              'bg-slate-500/20 text-slate-300'
            }`}>
              {log.type}
            </span>
            <span className="text-slate-600">
              {new Date(log.timestamp).toLocaleTimeString()}
            </span>
          </div>
          <p className="text-slate-200 font-semibold mb-2">{log.message}</p>
          {!!log.data && (
            <pre className="bg-slate-950/50 p-2 rounded overflow-x-auto text-slate-300">
              {JSON.stringify(log.data, null, 2)}
            </pre>
          )}
        </div>
      ))}
    </div>
  );
}
