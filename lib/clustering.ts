import { Photo } from '@/lib/api';

export type ClusterGroup = 'A' | 'B' | 'C' | 'D';

export interface ClusteredPhoto extends Photo {
  complexityScore: number;
  normalizedScore: number;
  cluster: ClusterGroup;
}

export function calculateComplexity(photo: Photo): number {
  const titleWeight = photo.title.length * 0.45;
  const idWeight = Math.log10(photo.id + 1) * 5;
  const albumWeight = (photo.albumId % 2 === 0 ? 5 : 2);
  const urlDepthWeight = (photo.url.split('/').length) * 3;
  
  return titleWeight + idWeight + albumWeight + urlDepthWeight;
}

export function calculateComplexityOnly(photo: Photo): number {
  return calculateComplexity(photo);
}

export function normalizeScore(complexity: number): number {
  // Sigmoid (logistic) normalization — maps raw complexity to 0-100.
  // x0 (midpoint) is calibrated to the data source's URL structure:
  //   Picsum URLs have 7 path segments → urlDepthWeight baseline = 21
  //   JSONPlaceholder had 4 segments → baseline = 12
  // Shifting x0 from 35 → 42 re-centres the distribution across all 4 clusters.
  const k = 0.15;
  const x0 = 42;
  const sigmoid = 1 / (1 + Math.exp(-k * (complexity - x0)));
  return Math.round(sigmoid * 100);
}

export function getCluster(score: number): ClusterGroup {
  if (score < 25) return 'A';
  if (score < 50) return 'B';
  if (score < 75) return 'C';
  return 'D';
}

export function clusterPhotos(photos: Photo[]): ClusteredPhoto[] {
  return photos.map(photo => {
    const complexityScore = calculateComplexity(photo);
    const normalizedScore = normalizeScore(complexityScore);
    const cluster = getCluster(normalizedScore);
    
    return {
      ...photo,
      complexityScore,
      normalizedScore,
      cluster
    };
  });
}