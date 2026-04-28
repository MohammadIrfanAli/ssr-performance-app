'use client';

import { useMemorySnapshot } from '@/hooks/useMemorySnapshot';

export function ClientMonitoring() {
  useMemorySnapshot();
  return null;
}
