import * as tf from '@tensorflow/tfjs';

export class ProductRecommendationEngine {
  private model: tf.LayersModel | null = null;

  async loadModel() {
    this.model = await tf.loadLayersModel('/models/recommendations/model.json');
  }

  async predict(features: number[]): Promise<number[]> {
    if (!this.model) await this.loadModel();
    const tensor = tf.tensor2d([features]);
    const prediction = this.model!.predict(tensor) as tf.Tensor;
    return Array.from(await prediction.data());
  }
}

export const recommendationEngine = new ProductRecommendationEngine();
