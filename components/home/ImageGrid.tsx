import { useState, useEffect, useRef } from 'react';
import { Photo } from '@/lib/api';
import ImageCard from '@/components/shared/ImageCard';

interface ImageGridProps {
  photos: Photo[];
  priorityCount: number;
}

const CHUNK_SIZE = 24;

export default function ImageGrid({ photos, priorityCount }: Readonly<ImageGridProps>) {
  const [visibleCount, setVisibleCount] = useState(CHUNK_SIZE);
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < photos.length) {
          setVisibleCount((prev) => Math.min(prev + CHUNK_SIZE, photos.length));
        }
      },
      { threshold: 0.1, rootMargin: '400px' }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [visibleCount, photos.length]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-2 grid-flow-dense auto-rows-[6px] sm:gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 sm:auto-rows-[20px]">
        {photos.slice(0, visibleCount).map((photo, index) => (
          <ImageCard
            key={photo.id}
            photo={photo}
            priority={index < priorityCount}
          />
        ))}
      </div>
      
      {visibleCount < photos.length && (
        <div ref={observerTarget} className="h-20 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
