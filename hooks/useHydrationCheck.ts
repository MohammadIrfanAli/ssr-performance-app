'use client';

import { useEffect } from 'react';
import { Photo } from '@/lib/api';
import { debugStore } from '@/lib/debug-store';

export function useHydrationCheck(serverChecksum: string, photos: Photo[]) {
  useEffect(() => {
    // Hydration check is performed in a background worker to ensure no main-thread impact
    const worker = new Worker(new URL('../workers/data-worker.ts', import.meta.url));
    
    worker.postMessage({ type: 'hash', data: photos });
    
    worker.onmessage = (e) => {
      const { type, hash } = e.data;
      if (type === 'hash_result') {
        if (hash === serverChecksum) {
          debugStore.addLog('hydration', 'Checksum verification passed', {
            checksum: hash
          });
        } else {
          debugStore.addLog('hydration', 'Hydration mismatch detected!', {
            server: serverChecksum,
            client: hash
          });
        }
        worker.terminate();
      }
    };

    return () => worker.terminate();
  }, [serverChecksum, photos]);
}
