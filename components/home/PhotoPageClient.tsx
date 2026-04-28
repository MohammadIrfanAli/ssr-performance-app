'use client';

import { useHydrationCheck } from '@/hooks/useHydrationCheck';
import ImageGrid from '@/components/home/ImageGrid';
import { Photo } from '@/lib/api';

interface PhotoPageClientProps {
  photos: Photo[];
  checksum: string;
  priorityCount: number;
}

export default function PhotoPageClient({ 
  photos, 
  checksum, 
  priorityCount 
}: Readonly<PhotoPageClientProps>) {
  useHydrationCheck(checksum, photos);

  return (
    <div className="space-y-5 sm:space-y-8">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">Image Gallery</h1>
        <p className="text-sm sm:text-base text-slate-300">
          Gathering all the images from the server and optimizing them for the best viewing experience.
        </p>
      </div>
      <ImageGrid photos={photos} priorityCount={priorityCount} />
    </div>
  );
}
