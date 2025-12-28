import sharp from 'sharp';

export class ImageOptimizer {{
  async optimize(buffer: Buffer, options: {{
    width?: number;
    quality?: number;
    format?: 'webp' | 'avif' | 'jpeg';
  }}): Promise<Buffer> {{
    return sharp(buffer)
      .resize(options.width || 1920, null, {{ withoutEnlargement: true }})
      .toFormat(options.format || 'webp', {{ quality: options.quality || 80 }})
      .toBuffer();
  }}

  async generateThumbnails(buffer: Buffer) {{
    const [thumb, small, medium, large] = await Promise.all([
      this.optimize(buffer, {{ width: 100 }}),
      this.optimize(buffer, {{ width: 400 }}),
      this.optimize(buffer, {{ width: 800 }}),
      this.optimize(buffer, {{ width: 1920 }})
    ]);
    return {{ thumb, small, medium, large }};
  }}
}}

export const imageOptimizer = new ImageOptimizer();
