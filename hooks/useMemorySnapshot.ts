'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { debugStore } from '@/lib/debug-store';

interface MemoryInfo {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

export function useMemorySnapshot() {
  const pathname = usePathname();
  const lastMemory = useRef<number | null>(null);

  useEffect(() => {
    // performance.memory is non-standard but available in many modern browsers
    const memory = (performance as unknown as { memory: MemoryInfo }).memory;
    
    if (!memory) {
      debugStore.addLog('performance', 'Memory tracking not supported by this browser');
      return;
    }

    const currentUsage = memory.usedJSHeapSize;
    if (lastMemory.current !== null) {
      const delta = currentUsage - lastMemory.current;
      const threshold = 10 * 1024 * 1024; // 10MB threshold for warning
      if (Math.abs(delta) > threshold) {
        debugStore.addLog('memory', `Significant memory change on route ${pathname}`, {
          delta: `${(delta / 1024 / 1024).toFixed(2)} MB`,
          current: `${(currentUsage / 1024 / 1024).toFixed(2)} MB`,
          threshold: '10 MB'
        });
      }
    }

    debugStore.addLog('memory', `Snapshot taken for ${pathname}`, {
      usage: `${(currentUsage / 1024 / 1024).toFixed(2)} MB`
    });

    lastMemory.current = currentUsage;
  }, [pathname]);
}
