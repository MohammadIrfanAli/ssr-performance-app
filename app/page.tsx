import { fetchPhotos, Photo } from '@/lib/api';
import PhotoPageClient from '@/components/home/PhotoPageClient';
import Link from 'next/link';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

function djb2Hash(str: string): string {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
    hash = Math.trunc(hash);
  }
  return (hash >>> 0).toString(16);
}

export default async function Home() {
  const headersList = await headers();
  const userAgent = headersList.get('user-agent') || '';
  const isMobile = /mobile|android|iphone|ipad/i.test(userAgent);
  // Only prioritize 2 images on mobile to ensure LCP discovery without bandwidth contention
  const priorityCount = isMobile ? 2 : 12;

  let photos: Photo[] = [];
  let error = false;

  try {
    const allPhotos = await fetchPhotos();
    photos = allPhotos.slice(0, 200);
  } catch {
    error = true;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Failed to load gallery</h1>
        <p className="text-slate-300 mb-8 max-w-md">
          Something went wrong while fetching the images. Please try again later.
        </p>
        <Link
          href="/"
          className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
        >
          Retry Connection
        </Link>
      </div>
    );
  }

  const checksum = djb2Hash(JSON.stringify(photos));
  return <PhotoPageClient photos={photos} checksum={checksum} priorityCount={priorityCount} />;
}
