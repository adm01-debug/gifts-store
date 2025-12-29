// Image optimizer - Browser-compatible version using Canvas API

interface OptimizeOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
}

export class ImageOptimizer {
  async optimize(
    input: Blob | File,
    options: OptimizeOptions = {}
  ): Promise<Blob> {
    const { width, height, quality = 0.8, format = 'webp' } = options;

    // Create image element
    const img = await this.loadImage(input);

    // Create canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;

    // Calculate dimensions
    const targetWidth = width || img.width;
    const targetHeight = height || img.height;

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    // Draw image
    ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

    // Convert to blob
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to convert canvas to blob'));
          }
        },
        `image/${format}`,
        quality
      );
    });
  }

  private loadImage(input: Blob | File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(img.src);
        resolve(img);
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(input);
    });
  }

  async generateThumbnails(
    input: Blob | File
  ): Promise<{ thumb: Blob; small: Blob; medium: Blob; large: Blob }> {
    const [thumb, small, medium, large] = await Promise.all([
      this.optimize(input, { width: 100 }),
      this.optimize(input, { width: 400 }),
      this.optimize(input, { width: 800 }),
      this.optimize(input, { width: 1920 })
    ]);
    return { thumb, small, medium, large };
  }
}

export const imageOptimizer = new ImageOptimizer();
