import Image from 'next/image';
import Link from 'next/link';
import { Photo } from '@/lib/api';

interface ImageCardProps {
  photo: Photo;
  priority?: boolean;
  badge?: string | number;
}

export default function ImageCard({ photo, priority = false, badge }: Readonly<ImageCardProps>) {
  const isFeatured = photo.id % 7 === 0 && photo.id !== 1;
  
  const mobileSpans = isFeatured
    ? ['row-span-24', 'row-span-28', 'row-span-26']          
    : ['row-span-20', 'row-span-24', 'row-span-18', 'row-span-22', 'row-span-21'];

  const mobileSpan = mobileSpans[photo.id % mobileSpans.length];

  const desktopColSpan = isFeatured ? 'sm:col-span-2' : '';
  const desktopSpans = isFeatured
    ? ['sm:row-span-18', 'sm:row-span-22', 'sm:row-span-20']                       
    : ['sm:row-span-10', 'sm:row-span-14', 'sm:row-span-8', 'sm:row-span-12', 'sm:row-span-11']; 

  const desktopSpan = desktopSpans[photo.id % desktopSpans.length];

  const spanClass = `break-inside-avoid mb-2 sm:mb-0 col-span-1 ${desktopColSpan} ${mobileSpan} ${desktopSpan}`;

  return (
    <Link
      href={`/details/${photo.id}`}
      className={`group relative block overflow-hidden rounded-xl sm:rounded-2xl bg-slate-900 transition-all hover:ring-2 hover:ring-blue-500 hover:ring-offset-2 hover:ring-offset-slate-950 ${spanClass}`}
    >
      <div className="relative h-full w-full overflow-hidden">
        <Image
          src={photo.url}
          alt={photo.title}
          fill
          priority={priority}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          quality={65}
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      <div className="absolute inset-0 flex flex-col justify-end bg-linear-to-t from-slate-950/80 via-transparent p-3 sm:p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <p className="line-clamp-2 text-xs font-medium text-white">{photo.title}</p>
        <p className="mt-1 text-[10px] text-slate-300">ID: {photo.id} • Album: {photo.albumId}</p>
      </div>

      {badge !== undefined && (
        <div className="absolute top-2 right-2 px-2 py-1 bg-slate-950/80 backdrop-blur-sm rounded-lg text-[10px] font-mono font-bold text-blue-400 border border-blue-500/30 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
          S: {badge}
        </div>
      )}
    </Link>
  );
}
