import {{ imageOptimizer }} from './optimizer';

export async function createThumbnail(
  file: File,
  size: number = 100
): Promise<Blob> {{
  const buffer = Buffer.from(await file.arrayBuffer());
  const optimized = await imageOptimizer.optimize(buffer, {{ width: size }});
  return new Blob([optimized], {{ type: 'image/webp' }});
}}
