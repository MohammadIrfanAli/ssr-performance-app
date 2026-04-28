'use client';

import { useMemo } from 'react';
import { Photo } from '@/lib/api';
import { normalizeScore, getCluster, ClusterGroup } from '@/lib/clustering';
import ImageCard from '@/components/shared/ImageCard';

interface ClusteringClientProps {
  photosWithComplexity: (Photo & { complexityScore: number })[];
}

export default function ClusteringClient({ photosWithComplexity }: Readonly<ClusteringClientProps>) {
  // Stage 4: Client-side normalization and clustering
  const clustered = useMemo(() => {
    return photosWithComplexity.map(photo => {
      const normalizedScore = normalizeScore(photo.complexityScore);
      const cluster = getCluster(normalizedScore);
      return { ...photo, normalizedScore, cluster };
    });
  }, [photosWithComplexity]);

  const groups: Record<ClusterGroup, typeof clustered> = {
    A: clustered.filter(p => p.cluster === 'A'),
    B: clustered.filter(p => p.cluster === 'B'),
    C: clustered.filter(p => p.cluster === 'C'),
    D: clustered.filter(p => p.cluster === 'D'),
  };

  const groupMeta = {
    A: { name: 'Cluster A', desc: 'Low Complexity', color: 'border-emerald-500/50 bg-emerald-500/5' },
    B: { name: 'Cluster B', desc: 'Balanced Low', color: 'border-blue-500/50 bg-blue-500/5' },
    C: { name: 'Cluster C', desc: 'Balanced High', color: 'border-amber-500/50 bg-amber-500/5' },
    D: { name: 'Cluster D', desc: 'High Complexity', color: 'border-rose-500/50 bg-rose-500/5' },
  };

  return (
    <div className="grid gap-5 sm:gap-8">
      {(Object.keys(groups) as ClusterGroup[]).map(key => (
        <section key={key} className={`rounded-2xl sm:rounded-3xl border p-4 sm:p-6 transition-all hover:shadow-2xl hover:shadow-slate-900/50 ${groupMeta[key].color}`}>
          <div className="flex items-end justify-between mb-4 sm:mb-6 gap-3">
            <div>
              <h2 className="text-lg sm:text-2xl font-bold">{groupMeta[key].name}</h2>
              <p className="text-xs sm:text-sm text-slate-300">{groupMeta[key].desc} • {groups[key].length} items</p>
            </div>
            <div className="text-[9px] sm:text-xs font-mono px-2 sm:px-3 py-1 bg-slate-950 rounded-full border border-slate-800 text-slate-300 shrink-0">
              Score: {key === 'A' ? '0-25' : key === 'B' ? '26-50' : key === 'C' ? '51-75' : '76-100'}
            </div>
          </div>

          <div className={groups[key].length > 0 
            ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4 auto-rows-[6px] grid-flow-dense sm:auto-rows-[20px]"
            : "block text-center py-10 sm:py-16 border border-dashed border-slate-800 rounded-xl bg-slate-900/20"
          }>
            {groups[key].map((photo, index) => (
              <ImageCard 
                key={photo.id} 
                photo={photo} 
                priority={key === 'A' && index < 6}
                badge={photo.normalizedScore} 
              />
            ))}
            {groups[key].length === 0 && (
              <p className="text-slate-500 text-xs sm:text-sm italic">
                No items in this cluster for the current dataset.
              </p>
            )}
          </div>
        </section>
      ))}
    </div>
  );
}
