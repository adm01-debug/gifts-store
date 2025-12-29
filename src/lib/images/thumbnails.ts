import { imageOptimizer } from './optimizer';

export async function createThumbnail(
  file: File,
  size: number = 100
): Promise<Blob> {
  const optimized = await imageOptimizer.optimize(file, { width: size });
  return optimized;
}

export async function createThumbnailURL(
  file: File,
  size: number = 100
): Promise<string> {
  const blob = await createThumbnail(file, size);
  return URL.createObjectURL(blob);
}
