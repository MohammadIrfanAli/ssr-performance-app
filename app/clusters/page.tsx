import { fetchPhotos, Photo } from '@/lib/api';
import { calculateComplexity } from '@/lib/clustering';
import ClusteringClient from '@/components/clusters/ClusteringClient';

export const dynamic = 'force-dynamic';

export default async function ClustersPage() {
  let photosWithComplexity: (Photo & { complexityScore: number })[] = [];
  let error = false;

  try {
    const allPhotos = await fetchPhotos();
    const subset = allPhotos.slice(0, 100);
    photosWithComplexity = subset.map(photo => ({
      ...photo,
      complexityScore: calculateComplexity(photo)
    }));
  } catch {
    error = true;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Clustering Data Unavailable</h1>
        <p className="text-slate-300 mb-8 max-w-md">
          {`We couldn't process the clustering algorithm due to an upstream API failure.`}
        </p>
        <a 
          href="/clusters"
          className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
        >
          Retry Algorithm
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-12">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Data Clustering</h1>
        <p className="text-sm sm:text-base text-slate-300">
          Photos grouped by our custom multi-stage complexity algorithm{' '}
          <span className="hidden sm:inline">
            (Server: Scoring | Client: Normalization)
          </span>.
        </p>
      </div>

      <ClusteringClient photosWithComplexity={photosWithComplexity} />
    </div>
  );
}
