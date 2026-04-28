/**
 * API layer — Picsum Photos (https://picsum.photos)
 */

export interface Photo {
  id: number;
  albumId: number;
  title: string;
  url: string;
  thumbnailUrl: string;
}

interface PicsumPhoto {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  download_url: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://picsum.photos';

function mapPicsum(p: PicsumPhoto): Photo {
  const numId = Number.parseInt(p.id, 10);
  return {
    id: numId,
    albumId: Math.floor(numId / 10) + 1,
    title: p.author,
    url: `${API_BASE_URL}/id/${p.id}/400/400`,
    thumbnailUrl: `${API_BASE_URL}/id/${p.id}/50/50`,
  };
}

export async function fetchPhotos(count = 200): Promise<Photo[]> {
  const pageSize = Math.min(count, 100);

  if (count <= 100) {
    const raw = await fetchWithRetry<PicsumPhoto[]>(
      `${API_BASE_URL}/v2/list?page=1&limit=${pageSize}`
    );
    return raw.filter(p => p.id !== '0').map(mapPicsum);
  }

  const [page1, page2] = await Promise.all([
    fetchWithRetry<PicsumPhoto[]>(`${API_BASE_URL}/v2/list?page=1&limit=100`),
    fetchWithRetry<PicsumPhoto[]>(`${API_BASE_URL}/v2/list?page=2&limit=${count - 100}`),
  ]);

  return [...page1, ...page2].filter(p => p.id !== '0').map(mapPicsum);
}

export async function fetchPhotoById(id: number): Promise<Photo> {
  const raw = await fetchWithRetry<PicsumPhoto>(
    `${API_BASE_URL}/id/${id}/info`
  );
  return mapPicsum(raw);
}

async function fetchWithRetry<T>(
  url: string,
  options: RequestInit = {},
  retries = 4,
  backoff = 300
): Promise<T> {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      if (response.status === 429 || (response.status >= 500 && retries > 0)) {
        const retryAfter = response.headers.get('Retry-After');
        const delay = retryAfter ? Number.parseInt(retryAfter) * 1000 : backoff;
        await new Promise(resolve => setTimeout(resolve, delay));
        return fetchWithRetry(url, options, retries - 1, backoff * 2);
      }
      throw new Error(`API request failed with status ${response.status}`);
    }

    return response.json();
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, backoff));
      return fetchWithRetry(url, options, retries - 1, backoff * 2);
    }
    throw error;
  }
}
