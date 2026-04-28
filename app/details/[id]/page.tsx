import { fetchPhotoById, Photo } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getPhoto(id: string): Promise<Photo> {
  const photoId = Number(id);
  if (!Number.isInteger(photoId)) notFound();

  try {
    const photo = await fetchPhotoById(photoId);
    if (!photo) notFound();

    return photo;
  } catch {
    notFound();
  }
}

export default async function PhotoDetails({ params }: Readonly<PageProps>) {
  const { id } = await params;
  const photo = await getPhoto(id);

  return (
    <div className="max-w-4xl mx-auto py-4 sm:py-8">
      <Link
        href="/"
        className="inline-flex items-center text-sm text-blue-400 hover:text-blue-300 mb-5 sm:mb-8 transition-colors"
      >
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back to Gallery
      </Link>

      <div className="grid md:grid-cols-2 gap-6 sm:gap-12 bg-slate-900/50 rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-slate-800 backdrop-blur-sm">
        <div className="relative aspect-square overflow-hidden rounded-xl sm:rounded-2xl ring-1 ring-slate-700">
          <Image
            src={photo.url}
            alt={photo.title}
            fill
            priority
            fetchPriority="high"
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col justify-center space-y-4 sm:space-y-6">
          <div>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-blue-500">
              Photo Details
            </span>
            <h1 className="text-xl sm:text-3xl font-bold mt-1.5 sm:mt-2 leading-tight">
              {photo.title}
            </h1>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <Detail label="Image ID" value={photo.id} valueClass="text-blue-400" />
            <Detail label="Album ID" value={photo.albumId} valueClass="text-purple-400" />
            <Detail label="Resolution" value="600 × 600" />
            <Detail label="Source" value={photo.url} truncate />
          </div>

          <div className="pt-2 sm:pt-4">
            <a
              href={photo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex justify-center items-center px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-900/20 text-sm sm:text-base"
            >
              View Full Resolution
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function Detail({
  label,
  value,
  valueClass = 'text-slate-300',
  truncate = false,
}: Readonly<{label: string; value: string | number; valueClass?: string; truncate?: boolean;}>) {
  return (
    <div className="flex justify-between border-b border-slate-800 pb-2">
      <span className="text-slate-500">{label}</span>
      <span
        className={`${valueClass} ${
          truncate ? 'truncate max-w-[200px] block' : ''
        }`}
      >
        {value}
      </span>
    </div>
  );
}